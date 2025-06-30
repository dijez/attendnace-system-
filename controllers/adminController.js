const express = require('express');
const Admin = require('../models/admin');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LecturerCourse = require('../models/lecturerCourse.js')
const ScannedAttendance = require('../models/ScannedAttendance.js')
const AttendanceSession = require('../models/AttendanceSession.js')
const router = express.Router();
const Course = require('../models/courses.js')
const Student = require('../models/student.js')
const Lecturer = require('../models/lecturer.js')
// const createAttendanceLogModel = require('../models/AttendanceLog.js');
const sequelize = require('../config/db.js');
const verifyToken = require('../middleware/authMiddleware.js'); 
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { format } = require('@fast-csv/format');
const path = require('path');
const { writeToStream } = require('fast-csv');


// ✅ Admin Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

       // Check if the email is already in use
       const existingAdmin = await Admin.findOne({ where: { email } });
       if (existingAdmin) {
         return res.status(400).json({ message: 'Email already registered' });
       } 
       
    const hashedPassword = await bcryptjs.hash(password, 10);

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ Admin Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isPasswordMatch = await bcryptjs.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});





router.post('/assign-lecturer', async (req, res) => {
  console.log('request body ', req.body)
  const { lecturerId, courseId,courseCode,course_name } = req.body;
  
  const course = await Course.findOne({ where: { id: courseId } });

  console.log('Fetched course:', course);

  // // Validate input
  // if (!lecturerId || !courseId || !courseCode || !course_name) {
  //   return res.status(400).json({ message: 'All fields required' });
  // }

  // Check if the course exists
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }


  // Check if the lecturer is already assigned
  const existingAssignment = await LecturerCourse.findOne({ where: { lecturerId, courseId,} });
  
  if (existingAssignment) {
    return res.status(400).json({ message: 'Lecturer already assigned to this course' });
  }
  
  try {
        // Assign lecturer to course
        console.log("Saving to LecturerCourse:", {
          lecturerId,
          courseId,
          courseCode: course.courseCode, // or course.dataValues.courseCode
          course_name: course.course_name // or course.dataValues.course_name
        });
        
       const result = await LecturerCourse.create({
         lecturerId: parseInt(lecturerId), 
        courseId: parseInt(courseId),
        courseCode: course.dataValues.courseCode, 
        course_name: course.dataValues.course_name, });

        res.json({ message: 'Lecturer assigned successfully' });
    
      }  catch (error) {
        console.error('Error assigning lecturer:', error); // Log the error
        // // Handle specific Sequelize errors
        // if (error.name === 'SequelizeForeignKeyConstraintError') {
        //     return res.status(400).json({ message: 'Foreign key constraint error: Check if lecturer and course exist' });
        // }
        return res.status(500).json({ message: 'Server error during assignment' });
    }
});

router.get('/courses', async (req, res) => {
  try {
      const courses = await Course.findAll({ attributes: ['id', 'course_name', 'courseCode'] });
      res.json(courses);
  } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Server Error' });
  }
});






router.post('/add-course', async (req, res) => {
  const { course_name, courseCode } = req.body;

  try {
    const existing = await Course.findOne({ where: { courseCode } });
    if (existing) {
      return res.status(409).json({ message: "Course code already exists." });
    }

    await Course.create({ course_name, courseCode });
    res.status(201).json({ message: "Course added successfully!" });


    // Then dynamically create a report table
    const formattedTableName = `attendance_log_course_${courseCode.replace(/\s+/g, '_').toLowerCase()}`;

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${formattedTableName} (
        id SERIAL PRIMARY KEY,
        
        username VARCHAR(255) NOT NULL,
        attendanceSessionId INTEGER,
        
        
        scannedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
      
    `);
    

    // Then dynamically create a report table
//     const formattedTableName = `attendance_log_course_${courseCode.replace(/\s+/g, '_').toLowerCase()}`;

//     await sequelize.query(`
//       CREATE TABLE IF NOT EXISTS ${formattedTableName} (
//         id SERIAL PRIMARY KEY,
//         studentId INTEGER,
//         username VARCHAR(255) NOT NULL,
//         attendanceSessionId INTEGER,
//         courseId INTEGER,
//         courseCode VARCHAR(50),
//         scannedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         status VARCHAR(50)
//       )
//     `);
    

//  res.send(`
//       <script>
//         alert("Course added and report table created successfully.");
//         window.location.href = "dashboard.html";
//       </script>
//     `);

  } catch (err) {
    console.error("Add course error:", err);
    res.status(500).json({ message: "Server error. Could not add course." });
  }
});



router.get('/get-attendance-report/:course_code',async (req, res) => {
  const  courseCode  = req.params.course_code;

  if (!courseCode) {
    return res.status(400).json({ error: 'Course code is required' });
  }

  const reportTable = `attendance_log_course_${courseCode.replace(/\s+/g, '_').toLowerCase()}`;

  try {
    const [reportData] = await sequelize.query(`
      SELECT username, attendanceSessionId, scannedAt
      FROM ${reportTable}
      ORDER BY scannedat DESC
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
    const filename = `attendance_report_${new Date().toISOString().split('T')[0]}.pdf`;

    // const filename = `attendance_${courseCode}_${Date.now()}.pdf`;

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




router.get('/dashboard-counts', async (req, res) => {
  try {
    const studentCount = await Student.count();
    const lecturerCount = await Lecturer.count();
    const courseCount = await Course.count();

    res.json({
      students: studentCount,
      lecturers: lecturerCount,
      courses: courseCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard counts' });
  }
});


router.get('/lecturer-course-assignments', async (req, res) => {
  try {
    const assignments = await LecturerCourse.findAll({
      include: [
        {
          model: Lecturer,
          attributes: ['username']  
        },
        {
          model: Course,
          attributes: ['courseCode', 'course_name']  // Get course code and ID
        }
      ]
    });
    res.json(assignments);  // Return the assignments as JSON
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error while fetching assignments' });
  }
});




router.delete('/lecturers/:id', async (req, res) => {
  const lecturerId = req.params.id;

  try {
      const deleted = await Lecturer.destroy({
          where: { id: lecturerId }
      });

      if (deleted) {
          res.status(200).send("Lecturer deleted successfully");
      } else {
          res.status(404).send("Lecturer not found");
      }
  } catch (error) {
      console.error("Error deleting lecturer:", error);
      res.status(500).send("Internal Server Error");
  }
});


// router.get('/attendance-report', async (req, res) => {
//   try {
//     const attendanceData = await ScannedAttendance.findAll({
//       include: [
//         { model: Student, as: 'students', attributes: ['username'] }, // no alias needed
//         { model: Course, as: 'courses', attributes: ['courseCode'] } // alias must match association
//       ],
//       attributes: ['createdAt'],
//       order: [['createdAt', 'DESC']]

      
//     });
//     console.log("Fetched records:", attendanceData);
//     const formattedData = attendanceData.map(entry => ({
//       username: entry.Student?.username,
//       courseCode: entry.course?.courseCode,
//       createdAt: entry.createdAt
//     }));
    
//     res.json({ success: true, data: formattedData });
//   } catch (error) {
//     console.error('Error fetching attendance:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

module.exports = router; // ✅ Export the router directly
//