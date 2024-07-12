document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const exportBtn = document.getElementById('export-btn');
    const balanceEl = document.getElementById('balance');

    let transactions = [];

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('type').value;

        const transaction = {
            id: generateID(),
            date,
            description,
            amount: +amount,
            type
        };

        transactions.push(transaction);
        addTransactionToList(transaction);
        updateLocalStorage();
        updateBalance();

        form.reset();
    });

    exportBtn.addEventListener('click', function() {
        exportToCSV(transactions);
    });

    function generateID() {
        return Math.floor(Math.random() * 1000000);
    }

    function addTransactionToList(transaction) {
        const item = document.createElement('li');
        item.classList.add(transaction.type.toLowerCase());
        item.innerHTML = `
            ${transaction.date} - ${transaction.description} - ${transaction.amount} (${transaction.type})
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;
        transactionList.appendChild(item);
    }

    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    window.removeTransaction = function(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        updateBalance();
        init();
    }

    function updateBalance() {
        const balance = transactions.reduce((acc, transaction) => {
            return transaction.type === 'Income' ? acc + transaction.amount : acc - transaction.amount;
        }, 0);
        balanceEl.innerText = balance;
    }

    function exportToCSV(transactions) {
        const csvRows = [
            ['ID', 'Tanggal', 'Deskripsi', 'Jumlah', 'Tipe']
        ];

        transactions.forEach(transaction => {
            csvRows.push([transaction.id, transaction.date, transaction.description, transaction.amount, transaction.type]);
        });

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'laporan_keuangan.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function init() {
        transactionList.innerHTML = '';
        transactions.forEach(addTransactionToList);
        updateBalance();
    }

    init();
});
