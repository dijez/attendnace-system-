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
// const createAttendanceLogModel = require('../models/AttendanceLog.js');
const sequelize = require('../config/db.js');



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
    try {
        const { lecturerId, courseId } = req.body;

        // Validate input
        if (!lecturerId || !courseId) {
            return res.status(400).json({ message: 'Lecturer and Course are required' });
        }

        // Check if the lecturer is already assigned
        const existingAssignment = await LecturerCourse.findOne({ where: { lecturerId, courseId } });

        if (existingAssignment) {
            return res.status(400).json({ message: 'Lecturer already assigned to this course' });
        }

        // Assign lecturer to course
        await LecturerCourse.create({ lecturerId, courseId });

        res.json({ message: 'Lecturer assigned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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




  router.get('/attendance-report', async (req, res) => {
  try {
    const attendanceData = await ScannedAttendance.findAll({
      include: [
        { model: Student, as: 'students', attributes: ['username'] }, // no alias needed
        { model: Course, as: 'courses', attributes: ['courseCode'] } // alias must match association
      ],
      attributes: ['createdAt'],
      order: [['createdAt', 'DESC']]

      
    });
    console.log("Fetched records:", attendanceData);
    const formattedData = attendanceData.map(entry => ({
      username: entry.Student?.username,
      courseCode: entry.course?.courseCode,
      createdAt: entry.createdAt
    }));
    
    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



module.exports = router; // ✅ Export the router directly
