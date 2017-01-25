// secretkey = 584af9729317fd49cf1621021267a76e

// My location is: 49.432300, 25.144558

// https://api.darksky.net/forecast/584af9729317fd49cf1621021267a76e/49.432300,25.144558

var currDate;
var currDateJS;
// major function getCoordinates
var getCoordinates = function(){
  var deffered = $.Deferred();
  var url = 'https://api.darksky.net/forecast/584af9729317fd49cf1621021267a76e/';
  navigator.geolocation.getCurrentPosition( function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    url += latitude + ',' + longitude;
    deffered.resolve(url);
  });
  return deffered.promise();
}

getCoordinates().then(function(data) {
  $.ajax({
    url: data,
    dataType: 'jsonp'
  }).done(function(data) {
      currDate = new Date();
      getLocation(data);
      getTemperature(data);
      var weather = setWeather(data);
      setImage(weather);
      setDate(data);
      startTime();
  })
});

function getLocation(data) {
  var location = data.timezone; 
  $('h1').text(data.timezone); 
}

function getTemperature(data){
  var tempF = data.currently.temperature;
  var tempC = Math.round((tempF - 32) * 5/9); 
  $('div.temp').text(tempC + "°"); //add temp
}

function setWeather(data) {
  var type = data.currently.icon;
  $('div.weather').text(type.toUpperCase());
  return type;

  setImage(type);
}

function setImage(type){
  var skycons = new Skycons({"monochrome": false,
    "colors": {
      "main": "#333333",
      "moon": "#78586F",
      "fog": "#78586F",
      "fogbank": "#B4ADA3",
      "cloud": "#B4ADA3",
      "snow": "#7B9EA8",
      "leaf":"#7B9EA8",
      "rain": "#7B9EA8",
      "sun": "#FF8C42"
      } 
  });
  //add animation
  skycons.add('icon1', type);
  skycons.play();
}


function setDate(data) {
  var date = new Date(data.currently.time * 1000);
  $('.day').text(date.getDate());
  
  var monthArr=['Junuary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var month = date.getMonth();
  $('.month').text('' + monthArr[month]);
  
  $('.year').text(date.getFullYear());
}

function startTime() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);
    document.getElementById('txt').innerHTML =
    hours + ":" + minutes + ":" + seconds;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}


//previous button
$('#previous').click(function () {
  document.getElementById("next").classList.remove('disabled');
  var prevDay = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - 1);
  var prevDayTime = prevDay.getTime() / 1000;
  currDateJS = prevDayTime;
  currDate = new Date(currDateJS * 1000);
  
  getCoordinates().then(function (data) {
    $.ajax({
      url: data + ',' + currDateJS,
      dataType: 'jsonp'
  }).done(function (data) {
      getLocation(data);
      getTemperature(data);
      var weather = setWeather(data);
    setImage(weather);
      setDate(data);
    })
  });
});

//next button
$('#next').click(function(data) {
  var nextDay = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() + 1);
  
  var today = new Date();  
  if(nextDay>=today){
    alert('You can not watch the weather for tomorrow');
   document.getElementById("next").classList.add('disabled');
    return;
  }
  
  var nextDayTime = nextDay.getTime() / 1000;
  currDateJS = nextDayTime;
  currDate = new Date(currDateJS * 1000);

  
  
  getCoordinates().then(function(data) {
    $.ajax({
    url: data + ',' + currDateJS,
    dataType: 'jsonp'
    }).done(function(data) {
      getLocation(data);
      setDate(data);
      getTemperature(data);
      var weather = setWeather(data);
    setImage(weather);
    })
  });     
});