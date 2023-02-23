const cityInput = document.getElementById("city-input");
const currentWeatherSection = document.getElementById("current-weather");
const cityName = document.getElementById("city-name");
const currentDate = document.getElementById("current-date");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const forecastList = document.getElementById("forecast-list");
const historyList = document.getElementById("history-list");

// Define variables to store API key and endpoint URLs
const apiKey = "1d755eef1f62654a34faed6604c00006";
const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=imperial&q=`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=imperial&q=`;


// Define an empty array to store search history
let searchHistory = [];

// Define a function to fetch and display current weather for a given city
async function getCurrentWeather(city) {
  try {
    const response = await fetch(currentWeatherUrl + city);
    const data = await response.json();
    // Update HTML elements with data from API response
    cityName.textContent = data.name;
    currentDate.textContent = new Date().toLocaleDateString();
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" />`;
    temperature.textContent = `Temperature: ${data.main.temp} °F`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`;
    // Add city to search history and update history list
    searchHistory.push(city);
    historyList.innerHTML = "";
    searchHistory.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = city;
      li.addEventListener("click", () => {
        getCurrentWeather(city);
        getForecast(city);
      });
      historyList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}
async function getForecast(city) {
    try {
      const response = await fetch(forecastUrl + city);
      const data = await response.json();
      // Filter forecast data to only include data for noon on each day
      const noonForecastData = data.list.filter((item) => item.dt_txt.includes("12:00:00"));
      // Clear existing forecast list items
      forecastList.innerHTML = "";
      // Loop through filtered forecast data and create new list items for each day
      noonForecastData.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<p>${new Date(item.dt_txt).toLocaleDateString()}</p> <p><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}" /></p> <p>Temperature: ${item.main.temp} °F</p> <p>Humidity: ${item.main.humidity}%</p> <p>Wind Speed: ${item.wind.speed} MPH</p>`;
        forecastList.appendChild(li);
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    getCurrentWeather(city);
    getForecast(city);
});