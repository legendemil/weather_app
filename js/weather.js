$(function () {
	// main app controller
	var WeatherApp = (function(){

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

		//get weather data
		function getWeatherData(pos) {
			var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + pos.latitude 
					+ '&lon=' + pos.longitude
					+'&APPID=c09be5d42c5336f34ab83eb69ea5c0ec';
			//get JSON data from OpenWeather
			$.getJSON(url, function (data) {
				console.log(data);
			});
		}

		 getCurrentPos();
	})();
});