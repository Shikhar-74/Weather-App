let mybtn = document.getElementById('submit');
let cityname = document.getElementById('city-name');
const apikey = "8eb760eafde92db29c436d24f2e0349a";

mybtn.addEventListener('click', (event) => {
    event.preventDefault();
    let city = cityname.value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`)
    .then(response => response.json())
    .then(data => {
        console.log(data); 
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        const description = data.weather[0].description;
        const temprature = data.main.temp;
        const celsius = (temprature - 273.15).toFixed(2);


        const lat = data.coord.lat;
        const lon = data.coord.lon;

        const timestamp = data.dt;
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        DataDiv.innerHTML = `
        <h3 class='weather-item'>Current Weather:</h3>
        <div class="weather-item">City: ${city}</div>
        <div class="weather-item">Date: ${formattedDate}</div>
        <div class="weather-item">Wind Speed: ${windSpeed} m/s</div>
        <div class="weather-item">Humidity: ${humidity}%</div>
        <div class="weather-item">Weather: ${description}</div>
        <div class="weather-item">Temperature: ${celsius} °C</div>
    `;
        
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`)
        .then(response => response.json())
        .then(forecastData => {
            console.log(forecastData); 

        const uniqueDates = new Set(); 
        const fiveDayForecast = []; 
        const today = new Date().toISOString().split('T')[0]
        forecastData.list.forEach(forecast => {
        const date = forecast.dt_txt.split(" ")[0]; 
    
     
        if (date!== today && !uniqueDates.has(date) && uniqueDates.size < 5) {
        uniqueDates.add(date); 
        fiveDayForecast.push(forecast); 
    }
});

const ForecastData = document.querySelector('.forecast-data');
if (ForecastData) {
    ForecastData.remove(); 
}
const newForecastData = document.createElement('div');
newForecastData.classList = 'forecast-data';
document.body.appendChild(newForecastData);


let forecastHtml = "<h3>5-Day Forecast:</h3>";

fiveDayForecast.forEach(forecast => {
    const forecastTime = new Date(forecast.dt * 1000); 
    const icon = forecast.weather[0].icon
    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;


    forecastHtml += `
         <div class="forecast-card">
                        <p><strong>Date:</strong> ${forecast.dt_txt.split(" ")[0]}</p>
                        <p><strong>Temperature:</strong> ${(forecast.main.temp - 273.15).toFixed(2)} °C</p>
                        <p><img src="${iconUrl}" alt="${forecast.weather[0].description}"></p> <!-- Weather Icon -->
                    </div>`;
});
        newForecastData.innerHTML = forecastHtml;
        console.log(fiveDayForecast);
            
        })
        .catch(error => console.log('Forecast Error:', error));
    })
    .catch(error => console.log('Weather Error:', error));
});

let DataDiv = document.createElement('div');
DataDiv.classList = 'data-container'
document.body.appendChild(DataDiv);

let ForecastData = document.createElement('div')
ForecastData.classList = 'forecast-data'
document.body.appendChild(ForecastData);

