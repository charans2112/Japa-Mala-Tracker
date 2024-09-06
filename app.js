// Set default date input to today's date
document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    document.getElementById('date').value = today; // Set the value of the date input field
});

document.getElementById('mala-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const malas = document.getElementById('malas').value;
    const date = document.getElementById('date').value;  // Use the selected or current date

    // Post data to the server
    await fetch('http://localhost:5000/add-malas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date, malas: Number(malas) })
    });

    updateTotalMalas();
    updateDailyRecords();
});

// Fetch and display lifetime total malas
async function updateTotalMalas() {
    const response = await fetch('http://localhost:5000/total-malas');
    const data = await response.json();
    document.getElementById('lifetime-total').textContent = data.total;
}

// Fetch and display daily mala records
async function updateDailyRecords() {
    const response = await fetch('http://localhost:5000/daily-records');
    const data = await response.json();
    
    const tbody = document.getElementById('daily-records');
    tbody.innerHTML = '';
    
    data.forEach(record => {
        const row = `<tr>
            <td>${record.date}</td>
            <td>${record.malas}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Initialize the data on page load
updateTotalMalas();
updateDailyRecords();
