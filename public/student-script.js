
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
  
    // Redirect if token is missing
    if (
      !token &&
      (
        window.location.pathname.includes("student-dashboard.html") ||
        window.location.pathname.includes("student-courses.html") ||
        window.location.pathname.includes("student-register-course.html")
      )
    ) {
      alert("Please login first");
      window.location.href = '/student-login.html';
      return;
    }










  // Student Login
  const loginForm = document.getElementById('login-form-student');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('login-username-student').value;
      const password = document.getElementById('login-password-student').value;

      try {
        const response = await fetch('/api/student/student-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.token) {
          localStorage.setItem('token', data.token);
          alert('Login successful!');
          window.location.href = "student-dashboard.html";
        } else {
          alert(data.message || 'Login failed!');
        }
      } catch (error) {
        alert('Error logging in');
        console.error(error);
      }
    });
  }

  







  //  Student Registration
  const registerForm = document.getElementById('register-form-student');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username-student').value;
      const email = document.getElementById('email-student').value;
      const password = document.getElementById('password-student').value;

      try {
        const response = await fetch('/api/student/student-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();
        alert(data.message || 'Registration successful!');
        window.location.href = "student-login.html"; // Redirect to login page

      } catch (error) {
        alert('Error: ' + error.message); 
        console.error(error);
      }
    });
  }

    












    // Handle course registration form
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
      const courseListContainer = document.getElementById('courseList');
  
      // Fetch available courses for registration
      fetch('/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(courses => {
        courses.forEach(course => {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = 'course';
          checkbox.value = course.id;
  
          const label = document.createElement('label');
          label.textContent = `${course.course_name} (${course.courseCode})`;
          label.style.marginLeft = '8px';
  
          const line = document.createElement('div');
          line.appendChild(checkbox);
          line.appendChild(label);
          courseListContainer.appendChild(line);
        });
      })
      .catch(err => console.error('Error fetching courses:', err));
  
  
  







  
      // Handle course registration submission
      registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedCourses = Array.from(document.querySelectorAll('input[name="course"]:checked')).map(cb => cb.value);
  
        if (selectedCourses.length === 0) {
          alert('Select at least one course.');
          return;
        }
  
        try {
          const response = await fetch('/api/student/register-course', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ courseIds: selectedCourses })
          });
  
          const result = await response.json();
          document.getElementById('statusMsg').textContent = result.message;
        } catch (err) {
          console.error(err);
          document.getElementById('statusMsg').textContent = 'Error registering courses.';
        }
      });
    }
  
  










  // Display registered courses on dashboard
  const dashboardCourses = document.getElementById('registered-courses');
  if (dashboardCourses) {
    fetch('/api/student/courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(courses => {
      courses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = `${course.course_name} (${course.courseCode})`;
        dashboardCourses.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Error loading dashboard courses:', err);
    });
  }
  
  





  // handle scan option
  const myCoursesList = document.getElementById('my-registered-courses');
  const refreshButton = document.getElementById('refresh-courses');
  
  if (myCoursesList) loadStudentCourses();
  if (refreshButton) refreshButton.addEventListener('click', loadStudentCourses);
  
  function loadStudentCourses() {
    fetch('/api/student/courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(courses => {
        myCoursesList.innerHTML = '';

        courses.forEach(course => {
          const template = document.getElementById('course-template');
          const clone = template.content.cloneNode(true);
  
          const courseBox = clone.querySelector('.course-box');
          const title = clone.querySelector('.course-title');
          const status = clone.querySelector('.course-status');
          const scanBtn = clone.querySelector('.scan-btn');
  
          courseBox.dataset.courseId = course.id;  // Keep the original courseId for the dataset
          title.textContent = `${course.course_name} (${course.courseCode})`;
  
          myCoursesList.appendChild(clone);
  
          fetch(`/api/student/get-active-session/${course.id}`)  // Still use course.id here, as it's the correct reference
            .then(res => res.json())
            .then(data => {
              const isActive = data?.isActive === true;
              status.textContent = isActive ? 
              'Status: Active – Tap to Scan' 
              : 'Status: Not Active';
              status.style.color = isActive ? 'green' : 'red';
              courseBox.style.borderLeft = isActive ?
               '5px solid green' 
               : '5px solid red';
  
              if (isActive) {
                scanBtn.style.display = 'inline-block';
                scanBtn.addEventListener('click', () => {
                  window.location.href = `/student-scan-qrcode.html?course_id=${course.id}&sessionId=${data.sessionId}`;
                });
                               }
            })
            .catch(err => {
              console.error(`Error checking session for course ${course.id}:`, err);
            });
        });
      })
      .catch(err => {
        console.error('Error loading registered courses:', err);
      });
  }
  
// scan-btn.addEventListener('click', () => {
//   window.location.href = `/student-scan-qrcode.html?courseId=${course.id}&sessionId=${data.sessionId}`;
// });


// Handle logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = "student-dashboard.html";
      });
    }
  
 
  });