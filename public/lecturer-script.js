// document.addEventListener("DOMContentLoaded", () => {

//   const token = localStorage.getItem('token');

//   // Redirect if token is missing and page requires authentication
//   if (
//     !token &&
//     (
//       window.location.pathname.includes("lecturer-dashboard.html") ||
//       window.location.pathname.includes("lecturer-courses.html") ||
//       window.location.pathname.includes("lecturer-take-attendance.html") ||
//       window.location.pathname.includes("lecturer-report.html")
//     )
//   ) {
//     alert("Please login first");
//     window.location.href = '/lecturer-login.html';
//     return;
//   }







//   // ✅ Lecturer Registration
//   const registerForm = document.getElementById('register-form-lecturer');
//   if (registerForm) {
//       registerForm.addEventListener('submit', async (e) => {
//           e.preventDefault();

//           const username = document.getElementById('username-lecturer').value;
//           const email = document.getElementById('email-lecturer').value;
//           const password = document.getElementById('password-lecturer').value;

//           try {
//               const response = await fetch('/api/lecturer/register', {
//                   method: 'POST',
//                   headers: { 'Content-Type': 'application/json' },
//                   body: JSON.stringify({ username, email, password })
//               });

//               const data = await response.json();
//               if (!response.ok) {
//                   throw new Error(data.message || 'Registration failed');
//               }

//               alert(data.message || 'Registration successful!');
//               window.location.href = "lecturer-login.html"; // Redirect to login page
//           } catch (error) {
//               console.error("Fetch error:", error);
//               alert('Error: ' + error.message);
//           }
//       });
//   }

//   // ✅ Lecturer Login
//   const loginForm = document.getElementById('login-form-lecturer');
//   if (loginForm) {
//       loginForm.addEventListener('submit', async (e) => {
//           e.preventDefault();

//           const username = document.getElementById('login-username-lecturer').value;
//           const password = document.getElementById('login-password-lecturer').value;

//           try {
//               const response = await fetch('/api/lecturer/login', {
//                   method: 'POST',
//                   headers: { 'Content-Type': 'application/json' },
//                   body: JSON.stringify({ username, password })
//               });

//               const data = await response.json();
//               if (data.token) {
//                   localStorage.setItem('token', data.token);
//                   alert('Login successful!');
//                   window.location.href = "lecturer-dashboard.html";
//               } else {
//                   alert(data.message || 'Login failed!');
//               }
//           } catch (error) {
//               console.error("Login error:", error);
//               alert('Error logging in');
//           }
//       });
//   }

// });








// document.addEventListener("DOMContentLoaded", () => {
//   if (!window.location.pathname.includes("lecturer-dashboard.html")) return;

//   const token = localStorage.getItem('token');
//   if (!token) {
//       alert("Unauthorized! Please log in.");
//       window.location.href = "lecturer-login.html";
//       return;
//   }

//   const logoutBtn = document.getElementById('logout');
//   if (logoutBtn) {
//       logoutBtn.addEventListener('click', () => {
//           localStorage.removeItem('token');
//           window.location.href = "lecturer-dashboard.html";
//       });
//   }

//   fetch('/api/lecturer/courses', {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//   }
//   })
//   .then(res => res.json())
//   .then(data => {
//       const courseList = document.getElementById('course-list');
//       if (courseList) {
//           courseList.innerHTML = data.length
//               ? data.map(course => `<li>${course.course_name} (${course.courseCode})</li>`).join('')
//               : `<li>No courses assigned</li>`;
//       }
//   })
//   .catch(err => {
//       console.error("Error loading courses:", err);
//   });
// });





// document.addEventListener("DOMContentLoaded", () => {
//   if (!window.location.pathname.includes("lecturer-courses.html")) return;

//   const token = localStorage.getItem('token');
//   if (!token) {
//     alert("Unauthorized! Please log in.");
//     window.location.href = "lecturer-login.html";
//     return;
//   }

//   const logoutBtn = document.getElementById('logout');
//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', () => {
//       localStorage.removeItem('token');
//       window.location.href = "index.html";
//     });
//   }

//   fetch('/api/lecturer/courses', {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   })
//   .then(res => res.json())
//   .then(data => {
//     const tableBody = document.getElementById('courses-table-body');

//     if (!tableBody) {
//       console.warn("⚠️ courses-table-body element not found");
//       return;
//     }

//     if (!Array.isArray(data) || data.length === 0) {
//       tableBody.innerHTML = `<tr><td colspan="3">No courses assigned.</td></tr>`;
//       return;
//     }

//     tableBody.innerHTML = data.map((course, index) => `
//       <tr>
//         <td>${index + 1}</td>
//         <td>${course.course_name}</td>
//         <td>${course.courseCode}</td>
//         <td>
//             <button class="btn-create" onclick="window.location.href='create-attendance.html?courseId=${course.id}'">
//               Create Attendance
//             </button>
//           </td>
//       </tr>
//     `).join('');
//   })
//   .catch(error => {
//     console.error("Error fetching courses:", error);
//   });
// });




// document.addEventListener("DOMContentLoaded", () => {
//   const courseDropdown = document.getElementById('courseCode');
//   const courseNameField = document.getElementById('course_name');
  
//   // Fetch available courses for the lecturer (replace the URL with your backend route)
//   fetch('/api/lecturer/courses')
//       .then(response => response.json())
//       .then(courses => {
//           // Populate the dropdown with courses
          
//           courses.forEach(course => {
//               const option = document.createElement('option');
//               option.value = course.courseCode;
//               option.textContent = course.courseCode; // Option shows course code
//               courseDropdown.appendChild(option);
//           });
//       })
//       .catch(error => {
//           console.error('Error fetching courses:', error);
//       });

//   // Update course name when a course code is selected
//   courseDropdown.addEventListener('change', (e) => {
//       const selectedCourseCode = e.target.value;
      
//       // Find the corresponding course name based on selected course code
//       fetch(`/api/lecturer/course/${selectedCourseCode}`)
//           .then(response => response.json())
//           .then(course => {
//               if (course) {
//                   courseNameField.value = course.course_name; // Set the course name
//               }
//           })
//           .catch(error => {
//               console.error('Error fetching course details:', error);
//           });
//   });

//   // Save form data in sessionStorage and redirect to get-location.html
//   document.getElementById('attendanceForm').addEventListener('submit', (e) => {
//       e.preventDefault();

//       const formData = {
//           courseCode: document.getElementById('courseCode').value,
//           course_name: document.getElementById('course_name').value,
//           date: document.getElementById('date').value,
//           start_time: document.getElementById('start_time').value,
//           end_time: document.getElementById('end_time').value,
//           expected_students: document.getElementById('expected_students').value
//       };

//       sessionStorage.setItem('attendanceSession', JSON.stringify(formData));
//       window.location.href = 'get-location.html';
//   });
// });


document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');

  // Token validation and redirection logic (applies to all pages that require authentication)
  if (!token && (
    window.location.pathname.includes("lecturer-dashboard.html") ||
    window.location.pathname.includes("lecturer-courses.html") ||
    window.location.pathname.includes("lecturer-take-attendance.html") ||
    window.location.pathname.includes("lecturer-report.html")
  )) {
    alert("Please login first");
    window.location.href = '/lecturer-login.html';
    return;
  }

  // Logout functionality for all pages
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = "lecturer-login.html"; // Ensure redirect to login page on logout
    });
  }

  // Lecturer Registration
  const registerForm = document.getElementById('register-form-lecturer');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username-lecturer').value;
      const email = document.getElementById('email-lecturer').value;
      const password = document.getElementById('password-lecturer').value;

      try {
        const response = await fetch('/api/lecturer/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        alert(data.message || 'Registration successful!');
        window.location.href = "lecturer-login.html"; // Redirect to login page
      } catch (error) {
        console.error("Fetch error:", error);
        alert('Error: ' + error.message);
      }
    });
  }

  // Lecturer Login
  const loginForm = document.getElementById('login-form-lecturer');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username-lecturer').value;
      const password = document.getElementById('login-password-lecturer').value;

      try {
        const response = await fetch('/api/lecturer/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          alert('Login successful!');
          window.location.href = "lecturer-dashboard.html";
        } else {
          alert(data.message || 'Login failed!');
        }
      } catch (error) {
        console.error("Login error:", error);
        alert('Error logging in');
      }
    });
  }

  // Lecturer Dashboard
  if (window.location.pathname.includes("lecturer-dashboard.html")) {
    fetch('/api/lecturer/courses', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      const courseList = document.getElementById('course-list');
      if (courseList) {
        courseList.innerHTML = data.length
          ? data.map(course => `<li>${course.course_name} (${course.courseCode})</li>`).join('')
          : `<li>No courses assigned</li>`;
      }
    })
    .catch(err => {
      console.error("Error loading courses:", err);
    });
  }

  // Lecturer Courses Page
  if (window.location.pathname.includes("lecturer-courses.html")) {
    fetch('/api/lecturer/courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const tableBody = document.getElementById('courses-table-body');
      if (!Array.isArray(data) || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3">No courses assigned.</td></tr>`;
        return;
      }
      tableBody.innerHTML = data.map((course, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${course.course_name}</td>
          <td>${course.courseCode}</td>
          <td>
            <button class="btn-create" onclick="window.location.href='create-attendance.html?courseId=${course.id}'">
              Create Attendance
            </button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error("Error fetching courses:", error);
    });
  }

  // Lecturer Create Attendance Page
  if (window.location.pathname.includes("lecturer-create-attendance.html")) {
    const courseDropdown = document.getElementById('courseCode');
    const courseNameField = document.getElementById('course_name');
    
    fetch('/api/lecturer/courses')
      .then(response => response.json())
      .then(courses => {
        courses.forEach(course => {
          const option = document.createElement('option');
          option.value = course.courseCode;
          option.textContent = course.courseCode;
          courseDropdown.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });

    courseDropdown.addEventListener('change', (e) => {
      const selectedCourseCode = e.target.value;
      fetch(`/api/lecturer/course/${selectedCourseCode}`)
        .then(response => response.json())
        .then(course => {
          if (course) {
            courseNameField.value = course.course_name;
          }
        })
        .catch(error => {
          console.error('Error fetching course details:', error);
        });
    });

    document.getElementById('attendanceForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {
        courseCode: document.getElementById('courseCode').value,
        course_name: document.getElementById('course_name').value,
        date: document.getElementById('date').value,
        start_time: document.getElementById('start_time').value,
        end_time: document.getElementById('end_time').value,
        expected_students: document.getElementById('expected_students').value
      };
      sessionStorage.setItem('attendanceSession', JSON.stringify(formData));
      window.location.href = 'get-location.html';
    });
  }




  
  
});






