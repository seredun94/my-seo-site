const form = document.getElementById("weather-form");
const input = document.getElementById("city-input");
const result = document.getElementById("weather-result");
const error = document.getElementById("error-message");

function getWeatherIcon(code) {
    if (code === 0) return "\u2600\uFE0F";
    if (code <= 3) return "\u26C5";
    if (code <= 48) return "\uD83C\uDF2B\uFE0F";
    if (code <= 57) return "\uD83C\uDF27\uFE0F";
    if (code <= 67) return "\uD83C\uDF26\uFE0F";
    if (code <= 77) return "\u2744\uFE0F";
    if (code <= 82) return "\uD83C\uDF27\uFE0F";
    if (code <= 86) return "\uD83C\uDF28\uFE0F";
    if (code <= 99) return "\u26C8\uFE0F";
    return "\uD83C\uDF24\uFE0F";
}

function getDescription(code) {
    const desc = {
        0: "ясно", 1: "преимущественно ясно", 2: "переменная облачность",
        3: "пасмурно", 45: "туман", 48: "изморозь",
        51: "лёгкая морось", 53: "морось", 55: "сильная морось",
        61: "небольшой дождь", 63: "дождь", 65: "сильный дождь",
        66: "ледяной дождь", 67: "сильный ледяной дождь",
        71: "небольшой снег", 73: "снег", 75: "сильный снег",
        77: "снежные зёрна", 80: "ливень", 81: "сильный ливень",
        82: "очень сильный ливень", 85: "снегопад", 86: "сильный снегопад",
        95: "гроза", 96: "гроза с градом", 99: "гроза с сильным градом"
    };
    return desc[code] || "неизвестно";
}

function showWeather(name, country, current) {
    document.getElementById("city-name").textContent = `${name}, ${country}`;
    document.getElementById("weather-icon").textContent = getWeatherIcon(current.weather_code);
    document.getElementById("temperature").textContent = `${Math.round(current.temperature_2m)}\u00B0C`;
    document.getElementById("description").textContent = getDescription(current.weather_code);
    document.getElementById("humidity").textContent = `${current.relative_humidity_2m}%`;
    document.getElementById("wind").textContent = `${current.wind_speed_10m} \u043A\u043C/\u0447`;
    document.getElementById("feels-like").textContent = `${Math.round(current.apparent_temperature)}\u00B0C`;
    result.hidden = false;
}

async function fetchWeatherByCoords(lat, lon, cityName, countryName) {
    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
    );
    const weatherData = await weatherRes.json();
    showWeather(cityName, countryName, weatherData.current);
}

async function loadWeatherByIP() {
    try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        if (ipData.latitude && ipData.longitude) {
            input.value = ipData.city || "";
            await fetchWeatherByCoords(ipData.latitude, ipData.longitude, ipData.city, ipData.country_name);
        }
    } catch {
        // ignore — user can search manually
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;

    result.hidden = true;
    error.hidden = true;

    try {
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            error.hidden = false;
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        await fetchWeatherByCoords(latitude, longitude, name, country);
    } catch {
        error.hidden = false;
    }
});

loadWeatherByIP();
