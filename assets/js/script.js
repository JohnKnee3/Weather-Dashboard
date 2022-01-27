var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-name");
var citySearchTerm = document.querySelector("#city-search-term");
var currentTempEl = document.querySelector("#current-temp");
var currentWindEl = document.querySelector("#current-wind");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentUviEl = document.querySelector("#current-uvi");
var currentIconEl = document.querySelector("#current-icon");
var forecastContainerEl = document.querySelector("#forecast-container");
var historyContainerEl = document.querySelector("#history-container");

//variable I want to save cities into
var tasks = [];

//saves the tasks variable to the local storage
var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

//gets items from local storage
var loadTasks = function () {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    // console.log(tasks);

    //local storage is empty this creates an empty array
    if (!tasks) {
        tasks = [];
    }
    //grabs each item in the array and sends it to my button maker
    for (var i = 0; i < tasks.length; i++) {
        displayHistoryButton(tasks[i]);
    }

};
//take the types in info
var formSubmitHandler = function (event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var cityName = cityInputEl.value.trim();


    if (cityName) {
        getCityWeather(cityName);
        // displayHistoryButton(cityName);
        //clears the input field
        cityInputEl.value = "";
        forecastContainerEl.textContent = "";

    }
    else {
        alert("Please enter a valid city");
    }
};

//goes to the api to get the city's weather by City Name and adds to the history.
var getCityWeather = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=b66533483256f366bcceb78a532dba20";

    // make a get request to url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    // console.log(data.name);
                    for (var i = 0; i < tasks.length; i++) {
                        if (data.name === tasks[i]) {
                            console.log(city);
                            getFeaturedCityWeather(city);
                            return;
                        }
                    }
                    // console.log(data);
                    displayCurrentNameDate(data.name, data.dt, data.weather[0].icon);
                    displayHistoryButton(data.name);
                    tasks.push(data.name);
                    // console.log(tasks);
                    saveTasks();
                    // console.log(data.weather[0].icon);
                    oneCallWeather(data.coord.lat, data.coord.lon);
                });

            } else {
                alert("Error: City " + response.statusText + ". Please enter valid input.");
            }
            
        })
};

//gets city weather by city name when clicked from history.  Does not add to history.
var getFeaturedCityWeather = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=b66533483256f366bcceb78a532dba20";

    // make a get request to url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    // console.log(data);
                    displayCurrentNameDate(data.name, data.dt, data.weather[0].icon);
                    // console.log(data.weather[0].icon);
                    oneCallWeather(data.coord.lat, data.coord.lon);
                });

            } else {
                alert("Error: City " + response.statusText + ". Please enter valid input.");
            }

        })
};

//goes to the api to get more weather info by Lat and Long
var oneCallWeather = function (lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=b66533483256f366bcceb78a532dba20"

    // make a get request to url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    // console.log(data);
                    // console.log(data.current.uvi);
                    displayCurrentWeather(data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi);
                    displayFiveDay(data.daily);
                });

            } else {
                alert("Error: City " + response.statusText + ". Please enter valid input.");
            }

        })
};

//displays the current days city name and date
var displayCurrentNameDate = function (name, dateScramble, icon) {

    //gets current day by converting the dt into something I want to see
    var date = new Date(dateScramble * 1000);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getUTCFullYear();
    var currentDay = "(" + month + "/" + day + "/" + year + ")";

    //City's name plus date attached
    var cityTime = name + currentDay;

    //changes the text content of the top to display the city and current day
    citySearchTerm.textContent = cityTime;

    //display icon next to text
    //first make a url
    var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";

    //creates an img element to add to the html
    currentIconEl.setAttribute("src", iconUrl);
};

//displays the information for the current days weather
var displayCurrentWeather = function (temp, wind, humidity, uvi) {

    //displays the current temp on the HTML
    fancyTemp = temp + "°F";
    currentTempEl.textContent = fancyTemp;

    //displays the current wind speed on the HTML
    fancyWind = wind + "MPH";
    currentWindEl.textContent = fancyWind;

    //displays the current humidity
    fancyHumidity = humidity + "%";
    currentHumidityEl.textContent = fancyHumidity;

    //displays the current UV Index
    currentUviEl.textContent = uvi;
    //styles the UV box
    currentUviEl.removeAttribute("class");
    //if favorable display green
    if (uvi <= 2.99) {
        currentUviEl.classList.add("uv-item-green");
    }
    //if moderate display yellow
    else if (uvi <= 5.99 && uvi >= 3) {
        currentUviEl.classList.add("uv-item-yellow");
    }
    //if anthing higher display orange
    else
        currentUviEl.classList.add("uv-item-orange");
};

//displays the 5 day forecast
var displayFiveDay = function (data) {
    for (var i = 1; i < 6; i++) {
        var dateScramble = (data[i].dt);
        var date = new Date(dateScramble * 1000);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getUTCFullYear();
        var currentDay = month + "/" + day + "/" + year;
        var iconUrl = "http://openweathermap.org/img/w/" + data[i].weather[0].icon + ".png";


        //create div to store a single day's weather
        var fiveWeatherEl = document.createElement("div");
        fiveWeatherEl.classList = "future-box col-12 col-md-6 col-lg-2";

        //add current date
        var dayEl = document.createElement("h4");
        dayEl.classList = "future-item";
        dayEl.textContent = currentDay;
        fiveWeatherEl.appendChild(dayEl);

        //display icon
        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", iconUrl);
        fiveWeatherEl.appendChild(iconEl);

        //displays temp
        var tempEl = document.createElement("h5");
        tempEl.classList = "future-item";
        tempEl.textContent = "Temp: " + (data[i].temp.day) + "°F";
        fiveWeatherEl.appendChild(tempEl);

        //displays wind speed
        var windEl = document.createElement("h5");
        windEl.classList = "future-item";
        windEl.textContent = "Wind: " + (data[i].wind_speed) + " MPH";
        fiveWeatherEl.appendChild(windEl);

        //displays humidity
        var humidityEl = document.createElement("h5");
        humidityEl.classList = "future-item";
        humidityEl.textContent = "Humidity: " + (data[i].humidity) + "%";
        fiveWeatherEl.appendChild(humidityEl);

        //appends the enitre element to the HTML
        forecastContainerEl.appendChild(fiveWeatherEl);
    }
};

//displays the city button to the History Box
var displayHistoryButton = function (city) {

    //creates the city button
    var cityEl = document.createElement("button");
    cityEl.setAttribute("data-city", city);
    cityEl.classList = "btn";
    cityEl.textContent = city;

    //add the button to the HTML
    historyContainerEl.appendChild(cityEl);
};

var buttonClickHandler = function (event) {
    // get the language attribute from the clicked element
    var city = event.target.getAttribute("data-city");

    if (city) {
        getFeaturedCityWeather(city);

        // clear old content
        forecastContainerEl.textContent = "";
    }
};


loadTasks();
//listens if the city form has been clicked
cityFormEl.addEventListener("submit", formSubmitHandler);
//listen to see if a city history button has been clicked
historyContainerEl.addEventListener("click", buttonClickHandler);



//THE DATE EXPERIMENT
// var date = new Date(1642871441 * 1000);
// console.log(date);

// var month = date.getMonth() + 1;
// console.log(month);

// var day = date.getDate();
// console.log(day);

// var year = date.getUTCFullYear();
// console.log(year);

// var currentDay = month + "/" + day + "/" + year;
// console.log(currentDay);


//Notes----------------------------------------------------

//LOOKIN AHEAD

// Use the fetch API to send requests to a server-side API

// Receive and parse data in the JSON format

// Use returned data to dynamically generate HTML

// Handle response codes and metadata, including headers, status, and URL


//WHAT YOU WILL LEARN

// Explain the difference between a client-side API and a server-side API

// Explain the client-server model and request-response pattern

// Explain and implement the differences between HTTP GET requests using XMLHTTPRequest, jQuery AJAX, and the fetch API

// Explain HTTP response codes and handle response metadata with fetch API

// Parse JSON to dynamically generate HTML

// Explain the benefits and challenges of working with asynchronous JavaScript

// Explain and implement query string parameters

//6.1.4 fetch() introduction and used dev tool to look at them under Network/repos/header/response.  Vid on Client Server Overview and JSON overview.
//6.1.5 .then to do something with what has been fetched and use .json to convert things into JSON so Javascript can use it.
//6.1.6 passed in a string from the call to the function to create something that can select any user that gets passed in.
//6.2.3 hardcoded the input form into the HTML using the provided CSS for styling
//6.2.4 addEventListener was used to call a new function that pulled the value of what was typed and send it to the next function.
//6.2.5 pretty dense stuff all surrounding creating elements from all of the parsed JSON data and grabbing the sepcific data you need from each step of the array using a for loop.
//6.2.6 if/else on the fetch to see if valid input.  .catch to show connection errors.
//6.3.3 Added a new HTML and JS for that page.  Shares the same CSS.
//6.3.4 Zero'd in on the issues page for this fetch and used ? in the URL to change the order of the info.
//6.3.5 Took the issues we received and created a list of links using <a> and href and _blank.
//6.3.6 checked Header from the fetch to see if it contained a "link" then made another <a> link in js
//6.4.3 Query parameters specifically GitHubs ?repo=JohnKnee3/git-it-done.
//6.4.4 Introduced to document.location  and grabbed it's .search and was introduced to .split.
//6.4.5 document.location.replace(."index.html"); can be added to return users to the main page.  Added as failsafes if when don't get certain expected info.
//6.5.3 pretty dense stuff about using a var to apply a name, adding multiple parameters and how to check your fetch in the Network/Preview tab.
//6.5.4 used fetch again to grab specific Javascript repos and passed data.items this time into the array because that was the name of it.
//6.5.5 created buttons in the HTML set up to reference things based on data-language="javascript" etc...
//6.5.6 used add event listener and .target to get the data-language specific button presses with the div that holds all the buttons.