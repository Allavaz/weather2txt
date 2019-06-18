# weather2txt
Gets current temperature from OpenWeatherMap.org and writes it to a text file. Can be useful for streaming.

## How to use
1. Register on [OpenWeatherMap](https://openweathermap.org/) and get an API key (it's free!).
2. Search for a city and copy the number after ``https://openweathermap.org/city/``. For example, for Los Angeles it's ``5368361``.
3. Set a refresh interval in minutes, it has to be greater than 10.
4. A file called ``weather.txt`` with the temperature in Celsius will be created at the same path as the executable. Use that file in OBS or any streaming software to show the current temperature in your stream! The file will be updated at the refresh interval you set before.

## Building and running from source
1. Requisites: Node.js.
2. Run ``npm install`` to download all dependencies.
3. Run ``node index.js``.

## Download latest Windows build [here](https://github.com/Allavaz/weather2txt/releases/latest).
