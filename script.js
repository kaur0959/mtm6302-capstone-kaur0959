const dateForm = document.getElementById('date-form');
const apodContainer = document.getElementById('apod-container');
const apodImage = document.getElementById('apod-image');
const hdImageBtn = document.getElementById('hd-image-btn');
const apodTitle = document.getElementById('apod-title');
const apodDate = document.getElementById('apod-date');
const apodExplanation = document.getElementById('apod-explanation');
const saveFavoriteBtn = document.getElementById('save-favorite');
const favoritesList = document.getElementById('favorites-list');

dateForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const dateInput = document.getElementById('date').value;
    fetch(`https://api.nasa.gov/planetary/apod?api_key=pnUYF2NG6A4xs2U4XWdKKM5YN6cJNGW0kbLqWRIm&date=${dateInput}`)
        .then(response => response.json())
        .then(data => {
            apodImage.src = data.url;
            apodImage.alt = data.title;
            apodTitle.textContent = data.title;
            apodDate.textContent = `Date: ${data.date}`;
            apodExplanation.textContent = data.explanation;
            apodContainer.classList.remove('hide');
            hdImageBtn.classList.remove('hide');
        })
        .catch(error => console.error('Error fetching APOD:', error));
});

apodImage.addEventListener('click', function() {
    window.open(apodImage.src, '_blank');
});

hdImageBtn.addEventListener('click', function() {
    window.open(apodImage.src, '_blank');
});

saveFavoriteBtn.addEventListener('click', function() {
    const favoriteItem = {
        title: apodTitle.textContent,
        date: apodDate.textContent.replace('Date: ', ''),
        explanation: apodExplanation.textContent,
        url: apodImage.src
    };
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(favoriteItem);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
});

function displayFavorites() {
    favoritesList.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach((favorite, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${favorite.url}" alt="${favorite.title}">
            <div>
                <h3>${favorite.title}</h3>
                <p>${favorite.date}</p>
                <p>${favorite.explanation}</p>
                <button class="delete-favorite" data-index="${index}">Delete</button>
            </div>
        `;
        favoritesList.appendChild(li);
    });

    const deleteButtons = document.querySelectorAll('.delete-favorite');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(button.dataset.index);
            const updatedFavorites = favorites.filter((favorite, i) => i !== index);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            displayFavorites();
        });
    });
}

displayFavorites();
