document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        let users = JSON.parse(localStorage.getItem('users')) || {};
        const user = users[username];

        if (user && user.password === password) {
            localStorage.setItem('currentUser', username);
            alert('Login berhasil');
            window.location.href = 'index.html'; // Redirect to main page after successful login
        } else {
            alert('Username atau password salah');
        }
    });
});
