// public/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('messageDiv');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileInfoDiv = document.getElementById('profileInfo');

    // --- Check if user is already logged in on profile page ---
    if (window.location.pathname === '/profile.html') {
        loadProfile();
    }

    // --- Handle Registration ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            messageDiv.textContent = '';
            messageDiv.className = 'message'; // Reset classes

            const result = await registerUser(name, email, password);

            if (result.success) {
                messageDiv.textContent = result.message;
                messageDiv.classList.add('success');
                // Optionally clear form
                registerForm.reset();
            } else {
                messageDiv.textContent = result.message;
                messageDiv.classList.add('error');
            }
        });
    }

    // --- Handle Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            messageDiv.textContent = '';
            messageDiv.className = 'message';

            const result = await loginUser(email, password);

            if (result.success) {
                messageDiv.textContent = result.message;
                messageDiv.classList.add('success');
                // Redirect to profile page after successful login
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000); // Wait 1 second to show message
            } else {
                messageDiv.textContent = result.message;
                messageDiv.classList.add('error');
            }
        });
    }

    // --- Handle Logout ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }

    // --- Load Profile Data ---
    async function loadProfile() {
        if (!profileInfoDiv) return; // Exit if not on profile page

        messageDiv.textContent = '';
        messageDiv.className = 'message';

        const result = await getProfile();

        if (result.success) {
            // Display user data
            profileInfoDiv.innerHTML = `
                <p><strong>Name:</strong> ${result.data.name}</p>
                <p><strong>Email:</strong> ${result.data.email}</p>
                <p><strong>Member Since:</strong> ${new Date(result.data.createdAt).toLocaleDateString()}</p>
                <p><strong>User ID:</strong> ${result.data._id}</p>
            `;
        } else {
            messageDiv.textContent = result.message;
            messageDiv.classList.add('error');
            // Optionally redirect to login if token is invalid
            if (result.message.includes('No token found') || result.message.includes('Invalid token')) {
                setTimeout(() => {
                    window.location.href = '/'; // Redirect to main page
                }, 2000);
            }
        }
    }
});

