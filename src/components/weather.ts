const request = require("request");

export default class Weather {
  outsideTemp: any = undefined;
  topic: string;

  constructor() {
    this.topic = "Weather";
    this.getCurrentWeather();
    setInterval(() => {
      this.getCurrentWeather();
    }, 5 * 1000);
  }

  handleIncoming() {}

  getCurrentWeather() {
    request(
      "https://api.openweathermap.org/data/2.5/weather?q=Sheffield&APPID=85c05ad811ead4d20eac5bb0e1ce640d&units=metric",
      (error: any, response: any, body: string) => {
        if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          this.outsideTemp = data.main.temp;
        }
      },
    );
  }

  getCurrent() {
    return JSON.stringify({
      outsideTemp: this.outsideTemp,
    });
  }
}
