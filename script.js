// Initialize storage or get existing data
let japaData = JSON.parse(localStorage.getItem('japaData')) || {};
let mantraData = JSON.parse(localStorage.getItem('mantraData')) || {};

// Helper to save data to localStorage
function saveData() {
    localStorage.setItem('japaData', JSON.stringify(japaData));
    localStorage.setItem('mantraData', JSON.stringify(mantraData));
}

// Initialize date picker to today's date
document.getElementById('japa-date').value = new Date().toISOString().slice(0, 10);

// Load Mantras in select dropdown
function loadMantras() {
    const select = document.getElementById('mantra-select');
    select.innerHTML = '<option value="" disabled selected>Select Mantra</option>';
    for (let mantra in mantraData) {
        let option = document.createElement('option');
        option.value = mantra;
        option.text = mantra;
        select.appendChild(option);
    }
}

// Add a new mantra
function addMantra() {
    const mantraInput = document.getElementById('mantra-input');
    const mantra = mantraInput.value.trim();
    if (mantra && !mantraData[mantra]) {
        mantraData[mantra] = { lifetime: 0 };
        saveData();
        loadMantras();
    }
    mantraInput.value = '';
}

// Remove selected mantra
function removeMantra() {
    const select = document.getElementById('mantra-select');
    const mantra = select.value;
    if (mantra) {
        delete mantraData[mantra];
        for (let date in japaData) {
            delete japaData[date][mantra];
        }
        saveData();
        loadMantras();
        updateStats();
        hideDailyLog(); // Hide the daily log after removal
    }
}

// Add Japa Malas for the selected mantra
function addJapaMalas() {
    const date = document.getElementById('japa-date').value;
    const malas = parseInt(document.getElementById('malas-input').value, 10);
    const mantra = document.getElementById('mantra-select').value;

    if (!mantra || isNaN(malas) || malas <= 0) {
        alert('Please select a valid mantra and enter the number of Japa Malas.');
        return;
    }

    // Add to japa data for the date and mantra
    if (!japaData[date]) japaData[date] = {};
    if (!japaData[date][mantra]) japaData[date][mantra] = 0;
    japaData[date][mantra] += malas;

    // Add to mantra lifetime count
    mantraData[mantra].lifetime += malas;

    // Save to localStorage
    saveData();

    // Update stats and logs
    updateStats();
    hideDailyLog(); // Hide the daily log after addition
}

// Update the statistics (total Japa Malas today and lifetime)
function updateStats() {
    const date = document.getElementById('japa-date').value;
    let todayMalas = 0;
    let lifetimeMalas = 0;

    // Calculate today's malas
    if (japaData[date]) {
        for (let mantra in japaData[date]) {
            todayMalas += japaData[date][mantra];
        }
    }

    // Calculate lifetime malas
    for (let mantra in mantraData) {
        lifetimeMalas += mantraData[mantra].lifetime;
    }

    document.getElementById('today-malas').textContent = todayMalas;
    document.getElementById('lifetime-malas').textContent = lifetimeMalas;

    // Update mantra-specific stats
    const statsContainer = document.getElementById('mantra-stats-container');
    statsContainer.innerHTML = '';
    for (let mantra in mantraData) {
        let stat = document.createElement('p');
        stat.textContent = `${mantra}: ${mantraData[mantra].lifetime} Japa Malas (Lifetime)`;
        statsContainer.appendChild(stat);
    }
}

// Show daily log on button click
function showDailyLog() {
    const logSection = document.getElementById('log-section');
    logSection.classList.remove('hidden'); // Show the log section
    updateDailyLog(); // Update the log based on the selected date
}

// Hide the daily log
function hideDailyLog() {
    const logSection = document.getElementById('log-section');
    logSection.classList.add('hidden'); // Hide the log section
}

// Update the daily Japa Mala log in table format
function updateDailyLog() {
    const date = document.getElementById('japa-date').value;
    const logContainer = document.getElementById('log-container');
    logContainer.innerHTML = '';

    if (japaData[date]) {
        for (let mantra in japaData[date]) {
            let row = document.createElement('tr');
            let mantraCell = document.createElement('td');
            let malasCell = document.createElement('td');
            let dateCell = document.createElement('td');

            mantraCell.textContent = mantra;
            malasCell.textContent = japaData[date][mantra];
            dateCell.textContent = date;

            row.appendChild(mantraCell);
            row.appendChild(malasCell);
            row.appendChild(dateCell);
            logContainer.appendChild(row);
        }
    } else {
        let row = document.createElement('tr');
        let noData = document.createElement('td');
        noData.setAttribute('colspan', 3);
        noData.textContent = 'No Japa Malas recorded for this day.';
        row.appendChild(noData);
        logContainer.appendChild(row);
    }
}

// Initial load
loadMantras();
updateStats();
hideDailyLog(); // Initially hide the daily log
