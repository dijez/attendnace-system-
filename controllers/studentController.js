const express = require('express');
const Student = require('../models/student');
const Course = require('../models/courses');
const ActiveSession = require('../models/ActiveSession');
const AttendanceSession = require('../models/AttendanceSession');
const StudentCourse = require('../models/studentCourse');
const ScannedAttendance = require('../models/ScannedAttendance');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/studentMiddleware'); 
const router = express.Router();
const sequelize = require('../config/db.js');

// ✅ student Registration Route
router.post('/student-register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

       // Check if the email is already in use
       const existingStudent = await Student.findOne({ where: { email } });
       if (existingStudent) {
         return res.status(400).json({ message: 'Email already registered' });
       } 
       
    const hashedPassword = await bcryptjs.hash(password, 10);

    const student = await Student.create({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date() ,
    });

     // Notify the admin (can be stored in the database or sent via email)
     const adminNotification = {
        message: "New student registered",
        student: {
            id: Student.id,
            username: Student.username,
            email: Student.email,
            createdAt: Student.createdAt
        }
    };

    // Save to AdminNotifications Table (Optional)
    // await AdminNotification.create(adminNotification);

   

    
    res.status(201).json({ message: 'student registered successfully', student });
  } catch (error) {
    console.error('Error registering lecturer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ student Login Route
router.post('/student-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const student = await Student.findOne({ where: { username } });
    if (!student) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isPasswordMatch = await bcryptjs.compare(password, student.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ studentId: student.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});



router.post('/register-course', verifyToken, async (req, res) => {
  try {
    const studentId = req.studentId;
    const { courseIds } = req.body;

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: 'No courses selected' });
    }

    const courses = await Course.findAll({ where: { id: courseIds } });

    if (courses.length !== courseIds.length) {
      return res.status(404).json({ message: 'Some courses not found' });
    }

    // Register each course (avoid duplicates)
    for (let courseId of courseIds) {
      await StudentCourse.findOrCreate({
        where: { studentId, courseId }
      });
    }

    res.status(200).json({ message: 'Courses registered successfully' });
  } catch (error) {
    console.error('Error registering courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.get('/courses', verifyToken, async (req, res) => {
  try {
    const studentId = req.studentId;
    console.log("Student ID:", studentId);

    const student = await Student.findByPk(studentId, {
      include: {
        model: Course,
        attributes: ['id', 'course_name', 'courseCode'],
        
      }
    });

    console.log("Student:", student);
    console.log("Courses:", student?.Courses);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.Courses || []);
  } catch (error) {
    console.error('Error fetching registered courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/get-active-session/:course_id', async (req, res) => {
  const { course_id } = req.params;
  try {

    const activeSession = await ActiveSession.findOne({
      where: { 
        course_id: course_id,
        isActive: true 
      },
      attributes: ['id', 'isActive', 'course_id', 'attendanceSessionId']  
    });

    if (!activeSession){
      return res.json({ isActive: false });
    }

    res.json({
       isActive: true, 
       sessionId: activeSession.attendanceSessionId });

  } catch (err) {
    console.error('Error fetching active session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});







router.post('/mark-attendance', verifyToken, async (req, res) => {
  const { course_id, sessionId ,  studentLat, studentLng} = req.body;
  const studentId = req.studentId;
  console.log("Received:", req.body);


  try {
    console.log("Inside mark-attendance route");


     // Validate course_id and sessionId are valid numbers
     if (isNaN(course_id) || isNaN(sessionId)) {
      return res.status(400).json({ message: 'Invalid course_id or sessionId' });
    }


    const session = await AttendanceSession.findOne({
      where: { id: sessionId, course_id},
      attributes: ['id' ,'course_id', 'course_code']
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    const courseIdFromSession = session.course_id;
    const course_code = session.course_code;

    const activeSession = await ActiveSession.findOne({
      where: {
        course_id: course_id,
        attendanceSessionId: sessionId,
        isActive: true
      },
      attributes: ['id', 'isActive', 'course_id', 'attendanceSessionId']
    });

    console.log(ActiveSession.rawAttributes);

    if (!activeSession) {
      return res.status(400).json({ message: 'Invalid QR Code: Session does not match this course.' });
    }

    const alreadyMarked = await ScannedAttendance.findOne({
      where: {
        courseId: courseIdFromSession,
        course_code: course_code,
        studentId,
        attendanceSessionId: sessionId
      }
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: 'Attendance already marked.' });
    }


     // Fetch the username from the Students table
     const student = await Student.findOne({
      where: { id: studentId },
      attributes: ['username']
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const username = student.username;

    await ScannedAttendance.create({
      studentId,
      courseId: courseIdFromSession,
      course_code,
      attendanceSessionId: sessionId,
      username,
    });

     //  // ✅ Insert into dynamic tables
    // //  const reportTable = `report_${course_code.replace(/\s+/g, '_').toLowerCase()}`;
    const scanLogTable = `attendance_log_course_${course_code.replace(/\s+/g, '_').toLowerCase()}`;

    console.log("Scan Log Table:", scanLogTable);
   //  console.log("Report Table:", reportTable);
    
    try {
     console.log('Inserting attendance into scanLogTable:', {
       studentId, username, sessionId, courseIdFromSession, course_code
     });
      await sequelize.query(`
        INSERT INTO ${scanLogTable} 
          (username, attendanceSessionId, scannedat)
        VALUES (?, ?, NOW())
      `, {
        replacements: [ username, sessionId,  ]
      });
    } catch (error) {
     console.error('Error marking attendance in scanLogTable:', error);
     return res.status(400).json({ error: 'Error marking attendance in scan log.' });
   }

    //  // ✅ Insert into dynamic tables
    //  const reportTable = `report_${course_code.replace(/\s+/g, '_').toLowerCase()}`;
    //  const scanLogTable = `attendance_log_course_${course_id}`;


    //  try {
    //   console.log('Inserting attendance into scanLogTable:', {
    //     studentId, username, sessionId, courseIdFromSession, course_code
    //   });
    //    await sequelize.query(`
    //      INSERT INTO ${scanLogTable} 
    //        (studentId, username, attendanceSessionId, courseId, courseCode, scannedAt)
    //      VALUES (?, ?, ?, ?, ?, NOW())
    //    `, {
    //      replacements: [studentId, username, sessionId, courseIdFromSession, course_code]
    //    });
    //  } catch (error) {
    //   console.error('Error marking attendance in scanLogTable:', error);
    //   return res.status(400).json({ error: 'Error marking attendance in scan log.' });
    // }


    //  try {
    //   console.log('Inserting attendance into reportTable:', {
    //     studentId, username, sessionId, courseIdFromSession, course_code
    //   });
    //    await sequelize.query(`
    //      INSERT INTO ${reportTable} 
    //        (studentId, username, attendanceSessionId, courseId, courseCode, scannedAt)
    //      VALUES (?, ?, ?, ?, ?, NOW())
    //    `, {
    //      replacements: [studentId, username, sessionId, courseIdFromSession, course_code]
    //    });
    //  } catch (error) {
    //   console.error('Error marking attendance in reportTable:', error);
    //   return res.status(400).json({ error: 'Error marking attendance in report.' });
    // }
     

    return res.json({ success: true, message: 'Attendance marked successfully.' });

  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ error: 'Server error while marking attendance.', details: err.message  });
  }
});

// router.post('/mark-attendance', verifyToken, async (req, res) => {
//   const { course_id, sessionId ,  studentLat, studentLng} = req.body;
//   const studentId = req.studentId;
//   console.log("Received:", req.body);
//   try {
//     console.log("Inside mark-attendance route");
//     const session = await AttendanceSession.findOne({
//       where: { id: sessionId },
//       attributes: ['course_id', 'course_code']
//     });

//     if (!session) {
//       return res.status(404).json({ message: "Session not found." });
//     }

//     const courseIdFromSession = session.course_id;
//     const course_code = session.course_code;

//     const activeSession = await ActiveSession.findOne({
//       where: {
//         course_id: course_id,
//         attendanceSessionId: sessionId,
//         isActive: true
//       },
//       attributes: ['id', 'isActive', 'course_id', 'attendanceSessionId']
//     });
//     console.log(ActiveSession.rawAttributes);

//     if (!activeSession) {
//       return res.status(400).json({ message: 'Invalid QR Code: Session does not match this course.' });
//     }

//     const alreadyMarked = await ScannedAttendance.findOne({
//       where: {
//         courseId: courseIdFromSession,
//         course_code: course_code,
//         studentId,
//         attendanceSessionId: sessionId
//       }
//     });

//     if (alreadyMarked) {
//       return res.status(400).json({ message: 'Attendance already marked.' });
//     }


//      // Fetch the username from the Students table
//      const student = await Student.findOne({
//       where: { id: studentId },
//       attributes: ['username']
//     });

//     if (!student) {
//       return res.status(404).json({ message: "Student not found." });
//     }

//     const username = student.username;

//     await ScannedAttendance.create({
//       studentId,
//       courseId: courseIdFromSession,
//       course_code,
//       attendanceSessionId: sessionId,
//       username
//     });

//     return res.json({ success: true, message: 'Attendance marked successfully.' });
//   } catch (err) {
//     console.error('Error marking attendance:', err);
//     res.status(500).json({ error: 'Server error while marking attendance.', details: err.message  });
//   }
// });





router.get('/session-location', async (req, res) => {
  const { course_id, sessionId } = req.query;

  try {
    const session = await AttendanceSession.findOne({
      where: { id: sessionId, course_id },
      attributes: ['latitude', 'longitude']
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    res.json({
      success: true,
      latitude: session.latitude,
      longitude: session.longitude
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router; // ✅ Export the router directly

