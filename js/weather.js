$(function () {
	// main app controller
	var WeatherApp = (function(){

		//variables for represent weather status in DOM
		var $weatherInfo, 
			city;

		//cache dom
		function cacheDOM() {
			$weatherInfo = $('#weather-info');
			city = {
				$name: $weatherInfo.find('#city-name'),
				$temp: $weatherInfo.find('#city-temp'),
				$weatherIcon: $weatherInfo.find('#city-weather-icon'),
				$weatherDesc: $weatherInfo.find('#city-weather-desc')
			}
		}

		//weather unit module

		var WeatherUnit = (function(){
			//kelvin to celsius
			function kelvinToCelsius(temp){
				if(typeof temp == "number")
					return (temp - 273.15).toFixed(2);
			}

			//celsius to fahrenheit
			function celsiusToFahr(temp) {
				if(typeof temp == "number")
					return (temp * (9/5) + 32).toFixed(2);
			}

			//fahrenheit to celsius
			function fahrToCelsius(temp) {
				if(typeof temp == "number")
					return ((temp - 32) / (9 / 5)).toFixed(2);
			}

			return {
				kelvinToCelsius: kelvinToCelsius,
				celsiusToFahr: celsiusToFahr
			}
		})();

		var WeatherIcons = (function () {
			/*
				object map  weather conditions(weather.main) on icons
			*/
			var weatherIcons = {
				"clear sky": "fa icon-sun",
				"clear": "fa icon-sun",
				"few clouds": "fa icon-cloud-sun",
				"scattered clouds": "fa icon-cloud",
				"broken clouds": "fa fa-cloud cloud-broken",
				"shower rain": "fa icon-rain",
				"rain": "fa icon-rain",
				"thunderstorm": "fa icon-cloud-flash",
				"snow": "fa icon-snow",
				"mist": "fa icon-mist"
			}

			//set properly icon weather to DOM
			function setIconWeather(weatherIconName) {
				var weatherIcon;

				weatherIconName = weatherIconName.toLowerCase();
				console.log(weatherIconName);
				if(weatherIcons.hasOwnProperty(weatherIconName)) {
					weatherIcon = '<i class="' + weatherIcons[weatherIconName] + '"></i>';
				} else {
					weatherIcon = '<i class="fa icon-na"></i>'
				}
				city.$weatherIcon.html(weatherIcon);
			}

			return {
				setIconWeather: setIconWeather
			}
		})();

		//get lattitude and longitude
		function getCurrentPos() {
			if(navigator.geolocation) {
				//options for getCurrentPosition
				var options = {
					enableHighAccuracy: true
				}

				//run when get position succesfully
				function onSuccess(pos) {
					getWeatherData(pos.coords);
				}
				//run when error
				function onError(err) {
					console.log(err);
				}

				//run geolocation
				navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

			} 
			else {
				return {
					latitude: 0,
					longitude: 0
				}
			}
		}

		//update view
		function updateDOMWeather(weatherInfo) {
			city.$name.text(weatherInfo.name);
			city.$temp.text(WeatherUnit.kelvinToCelsius(weatherInfo.main.temp) + '°C');
			city.$weatherDesc.text(weatherInfo.weather[0].description.toUpperCase());
			WeatherIcons.setIconWeather(weatherInfo.weather[0].main);
		}

		//get weather data from openweather
		function getWeatherData(pos) {
			var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + pos.latitude 
					+ '&lon=' + pos.longitude
					+'&APPID=c09be5d42c5336f34ab83eb69ea5c0ec';
			//get JSON data from OpenWeather
			$.getJSON(url, function (data) {
				console.log(data);
				updateDOMWeather(data);
			});
		}

		//initialize app
		function init() {
			cacheDOM();
			getCurrentPos();
		}

		 return {
		 	init: init
		 }
	})();

	WeatherApp.init();
});