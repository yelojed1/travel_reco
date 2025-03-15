document.addEventListener('DOMContentLoaded', function() {
    var hash = window.location.hash.substring(1); // Remove the '#' character
    if (hash) {
        showSection(hash);
    } else {
        showSection('home'); // Default to the home section
    }
});

function showSection(sectionId) {
    // Hide all sections
    var sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';

    // Update active class on nav links
    var navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(function(link) {
        link.classList.remove('active');
    });
    document.querySelector('.nav-links a[href="#' + sectionId + '"]').classList.add('active');

    // Hide or show the search container based on the section
    var searchContainer = document.querySelector('.search-container');
    if (sectionId === 'about-us' || sectionId === 'contact') {  // Requirement for the search bar to be present only in the home page
        searchContainer.style.display = 'none';
    } else {
        searchContainer.style.display = 'block';
    }

    // Update the URL hash
    window.location.hash = sectionId;
}



document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Add your form submission logic here. 
    alert('Form submitted successfully!'); // Temporary alert to confirm form submission
    // Since we dont have storage, we simply reset the elements
    document.getElementById('contact-form').reset();
});


document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    } else {
        console.error('Search button not found.');
    }

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            window.travelData = data; // Store the data for later use
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function performSearch() {
    console.log('Search button clicked');
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    const recommendationsContainer = document.getElementById('travel-recommendations');
    recommendationsContainer.innerHTML = '';

    if (!searchInput) {
        alert('Please enter a keyword.');
        return;
    }

    if (searchInput.includes('temple')) {
        displayTemples();
    } else if (searchInput.includes('country') | searchInput.includes('countries') ) {
        displayCountries();
    } else if (searchInput.includes('beach')) {
        displayBeaches();
    } else {
        alert('Keyword not recognized. Please enter "temples", "countries", or "beaches".');
    }
}


function displayTemples() {
    const recommendationsContainer = document.getElementById('travel-recommendations');
    window.travelData.temples.forEach(temple => {
        const templeDiv = document.createElement('div');
        templeDiv.innerHTML = `
            <h2>${temple.name}</h2>
            <img src="img/${temple.imageUrl}" alt="${temple.name}">
            <p>${temple.description}</p>
        `;
        recommendationsContainer.appendChild(templeDiv);
    });
}

function displayCountries() {
    const recommendationsContainer = document.getElementById('travel-recommendations');
    window.travelData.countries.forEach(country => {
        const countryDiv = document.createElement('div');
        countryDiv.innerHTML = `<h2>${country.name}</h2>`;
        
        country.cities.forEach(city => {
            const cityDiv = document.createElement('div');
            const currentTime = getCurrentTime(city.timeZone); // Get the current time for the city's time zone
            console.log("Current time in " + city.name + ":" + currentTime)

            cityDiv.innerHTML = `
                <h3>${city.name}</h3>
                <p>Current Time: ${currentTime}</p>
                <img src="img/${city.imageUrl}" alt="${city.name}">
                <p>${city.description}</p>
            `;
            countryDiv.appendChild(cityDiv);
        });

        recommendationsContainer.appendChild(countryDiv);
    });
}


function displayBeaches() {
    const recommendationsContainer = document.getElementById('travel-recommendations');
    window.travelData.beaches.forEach(beach => {
        const beachDiv = document.createElement('div');
        beachDiv.innerHTML = `
            <h2>${beach.name}</h2>
            <img src="img/${beach.imageUrl}" alt="${beach.name}">
            <p>${beach.description}</p>
        `;
        recommendationsContainer.appendChild(beachDiv);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const reset = document.getElementById('reset-button');
    if (reset) {
        reset.addEventListener('click', clearResults);
    } else {
        console.error('Reset function not found.');
    }

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            window.travelData = data; // Store the data for later use
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function clearResults(){
    const recommendationsContainer = document.getElementById('travel-recommendations');
    recommendationsContainer.innerHTML = '';
    const searchResults = document.getElementById('search-input');
    searchResults.value = '';
}

function getCurrentTime(timeZone) {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone, timeZoneName: 'short' };
    return new Intl.DateTimeFormat([], options).format(new Date());
}
