document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newUsername = document.getElementById('new-username').value.trim();
        const newPassword = document.getElementById('new-password').value;

        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[newUsername]) {
            alert('Username sudah terdaftar.');
            return;
        }

        // Create new user object
        const newUser = {
            password: newPassword,
            transactions: []
        };

        // Save new user to localStorage
        users[newUsername] = newUser;
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registrasi berhasil. Silakan login.');
        window.location.href = 'login.html'; // Redirect to login page after registration
    });
});
