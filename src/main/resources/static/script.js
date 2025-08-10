

const baseUrl = 'http://localhost:8080'; // Your Spring Boot API URL

// Show error message
function showError(message, elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
}


// Hide error message
function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = '';
}

// Validate form fields
function validateForm(fields) {
  for (const field of fields) {
    if (!field.value) {
      return `${field.placeholder} is required`;
    }
  }
  return null;
}







// Handle Signup
function handleSignup() {
  const name = document.getElementById('signup-name');
  const email = document.getElementById('signup-email');
  const password = document.getElementById('signup-password');

  const validationError = validateForm([name, email, password]);
  if (validationError) {
    showError(validationError, 'signup-error');
    return;
  }

  const data = { name: name.value, email: email.value, password: password.value };

  document.getElementById('signup-btn').disabled = true;

  fetch(`${baseUrl}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('signup-btn').disabled = false;
    if (data.success) {
      alert('Signup successful!');
      toggleForm();
    } else {
      showError(data.message, 'signup-error');
    }
  })
  .catch(error => {
    document.getElementById('signup-btn').disabled = false;
    showError('Error during signup: ' + error, 'signup-error');
  });
}

// Handle Login
function handleLogin() {
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');

  const validationError = validateForm([email, password]);
  if (validationError) {
    showError(validationError, 'login-error');
    return;
  }

  const data = { email: email.value, password: password.value };

  document.getElementById('login-btn').disabled = true;

  fetch(`${baseUrl}/users/login/{email}/{password}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password }),
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('login-btn').disabled = false;
    if (data.token) {
      alert('Login successful!');
      console.log("login successful");
      localStorage.setItem('auth-token', data.token); // Store JWT Token
      window.location.href = 'users.html';  // Redirect to the employees page

    } else {
      console.log("login failed");
      showError(data.message, 'login-error');
    }
  })
  .catch(error => {
    console.error('Error during login:', error);
    document.getElementById('login-btn').disabled = false;
    showError('Error during login: ' + error, 'login-error');
  });
}
// Fetch all employees and display them
// Function to fetch all employees and display them on employees.html page
function fetchUsers() {
    const token = localStorage.getItem('auth-token'); // Get the JWT token from localStorage

    if (!token) {
        alert('You must be logged in to view the employees.');
        window.location.href = 'index.html'; // Redirect to the login page if no token
        return;
    }

    // Fetch all employees from the backend
    fetch('http://localhost:8080/employees/all', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Send the token in the Authorization header
        }
    })
    .then(response => response.json())
    .then(data => {
        const userListElement = document.getElementById('user-list');
        userListElement.innerHTML = ''; // Clear any previous data

        // Add each user to the list
        data.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `Name: ${user.name}, Email: ${user.email}`;
            employeeListElement.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error fetching employees:', error);
        alert('Failed to load users.');
    });
}
// Call fetchEmployees when the page loads (employees.html)
window.onload = function() {
    if (window.location.pathname.endsWith('users.html')) {
        fetchUsers();
    } else {
        const signupForm = document.getElementById('signup-form');
        const signinForm = document.getElementById('signin-form');
        
        // Initially show the signup form and hide the signin form
        signupForm.style.display = 'block';
        signinForm.style.display = 'none';
    }
};
// Toggle between Signup and Login Forms
function toggleForm() {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const formTitle = document.getElementById('form-title');
  const switchText = document.getElementById('switch-text');
  
  if (signupForm.style.display === 'none') {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
    formTitle.innerText = 'Signup';
    switchText.innerHTML = 'Already have an account? <span id="switch-link" onclick="toggleForm()">Login</span>';
  } else {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    formTitle.innerText = 'Login';
    switchText.innerHTML = "Don't have an account? <span id='switch-link' onclick='toggleForm()'>Signup</span>";
  }

  // Hide errors when switching forms
  hideError('signup-error');
  hideError('login-error');
}
