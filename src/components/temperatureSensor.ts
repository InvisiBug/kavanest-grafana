import { MqttClient } from "mqtt";

export default class TemperatureSensor {
  client: MqttClient;
  topic: string;

  sensors: Array<sensor> = [];

  constructor(client: MqttClient) {
    this.client = client;
    this.topic = "Temperatures";

    this.sensors.push(new sensor("Living Room"));
    this.sensors.push(new sensor("Kitchen"));
    this.sensors.push(new sensor("Liams Room"));
    this.sensors.push(new sensor("Study"));
    this.sensors.push(new sensor("Our Room"));
  }

  handleIncoming(topic: string, payload: object) {
    if (topic.includes("Sensor")) {
      for (let i = 0; i < this.sensors.length; i++) {
        this.sensors[i].handleIncoming(payload);
      }
    } else if (topic == "Room Offsets") {
      for (let i = 0; i < this.sensors.length; i++) {
        this.sensors[i].updateOffset(JSON.parse(payload.toString()));
      }
    }
  }

  getCurrent() {
    // Create a blank object and push each new datapoint into it
    //* Only getting the temperature
    let obj: any = {};

    for (let i = 0; i < this.sensors.length; i++) {
      Object.entries(this.sensors[i].getTemp()).forEach(([key, value]) => {
        obj[key] = value;
      });
    }
    return JSON.stringify(obj);
  }
}

class sensor {
  temperature: number | undefined = undefined;
  humidity: number | undefined = undefined;
  pressure: number | undefined = undefined;

  offset: number = 0;
  id: string = "";

  constructor(id: string) {
    this.id = id;
  }

  handleIncoming(payload: object) {
    let message = JSON.parse(payload.toString());

    if (message.node.includes(this.id)) {
      this.temperature = parseFloat((message.temperature + this.offset).toFixed(2));
      this.humidity = parseFloat(message.humidity.toFixed(2));
      this.pressure = parseFloat(message.pressure.toFixed(2));
    }
  }

  updateOffset(newOffset: any) {
    this.offset = newOffset[this.id];
  }

  getCurrent() {
    return {
      [`${this.camelRoomName(this.id)}Temperature`]: this.temperature,
      [`${this.camelRoomName(this.id)}Humidity`]: this.humidity,
      [`${this.camelRoomName(this.id)}Pressure`]: this.pressure,
    };
  }

  getTemp() {
    return {
      [`${this.camelRoomName(this.id)}Temperature`]: this.temperature,
    };
  }

  getHumidity() {
    return {
      [`${this.camelRoomName(this.id)}Humidity`]: this.humidity,
    };
  }

  getPressure() {
    return {
      [`${this.camelRoomName(this.id)}Pressure`]: this.pressure,
    };
  }

  camelRoomName(text: string) {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
    return text.substr(0, 1).toLowerCase() + text.substr(1);
  }
}
