const key = '03fb54ebf904aeecf7fbb0e169f0c7ad';
const urlWeatherMinsk = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`;
const urlForecastMinsk = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`;

const kelvin = 273.15;

const containerNode = document.querySelector('.container');
const section1Node = document.createElement('section');
const section2Node = section1Node.cloneNode(true);

const arrDataMinsk = [];

// Function for Promise
function fetchData(method, url) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onload = () => resolve(JSON.parse(xhr.response));
        xhr.onerror = () => reject(xhr.statusText);

        xhr.send();
    })
    
    return promise;
}

// Weather by Minsk from https://api.openweathermap.org
class Minsk {
    constructor(data) {
        this.dataWeather = data;
        this.city = data[0].name;
        this.country = data[0].sys.country;
        this.time = new Date(data[0].dt * 1000).getHours() + ":" + this._addZeroInFrontOfMinutes(new Date(data[0].dt * 1000).getMinutes());
        this.iconWeather = `http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png`;
        this.temperature = data[0].main.temp - kelvin;
        this.temperatureFeelLikes = Math.round(data[0].main.feels_like - kelvin);
        this._windDeg();
        this.windSpeed = data[0].wind.speed;
        this.listForecast = data[1].list;
        this.listForecastDays = this.listForecast.filter((item) => { return item.dt_txt.toLowerCase().trim().includes("12:00:00") });
        this.render(section1Node, section2Node);
    }

        // Create function that add zero in front of minute 
        _addZeroInFrontOfMinutes(minute) {
            return (minute < 10) ? "0" + minute : minute;
        }

        // Create function to get wind deg
        _windDeg() {
            if (this.dataWeather[0].wind.deg < 45 ) return "North";
            if (this.dataWeather[0].wind.deg < 135) return "East";
            if (this.dataWeather[0].wind.deg < 225) return "South";
            if (this.dataWeather[0].wind.deg < 315) return "West";
            if (this.dataWeather[0].wind.deg <= 360) return "North";
        }

        // Create function for trasnform text array of forecast weather by Date in day(number) 
        _dtDayForecast(day) {
            return new Date(day).getDate();
        }

        // Create function for trasnform text array of forecast weather by Date in month(number) and return name month
        _dtMonthForecast(month) {
            const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthIndex[new Date(month).getMonth()];
        }

        // Create function for trasnform text array of forecast weather by Date in hours(number)
        _dtHoursForecast(hours) {
            return new Date(hours).getHours();
        }    

        // Add weather Minsk in html
        render(parent1, parent2) {
            const templateWeatherMinsk = `
                <div class="weather-current">
                    <div class="country-time">
                        <p>${this.city}, <span>${this.country}</span></p>
                        <p><i class="far fa-clock"></i> ${this.time}</p>
                    </div>
                    <div class="temperature">
                        <div class="img-temperature">
                            <img src="${this.iconWeather}" alt="No photo">
                        </div>
                        <p class="temperature-current">${this.temperature} <i class="fas fa-thermometer-empty"></i></p>
                        <p>Feels like ${this.temperatureFeelLikes} <i class="fas fa-thermometer-empty"></i></p>
                    </div>
                    <div class="wind">
                        <p><i class="far fa-compass"></i> ${this._windDeg()}</p>
                        <p><i class="fas fa-wind"></i> ${this.windSpeed} m/s</p>
                    </div>
                </div>
            `
            parent1.innerHTML = templateWeatherMinsk;
            containerNode.append(parent1);

            this.listForecastDays.forEach((item) => {
                const dateForecast = this._dtDayForecast(item.dt_txt) + ' ' + this._dtMonthForecast(item.dt_txt) + ' ' + this._dtHoursForecast(item.dt_txt);
                const iconForecast = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
                const temperatureForecast = Math.round(item.main.temp - kelvin);

                const templateForecastMinsk = `
                <div class="forecast-Minsk">
                    <div class="forecast">
                        <p>${dateForecast}a.m</p>
                        <div class="img-forecast">
                            <img src="${iconForecast}" alt="No photo">
                        </div>
                        <p>${temperatureForecast} <i class="fas fa-thermometer-empty"></i></p>
                    </div>
                `

                parent2.innerHTML = parent2.innerHTML + templateForecastMinsk;
                containerNode.append(parent2);
            })
        }
    }


fetchData('GET', urlWeatherMinsk) 
    // .then(response => JSON.parse(response))
    .then(data => arrDataMinsk.push(data))
    .then(() => fetchData('GET', urlForecastMinsk))
    // .then(response => JSON.parse(response))
    .then(data => arrDataMinsk.push(data))
    .then(() => new Minsk(arrDataMinsk))
    .catch((error) => console.error(error));
    



        


