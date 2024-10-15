const switchButton = document.getElementById('switcher');
const switchCircle = document.getElementById('circle')
const switchLabel = document.getElementById('switcher-label');
const switcFirstPhoto = document.querySelector('.sunRise img')
const switcSecondPhoto = document.querySelector('.sunSet img')
const searchBtn = document.querySelector('.search')
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
const secondApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='
const apiKey = 'ab1bf8c31edb417a05536d85a631fcc9'
const currentLocation = document.getElementById('current-location-btn')

const getCityName = async (long, lat) => {
    const { name } = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=ab1bf8c31edb417a05536d85a631fcc9`).then(res => res.json())
    return name

}
const unixToTime = (unix_timestamp) => {
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime
}


switchButton.addEventListener('click', () => {
    if (switchCircle.classList.contains('passive')) {
        switchCircle.classList.remove('passive');
        switchCircle.classList.add('active');
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        switchLabel.textContent = 'Dark Mode';
        switcFirstPhoto.src = 'assets/SunRise.png';
        switcSecondPhoto.src = 'assets/SunSet.png';

    } else {
        switchCircle.classList.remove('active');
        switchCircle.classList.add('passive');
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        switchLabel.textContent = 'Light Mode';
        switcFirstPhoto.src = 'assets/darkSunRise.png';
        switcSecondPhoto.src = 'assets/darkSunSet.png';
    }
})


const fetchWeather = async function (name = '', long = '', lat = '') {
    const input = name.length > 0 ? name : document.getElementById("input").value
    let countryResponse = await fetch(`${apiUrl}${input}&appid=${apiKey}`)
    let countryData = await countryResponse.json()
    if (countryData === "404") {
        alert('City not found');
        return;
    }
    else {
        const longitude = long.length > 0 ? long : countryData.coord.lon
        const latitute = lat.length > 0 ? lat : countryData.coord.lat
        let hourlyResponse = await fetch(`${secondApiUrl}${latitute}&lon=${longitude}&appid=${apiKey}`)
        let hourlyData = await hourlyResponse.json()

        if (hourlyData === "404") {
            alert('City not found');
            return;
        }
        else { updateWeatherProgram(countryData, hourlyData) }
    }
}



function updateWeatherProgram(data, data2) {
    const currentWeather = document.querySelector('.current-weather');
    const localTime = new Date();
    localTime.setUTCSeconds(data.timezone - 14400);
    const timeString = localTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateString = localTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const { sunset, sunrise, timezone } = data2.city
    const sunsetString = unixToTime(sunset + timezone - 14400)
    const sunriseString = unixToTime(sunrise + timezone - 14400)
    currentWeather.innerHTML = `
        <h2>${data.name}</h2>
        <div class="time">
            <span class="current-time">${timeString}</span>
            <span class="date">${dateString}</span>
        </div>
    `;


    const firstColumnTemp = document.querySelector('.weather-details .column-1 .temperature');
    firstColumnTemp.innerHTML = `
        <div class="temperature">
          <span class="current-temp">${Math.round(data.main.temp - 273.5)}°C</span>
          <span class="feels-like">Feels like:${Math.round(data.main.feels_like - 273.5)}°C</span>
        </div>
        `
    const firstColumnSunRise = document.querySelector('.weather-details .column-1 .sun-times .sunRise div')
    firstColumnSunRise.innerHTML = `
                    <span>Sunrise</span>
                    <span>${sunriseString}</span>`
    const firstColumnSunSet = document.querySelector('.weather-details .column-1 .sun-times .sunSet div')
    firstColumnSunSet.innerHTML = `
                    <span>Sunset</span>
                    <span>${sunsetString}</span>`

    const condition = document.querySelector('.weather-details .condition');
    condition.innerHTML = `
            <div></div>
            <img src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png' />
            <span>${data.weather[0].description}</span>
            `
    const otherDetails = document.querySelector('.weather-details .other-details');
    otherDetails.innerHTML = `
            <div class="detail">
              <i class="fa-solid fa-water"></i>
              <span>${data.main.humidity}%</span>
              <span>Humidity</span>
            </div>
            <div class="detail">
              <i class="fa-solid fa-wind"></i>
              <span>${data.wind.speed}km/h</span>
              <span>Wind Speed</span>
            </div>
            <div class="detail">
              <i class="fa-solid fa-gauge"></i>
              <span>${data.main.pressure}hPa</span>
              <span>Pressure</span>
            </div>
            <div class="detail">
              <i class="fa-solid fa-leaf"></i>
              <span>8</span>
              <span>UV</span>
            </div>
            `
    const forecast = document.querySelector('.forecast');
    let forecastHTML = `<h3>5 Days Forecast:</h3><ul>`;
    for (let i = 0; i < 40; i += 8) {
        const forecastData = data2.list[i];
        const date = new Date(forecastData.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayAndMonth = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        forecastHTML += `
             <li>
                 <img src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png" alt="${forecastData.weather[0].description}">
                 <span>${Math.round(forecastData.main.temp - 273.15)}°C</span>
                 <span>${dayOfWeek}, ${dayAndMonth}</span>
             </li>
            `;
    }
    forecastHTML += `</ul>`;
    forecast.innerHTML = forecastHTML;
    const hourlyForecast = document.querySelector('.hourly-forecast');
    let hourlyHTML = `<h3>Hourly Forecast:</h3><div class="hourly-items">`;
    for (let i = 0; i < 5; i++) {
        const hourData = data2.list[i];
        const date = new Date(hourData.dt * 1000 + data.timezone);
        const hour = date.getHours();
        const isNightTime = hour >= 18 || hour < 6;
        hourlyHTML += `
                 <div class="hourly-item ${isNightTime ? 'nightTime' : 'sunny'}">
                     <span>${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                     <img src="https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png" alt="${hourData.weather[0].description}">
                     <span>${Math.round(hourData.main.temp - 273.15)}°C</span>
                     <img style="transform: rotate(${hourData.wind.deg}deg);" src="assets/navigation.png" alt="" class="navigation">
                     <span>${Math.round(hourData.wind.speed)}km/h</span>
                 </div>
             `;
    }
    hourlyHTML += `</div>`;
    hourlyForecast.innerHTML = hourlyHTML;
}

searchBtn.addEventListener('click', fetchWeather)

const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

async function success(pos) {
    const crd = pos.coords;
    console.log({ lng: crd.longitude, lat: crd.latitude })
    fetchWeather(await getCityName(crd.longitude, crd.latitude), crd.longitude, crd.latitude)
}

function error(err) { console.warn(`ERROR(${err.code}): ${err.message}`) }
currentLocation.addEventListener('click', () => {
    if (navigator.geolocation){
       navigator.geolocation.getCurrentPosition(success, error, options)
    }
    else {
        alert('Geolocation is not not turned on.');
    }
})

window.onload(navigator.geolocation.getCurrentPosition(success, error, options))
