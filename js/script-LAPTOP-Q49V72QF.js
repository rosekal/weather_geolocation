// JavaScript Document
$(document).on('pagecreate', function(){
	var latitude;
	var longitude;
	var city;
	var currTemp, weather, weatherIcon;

	var currTemp;
	if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		}
	else
		{
			console.log("geolocation is not supported");
		}
	function showPosition(position){
		console.log("Lat: " + position.coords.latitude);
		console.log("Long: " + position.coords.longitude);
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		getWeather(false);
	}
	function showError(){
		console.log("There was an error when getting the current position.");
	}
	function getWeather(searched){
		console.log(searched);
		if(!searched){
			$.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=metric&APPID=0cea0deca55cc323f81363e1ac7151e0")
			.done(function (data) {
				//console.log('Entire Data: '+ data);
				//console.log('Main Data: '+data.main);
				//console.log('Current Temperature: '+data.main.temp);
				currTemp = data.main.temp;
				
				//console.log('Max Temperature: '+data.main.temp_max);
				//console.log('Min Temperature: '+data.main.temp_min);
				
				//console.log('Weather: '+data.weather[0].description);
				weather = data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());
				weatherIcon = data.weather[0].icon;
				
				//console.log('City Name: '+data.name);
				city = data.name;
				main();
			})
			.fail(function () {
				console.log('Unexpected Error');
			});
		}else{
			$.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&APPID=0cea0deca55cc323f81363e1ac7151e0")
			.done(function (data) {
				console.log('Entire Data: '+ data);
				console.log('Main Data: '+data.main);
				console.log('Current Temperature: '+data.main.temp);
				console.log('Max Temperature: '+data.main.temp_max);
				console.log('Min Temperature: '+data.main.temp_min);
				console.log('Weathers: '+data.weather.description);
				console.log('City Name: '+data.name);
			})
			.fail(function () {
				console.log('Unexpected Error');
			});
		}
	}
	
	function main(){
		$('#cityHead').text(city);
		$('#currTemp').text('Current temperature: ' + currTemp + ' celsius');
		$('#weatherText').text('Weather: ' + weather);
		$('#weather').attr('src', 'http://openweathermap.org/img/w/'+weatherIcon+'.png');

		$.getJSON("http://api.openweathermap.org/data/2.5/forecast?lat="+latitude+"&lon="+longitude+"&units=metric&APPID=0cea0deca55cc323f81363e1ac7151e0")
		.done(function(data){
			
		})
	}
});