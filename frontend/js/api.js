// frontend/js/api.js
const API_BASE_URL = 'http://localhost:8000/v1';

async function apiFetch(endpoint, method = 'GET', body = null, requireAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (requireAuth) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            throw new Error('Unauthorized');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (res.status === 401 && window.location.pathname.includes('dashboard.html')) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        throw new Error('Session expired. Please log in again.');
    }

    try {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || `API request failed with status: ${res.status}`);
        }
        return data;
    } catch (e) {
        if (!res.ok) {
             throw new Error(`HTTP Error ${res.status}`);
        }
        return {}; 
    }
}
