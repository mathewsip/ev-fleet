// Disabled authentication system for demo purposes
document.addEventListener('DOMContentLoaded', function() {
    // Simulate a logged-in user
    if (!localStorage.getItem('slbvi_user')) {
        const user = {
            email: "demo@example.com",
            name: "Demo User",
            avatar: "https://ui-avatars.com/api/?name=Demo+User&background=635BFF&color=fff",
            role: "Demo User",
            lastLogin: new Date().toISOString()
        };
        
        // Store in localStorage
        localStorage.setItem('slbvi_user', JSON.stringify(user));
    }
    
    // Update UI with user info
    updateUserInfo();
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
    }
});

// Simple logout function
function logout() {
    localStorage.removeItem('slbvi_user');
    window.location.href = 'index.html';
}

// Check authentication status - always returns a user
function checkAuth() {
    const user = localStorage.getItem('slbvi_user');
    if (!user) {
        // Create a default user if none exists
        const defaultUser = {
            email: "demo@example.com",
            name: "Demo User",
            avatar: "https://ui-avatars.com/api/?name=Demo+User&background=635BFF&color=fff",
            role: "Demo User",
            lastLogin: new Date().toISOString()
        };
        localStorage.setItem('slbvi_user', JSON.stringify(defaultUser));
        return defaultUser;
    }
    return JSON.parse(user);
}

// Update UI with user info
function updateUserInfo() {
    const user = checkAuth();
    
    const userElements = document.querySelectorAll('.user-name');
    userElements.forEach(el => {
        el.textContent = user.name;
    });
    
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(el => {
        el.src = user.avatar;
    });
}
