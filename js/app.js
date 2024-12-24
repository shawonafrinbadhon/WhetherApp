const searchBtn = document.getElementById("searchBtn");
const countryDataDiv = document.getElementById("countryData");

const spinner = document.querySelector(".spinner");

// Replace with your OpenWeatherMap API key
const API_KEY = "c46bffa0c130f9d6a856d5cd8ab191fa";

const searchInput = document.getElementById("search");
const countryResults = document.getElementById("countryResults");

// Fetch and display countries when typing
searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim();

  if (query) {
    spinner.style.display = "block"; // Show spinner
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
      spinner.style.display = "none"; // Hide spinner
      if (response.ok) {
        const data = await response.json();
        displayCountries(data);
      } else {
        countryResults.innerHTML = `<p class="text-danger text-center">Country not found. Try again.</p>`;
      }
    } catch (error) {
      console.error("Error fetching country data:", error);
      countryResults.innerHTML = `<p class="text-danger text-center">Error fetching data. Please try again later.</p>`;
    }
  } else {
    countryResults.innerHTML = "";
  }
});

// Display country cards
function displayCountries(countries) {
  countryResults.innerHTML = "";

  countries.forEach((country) => {
    const countryCard = document.createElement("div");
    countryCard.classList.add("col-md-4", "mb-4");

    const capital = country.capital ? country.capital[0] : "N/A";

    countryCard.innerHTML = `
      <div class="card">
        <img src="${country.flags.svg}" class="card-img-top" alt="Flag of ${country.name.common}">
        <div class="card-body">
          <h5 class="card-title">${country.name.common}</h5>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <button class="btn btn-primary" onclick="showWeather('${capital}', '${country.name.common}')">
            Show Weather
          </button>
          <button class="btn btn-secondary" onclick="showMoreDetails('${country.name.common}', '${country.capital[0]}', ${country.area}, ${country.population})">More Details</button>
        </div>
      </div>
    `;

    countryResults.appendChild(countryCard);
  });
}

// Fetch weather data
async function showWeather(capital, country) {
  try {
    const location = capital || country;
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
    );
    if (!weatherResponse.ok) throw new Error("Weather API Error");
    const weatherData = await weatherResponse.json();
    displayWeatherModal(weatherData, country);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Weather data not available. Please try again.");
  }
}

// Display weather modal
function displayWeatherModal(weather, country) {
  const weatherDetails = document.getElementById("weatherDetails");
  weatherDetails.innerHTML = `
    <p><strong>Country:</strong> ${country}</p>
    <p><strong>City:</strong> ${weather.name}</p>
    <p><strong>Temperature:</strong> ${weather.main.temp}°C</p>
    <p><strong>Weather:</strong> ${weather.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${weather.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${weather.wind.speed} m/s</p>
  `;
  const weatherModal = new bootstrap.Modal(document.getElementById("weatherModal"));
  weatherModal.show();
}
function showMoreDetails(name, capital, area, population) {
    console.log("Show More Details Called");
    console.log("Name:", name, "Capital:", capital, "Area:", area, "Population:", population);
  
    const detailsBody = document.getElementById("detailsBody");
    if (!detailsBody) {
      console.error("Details Body element not found");
      return;
    }
  
    // Populate the modal with details
    detailsBody.innerHTML = `
      <p><strong>Country:</strong> ${name}</p>
      <p><strong>Capital:</strong> ${capital || "N/A"}</p>
      <p><strong>Area:</strong> ${area.toLocaleString()} km²</p>
      <p><strong>Population:</strong> ${population.toLocaleString()}</p>
    `;
  
    // Show the modal
    const detailsModal = new bootstrap.Modal(document.getElementById("detailsModal"));
    detailsModal.show();
  }
  