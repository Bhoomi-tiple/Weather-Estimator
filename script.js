const locationBtn = document.getElementById("location-btn");

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const temperature = document.querySelector(".temperature");
const cityName = document.querySelector(".city");
const description = document.querySelector(".description");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const weatherIcon = document.querySelector(".weather-icon");

// 🌟 NEW: Date-Time element
const dateTime = document.querySelector(".date-time");


// Search Button Click
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);
});


// Location Button Click
locationBtn.addEventListener("click", () => {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

});


// Press Enter to Search
cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});


// 🌟 DATE + TIME FUNCTION
function updateDateTime() {

    const now = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const date = now.toLocaleDateString("en-US", options);

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    dateTime.innerHTML = `${date}<br>${time}`;
}


// Fetch Weather Data (CITY)
async function getWeather(city) {

    searchBtn.innerHTML = "Loading...";
    searchBtn.disabled = true;

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod != 200) {
            alert(data.message);
            return;
        }

        // Update UI
        temperature.innerText = `${Math.round(data.main.temp)}°C`;
        cityName.innerText = data.name;
        description.innerText = data.weather[0].description;
        humidity.innerText = `${data.main.humidity}%`;
        wind.innerText = `${data.wind.speed} km/h`;

        const weatherMain = data.weather[0].main;

        changeBackground(weatherMain);
        changeWeatherIcon(weatherMain);

        // 🌟 NEW: update time
        updateDateTime();

    }

    catch (error) {
        console.log("Error:", error);
        alert("Something went wrong!");
    }

    finally {
        searchBtn.innerHTML =
            '<i class="fa-solid fa-magnifying-glass"></i>';
        searchBtn.disabled = false;
    }

}


// Fetch Weather Data (LOCATION)
async function success(position) {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        temperature.innerText = `${Math.round(data.main.temp)}°C`;
        cityName.innerText = data.name;
        description.innerText = data.weather[0].description;
        humidity.innerText = `${data.main.humidity}%`;
        wind.innerText = `${data.wind.speed} km/h`;

        const weatherMain = data.weather[0].main;

        changeBackground(weatherMain);
        changeWeatherIcon(weatherMain);

        // 🌟 NEW: update time
        updateDateTime();

    } catch (error) {
        console.log(error);
    }

}

function error() {
    alert("Unable to retrieve your location.");
}


// Dynamic Background
function changeBackground(weather) {

    const body = document.body;

    switch (weather) {

        case "Clear":
            body.style.background =
                "linear-gradient(135deg, #f6d365, #fda085)";
            break;

        case "Clouds":
            body.style.background =
                "linear-gradient(135deg, #bdc3c7, #2c3e50)";
            break;

        case "Rain":
        case "Drizzle":
            body.style.background =
                "linear-gradient(135deg, #4b79a1, #283e51)";
            break;

        case "Thunderstorm":
            body.style.background =
                "linear-gradient(135deg, #232526, #414345)";
            break;

        case "Snow":
            body.style.background =
                "linear-gradient(135deg, #e6dada, #274046)";
            break;

        case "Mist":
        case "Fog":
        case "Haze":
            body.style.background =
                "linear-gradient(135deg, #757f9a, #d7dde8)";
            break;

        default:
            body.style.background =
                "linear-gradient(135deg, #74ebd5, #9face6)";
    }
}


// Dynamic Weather Icon
function changeWeatherIcon(weather) {

    switch (weather) {

        case "Clear":
            weatherIcon.innerHTML = "☀️";
            break;

        case "Clouds":
            weatherIcon.innerHTML = "☁️";
            break;

        case "Rain":
            weatherIcon.innerHTML = "🌧️";
            break;

        case "Drizzle":
            weatherIcon.innerHTML = "🌦️";
            break;

        case "Thunderstorm":
            weatherIcon.innerHTML = "⛈️";
            break;

        case "Snow":
            weatherIcon.innerHTML = "❄️";
            break;

        case "Mist":
        case "Fog":
        case "Haze":
            weatherIcon.innerHTML = "🌫️";
            break;

        default:
            weatherIcon.innerHTML = "🌤️";
    }
}