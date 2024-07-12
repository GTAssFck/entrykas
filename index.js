document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transaction-form');
    const transactionTable = document.getElementById('transaction-table');
    const transactionList = document.getElementById('transaction-list');
    const totalBalance = document.getElementById('total-balance');
    const logoutButton = document.getElementById('logout-button');

    let transactions = [];

    // Function to display transactions
    function displayTransactions() {
        let currentUser = localStorage.getItem('currentUser');
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[currentUser]) {
            transactions = users[currentUser].transactions || [];
            let transactionsHTML = '';
            let balance = 0;

            transactions.forEach(function(transaction, index) {
                transactionsHTML += `<tr data-index="${index}">
                                        <td>${transaction.description}</td>
                                        <td>${transaction.type === 'income' ? '+' : '-'}${transaction.amount}</td>
                                        <td>${transaction.date}</td>
                                        <td>${transaction.type}</td>
                                        <td><button class="delete-button">Hapus</button></td>
                                    </tr>`;
                balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
            });

            transactionList.innerHTML = transactionsHTML;
            totalBalance.textContent = balance.toFixed(2);
            addDeleteEventListeners();
        }
    }

    // Add delete event listeners to each delete button
    function addDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const index = this.parentElement.parentElement.getAttribute('data-index');
                deleteTransaction(index);
            });
        });
    }

    // Delete transaction
    function deleteTransaction(index) {
        let currentUser = localStorage.getItem('currentUser');
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[currentUser]) {
            users[currentUser].transactions.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            displayTransactions();
        }
    }

    // Add transaction
    transactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let currentUser = localStorage.getItem('currentUser');
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (!users[currentUser]) {
            alert('User tidak ditemukan.');
            return;
        }

        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const transactionDate = document.getElementById('transaction-date').value;
        const transactionType = document.getElementById('transaction-type').value;

        // Validation
        if (!description || isNaN(amount) || !transactionDate) {
            alert('Mohon lengkapi semua kolom.');
            return;
        }

        // Create transaction object
        const transaction = {
            date: transactionDate,
            description: description,
            amount: amount,
            type: transactionType
        };

        // Save transaction to user's data
        users[currentUser].transactions.push(transaction);
        localStorage.setItem('users', JSON.stringify(users));

        // Clear form fields
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('transaction-date').value = '';

        // Update transaction list
        displayTransactions();
    });

    // Logout function
    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html'; // Redirect to login page after logout
    }

    function convertArrayOfObjectsToCSV(data) {
        const header = ['Tanggal', 'Deskripsi', 'Jumlah', 'Jenis'];
        const csvRows = [header.join(','), ...data.map(row => Object.values(row).join(','))];
        return 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    }
    
    function downloadCSV(csvData) {
        const link = document.createElement('a');
        link.setAttribute('href', csvData);
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    document.getElementById('export-csv-button').addEventListener('click', function() {
        const currentUser = localStorage.getItem('currentUser');
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[currentUser] && users[currentUser].transactions) {
            const csvData = convertArrayOfObjectsToCSV(users[currentUser].transactions);
            downloadCSV(csvData);
        } else {
            alert('Tidak ada data transaksi untuk diekspor.');
        }
    });

    // Event listener for logout button
    logoutButton.addEventListener('click', function() {
        logout();
    });

    // Initial display of transactions
    displayTransactions();
});
