// frontend/api.js

// Dynamic API base URL for development and production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
    ? 'http://localhost:8000/v1'  // Local development
    : 'https://safemove.onrender.com/v1'; // Production backend

/**
 * A wrapper for the fetch API to communicate with the backend.
 * @param {string} endpoint - The API endpoint to call (e.g., '/auth/login').
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
 * @param {object|null} body - The request body for POST/PUT requests.
 * @param {boolean} requireAuth - Whether to include the JWT token in the headers.
 * @returns {Promise<any>} - The JSON response from the server.
 */
async function apiFetch(endpoint, method = 'GET', body = null, requireAuth = true) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    const config = {
        method,
        headers,
    };

    if (requireAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('API call requires auth, but no token found.');
        }
    }

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error('API Fetch Error:', error);
        // Re-throw the error to be caught by the calling function
        throw error;
    }
}