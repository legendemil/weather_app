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
				$weatherIcon: $weatherInfo.find('#city-weather-icon')
			}
		}

		//weather unit module

		var WeatherUnit = (function(){
			//kelvin to celsius
			function kelvinToCelsius(temp){
				return temp - 273.15;
			}

			//celsius to fahrenheit
			function celsiusToFahr(temp) {
				// body...
			}

			return {
				kelvinToCelsius: kelvinToCelsius,
				celsiusToFahr: celsiusToFahr
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