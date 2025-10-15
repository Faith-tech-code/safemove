// frontend/js/auth.js
async function register() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const statusEl = document.getElementById('status');
    
    if (!name || !phone || !password) {
        statusEl.innerText = 'Please fill in all fields';
        statusEl.style.color = 'red';
        return;
    }
    
    statusEl.innerText = 'Registering...';
    statusEl.style.color = '#007bff';

    try {
        const intendedRole = localStorage.getItem('intendedRole') || 'rider';
        const data = await apiFetch('/auth/register', 'POST', { 
            name, 
            phone, 
            password,
            role: intendedRole
        }, false);
        
        statusEl.innerText = `Success! ${data.message || 'Registered successfully'}. Redirecting...`;
        statusEl.style.color = 'green';
        localStorage.removeItem('intendedRole');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    } catch (e) {
        statusEl.innerText = e.message || 'Registration failed. Please try again.';
        statusEl.style.color = 'red';
        console.error('Registration error:', e);
    }
}

async function login() {
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const statusEl = document.getElementById('status');
    
    if (!phone || !password) {
        statusEl.innerText = 'Please fill in all fields';
        statusEl.style.color = 'red';
        return;
    }
    
    statusEl.innerText = 'Logging in...';
    statusEl.style.color = '#007bff';

    try {
        const data = await apiFetch('/auth/login', 'POST', { phone, password }, false);

        if (!data || !data.token) {
            throw new Error('Invalid response from server');
        }

        localStorage.setItem('token', data.token);

        // Handle different response structures from backend
        if (data.user) {
            localStorage.setItem('userName', data.user.name || data.user.username || phone);
            localStorage.setItem('userRole', data.user.role || 'rider');
        } else {
            // Fallback: decode token to get user info
            try {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                localStorage.setItem('userName', payload.name || payload.username || phone);
                localStorage.setItem('userRole', payload.role || 'rider');
            } catch (e) {
                localStorage.setItem('userName', phone);
                localStorage.setItem('userRole', 'rider');
            }
        }
        
        statusEl.innerText = 'Login successful! Redirecting...';
        statusEl.style.color = 'green';
        
        // Redirect to intended destination or default based on role
        const intendedDestination = localStorage.getItem('intendedDestination');
        localStorage.removeItem('intendedDestination');
        localStorage.removeItem('intendedRole');
        
        setTimeout(() => {
            if (intendedDestination) {
                window.location.href = intendedDestination;
            } else {
                // Default redirects based on role
                if (data.user.role === 'driver') {
                    window.location.href = 'driver-dashboard.html';
                } else if (data.user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'booking.html';
                }
            }
        }, 500);
    } catch (e) {
        statusEl.innerText = e.message || 'Login failed. Please check your credentials.';
        statusEl.style.color = 'red';
        console.error('Login error:', e);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const path = window.location.pathname;

    // Protected pages that require authentication
    const protectedPages = ['booking.html', 'dashboard.html', 'driver-dashboard.html', 'admin-dashboard.html'];
    const isProtectedPage = protectedPages.some(page => path.includes(page));

    if (!token && isProtectedPage) {
        localStorage.setItem('intendedDestination', path.split('/').pop());
        window.location.href = 'login.html';
    } else if (token && (path.includes('login.html') || path.includes('register.html'))) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'driver') {
            window.location.href = 'driver-dashboard.html';
        } else if (userRole === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'booking.html';
        }
    }

    const userName = localStorage.getItem('userName');
    if (userName && document.getElementById('userName')) {
        document.getElementById('userName').innerText = userName;
    }
}
