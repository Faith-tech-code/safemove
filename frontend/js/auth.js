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
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
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
        console.log('🔐 Attempting login with:', loginInput);
         const data = await apiFetch('/auth/login', 'POST', { loginInput: loginInput, password }, false);

        console.log('📥 Raw login response:', data);
        console.log('📊 Response type:', typeof data);
        console.log('🔑 Response keys:', data ? Object.keys(data) : 'null/undefined');

        // Handle different response formats
        const token = data.token || data.access_token;
        console.log('🎫 Token found:', !!token);
        console.log('🎫 Token value:', token ? token.substring(0, 20) + '...' : 'null');

        if (!data || !token) {
            console.error('❌ Invalid response structure:', data);
            throw new Error('Invalid response from server - no token found');
        }

        console.log('Token received, storing...');
        localStorage.setItem('token', token);

        // Handle different response structures from backend
        let userRole = 'rider'; // default role

        console.log('🔄 Processing login response:', data);
        console.log('📋 Response has user object:', !!data.user);
        console.log('👤 User object type:', typeof data.user);

        if (data.user && typeof data.user === 'object') {
            const userName = data.user.name || data.user.username || loginInput;
            userRole = data.user.role || 'rider';

            localStorage.setItem('userName', userName);
            localStorage.setItem('userRole', userRole);

            console.log('✅ User data from response:', { name: userName, role: userRole });
        } else {
            console.log('🔄 No user object in response, trying token decode...');
            // Fallback: decode token to get user info
            try {
                const tokenParts = token.split('.');
                console.log('🎫 Token parts:', tokenParts.length);
                const tokenPayload = JSON.parse(atob(tokenParts[1]));
                console.log('🎫 Token payload:', tokenPayload);

                const fallbackName = tokenPayload.name || tokenPayload.username || loginInput;
                userRole = tokenPayload.role || 'rider';

                localStorage.setItem('userName', fallbackName);
                localStorage.setItem('userRole', userRole);

                console.log('✅ User data from token:', { name: fallbackName, role: userRole });
            } catch (e) {
                console.error('❌ Token decode error:', e);
                localStorage.setItem('userName', loginInput);
                localStorage.setItem('userRole', 'rider');
                userRole = 'rider';
            }
        }

        console.log('✅ Final user role for redirection:', userRole);
        console.log('💾 Stored in localStorage - userRole:', localStorage.getItem('userRole'));
        console.log('💾 Stored in localStorage - userName:', localStorage.getItem('userName'));
        console.log('💾 Stored in localStorage - token:', localStorage.getItem('token') ? 'YES' : 'NO');

        statusEl.innerText = 'Login successful! Redirecting...';
        statusEl.style.color = 'green';

        // Redirect to intended destination or default based on role
        const intendedDestination = localStorage.getItem('intendedDestination');
        console.log('🎯 Intended destination:', intendedDestination);

        localStorage.removeItem('intendedDestination');
        localStorage.removeItem('intendedRole');

        setTimeout(() => {
            console.log('⏰ Executing redirection after 500ms delay...');
            if (intendedDestination) {
                console.log('🚀 Redirecting to intended destination:', intendedDestination);
                window.location.href = intendedDestination;
            } else {
                // Default redirects based on role
                console.log('🚀 Redirecting to role-based dashboard for role:', userRole);
                if (userRole === 'driver') {
                    console.log('🚗 Redirecting driver to driver-dashboard.html');
                    window.location.href = 'driver-dashboard.html';
                } else if (userRole === 'admin') {
                    console.log('⚙️ Redirecting admin to admin-dashboard.html');
                    window.location.href = 'admin-dashboard.html';
                } else {
                    console.log('🎫 Redirecting rider to booking.html');
                    window.location.href = 'booking.html';
                }
            }
            console.log('✅ Redirection initiated');
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
        const data = await apiFetch('/forgot-password', 'POST', { email }, false);
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
        const data = await apiFetch('/reset-password', 'POST', {
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
        // Only redirect if not in the middle of a login process
        const isLoggingIn = document.getElementById('loginBtn') && document.getElementById('loginBtn').textContent === 'Logging in...';
        if (!isLoggingIn) {
            const userRole = localStorage.getItem('userRole') || 'rider';
            const userName = localStorage.getItem('userName') || 'User';
            console.log('User already logged in:', userName, 'role:', userRole, 'current path:', path);

            if (userRole === 'driver') {
                console.log('Redirecting driver to driver-dashboard.html');
                window.location.href = 'driver-dashboard.html';
            } else if (userRole === 'admin') {
                console.log('Redirecting admin to admin-dashboard.html');
                window.location.href = 'admin-dashboard.html';
            } else {
                console.log('Redirecting rider to booking.html');
                window.location.href = 'booking.html';
            }
        } else {
            console.log('Login in progress, not redirecting');
        }
    }

    const userName = localStorage.getItem('userName');
    if (userName && document.getElementById('userName')) {
        document.getElementById('userName').innerText = userName;
    }
}
