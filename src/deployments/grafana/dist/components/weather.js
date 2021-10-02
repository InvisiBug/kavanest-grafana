"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class Weather {
    constructor() {
        this.outsideTemp = undefined;
        this.getCurrentWeather();
        setInterval(() => {
            this.getCurrentWeather();
        }, 5 * 1000);
    }
    getCurrentWeather() {
        request("https://api.openweathermap.org/data/2.5/weather?q=Sheffield&APPID=85c05ad811ead4d20eac5bb0e1ce640d&units=metric", (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                this.outsideTemp = data.main.temp;
            }
        });
    }
    getCurrent() {
        return JSON.stringify({
            outsideTemp: this.outsideTemp,
        });
    }
}
exports.default = Weather;
