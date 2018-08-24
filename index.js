const readline = require("readline")
const request = require("request")
const fs = require("fs")

var url
var txt
var rate
var city
var d = new Date();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log()
console.log("Welcome to Weather2TXT!")
console.log()

main()

function main() {
    rl.question("Enter City ID (from openweathermap.org): ", (answer) => {
        url = "http://api.openweathermap.org/data/2.5/weather?id=" + answer + "&units=metric&appid=14eac1a1ca632105d940d23677345cb1"
        request({ url: url, json: true }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                city = body.name
                askInterval()
            } else {
                console.log()
                console.log("Wrong City ID, try again.")
                main()
            }
        })
        
    })
}

function askInterval() {
    rl.question("Enter refresh rate (in minutes): ", (answer) => {
        if (answer < 1) {
            console.log()
            console.log("Please enter an interval greater than 1 minute.")
            askInterval()
        } else {
            rate = answer * 60000
            requestWeather(url)
            setInterval(requestWeather, 60000, url)
            rl.close()
        }
    })
}

function requestWeather(url) {
    request({ url: url, json: true }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            txt = Math.round(body.main.temp) + "ºC"
            console.log()
            console.log("Current temperature in " + city + " at " + d.getHours() + ":" + d.getMinutes() + " is " + txt + ".")
            fs.writeFile("./weather.txt", txt, function (error){
                if (!error) {
                    console.log()
                    console.log("Successfully written to weather.txt.")
                    if (rate == 60000) {
                        console.log()
                        console.log("Refreshing in 1 minute...")
                    } else {
                        console.log()
                        console.log("Refreshing in " + rate/60000 + " minutes...")
                    }    
                }
            })
        }
    })
    console.log()
    console.log("Gathering weather data from " + city + "...")
}