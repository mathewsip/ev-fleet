document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (localStorage.getItem('slbvi_user')) {
        window.location.href = 'home.html';
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // For demo purposes, we'll just validate that fields aren't empty
            if (email.trim() === '' || password.trim() === '') {
                showError('Please enter both email and password');
                return;
            }
            
            // In a real application, you'd send these credentials to a server
            // For this demo, we'll simulate a successful login
            simulateLogin(email, remember);
        });
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
    }
});

function simulateLogin(email, remember) {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Signing in...';
    
    // Simulate API request delay
    setTimeout(function() {
        // Create user object
        const user = {
            email: email,
            name: email.split('@')[0], // Simple way to generate a name for demo
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=635BFF&color=fff`,
            role: 'Demo User',
            lastLogin: new Date().toISOString()
        };
        
        // Store in localStorage
        localStorage.setItem('slbvi_user', JSON.stringify(user));
        
        // Redirect to home page
        window.location.href = 'home.html';
    }, 1000);
}

function logout() {
    localStorage.removeItem('slbvi_user');
    window.location.href = 'index.html';
}

function showError(message) {
    // Check if error element already exists
    let errorElement = document.querySelector('.login-error');
    
    if (!errorElement) {
        // Create error element
        errorElement = document.createElement('div');
        errorElement.className = 'login-error';
        errorElement.style.backgroundColor = '#fff0f0';
        errorElement.style.color = '#e03030';
        errorElement.style.padding = '12px';
        errorElement.style.borderRadius = '8px';
        errorElement.style.marginBottom = '16px';
        errorElement.style.fontSize = '0.875rem';
        
        // Insert before the form
        const form = document.getElementById('login-form');
        form.parentNode.insertBefore(errorElement, form);
    }
    
    // Set error message
    errorElement.textContent = message;
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 4000);
}

// Check authentication status
function checkAuth() {
    const user = localStorage.getItem('slbvi_user');
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(user);
}

// Update UI with user info
function updateUserInfo() {
    const user = checkAuth();
    if (!user) return;
    
    const userElements = document.querySelectorAll('.user-name');
    userElements.forEach(el => {
        el.textContent = user.name;
    });
    
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(el => {
        el.src = user.avatar;
    });
}