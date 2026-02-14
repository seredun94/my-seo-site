const form = document.getElementById("weather-form");
const input = document.getElementById("city-input");
const result = document.getElementById("weather-result");
const error = document.getElementById("error-message");
const forecastSection = document.getElementById("forecast-section");

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
        0: "\u044F\u0441\u043D\u043E", 1: "\u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E \u044F\u0441\u043D\u043E", 2: "\u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u0441\u0442\u044C",
        3: "\u043F\u0430\u0441\u043C\u0443\u0440\u043D\u043E", 45: "\u0442\u0443\u043C\u0430\u043D", 48: "\u0438\u0437\u043C\u043E\u0440\u043E\u0437\u044C",
        51: "\u043B\u0451\u0433\u043A\u0430\u044F \u043C\u043E\u0440\u043E\u0441\u044C", 53: "\u043C\u043E\u0440\u043E\u0441\u044C", 55: "\u0441\u0438\u043B\u044C\u043D\u0430\u044F \u043C\u043E\u0440\u043E\u0441\u044C",
        61: "\u043D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0434\u043E\u0436\u0434\u044C", 63: "\u0434\u043E\u0436\u0434\u044C", 65: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
        66: "\u043B\u0435\u0434\u044F\u043D\u043E\u0439 \u0434\u043E\u0436\u0434\u044C", 67: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u043B\u0435\u0434\u044F\u043D\u043E\u0439 \u0434\u043E\u0436\u0434\u044C",
        71: "\u043D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0441\u043D\u0435\u0433", 73: "\u0441\u043D\u0435\u0433", 75: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u043D\u0435\u0433",
        77: "\u0441\u043D\u0435\u0436\u043D\u044B\u0435 \u0437\u0451\u0440\u043D\u0430", 80: "\u043B\u0438\u0432\u0435\u043D\u044C", 81: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u043B\u0438\u0432\u0435\u043D\u044C",
        82: "\u043E\u0447\u0435\u043D\u044C \u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u043B\u0438\u0432\u0435\u043D\u044C", 85: "\u0441\u043D\u0435\u0433\u043E\u043F\u0430\u0434", 86: "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
        95: "\u0433\u0440\u043E\u0437\u0430", 96: "\u0433\u0440\u043E\u0437\u0430 \u0441 \u0433\u0440\u0430\u0434\u043E\u043C", 99: "\u0433\u0440\u043E\u0437\u0430 \u0441 \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u0433\u0440\u0430\u0434\u043E\u043C"
    };
    return desc[code] || "\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E";
}

const dayNames = ["\u0412\u0441", "\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431"];

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

function showForecast(daily) {
    const container = document.getElementById("forecast-days");
    container.innerHTML = "";

    const temps = daily.temperature_2m_max;
    const tempsMin = daily.temperature_2m_min;
    const codes = daily.weather_code;
    const dates = daily.time;

    for (let i = 0; i < 7; i++) {
        const date = new Date(dates[i] + "T00:00:00");
        const dayName = i === 0 ? "\u0421\u0435\u0433\u043E\u0434\u043D\u044F" : dayNames[date.getDay()];
        const day = document.createElement("div");
        day.className = "forecast-day";
        if (i === 0) day.classList.add("today");
        day.innerHTML = `
            <span class="forecast-day-name">${dayName}</span>
            <span class="forecast-day-icon">${getWeatherIcon(codes[i])}</span>
            <span class="forecast-day-temp">${Math.round(temps[i])}\u00B0</span>
            <span class="forecast-day-temp-min">${Math.round(tempsMin[i])}\u00B0</span>
        `;
        container.appendChild(day);
    }

    const todayMax = temps[0];
    const endMax = temps[6];
    const diff = Math.round(endMax - todayMax);
    const avgFirst = (temps[0] + temps[1] + temps[2]) / 3;
    const avgLast = (temps[4] + temps[5] + temps[6]) / 3;
    const trend = avgLast - avgFirst;

    const hasRain = codes.some(c => (c >= 51 && c <= 67) || (c >= 80 && c <= 82));
    const hasSnow = codes.some(c => (c >= 71 && c <= 77) || (c >= 85 && c <= 86));
    const hasStorm = codes.some(c => c >= 95);

    const rec = document.getElementById("recommendation");
    let tips = [];

    if (trend > 3) {
        tips.push(`\u{1F525} \u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u0442\u0435\u043F\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 ${Math.abs(diff)}\u00B0C \u043A \u043A\u043E\u043D\u0446\u0443 \u043D\u0435\u0434\u0435\u043B\u0438. \u041C\u043E\u0436\u043D\u043E \u043E\u0434\u0435\u0432\u0430\u0442\u044C\u0441\u044F \u043B\u0435\u0433\u0447\u0435.`);
    } else if (trend < -3) {
        tips.push(`\u{1F9CA} \u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u0445\u043E\u043B\u043E\u0434\u0430\u043D\u0438\u0435 \u043D\u0430 ${Math.abs(diff)}\u00B0C. \u041F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u044C\u0442\u0435 \u0442\u0451\u043F\u043B\u0443\u044E \u043E\u0434\u0435\u0436\u0434\u0443.`);
    } else {
        tips.push(`\u{1F321}\uFE0F \u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u0431\u0443\u0434\u0435\u0442 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u043E\u0439 \u0432\u0441\u044E \u043D\u0435\u0434\u0435\u043B\u044E.`);
    }

    if (hasStorm) {
        tips.push(`\u26A1 \u0412\u043E\u0437\u043C\u043E\u0436\u043D\u044B \u0433\u0440\u043E\u0437\u044B \u2014 \u0431\u0443\u0434\u044C\u0442\u0435 \u043E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u044B \u043D\u0430 \u0443\u043B\u0438\u0446\u0435.`);
    } else if (hasRain) {
        tips.push(`\u{1F302} \u041D\u0430 \u043D\u0435\u0434\u0435\u043B\u0435 \u043E\u0436\u0438\u0434\u0430\u044E\u0442\u0441\u044F \u0434\u043E\u0436\u0434\u0438 \u2014 \u0432\u043E\u0437\u044C\u043C\u0438\u0442\u0435 \u0437\u043E\u043D\u0442.`);
    }

    if (hasSnow) {
        tips.push(`\u2744\uFE0F \u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u0441\u043D\u0435\u0433. \u0411\u0443\u0434\u044C\u0442\u0435 \u0430\u043A\u043A\u0443\u0440\u0430\u0442\u043D\u044B \u043D\u0430 \u0434\u043E\u0440\u043E\u0433\u0430\u0445.`);
    }

    const minTemp = Math.min(...tempsMin);
    if (minTemp < 0) {
        tips.push(`\u{1F9E4} \u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u0435: ${Math.round(minTemp)}\u00B0C. \u041D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C\u0442\u0435 \u043F\u0435\u0440\u0447\u0430\u0442\u043A\u0438 \u0438 \u0448\u0430\u043F\u043A\u0443.`);
    } else if (Math.max(...temps) > 30) {
        tips.push(`\u{1F4A7} \u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C \u0434\u043E ${Math.round(Math.max(...temps))}\u00B0C. \u041F\u0435\u0439\u0442\u0435 \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u043E\u0434\u044B \u0438 \u0438\u0437\u0431\u0435\u0433\u0430\u0439\u0442\u0435 \u0441\u043E\u043B\u043D\u0446\u0430 \u0432 \u043F\u0438\u043A.`);
    }

    rec.innerHTML = tips.map(t => `<p>${t}</p>`).join("");
    forecastSection.hidden = false;
}

async function fetchWeatherByCoords(lat, lon, cityName, countryName) {
    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
    );
    const weatherData = await weatherRes.json();
    showWeather(cityName, countryName, weatherData.current);
    if (weatherData.daily) {
        showForecast(weatherData.daily);
    }
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
        // ignore
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;

    result.hidden = true;
    error.hidden = true;
    forecastSection.hidden = true;

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
