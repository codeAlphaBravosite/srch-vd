let originalData = [];
let viewedCount = 0;

function loadFile(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            originalData = results.data.map(item => ({
                ...item,
                Subscriber: item.Subscriber || 'N/A',
                Views: item.Views || '0'
            }));
            displayCards(originalData);
            document.getElementById('filterContainer').style.display = 'flex';
            document.getElementById('statsContainer').style.display = 'flex';
            updateStats();
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
            alert('Error parsing CSV file. Please check the file format and try again.');
        }
    });
}

function applyFilters() {
    const subscriberSort = document.getElementById('subscriberSort').value;
    const viewSort = document.getElementById('viewSort').value;
    
    let filteredData = [...originalData];

    filteredData.sort((a, b) => {
        let subscriberScore = 0;
        let viewScore = 0;

        if (subscriberSort !== 'none') {
            const subsA = a['Subscriber'] === 'N/A' ? -1 : parseInt(a['Subscriber']);
            const subsB = b['Subscriber'] === 'N/A' ? -1 : parseInt(b['Subscriber']);
            subscriberScore = subscriberSort === 'ascending' ? subsA - subsB : subsB - subsA;
        }

        if (viewSort !== 'none') {
            const viewsA = parseInt(a['Views'] || 0);
            const viewsB = parseInt(b['Views'] || 0);
            viewScore = viewSort === 'ascending' ? viewsA - viewsB : viewsB - viewsA;
        }

        return subscriberScore + viewScore;
    });

    displayCards(filteredData);
}

function formatNumber(number) {
    if (number === 'N/A') return 'N/A';
    number = parseInt(number);
    if (isNaN(number)) return 'N/A';
    
    const units = ['', 'K', 'M', 'B', 'T'];
    const unit = Math.floor(Math.log10(number) / 3);
    const value = (number / Math.pow(1000, unit)).toFixed(1);
    return `${value}${units[unit]}`;
}

function displayCards(data) {
    const cardsContainer = document.getElementById('cards');
    cardsContainer.innerHTML = '';
    data.forEach((video, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        const thumbnailUrl = `https://img.youtube.com/vi/${video['Video Id']}/0.jpg`;
        card.innerHTML = `
            <img src="${thumbnailUrl}" alt="${video['Title']}" class="thumbnail" loading="lazy">
            <div class="card-content">
                <h2 class="card-title">
                    <a href="https://m.youtube.com/watch?v=${video['Video Id']}" target="_blank" rel="noopener noreferrer">${video['Title']}</a>
                </h2>
                <div class="card-stats">
                    ${formatNumber(video['Views'])} views • ${formatNumber(video['Subscriber'])} subscribers
                </div>
                <label class="viewed-checkbox">
                    <input type="checkbox" onchange="toggleVisibility(${index})"> Viewed
                </label>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
    updateStats();
}

function toggleVisibility(index) {
    const card = document.querySelector(`.card[data-index='${index}']`);
    card.classList.toggle('viewed');
    updateStats();
}

function updateStats() {
    const totalVideos = originalData.length;
    viewedCount = document.querySelectorAll('.card.viewed').length;
    const remainingVideos = totalVideos - viewedCount;

    document.getElementById('totalVideos').textContent = totalVideos;
    document.getElementById('viewedVideos').textContent = viewedCount;
    document.getElementById('remainingVideos').textContent = remainingVideos;
}

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.body.classList[currentTheme === 'dark' ? 'add' : 'remove']('dark-mode');
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedApplyFilters = debounce(applyFilters, 300);

document.getElementById('filterContainer').style.display = 'none';
document.getElementById('csvFileInput').addEventListener('change', loadFile);
document.getElementById('subscriberSort').addEventListener('change', debouncedApplyFilters);
document.getElementById('viewSort').addEventListener('change', debouncedApplyFilters);

window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
    alert('An error occurred. Please check your internet connection and try again.');
});
