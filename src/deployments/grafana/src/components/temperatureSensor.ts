import { MqttClient } from "mqtt";

export default class TemperatureSensor {
  client: MqttClient;
  topic: string;
  inlet: number = 0;
  outlet: number = 0;

  livingRoom = new sensor("Living Room");
  kitchen = new sensor("Kitchen");
  liamsRoom = new sensor("Liams Room");
  study = new sensor("Study");
  ourRoom = new sensor("Our Room");

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
      console.log("Offsets Received");
      this.updateOffsets(payload);
    }

    // if (topic.includes("Sensor")) {
    //   this.livingRoom.handleIncoming(payload);
    //   this.kitchen.handleIncoming(payload);
    //   this.liamsRoom.handleIncoming(payload);
    //   this.study.handleIncoming(payload);
    //   this.ourRoom.handleIncoming(payload);
    // } else if (topic == "Room Offsets") {
    //   console.log("Offsets Received");
    //   this.updateOffsets(payload);
    // }
  }

  updateOffsets(payload: object) {
    const newOffsets = JSON.parse(payload.toString());

    for (let i = 0; i < this.sensors.length; i++) {
      this.sensors[i].updateOffset(newOffsets);
    }

    // this.livingRoom.updateOffset(newOffsets);
    // this.kitchen.updateOffset(newOffsets);
    // this.liamsRoom.updateOffset(newOffsets);
    // this.study.updateOffset(newOffsets);
    // this.ourRoom.updateOffset(newOffsets);
  }

  getCurrent() {
    let string: string = "{";
    for (let i = 0; i < this.sensors.length; i++) {
      if (i < this.sensors.length - 1) {
        string += this.sensors[i].getTemp() + ",\n";
      } else {
        string += this.sensors[i].getTemp() + "\n";
      }
    }
    string += "}";

    console.log(string);
    try {
      console.log(JSON.parse(string));
      return JSON.stringify(JSON.parse(string));
    } catch {
      return "";
    }

    // return JSON.stringify({
    //   livingRoomTemperature: this.livingRoom.getTemp(),
    //   livingRoomHumidity: this.livingRoom.getHumidity(),

    //   kitchenTemperature: this.kitchen.getTemp(),
    //   kitchenHumidity: this.kitchen.getHumidity(),

    //   liamsRoomTemperature: this.liamsRoom.getTemp(),
    //   liamsRoomHumidity: this.liamsRoom.getHumidity(),

    //   studyTemperature: this.study.getTemp(),
    //   studyHumidity: this.study.getHumidity(),

    //   ourRoomTemperature: this.ourRoom.getTemp(),
    //   ourRoomHumidity: this.ourRoom.getHumidity(),
    // });
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
      temperature: this.temperature,
      pressure: this.pressure,
      humidity: this.humidity,
    };
  }

  getTemp() {
    const test = `"${this.camelRoomName(this.id)}Temperature":${this.temperature}`;
    return test;
  }

  getHumidity() {
    return this.humidity;
  }

  getPressure() {
    return this.pressure;
  }

  camelRoomName(roomName: string) {
    if (roomName.split(" ").length === 2) {
      return `${roomName.split(" ")[0].toLowerCase()}${roomName.split(" ")[1]}`;
    } else return roomName.toLowerCase();
  }
}
