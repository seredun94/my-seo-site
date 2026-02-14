const API_KEY = "YOUR_API_KEY";
const form = document.getElementById("weather-form");
const input = document.getElementById("city-input");
const result = document.getElementById("weather-result");
const error = document.getElementById("error-message");

const icons = {
    "01d": "\u2600\uFE0F", "01n": "\uD83C\uDF19",
    "02d": "\u26C5", "02n": "\u2601\uFE0F",
    "03d": "\u2601\uFE0F", "03n": "\u2601\uFE0F",
    "04d": "\uD83C\uDF25\uFE0F", "04n": "\uD83C\uDF25\uFE0F",
    "09d": "\uD83C\uDF27\uFE0F", "09n": "\uD83C\uDF27\uFE0F",
    "10d": "\uD83C\uDF26\uFE0F", "10n": "\uD83C\uDF27\uFE0F",
    "11d": "\u26C8\uFE0F", "11n": "\u26C8\uFE0F",
    "13d": "\u2744\uFE0F", "13n": "\u2744\uFE0F",
    "50d": "\uD83C\uDF2B\uFE0F", "50n": "\uD83C\uDF2B\uFE0F"
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;

    result.hidden = true;
    error.hidden = true;

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`
        );

        if (!res.ok) {
            error.hidden = false;
            return;
        }

        const data = await res.json();
        const icon = data.weather[0].icon;

        document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById("weather-icon").textContent = icons[icon] || "\uD83C\uDF24\uFE0F";
        document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}\u00B0C`;
        document.getElementById("description").textContent = data.weather[0].description;
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
        document.getElementById("wind").textContent = `${data.wind.speed} м/с`;
        document.getElementById("feels-like").textContent = `${Math.round(data.main.feels_like)}\u00B0C`;

        result.hidden = false;
    } catch {
        error.hidden = false;
    }
});
