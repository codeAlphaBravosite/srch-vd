let originalData = [];

function loadFile(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            originalData = results.data;
            displayCards(originalData);
            document.getElementById('filterContainer').style.display = 'block';
        }
    });
}

function applyFilters() {
    const subscriberSort = document.getElementById('subscriberSort').value;
    const viewSort = document.getElementById('viewSort').value;
    
    let filteredData = [...originalData];

    filteredData.sort((a, b) => {
        let comparison = 0;
        if (subscriberSort !== 'none') {
            const subsA = parseInt(a['Subscribers']);
            const subsB = parseInt(b['Subscribers']);
            comparison = subscriberSort === 'ascending' ? subsA - subsB : subsB - subsA;
        }
        if (comparison === 0 && viewSort !== 'none') {
            const viewsA = parseInt(a['Views']);
            const viewsB = parseInt(b['Views']);
            comparison = viewSort === 'ascending' ? viewsA - viewsB : viewsB - viewsA;
        }
        return comparison;
    });

    displayCards(filteredData);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
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
            <img src="${thumbnailUrl}" alt="${video['Title']}" class="thumbnail">
            <div class="card-content">
                <a href="https://www.youtube.com/watch?v=${video['Video Id']}" target="_blank" class="card-title">${video['Title']}</a>
                <div class="card-subtitle">${formatNumber(video['Views'])} views</div>
                <div class="card-subtitle">${formatNumber(video['Subscribers'])} subscribers</div>
                <label class="viewed-checkbox">
                    <input type="checkbox" onchange="toggleVisibility(${index})"> Viewed?
                </label>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}

function toggleVisibility(index) {
    const card = document.querySelector(`.card[data-index='${index}']`);
    card.classList.toggle('viewed');
}

// Dark mode toggle
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

// Check for saved user preference, if any, on load of the website
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.body.classList[currentTheme === 'dark' ? 'add' : 'remove']('dark-mode');

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// Initialize
document.getElementById('filterContainer').style.display = 'none';
