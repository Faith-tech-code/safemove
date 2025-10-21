// frontend/js/api.js
// Dynamic API base URL for development and production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
    ? 'http://localhost:8000/v1'  // Local development
    : 'https://safemove.onrender.com/v1'; // Production backend

// Fallback API URL in case production backend is not available
const FALLBACK_API_URL = 'http://localhost:8000/v1';

async function apiFetch(endpoint, method = 'GET', body = null, requireAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (requireAuth) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'register.html';
            throw new Error('Unauthorized');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    // Try production URL first, fallback to localhost if it fails
    let baseUrl = API_BASE_URL;
    let res;

    try {
        res = await fetch(`${baseUrl}${endpoint}`, options);
        // If production URL fails and we're not in development, try localhost as fallback
        if (!res.ok && !baseUrl.includes('localhost')) {
            console.warn('Production API failed, trying localhost fallback...');
            baseUrl = FALLBACK_API_URL;
            res = await fetch(`${baseUrl}${endpoint}`, options);
        }
    } catch (error) {
        // If production URL fails completely, try localhost fallback
        if (!baseUrl.includes('localhost')) {
            console.warn('Production API not accessible, using localhost fallback:', error.message);
            baseUrl = FALLBACK_API_URL;
            res = await fetch(`${baseUrl}${endpoint}`, options);
        } else {
            throw error;
        }
    }

    if (res.status === 401 && window.location.pathname.includes('dashboard.html')) {
        localStorage.removeItem('token');
        window.location.href = 'register.html';
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
            // Handle different HTTP status codes appropriately
            if (res.status === 401) {
                // Don't throw error for login/register - let calling function handle it
                if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
                    throw new Error(`Authentication failed`);
                }
                // For other endpoints, redirect to login
                if (requireAuth) {
                    localStorage.removeItem('token');
                    window.location.href = 'register.html';
                    throw new Error('Session expired. Please log in again.');
                }
            }
            throw new Error(`HTTP Error ${res.status}`);
        }
        return {};
    }
}
