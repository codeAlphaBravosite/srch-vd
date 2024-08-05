let originalData = [];

function loadFile(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            originalData = results.data;
            displayCards(originalData);
            document.getElementById('filterContainer').style.display = 'flex';
        }
    });
}

function applySorting() {
    const sortOrder = document.getElementById('sortOrder').value;
    let sortedData = [...originalData];

    if (sortOrder !== 'none') {
        sortedData.sort((a, b) => {
            const viewsA = parseInt(a['Views'].replace(/,/g, ''));
            const viewsB = parseInt(b['Views'].replace(/,/g, ''));
            return sortOrder === 'ascending' ? viewsA - viewsB : viewsB - viewsA;
        });
    }

    displayCards(sortedData);
}

function displayCards(data) {
    const cardsContainer = document.getElementById('cards');
    cardsContainer.innerHTML = '';
    data.forEach(video => {
        const card = document.createElement('div');
        card.className = 'card';
        const thumbnailUrl = `https://img.youtube.com/vi/${video['Video Id']}/mqdefault.jpg`;
        card.innerHTML = `
            <img src="${thumbnailUrl}" alt="${video['Title']}">
            <div class="card-content">
                <div class="card-title">
                    <a href="https://www.youtube.com/watch?v=${video['Video Id']}" target="_blank">${video['Title']}</a>
                </div>
                <div class="card-channel">${video['Channel N']}</div>
                <div class="card-views">${parseInt(video['Views']).toLocaleString()} views</div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}

document.getElementById('csvFileInput').addEventListener('change', loadFile);
document.getElementById('sortOrder').addEventListener('change', applySorting);

// Theme switcher
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
    toggleSwitch.checked = currentTheme === 'dark';
}

// Initialize
document.getElementById('filterContainer').style.display = 'none';
