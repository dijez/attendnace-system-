if (document.getElementById('register-form')) {
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/admin/register', {
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
      window.location.href = "index.html"; // Redirect to login page
    } catch (error) {
      alert('Error registering user');
    }
  });
}


if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // const email = document.getElementById('email').value;
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // Use username instead of email
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        window.location.href = "dashboard.html"; // Redirect to a dashboard or user info page
      } else {
        alert(data.message || 'Login failed!');
      }
    } catch (error) {
      alert('Error logging in');
    }
  });
}

if (window.location.pathname.includes("dashboard.html")) {
  const token = localStorage.getItem('token');

  // if (!token) {
  //   alert("Unauthorized! Please log in.");
  //   window.location.href = "index.html"; // Redirect to login
  // } else {

  //   document.getElementById('fetch-info').addEventListener('click', async () => {
  //     try {
  //       const response = await fetch('/userinfo', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });

  //       const data = await response.json();
  //       if (data.lecturer) {
  //         document.getElementById('userinfo-section').style.display = 'block'; // Show section
  //         document.getElementById('userinfo-output').textContent = JSON.stringify(data.lecturer, null, 2);
  //       } else {
  //         alert("Failed to fetch user info");
  //       }
  //     } catch (error) {
  //       alert('Error fetching user info');
  //     }
  //   });
  // }

  // Logout function
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = "index.html";
  });
}

// Display registered courses on dashboard
const dashboardCourses = document.getElementById('assignmentsTable');
if (dashboardCourses) {
  fetch('/api/admin/lecturer-course-assignments')
  .then(res => res.json())
  .then(data => {
    console.log('Dashboard assignments:', data.assignments);
    const tbody = document.querySelector('#assignmentsTable tbody');
    data.assignments.forEach(item => {
      const row = `<tr>
        <td>${item.lecturerName}</td>
        <td>${item.course_code}</td>
        <td>${item.course_name}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  })
  .catch(err => {
    console.error('Error loading assignments:', err);
  });
}   

// if (data.token) {
//   localStorage.setItem('token', data.token);
//   alert('Login successful!');
//   window.location.href = "dashboard.html"; // Redirect to dashboard
// }



  // document.getElementById('fetch-info').addEventListener('click', async () => {
  //   const token = localStorage.getItem('token');
  //   try {
  //     const response = await fetch('/userinfo', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  
  //     const data = await response.json();
  //     if (response.ok) {
  //       document.getElementById('userinfo-output').textContent = JSON.stringify(data.user, null, 2);
  //     } else {
  //       alert(data.message || 'Failed to fetch user info');
  //     }
  //   } catch (error) {
  //     alert('Error fetching user info');
  //   }
  // });
  


















