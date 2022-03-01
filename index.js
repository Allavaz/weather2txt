const readline = require("readline");
const fetch = require("node-fetch");
const fs = require("fs");

let url
let txt;
let rate;
let city;
let apikey;
let json = {};
let noCity = false;
let noAPI = false;
let cityQuestion;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Welcome to Weather2TXT!\n");

main();

function main() {
  fs.readFile("./weather2txt-settings.json", function (error, data) {
    if (error) {
      noCity = true;
      noAPI = true;
      console.log("Looks like it's the first time you run this program.\n");
      console.log("In order to get started, register at openweathermap.org and get an API key (it's free!)\n")
      askAPI();
    } else {
      json = JSON.parse(data);
      apikey = json.apikey;
      askAPI();
    }
  });
}

function askAPI() {
  rl.question("Enter your API key: ", answer => {
    let url = "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=" + answer;
    fetch(url).then(res => {
      if (res.status === 200) {
        apikey = answer;
        console.log("Successfully logged in.\n");
        askCity();
      } else if (res.status === 401) {
        console.log("Wrong API key. Try again.\n");
        askAPI();
      } else {
        console.log("Unknown error. Try again.\n");
        askAPI();
      }
    });
  });
  if (!noAPI) {
    rl.write(json.apikey);
  }
}

function askCity() {
  if (noCity) {
    cityQuestion = "Enter City ID: ";
  } else {
    cityQuestion = "Enter City ID (" + json.cityname + "): ";
  }
  rl.question(cityQuestion, answer => {
    url =
      "http://api.openweathermap.org/data/2.5/weather?id=" +
      answer +
      "&units=metric&appid=" +
      apikey;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        city = data.name;
        console.log("You've selected " + city + ".\n");
        json.apikey = apikey;
        json.cityid = answer;
        json.cityname = city;
        noCity = false;
        json = JSON.stringify(json, null, '\t');
        fs.writeFileSync("./weather2txt-settings.json", json);
        askInterval();
      })
      .catch(() => {
        console.log("Wrong City ID, try again.\n");
        askCity();
      });
  });

  if (!noCity) {
    rl.write(json.cityid);
  }
}

function askInterval() {
  rl.question("Enter refresh rate (in minutes): ", answer => {
    if (answer < 10) {
      console.log();
      console.log("Please enter an interval equal or greater than 10 minutes.");
      askInterval();
    } else {
      rate = answer * 60000;
      requestWeather(url);
      setInterval(requestWeather, rate, url);
      rl.close();
    }
  });
}

function requestWeather(url) {
  console.log("Gathering weather data from " + city + "...\n");
  fetch(url)
    .then(res => res.json())
    .then(data => {
      txt = Math.round(data.main.temp) + "ºC";
      fs.writeFile("./weather.txt", txt, function (error) {
        if (!error) {
          console.log("Successfully written to weather.txt.\n");
          console.log("Refreshing in " + rate / 60000 + " minutes...\n");
        }
      });
      console.log("Current temperature is " + txt + ".\n");
    })
    .catch(err => console.error(err))
}
