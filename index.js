let body = document.querySelector("body");
let search = document.querySelector(".search");
let inputField = document.querySelector(".search > input");
let searchIcon = document.querySelector(".search-icon");
let currentLocation = document.querySelector(".current-location-button")
let sectionOne = document.querySelector(".section-one");
let containerOne = sectionOne.querySelectorAll(".container-one, .container-two");
let actualTemp = document.querySelector(".actual-temp > h2");
let feelTemp = document.querySelector(".feel-temp h4");
let whiteOutline = document.querySelectorAll(".white-filter");
let sectionTwo = document.querySelector(".section-two");
let containerTwo = sectionTwo.querySelectorAll(".container-three, .container-four");
let hourlyPositionBg = document.querySelectorAll(".hourly-position-bg")
let modeInfo = document.querySelector(".mode-info");
let themeButton = document.querySelector(".circle-shape");
let mode = document.querySelector(".mode");

document.addEventListener('DOMContentLoaded', function(){
    window.addEventListener("offline", () => {
        alert("You lost your internet connection!");
    });
    checkWeather("40.7128,-74.0060");
    
});

function checkInternet() {
      window.addEventListener("offline", () => {
        alert("You lost your internet connection!");
    });
}
  
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    enableDarkMode();
}
else if (savedTheme === "light") {
    enableLightMode();
} 
else {

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        enableDarkMode();
    } 
    else {
        enableLightMode();
    }
}

themeButton.addEventListener("click", () => {
    if (!themeButton.classList.contains("move-right")) {
        enableDarkMode();
        localStorage.setItem("theme", "dark");
    } else {
        enableLightMode();
        localStorage.setItem("theme", "light");
    }
});

input.addEventListener('input', () => {
    input.addEventListener('keydown', function handleEnter(event) {
        if (event.key === 'Enter') {
            const value = input.value.trim();
            if (value !== "") {
                searchIcon.click();
            } else {
                alert("Please enter a city name!");
            }
        }
    }, { once: true }); 
});

currentLocation.addEventListener('click', ()=>{
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
      
          checkWeather(`${lat},${lon}`);
        },
        (error) => {
            alert("Unable to access your location. Please allow location access or enter your city manually.");
        }
      );
})

function updateClock() {

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const parts = now.toLocaleDateString(undefined, options).split(' ');
    const formattedDate = `${parts[0]} ${parts[1].padStart(2, 0)} ${parts[2]}`;
    document.getElementById('current_time').textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById('current_date').textContent = formattedDate;
}
  
setInterval(updateClock, 1000);
updateClock(); 

function reloadAfterDelay() {
    setTimeout(() => {
      checkInternet();
    }, 1000); 
  }

function enableDarkMode() {

    themeButton.classList.add("move-right");
    modeInfo.innerHTML = "Dark Mode";
    mode.classList.add("mode-darkmode");
    body.classList.add("dark-mode");
    inputField.style.backgroundColor = 'rgba(91, 91, 91, 0.9)';
    inputField.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    inputField.style.color = 'rgb(255, 255, 255)';
    inputField.classList.add("active");
    searchIcon.classList.add("search-icon-darkmode");
    currentLocation.classList.add("current-location-button-darkmode");

    containerOne.forEach(container => {
        container.classList.add("dark-box-shadow");
        container.classList.remove("light-box-shadow");
    });

    actualTemp.classList.add("dark-text-decor");
    feelTemp.classList.add("dark-text-decor");

    whiteOutline.forEach(element => {
        element.style.filter = "brightness(0) saturate(100%) invert(1)";
    });

    containerTwo.forEach(container => {
        container.classList.add("dark-box-shadow");
        container.classList.remove("light-box-shadow");
    });

    hourlyPositionBg.forEach(element => {
        element.style.backgroundColor = "rgba(40, 40, 40, 0.5)";
    });
}

function enableLightMode() {
    themeButton.classList.remove("move-right");
    modeInfo.innerHTML = "Light Mode";
    mode.classList.remove("mode-darkmode");
    body.classList.remove("dark-mode");
    inputField.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    inputField.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
    inputField.style.color = 'rgb(0, 0, 0)';
    inputField.classList.remove("active");
    searchIcon.classList.remove("search-icon-darkmode");
    currentLocation.classList.remove("current-location-button-darkmode");

    containerOne.forEach(container => {
        container.classList.remove("dark-box-shadow");
        container.classList.add("light-box-shadow");
    });

    actualTemp.classList.remove("dark-text-decor");
    feelTemp.classList.remove("dark-text-decor");

    whiteOutline.forEach(element => {
        element.style.filter = "brightness(0) saturate(100%)";
    });

    containerTwo.forEach(container => {
        container.classList.remove("dark-box-shadow");
        container.classList.add("light-box-shadow");
    });

    hourlyPositionBg.forEach(element => {
        element.style.backgroundColor = "rgb(223, 223, 223)";
    });
}

const newapiKey ="6b6ac27efc294086a91191233250804";
const apiUrlOfDays = "https://api.weatherapi.com/v1/forecast.json?&days=5&aqi=no&alerts=no&q="; //{city name}&cnt={cnt}&appid={API key}

let inputBox = document.querySelector(".input-box");

async function checkWeather(city) {
    
    let response;
    let data;
    try{
        response = await fetch(apiUrlOfDays + city + `&key=${newapiKey}`);
        if(!response.ok){
            
            throw new Error (`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
    }
    catch(e){
        if (!navigator.onLine) {
            body.style.filter = "blur(50px)";
            alert("You're offline! Please check your internet connection.");
            return;
        } 
        else{
            alert("Oops! Couldn't fetch weather data right now. Please try again later.");
        }
    }

    document.querySelector("#current_location").innerHTML = data.location.name;
    document.querySelector("#current_temp").innerHTML = `${Math.round(data.current.temp_c)}` + "°C";
    document.querySelector("#current_temp2").innerHTML = "Feels like: " + data.current.feelslike_c + "°C";
    document.querySelector(".sunrise-time").innerHTML = data.forecast.forecastday[0].astro.sunrise;
    document.querySelector(".sunset-time").innerHTML = data.forecast.forecastday[0].astro.sunset;
    
    document.querySelector(".weather-info").innerHTML = `${data.current.condition.text}`

    document.querySelector(".humidity-persentage").innerHTML = data.current.humidity + "%";
    document.querySelector(".pressure-amount").innerHTML = data.current.pressure_mb + "hPa";
    document.querySelector(".wind_speed").innerHTML = data.current.wind_kph + "km/h";
    document.querySelector(".uv-amount").innerHTML = data.current.uv;

    let daysWeather = document.querySelectorAll(".day-temp");
    let dailyWeatherIcon = document.querySelectorAll("#daily_icon");

    function extractIconNumber(iconUrl) {
        const match = iconUrl.match(/(\d+)\.png$/);
        return match ? match[1] : null;
    }

    const IsDay = data.current.is_day === 1;
    const IconNumber = extractIconNumber(data.current.condition.icon); 
    const IconPath = IsDay ? `assets/icons/weather_icons_day/${IconNumber}.png` : `assets/icons/weather_icons_night/${IconNumber}.png`; 
    document.querySelector("#weather_icon").src = IconPath ;

    for (let i = 0; i < daysWeather.length; i++) {

        const element = daysWeather[i];
        const iconElement = dailyWeatherIcon[i];
        element.innerHTML = data.forecast.forecastday[i].day.avgtemp_c + "°C";
        const iconNumber = extractIconNumber(data.forecast.forecastday[i].day.condition.icon); 
        const iconPath =`assets/icons/weather_icons_day/${iconNumber}.png` ; 
        iconElement.src = iconPath;
    }

    let dayDate = document.querySelectorAll(".day-date");
    const dates = [];
    const options = { weekday: 'short', day: 'numeric', month: 'short' };

    for(let i = 0; i < 5; i++) {

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i);
        dates.push(futureDate.toLocaleDateString(undefined, options));
        const element = dayDate[i];
        element.innerHTML = dates[i];
    }

    let hourlyImage = document.querySelectorAll("#hourly_img");
    let hourlyTemp= document.querySelectorAll(".hourly-temp");
    let hourlyWindSpeed = document.querySelectorAll(".hourly-windspeed");

    let time = [6, 9, 12, 15, 18];

    for(let i = 0; i < 5; i++){

        hourlyTemp[i].innerHTML = `${Math.round(data.forecast.forecastday[i].hour[time[i]].temp_c)}°C`;
        hourlyWindSpeed[i].innerHTML = `${Math.round(data.forecast.forecastday[i].hour[time[i]].wind_kph)}km/h`;
        const isDay = data.forecast.forecastday[0].hour[time[i]].is_day === 1;
        const iconNumber = extractIconNumber(data.forecast.forecastday[0].hour[time[i]].condition.icon); 
        const iconPath = isDay ? `assets/icons/weather_icons_day/${iconNumber}.png` : `assets/icons/weather_icons_night/${iconNumber}.png`; 
        hourlyImage[i].src = iconPath;
    }
}

searchIcon.addEventListener('click', ()=>{
    checkWeather(inputBox.value);
})
