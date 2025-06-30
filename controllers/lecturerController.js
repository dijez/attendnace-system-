const express = require('express');
const Lecturer = require('../models/lecturer');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/db');
const Course = require('../models/courses')
const Student = require('../models/student')
const LecturerCourse = require('../models/lecturerCourse')
const router = express.Router();
const verifyToken = require('../middleware/lecturerMiddleware'); 
const AttendanceSession = require('../models/AttendanceSession'); 
const ActiveSession = require('../models/ActiveSession');
sequelize.ActiveSession = ActiveSession;
const ScannedAttendance = require('../models/ScannedAttendance'); 
const QRCode = require('qrcode');
const { Op } = require('sequelize');
const moment = require('moment'); // for time formatting

// ✅ Lecturer Registration Route
router.post('/register', async (req, res) => {
    try {
      console.log("Received Request Body:", req.body); 

        const { username, email, password } = req.body;

        console.log("Received Registration Data:", { username, email, password });

        // Check if the email is already in use
        const existingLecturer = await Lecturer.findOne({ where: { email } });
        if (existingLecturer) {
            console.log("Email already exists:", email);
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash Password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create Lecturer
        const lecturer = await Lecturer.create({
            username,
            email,
            password: hashedPassword,
        });

        console.log("Lecturer Registered Successfully:", lecturer);

        res.status(201).json({ message: 'Lecturer registered successfully', lecturer });
    } catch (error) {
        console.error('Error registering lecturer:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ✅ Lecturer Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const lecturer = await Lecturer.findOne({ where: { username } });
        if (!lecturer) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isPasswordMatch = await bcryptjs.compare(password, lecturer.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ lecturerId: lecturer.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});



router.get('/courses',verifyToken, async (req, res) => {
  try {
      console.log(" /api/lecturer/courses endpoint hit"); 
      console.log("Lecturer ID from token:", req.lecturerId);

        const lecturer = await Lecturer.findByPk(req.lecturerId, {
            include: {
                model: Course,
                through: { attributes: [] } 
            }
            
        });

        if (!lecturer) {
            return res.status(404).json({ error: "Lecturer not found" });
        }
        console.log("Courses found:", lecturer.Courses);
        res.json(lecturer.Courses); // Only the courses assigned to the lecturer
    } catch (error) {
        console.error("Error fetching lecturer courses:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// Endpoint to get details of a course by courseCode
router.get('/course/:courseCode', verifyToken, async (req, res) => {
  try {
      const { courseCode } = req.params;

      // Fetch course details by courseCode
      const course = await Course.findOne({ where: { courseCode } });

      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      res.json(course);
  } catch (error) {
      console.error('Error fetching course details:', error);
      res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/attendance/register', async (req, res) => {
  try {
    const {
      course_id,
      course_name,
      course_code,
      date,
      time, // start_time
      end_time,
      expected_students,
      latitude,
      longitude,
      qr_code,
    } = req.body;

    // console.log('Received attendance data:', req.body);
    // console.log('Course Name:', course_name);
    // console.log('Expected Students:', expected_students);

//     const course = await Course.findOne({ where: { courseCode: course_code } });
// if (!course) {
//   return res.status(404).json({ message: 'Course not found' });
// }

    // Ensure no required data is missing
    if (!course_id || !course_name || !expected_students) {
      return res.status(400).json({ message: 'Course ID, name, and expected students are required.' });
    }



    const existingSession = await AttendanceSession.findOne({
      where: {
        course_id: course_id,
        date,
        start_time: time
      },
      attributes: ['course_id', 'start_time', 'date']
    });
    
    if (existingSession) {
      return res.status(400).json({ message: 'An attendance session already exists for this course at this date and time.' });
    }


    console.log("🔍 Creating attendance with data:", {
      course_id, course_name, course_code, time, end_time, date, expected_students
    });
    
    // Create a new session
    const session = await AttendanceSession.create({
      course_id: course_id,
      course_name,
      course_code,
      date,
      start_time: time,
      end_time,
      expected_students,
      qr_code: qr_code,
      latitude,
      longitude,
      isActive: false ,
    }, {
      returning: ['id', 'date',
         'start_time','end_time', 'course_name',
          'course_code', 'expected_students',
           'course_id','latitude','longitude']
    });
    // await session.reload();
      // Generate QR data
  const qrData = `session_id=${session.id}&course_id=${course_id}`;
  const qrCode = await QRCode.toDataURL(qrData);

  
      // Update session with QR code
  await session.update({ qr_code: qrCode });


    res.status(201).json({
      message: 'Attendance created successfully!',
      qrCode,
      sessionId: session.id ,
      course_id: course_id
    });

  } catch (error) {
    console.error('Attendance creation error:', error);
    res.status(500).json({ message: 'Server error while creating attendance' });
  }
});




router.post('/make-active-session', async (req, res) => {
  const { course_code } = req.body;
  try {
  const course = await Course.findOne({ where: { courseCode: course_code } });
  if (!course) return res.status(404).json({ message: 'Course not found' });

  // Deactivate previous active session
  await ActiveSession.update({ isActive: false }, { where: { course_id: course.id } });

 
  const latestSession = await AttendanceSession.findOne({
   
    where: {
      course_id: course.id,
   
    },
    attributes: ['id' ,'course_id'],
    order: [['createdAt', 'DESC']]
  });

  console.log('Latest session raw:', latestSession);


  if (!latestSession || !latestSession.id) {
    return res.status(404).json({ message: 'No valid attendance session found' });
  }
    
  console.log('Trying to activate session ID:', latestSession.id); // or whatever variable you're using
  console.log('Latest session from DB:', latestSession?.toJSON?.());


  // const session = await AttendanceSession.findByPk(14);
  // console.log(session);

  // Create new active session
const newSession = await ActiveSession.create({ 
  course_id: course.id, 
  attendanceSessionId: latestSession.id,
  isActive: true 
}, {
  returning: ['id', 'isActive', 'course_id', 'attendanceSessionId'] 
});


  res.json({ message: 'Session activated', session: newSession });
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
}
});


router.post('/deactivate-session', verifyToken, async (req, res) => {
  const { courseId } = req.body;
  try {
    const activeSession = await ActiveSession.findOne({
      where: { course_id: courseId, isActive: true }
    });

    if (!activeSession) {
      return res.status(404).json({ message: 'No active session found.' });
    }

    activeSession.isActive = false;
    await activeSession.save();

    res.json({ message: 'Session deactivated.' });
  } catch (err) {
    console.error('Error deactivating session:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




router.get('/get-attendance-report/:course_code',verifyToken, async (req, res) => {
  const courseCode = req.params.course_code;
  const lecturerId = req.lecturerId; // Make sure JWT middleware sets req.user

  if (!courseCode) {
    return res.status(400).json({ error: 'Course code is required' });
  }

  const formattedCode = courseCode.replace(/\s+/g, '_').toLowerCase();
  const reportTable = `attendance_log_course_${formattedCode}`;

  try {
    // Check if this course is assigned to the lecturer
    const [courseMatch] = await sequelize.query(`
      SELECT lc."courseId", c."courseCode"
      FROM "LecturerCourse" lc
      JOIN courses c ON lc."courseId" = c.id
      WHERE lc."lecturerId" = :lecturerId AND LOWER(REPLACE(c."courseCode", ' ', '_')) = :formattedCode
    `, {
      replacements: { lecturerId, formattedCode },
    });

    if (!courseMatch.length) {
      return res.status(403).json({ error: 'Unauthorized. You are not assigned to this course.' });
    }

    const [reportData] = await sequelize.query(`
      SELECT username, attendanceSessionId, scannedAt
      FROM ${reportTable}
      ORDER BY scannedAt DESC
    `);

    return res.status(200).json({ report: reportData });

  } catch (error) {
    console.error('Error fetching attendance report:', error);
    return res.status(500).json({ error: 'Failed to generate attendance report.' });
  }
});



router.get('/export-attendance-csv/:course_code', async (req, res) => {
  const courseCode = req.params.course_code;
  const reportTable = `attendance_log_course_${courseCode}`;

  try {
    const [reportData] = await sequelize.query(`
      SELECT username, attendanceSessionId, scannedAt
      FROM ${reportTable}
      ORDER BY scannedAt DESC
    `);


     // Ensure the exports directory exists
     const exportDir = path.join(__dirname, '..', 'exports');
     if (!fs.existsSync(exportDir)) {
       fs.mkdirSync(exportDir);
     }

    const filename = `attendance_${courseCode}_${Date.now()}.csv`;
    const filePath = path.join(__dirname, '..', 'exports', filename);
    const fileStream = fs.createWriteStream(filePath);

    // Write CSV headers + data
    writeToStream(fileStream, reportData, {
      headers: true,
      writeHeaders: true
    })
    .on('finish', () => {
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(500).send('Download failed.');
        } else {
          // Optional: delete after download
          fs.unlink(filePath, () => {});
        }
      });
    })
    .on('error', (err) => {
      console.error('CSV Write Error:', err);
      res.status(500).send('Failed to write CSV.');
    });


  } catch (error) {
    console.error('CSV Export Error:', error);
    res.status(500).send('Failed to export CSV.');
  }
});






router.get('/export-attendance-pdf/:course_code', async (req, res) => {
  const courseCode = req.params.course_code;
  const reportTable = `attendance_log_course_${courseCode}`;

  try {
    const [reportData] = await sequelize.query(`
      SELECT username, attendanceSessionId, scannedAt
      FROM ${reportTable}
      ORDER BY scannedAt DESC
    `);

    const doc = new PDFDocument();
    const filename = `attendance_${courseCode}_${Date.now()}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);
    doc.fontSize(18).text(`Attendance Report: ${courseCode}`, { align: 'center' }).moveDown();

    reportData.forEach((entry, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${entry.username} | Session ID: ${entry.attendancesessionid} | Time: ${new Date(entry.scannedat).toLocaleString()}`
      );
    });
    
    doc.end();
  } catch (error) {
    console.error('PDF Export Error:', error);
    res.status(500).send('Failed to export PDF.');
  }
});


// router.get('/active-deactive-display',verifyToken, async (req, res) => {
//   // lecturerId: lecturer.id
//   const lecturerId = req.lecturerId; 
  
//   if (!lecturerId) {
//     console.error("Lecturer ID missing");
//     return res.status(401).json({ error: 'Unauthorized - No lecturer ID' });
//   }

//   try {
//     // 1. Get all courses assigned to the lecturer
//     const assignedCourses = await LecturerCourse.findAll({
//       where: { lecturerId },
//       include: [{ model: Course }]
//     });

//     // 2. Check which courses have active sessions
//     const activeSessions = await ActiveSession.findAll();
//     const activeCourseIds = activeSessions.map(session => session.courseId);

//     // 3. Build course list with active status
//     const courseList = assignedCourses.map(c => ({
//       courseId: c.Course.id,
//       courseCode: c.Course.courseCode,
//       courseTitle: c.Course.course_name,
//       isActive: activeCourseIds.includes(c.Course.id)
//     }));

//     res.json(courseList);

//     // res.render('lecturer-dashboard', { courseStatusList });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });


// router.get('reports', async (req, res) => {
//     try {
//         const report = await ScannedAttendance.findAll({
//             attributes: ['id', 'username', 'course_code', 'createdAt']
//         });

//         res.json(report);
//     } catch (error) {
//         console.error("Error fetching report:", error);
//         res.status(500).json({ message: "Error fetching report" });
//     }
// });


// router.get('/report/:courseId/:sessionId', async (req, res) => {
//   const { courseId, sessionId } = req.params;

//   const tableName = `attendance_log_course_${courseId}`;

//   try {
//     // Check if the dynamic table exists
//     const [tables] = await sequelize.query(
//       `SHOW TABLES LIKE :tableName`,
//       { replacements: { tableName }, type: QueryTypes.SHOWTABLES }
//     );

//     if (!tables || tables.length === 0) {
//       return res.status(404).json({ message: "No attendance records found for this course." });
//     }

//     // Get the scanned students for that session
//     const records = await sequelize.query(
//       `SELECT * FROM ${tableName} WHERE attendanceSessionId = :sessionId`,
//       {
//         replacements: { sessionId },
//         type: QueryTypes.SELECT
//       }
//     );

//     res.json({ data: records });
//   } catch (error) {
//     console.error("Error generating report:", error);
//     res.status(500).json({ error: "Could not generate report" });
//   }
// });






module.exports = router;
