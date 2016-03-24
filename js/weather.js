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

		// binds events

		function bindEvents() {
			// click temp to switch unit from celsiu to fahrenheit
			city.$temp.on('click', WeatherEvents.changeTempUnit);
		}


		// weather events module
		var WeatherEvents = (function () {
			function changeTempUnit() {
				var value = $(this).find('#temp-value'),
					unit = $(this).find('#temp-unit'),
					newValue,
					newUnit;
				
				//set proper unit and new convert Value
				switch(city.$temp.data('unit')) {
					case 'celsius':
						newValue = WeatherUnit.celsiusToFahr(city.$temp.data('value'));
						newUnit = 'F';
						city.$temp.data('unit', 'fahrenheit');
						city.$temp.data('value', newValue);
						break;
					case 'fahrenheit':
						newValue = WeatherUnit.fahrToCelsius(city.$temp.data('value'));
						newUnit = '°C';
						city.$temp.data('unit', 'celsius');
						city.$temp.data('value', newValue);
						break;
				}

				value.text(newValue);
				unit.text(newUnit);
			}

			return {
				changeTempUnit: changeTempUnit
			}
		})();

		//weather unit module
		var WeatherUnit = (function(){
			//kelvin to celsius
			function kelvinToCelsius(temp){
				if(typeof parseFloat(temp) == "number")
					return (temp - 273.15).toFixed(1);
			}

			//celsius to fahrenheit
			function celsiusToFahr(temp) {
				if(typeof parseFloat(temp) == "number")
					return (temp * 9 / 5 + 32).toFixed(1);
			}

			//fahrenheit to celsius
			function fahrToCelsius(temp) {
				if(typeof parseFloat(temp) == "number")
					return ((temp - 32) / (9 / 5)).toFixed(1);
			}

			return {
				kelvinToCelsius: kelvinToCelsius,
				celsiusToFahr: celsiusToFahr,
				fahrToCelsius: fahrToCelsius
			}
		})();

		var WeatherIcons = (function () {
			/*
				object map  weather conditions(weather.main) on icons
			*/
			var weatherIcons = {
				"clear sky": "fa icon-sun",
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
				console.log(weatherIconName);
				weatherIconName = weatherIconName.toLowerCase();
				
				if(weatherIcons.hasOwnProperty(weatherIconName)) {
					weatherIcon = '<i class="' + weatherIcons[weatherIconName] + '" id="anim-weather-icon"></i>';
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
			//set city name and country 
			city.$name.text(weatherInfo.name + ', ' + weatherInfo.sys.country);

			// set temperature in celsius
			var weatherInCelsius = WeatherUnit.kelvinToCelsius(weatherInfo.main.temp);
			var weatherTemp = '<span id="temp-value">' + weatherInCelsius + '</span>';
			weatherTemp += '<span id="temp-unit">°C</span>';
			city.$temp.html(weatherTemp);
			
			//add data-unit,data-value attribute
			city.$temp.data('unit', 'celsius');
			city.$temp.data('value', weatherInCelsius);
			
			// set weather desc
			city.$weatherDesc.text(weatherInfo.weather[0].description.toUpperCase());

			// set weather icon
			WeatherIcons.setIconWeather(weatherInfo.weather[0].description);
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
			bindEvents();
		}

		 return {
		 	init: init
		 }
	})();

	WeatherApp.init();
});