const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/db');
const ScannedAttendance = require('./ScannedAttendance')

class Student extends Model {}

Student.schema = {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
}

Student.init(Student.schema, {
  sequelize,
  modelName: "Student",
  tableName: 'students',
  timestamps: true
})

// Student.associate = ( ) => {
//     Student.hasMany(models.ScannedAttendance, {
//       foreignKey: 'studentId',
//       as: 'ScannedAttendances',
//     });
//   };
    

module.exports = Student;

















// // Handle student registration
// if (document.getElementById('register-form-student')) {
//     document.getElementById('register-form-student').addEventListener('submit', async (e) => {
//       e.preventDefault();
  
//       const username = document.getElementById('username-student').value;
//       const email = document.getElementById('email-student').value;
//       const password = document.getElementById('password-student').value;
  
//       try {
//         const response = await fetch('/api/student/student-register', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ username, email, password })
//         });
  
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Registration failed');
//         }
  
//         const data = await response.json();
//         alert(data.message || 'Registration successful!');
//         window.location.href = "student-login.html"; // Redirect to login page
  
//       } catch (error) {
//         alert('Error registering user');
//         console.error(error);
//       }
//     });
//   }
  
//   // Handle student login
//   if (document.getElementById('login-form-student')) {
//     document.getElementById('login-form-student').addEventListener('submit', async (e) => {
//       e.preventDefault();
  
//       const username = document.getElementById('login-username-student').value;
//       const password = document.getElementById('login-password-student').value;
  
//       try {
//         const response = await fetch('/api/student/student-login', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ username, password })
//         });
  
//         const data = await response.json();
  
//         if (data.token) {
//           localStorage.setItem('token', data.token);
//           alert('Login successful!');
//           window.location.href = "student-dashboard.html";
//         } else {
//           alert(data.message || 'Login failed!');
//         }
//       } catch (error) {
//         alert('Error logging in');
//         console.error(error);
//       }
//     });
//   }
  
//   // Handle dashboard actions
//   document.addEventListener("DOMContentLoaded", () => {
//     if (window.location.pathname.includes("student-dashboard.html")) {
//       const token = localStorage.getItem('token');
  
//       if (!token) {
//         alert("Please login first");
//         window.location.href = '/student-login.html';
//         return;
//       }
  
  
  
//       // Populate course list
//       const courseListContainer = document.getElementById('courseList');
//       if (courseListContainer) {
//         fetch('/api/courses', {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//         .then(res => res.json())
//         .then(courses => {
//           courses.forEach(course => {
//             const checkbox = document.createElement('input');
//             checkbox.type = 'checkbox';
//             checkbox.name = 'course';
//             checkbox.value = course.id;
  
//             const label = document.createElement('label');
//             label.textContent = `${course.course_name} (${course.courseCode})`;
//             label.style.marginRight = '10px';
  
//             const line = document.createElement('div');
//             line.appendChild(checkbox);
//             line.appendChild(label);
//             courseListContainer.appendChild(line);
//           });
//         })
//         .catch(err => console.error('Error fetching courses:', err));
//       }
  
  
      
//       // Handle course registration
//       const registrationForm = document.getElementById('registrationForm');
//       if (registrationForm) {
//         registrationForm.addEventListener('submit', async (e) => {
//           e.preventDefault();
  
//           const selectedCourses = Array.from(document.querySelectorAll('input[name="course"]:checked'))
//             .map(cb => cb.value);
  
//           if (selectedCourses.length === 0) {
//             alert('Select at least one course.');
//             return;
//           }
  
//           try {
//             const response = await fetch('/api/student/register-course', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//               },
//               body: JSON.stringify({ courseIds: selectedCourses })
//             });
  
//             const result = await response.json();
//             document.getElementById('statusMsg').textContent = result.message;
//           } catch (err) {
//             console.error(err);
//             document.getElementById('statusMsg').textContent = 'Error registering courses.';
//           }
//         });
//       }
  
//       // Handle logout
//       const logoutBtn = document.getElementById('logout');
//       if (logoutBtn) {
//         logoutBtn.addEventListener('click', () => {
//           localStorage.removeItem('token');
//           window.location.href = "index.html";
//         });
//       }
//     }
//   });
  