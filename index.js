const readline = require("readline")
const request = require("request")
const fs = require("fs")

var url
var txt
var rate
var city
var apikey
var json = {}
var noCity = false
var noAPI = false
var cityQuestion

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log("Welcome to Weather2TXT!")
console.log()

main()

function main() {
    fs.readFile("./weather2txt-settings.json", function(error, data) {
        if (error) {
            noCity = true
            noAPI = true
            console.log("Looks like it's the first time you run this program. In order to get started, register at openweathermap.org and get an API key (it's free!)")
            console.log()
            askAPI()
        } else {
            json = JSON.parse(data)
            apikey = json.apikey
            askAPI()
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
    if (!noAPI){
        rl.write(json.apikey)
    }
}

function askCity() {
    if (noCity) {
        cityQuestion = "Enter City ID: "
    } else {
        cityQuestion = "Enter City ID (" + json.cityname + "): "
    }
    rl.question(cityQuestion, (answer) => {
        url = "http://api.openweathermap.org/data/2.5/weather?id=" + answer + "&units=metric&appid=" + apikey
        request({ url: url, json: true }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                city = body.name
                console.log()
                console.log("You've selected " + city + ".")
                console.log()
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
                console.log()
                askCity()
            }
        })
    })

    if (!noCity){
        rl.write(json.cityid)
    }
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
            setInterval(requestWeather, rate, url)
            rl.close()
        }
    })
}

function requestWeather(url) {
    request({ url: url, json: true }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            txt = Math.round(body.main.temp) + "ºC"
            console.log()       
            fs.writeFile("./weather.txt", txt, function (error){
                if (!error) {
                    console.log()
                    console.log("Successfully written to weather.txt.")
                    console.log()
                    console.log("Refreshing in " + rate/60000 + " minutes...")   
                }
            })
            console.log("Current temperature is " + txt + ".")
        }
    })
    console.log()
    console.log("Gathering weather data from " + city + "...")
}