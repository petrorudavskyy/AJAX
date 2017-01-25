

$(document).ready(function() {
  $("body").animate({ opacity: 1 }, 700);
  //var darkSky = "https://api.darksky.net/forecast/584af9729317fd49cf1621021267a76e/";
  // Get geo-coordinates
  $.ajax({
    type: "GET",
    url: "https://ipinfo.io/json/",
    success: coordinates
  });

  // coordinates callback function
  function coordinates(data) {
    var coords = data.loc;
    var city = data.city;
    var region = data.region;
    var country = data.country;

    // var lastb = document.getElementById("last");
   

    // Dark Sky API
    window.darkSkyAPI = "https://api.darksky.net/forecast/584af9729317fd49cf1621021267a76e/" + coords ;
    
    // Pass city, region, and country to displayLocation
    displayLocation(city, region, country);

    // Pass API url to getWeather
    getWeather(darkSkyAPI);
    getWeatherLast(darkSkyAPI);
    getWeatherNext(darkSkyAPI);  
    };
    
   // end of coordinates callback

  function getWeatherLast(darkSkyAPI) {
    $.ajax({
      type: "GET",
      url: darkSkyAPI,
      dataType: "jsonp",
      success: last
    });
  }
  function getWeatherNext(darkSkyAPI) {
    $.ajax({
      type: "GET",
      url: darkSkyAPI,
      dataType: "jsonp",
      success: next
    });
  }

  function last(data) {
    document.getElementById('last').onclick = function() {
      var currDateJs = data.currently.time*1000;
      // console.log(currDateJs);
      var currDate = new Date(currDateJs);
      var lastJs = currDate.setDate(currDate.getDate()-1);
      const lastUnix = lastJs/1000;
      
      // var lastDay = new Date(lastJs);
      // console.log(lastJs);
      //console.log(lastUnix);
      var darkSky = window.darkSkyAPI + "," + lastUnix;
      console.log(darkSky);
       $.ajax({
        type: "GET",
        url: darkSky,
        dataType: "jsonp",
        success: function(data){
          var ltime = data.currently.time*1000;
          var lasttime = new Date(ltime);
          getWeather(darkSky);
        }
    });
    }

    
  }

  function next(data) {
    document.getElementById('next').onclick = function() {
      alert("Sorry!")
    }
  }

  // displayLocation (pass city, region, and country arguments)
  function displayLocation(city, region, country) {

    // Turn country code into full country name
    $.ajax({
      type: "GET",
      url: "https://restcountries.eu/rest/v1/alpha?codes=" + country,
      success: function(data) {

        // Print to html
        $("#city-state").text((city + ", " + region).toUpperCase());
        $("#country").text((data[0].name).toUpperCase());
      }
    });
  } // end of displayLocation

  // getWeather (pass API URL argument)
  function getWeather(darkSkyAPI) {
    $.ajax({
      type: "GET",
      url: darkSkyAPI,
      dataType: "jsonp",
      success: weather
    });

    // weather function to get darksky JSON data
    function weather(data) {
      var temp = Math.round(data.currently.temperature);
      var icon = data.currently.icon;
      var summary = data.currently.summary;
      //console.log(temp, icon, summary);

      displayWeather(icon, temp, summary);
    } // end of weather

    // displayWeather (pass icon, temp, summary as arguments)
    function displayWeather(icon, temp, summary) {
      //console.log(temp, icon, summary);

      // Using the colored Skycons - https://github.com/maxdow/skycons
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
                    } });

      var tempC = Math.round((temp - 32) * 5/9);
      //$("#temperature").text(temp + "°");
      $("#temperature").html(tempC + "°");
     

      $("#condition").text(summary.toUpperCase());

      // Add Skycon based on weather condition
      skycons.add('icon1', icon);
      skycons.play();
    } // end of displayWeather

  } // end getWeather
});



