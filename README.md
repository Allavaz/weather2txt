# weather2txt
Gets current temperature from OpenWeatherMap.org and writes it to a text file. Can be useful for streaming.

### How to use
- Go to [OpenWeatherMap](https://openweathermap.org/). Search for a city and copy the number after ``https://openweathermap.org/city/``. For example, for Los Angeles it's **5368361**. When requested, paste that number into the console.
- Set a refresh interval in minutes, it has to be greater than 1.
- A file called ``weather.txt`` with the temperature in Celsius will be created at the same path as the executable. Use that file in OBS or any streaming software to show the current temperature in your stream! The file will be updated at the refresh interval you set before.

### Building from source
- Requisites: Node.js (preferably the latest version)
- Run ``npm install`` to download all dependencies.

### Download latest Windows build [here](https://github.com/Allavaz/weather2txt/releases/latest).
