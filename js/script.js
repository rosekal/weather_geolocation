// JavaScript Document
$(document).on('pagecreate', function () {
	var latitude;
	var longitude;
	var city;
	var searchHistory = [];
	var defaultCities = [];
	var currTemp, weather, weatherIcon;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		console.log("geolocation is not supported");
	}

	$.getJSON("data/data.json")
		.done(function (data) {
			$.each(data.cities, function (index, city) {
				defaultCities.push(city.Name);
			});
		});

	$("#searchBTN").on("click", function () {
		var search = $("#search-basic").val();
		getWeather(search);
	});

	$("#clearBTN").on("click", function () {
		localStorage.clear();
		loadPreviousSearch();
	});

	$('#searchHistory').on('change', function () {
		getWeather($(this).val());
	});

	function showPosition(position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		getWeather(false);
	}

	function showError() {
		console.log("There was an error when getting the current position.");
	}

	function getWeather(searched) {
		if (!searched) {
			$.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=metric&APPID=0cea0deca55cc323f81363e1ac7151e0")
				.done(function (data) {
					currTemp = data.main.temp;
					weather = data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());
					weatherIcon = data.weather[0].icon;
					city = data.name;
					loadChart();
					main();
				})
				.fail(function () {
					console.log('Unexpected Error');
				});
		} else {
			$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + searched + "&units=metric&APPID=0cea0deca55cc323f81363e1ac7151e0")
				.done(function (data) {
					currTemp = data.main.temp;
					weather = data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());
					weatherIcon = data.weather[0].icon;
					city = data.name;
					if (!ifSearched(data.name)){
						searchHistory.push(data.name);
					}
					localStorage.setItem("history", JSON.stringify(searchHistory));
					$("#search-basic").val("");
					loadChart();
					main();
				})
				.fail(function () {
					console.log('Unexpected Error');
				});
		}
	}
	
	function ifSearched(value){
		var exist = false;
		$.each(searchHistory, function(index, city){
			if (city === value){
				exist = true
			}
		});
		$.each(defaultCities, function (index, city) {
			if (city === value){
				exist = true
			}
		});
		return exist;	
		}
	
	function loadChart() {
		$.getJSON("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&APPID=0cea0deca55cc323f81363e1ac7151e0")
			.done(function (data) {
				$('#weekForecast').empty();

				var weekLabels = new Array();
				var weekData = new Array();
				var dates = new Array();

				$.each(data.list, function (index, listItem) {
					var temp = listItem.main.temp;
					var dt = listItem.dt_txt;
					weekLabels.push(dt);
					weekData.push(temp);


					var date = dt.split(' ')[0];
					var now = new Date();
					var month = (now.getUTCMonth() + 1 < 10 ? "0" + (now.getUTCMonth() + 1) : (now.getUTCMonth() + 1))
					now = now.getUTCFullYear() + "-" + month + "-" + now.getUTCDate();

					if (dt.split(' ')[1] == '12:00:00') {
						var weather = listItem.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());;
						var icon = $('<img></img>').attr('src', 'http://openweathermap.org/img/w/' + listItem.weather[0].icon + '.png');
						$('<li></li>').html(date + '<br>' + weather)
							.append(icon)
							.appendTo('#weekForecast');
					} else {
						dates.push(date);
					}

				})

				$('#weekForecast').listview('refresh');

				var chartData = {
					labels: weekLabels,
					datasets: [{
						fillColor: "rgba(220,0,0,0.5)",
						strokeColor: "rgba(255,0,0,1)",
						pointColor: "rgba(0,255,0,1)",
						pointStrokeColor: "#fff",
						data: weekData
					}]
				}
				cvs = document.getElementById("weekTemperature");
				ctx = cvs.getContext('2d');
				myChart = new Chart(ctx).Line(chartData);
			})
			.fail(function () {
				console.log('unable to pull data');
			});
	}

	function loadPreviousSearch() {
		var tag = $('#searchHistory');
		$(tag).empty();
		$.each(defaultCities, function (index, city) {
			$(tag).append(new Option(city, city));
		});
		var pastSearch = [];
		if (localStorage.history) {
			searchHistory = [];
			pastSearch = JSON.parse(localStorage.getItem("history"));
			$.each(pastSearch, function (index, city) {
				searchHistory.push(city);
				$(tag).append(new Option(city, city));
			});
		}
		$(tag).selectmenu('refresh');
	}

	function main() {
		$('#cityHead').text(city);
		$('#currTemp').text('Current temperature: ' + currTemp + ' celsius');
		$('#weatherText').text('Weather: ' + weather);
		$('#weather').attr('src', 'http://openweathermap.org/img/w/' + weatherIcon + '.png');
		city = null;
		currTemp = null;
		weather = null;
		weatherIcon = null;
		loadPreviousSearch();
	}

});