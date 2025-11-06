// public/js/api.js
const API_BASE_URL = 'http://localhost:5000/api/auth'; // Adjust if your backend runs elsewhere

// --- Registration ---
async function registerUser(name, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.error || 'Registration failed' };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Network error or server unavailable' };
    }
}

// --- Login ---
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user info in localStorage (or sessionStorage)
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.name); // Store name for display
            localStorage.setItem('userEmail', data.email); // Store email for display
            return { success: true, message: 'Login successful' };
        } else {
            return { success: false, message: data.error || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error or server unavailable' };
    }
}

// --- Get Profile ---
// public/js/api.js

// --- Get Profile ---
async function getProfile() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No token found in localStorage'); // Add this for debugging
        return { success: false, message: 'No token found' };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/profile`, { // API_BASE_URL should be 'http://localhost:5000/api/auth'
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // This is crucial
                'Content-Type': 'application/json',
            },
        });

        console.log('Profile API response status:', response.status); // Add this for debugging
        const data = await response.json();
        console.log('Profile API response data:', data); // Add this for debugging

        if (response.ok) {
            return { success: true, data }; // Returns user object
        } else {
            // If token is invalid/expired, clear it
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
            }
            return { success: false, message: data.error || 'Failed to get profile' };
        }
    } catch (error) {
        console.error('Get profile error:', error); // This is likely where the "Network error" comes from
        return { success: false, message: 'Network error or server unavailable' };
    }
}

// --- Logout ---
function logoutUser() {
    // Clear token and user info from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    // Redirect to main page after logout
    window.location.href = '/';
}