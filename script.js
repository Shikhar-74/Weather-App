let mybtn = document.getElementById('submit');
let cityname = document.getElementById('city-name');
const apikey = "8eb760eafde92db29c436d24f2e0349a";


let DataDiv = document.createElement('div');
DataDiv.classList = 'data-container';
document.body.appendChild(DataDiv);

let ForecastData = document.createElement('div');
ForecastData.classList = 'forecast-data';
document.body.appendChild(ForecastData);

mybtn.addEventListener('click', (event) => {
    event.preventDefault();
    let city = cityname.value;

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    DataDiv.innerHTML = '';
    ForecastData.innerHTML = '';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('City not found or invalid API request.');
        }
        return response.json();
    })
    .then(data => {
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
            <h3 class='weather-item'>Current Weather for ${city}:</h3>
            <div class="weather-item">Date: ${formattedDate}</div>
            <div class="weather-item"><strong>Temperature:</strong> ${celsius} °C</div>
            <div class="weather-item"><strong>Weather:</strong> ${description}</div>
            <div class="weather-item"><strong>Wind Speed:</strong> ${windSpeed} m/s</div>
            <div class="weather-item"><strong>Humidity:</strong> ${humidity}%</div>
        `;
        
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data could not be fetched.');
            }
            return response.json();
        })
        .then(forecastData => {
            const uniqueDates = new Set(); 
            const fiveDayForecast = []; 
            const today = new Date().toISOString().split('T')[0];
            
            forecastData.list.forEach(forecast => {
                const date = forecast.dt_txt.split(" ")[0]; 
                
                if (date !== today && !uniqueDates.has(date) && uniqueDates.size < 5) {
                    uniqueDates.add(date); 
                    fiveDayForecast.push(forecast); 
                }
            });

          
            ForecastData.innerHTML = "<h3>5-Day Forecast:</h3>";

            fiveDayForecast.forEach(forecast => {
                const forecastDate = forecast.dt_txt.split(" ")[0];
                const forecastTime = new Date(forecast.dt * 1000); 
                const temp = (forecast.main.temp - 273.15).toFixed(2);
                const icon = forecast.weather[0].icon;
                const weatherDescription = forecast.weather[0].description;

               
                const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

                ForecastData.innerHTML += `
                    <div class="forecast-card">
                        <p><strong>Date:</strong> ${forecastDate}</p>
                        <p><strong>Temperature:</strong> ${temp} °C</p>
                        <p><strong>Weather:</strong> ${weatherDescription}</p>
                        <img src="${iconUrl}" alt="${weatherDescription}" class="weather-icon">
                    </div>`;
            });

        })
        .catch(error => {
            console.error('Forecast Error:', error);
            ForecastData.innerHTML = `<p style="color: red;">Error fetching forecast data: ${error.message}</p>`;
        });
    })
    .catch(error => {
        console.error('Weather Error:', error);
        DataDiv.innerHTML = `<p style="color: red;">Error fetching weather data: ${error.message}</p>`;
    });
});
