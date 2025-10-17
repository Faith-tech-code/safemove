// frontend/js/auth.js
async function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const statusEl = document.getElementById('status');

    if (!name || !email || !phone || !password) {
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
            email,
            phone,
            password,
            role: intendedRole
        }, false);
        
        statusEl.innerText = `Success! ${data.message || 'Registered successfully'}. Redirecting...`;
        statusEl.style.color = 'green';
        localStorage.removeItem('intendedRole');
        setTimeout(() => { window.location.href = 'register.html'; }, 1500);
    } catch (e) {
        statusEl.innerText = e.message || 'Registration failed. Please try again.';
        statusEl.style.color = 'red';
        console.error('Registration error:', e);
    }
}

async function login() {
    const loginInput = document.getElementById('loginInput').value;
    const password = document.getElementById('password').value;
    const statusEl = document.getElementById('status');
    
    if (!loginInput || !password) {
        statusEl.innerText = 'Please fill in all fields';
        statusEl.style.color = 'red';
        return;
    }

    statusEl.innerText = 'Logging in...';
    statusEl.style.color = '#007bff';

    try {
         const data = await apiFetch('/auth/login', 'POST', { loginInput: loginInput, password }, false);

        if (!data || !data.token) {
            throw new Error('Invalid response from server');
        }

        localStorage.setItem('token', data.token);

        // Handle different response structures from backend
        if (data.user) {
            localStorage.setItem('userName', data.user.name || data.user.username || loginInput);
            localStorage.setItem('userRole', data.user.role || 'rider');
        } else {
            // Fallback: decode token to get user info
            try {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                localStorage.setItem('userName', payload.name || payload.username || loginInput);
                localStorage.setItem('userRole', payload.role || 'rider');
            } catch (e) {
                localStorage.setItem('userName', loginInput);
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

// Password Reset Functions
async function requestPasswordReset(email) {
    if (!email) {
        showStatus('Please provide your email address', 'error');
        return;
    }

    showStatus('Sending reset link...', 'info');

    try {
        const data = await apiFetch('/auth/forgot-password', 'POST', { email }, false);
        showStatus(data.message || 'Reset link sent successfully!', 'success');

        if (data.resetToken && window.location.pathname.includes('login.html')) {
            // Show the token for development/testing in login modal
            const statusEl = document.getElementById('resetStatus');
            if (statusEl) {
                statusEl.innerHTML = `<div>${data.message}</div><div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; font-family: monospace; font-size: 12px;">Reset Token: ${data.resetToken}</div><div style="margin-top: 10px; font-size: 12px; color: #666;">Copy this token and use it in Step 2</div>`;
            }
        }

        return data;
    } catch (e) {
        showStatus(e.message || 'Failed to send reset link. Please try again.', 'error');
        throw e;
    }
}

async function resetPasswordWithToken(token, newPassword) {
    if (!token || !newPassword) {
        showStatus('Token and new password are required', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showStatus('Password must be at least 6 characters long', 'error');
        return;
    }

    showStatus('Resetting password...', 'info');

    try {
        const data = await apiFetch('/auth/reset-password', 'POST', {
            token: token,
            newPassword: newPassword
        }, false);

        showStatus(data.message || 'Password reset successful!', 'success');
        return data;
    } catch (e) {
        showStatus(e.message || 'Failed to reset password. Please try again.', 'error');
        throw e;
    }
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const path = window.location.pathname;

    // Protected pages that require authentication
    const protectedPages = ['booking.html', 'dashboard.html', 'driver-dashboard.html', 'admin-dashboard.html'];
    const isProtectedPage = protectedPages.some(page => path.includes(page));

    if (!token && isProtectedPage) {
        localStorage.setItem('intendedDestination', path.split('/').pop());
        window.location.href = 'register.html';
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
