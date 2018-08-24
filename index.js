const readline = require("readline");
const request = require("request");
const fs = require("fs");

var url;
var txt;
var rate;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("Welcome to Weather2TXT!");
main();
function main() {
    rl.question("Enter City ID (from openweathermap.org): ", (answer) => {
        url = "http://api.openweathermap.org/data/2.5/weather?id=" + answer + "&units=metric&appid=14eac1a1ca632105d940d23677345cb1";
        request({ url: url, json: true }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Getting weather data from " + body.name + ".");
                askInterval();
            } else {
                console.log("Unknown error, try again.");
                main();
            }
        });
        
    });
}

function askInterval() {
    rl.question("Enter refresh rate (in minutes): ", (answer) => {
        if (answer < 1) {
            console.log("Please enter an interval greater than 1 minute.")
            askInterval();
        } else {
            rate = answer * 60000;
            console.log("Getting data from OpenWeatherMap...");
            requestWeather(url);
            setInterval(requestWeather, 60000, url);
            rl.close();
        }
    });
}

function requestWeather(url) {
    request({ url: url, json: true }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            txt = Math.round(body.main.temp) + "ºC";
            console.log(txt);
            fs.writeFile("./weather.txt", txt, function (error){
                if (!error) {
                    console.log("Successfully written to weather.txt.")
                    if (rate == 60000) {
                        console.log("It will refresh next minute.");
                    } else {
                        console.log("It will refresh in " + rate/60000 + " minutes.")
                    }
                    
                }
            })
        }
    });
}