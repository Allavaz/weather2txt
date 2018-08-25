const readline = require("readline")
const request = require("request")
const fs = require("fs")

var url
var txt
var rate
var city
var d = new Date()
var apikey
var json = {}
var noCity = false
var cityQuestion

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log()
console.log("Welcome to Weather2TXT!")
console.log()

main()

function main() {
    fs.readFile("./weather2txt-settings.json", function(error, data) {
        if (error) {
            noCity = true
            console.log("Looks like it's the first time you run this program. In order to get started, register at openweathermap.org and get an API key (it's free!)")
            console.log()
            askAPI()
        } else {
            json = JSON.parse(data)
            apikey = json.apikey
            askCity()
        }
    })
}

function askAPI() {
    rl.question("Enter your API key: ", (answer) => {
        request({ url: "http://api.openweathermap.org/data/2.5/weather?id=3435910&appid=" + answer, json: true }, function (error, response, body) {
            if (response.statusCode == 401) {
                console.log("Wrong API key. Try again.")
                console.log()
                askAPI()
            } else {
                apikey = answer
                console.log("Successfully logged in.")
                console.log()
                askCity()
            }
        })
    })
}

function askCity() {
    if (noCity) {
        cityQuestion = "Enter City ID: "
    } else {
        cityQuestion = "Enter City ID (" + json.cityname + "): "
    }
    rl.question(cityQuestion, (answer) => {
        if (answer == "") {
            url = "http://api.openweathermap.org/data/2.5/weather?id=" + json.cityid + "&units=metric&appid=" + json.apikey
            city = json.cityname
            askInterval()
        } else {
            url = "http://api.openweathermap.org/data/2.5/weather?id=" + answer + "&units=metric&appid=" + apikey
            request({ url: url, json: true }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    city = body.name
                    json.apikey = apikey
                    json.cityid = answer
                    json.cityname = city
                    noCity = false
                    json = JSON.stringify(json)
                    fs.writeFile("./weather2txt-settings.json", json, function (error){
                        
                    })
                    askInterval()
                }
                else {
                    console.log()
                    console.log("Wrong City ID, try again.")
                    askCity()
                }
            })
        }
        
    })
}

function askInterval() {
    rl.question("Enter refresh rate (in minutes): ", (answer) => {
        if (answer < 10) {
            console.log()
            console.log("Please enter an interval equal or greater than 10 minutes.")
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
                    console.log()
                    console.log("Refreshing in " + rate/60000 + " minutes...")   
                }
            })
        }
    })
    console.log()
    console.log("Gathering weather data from " + city + "...")
}