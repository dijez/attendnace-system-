require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./config/db.js');
const cors = require('cors');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

// Import Models
const Student = require('./models/student.js');
const Lecturer = require('./models/lecturer.js');
const Course = require('./models/courses.js');
const LecturerCourse = require('./models/lecturerCourse.js');
const StudentCourse = require('./models/studentCourse.js');
const AttendanceSession = require('./models/AttendanceSession.js'); // Adjust the path as needed
const AttendanceRecord = require('./models/AttendanceRecord'); // Adjust the path as needed
const ScannedAttendance = require('./models/ScannedAttendance.js'); // Adjust the path as needed

AttendanceSession.hasMany(AttendanceRecord, { foreignKey: 'session_id' });
AttendanceRecord.belongsTo(AttendanceSession, { foreignKey: 'session_id' });

// A lecturer can teach many courses
Lecturer.belongsToMany(Course, { through: LecturerCourse, foreignKey: 'lecturerId' });

// A course can have many lecturers
Course.belongsToMany(Lecturer, { through: LecturerCourse, foreignKey: 'courseId' });

// models/student.js
Student.belongsToMany(Course, { through: StudentCourse ,foreignKey: 'studentId', otherKey: 'courseId', });

// models/course.js
Course.belongsToMany(Student, { through: StudentCourse , foreignKey: 'courseId',  otherKey: 'studentId',});

if (Student.associate) Student.associate({ ScannedAttendance });
if (ScannedAttendance.associate) ScannedAttendance.associate({ Student, AttendanceSession });



// Import Controllers
const adminRoutes = require('./controllers/adminController');
const lecturerRoutes = require('./controllers/lecturerController');
const studentRoutes = require('./controllers/studentController.js');
const verifyToken = require('./middleware/lecturerMiddleware.js');
const ActiveSession = require('./models/ActiveSession.js');

const app = express();

//  Middleware
app.use(express.json());
app.use(cors());

//  Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//  Serve index.html explicitly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Serve Lecturer Login Page
app.get('/lecturer-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lecturer-login.html'));
});

// ✅ Serve Student Login Page
app.get('/student-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student-login.html'));
});


//  Admin: Fetch All Students
app.get('/api/admin/students', async (req, res) => {
    try {
        const students = await Student.findAll({
            attributes: ['id', 'username', 'email', 'createdAt']
        });

        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

//  Admin: Fetch All Lecturers
app.get('/api/admin/lecturers', async (req, res) => {
    try {
        const lecturers = await Lecturer.findAll({
            attributes: ['id', 'username', 'email']
        });

        res.json(lecturers);
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        res.status(500).json({ message: "Error fetching lecturers" });
    }
});


app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.findAll({
            attributes: ['id', 'course_name', 'courseCode']
        });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
});


  


//  Mount Routes
app.use('/api/admin', adminRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/student', studentRoutes);

// Sync Database
sequelize.sync()
    .then(() => console.log("Database Synced"))
    .catch(err => console.error("DB Sync Error:", err));


//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
