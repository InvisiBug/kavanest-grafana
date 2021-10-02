import { MqttClient } from "mqtt";

export default class TemperatureSensor {
  client: MqttClient;
  inlet: number = 0;
  outlet: number = 0;

  livingRoom = new sensor("Living Room");
  kitchen = new sensor("Kitchen");
  liamsRoom = new sensor("Liams Room");
  study = new sensor("Study");
  ourRoom = new sensor("Our Room");

  constructor(client: MqttClient) {
    this.client = client;
  }

  handleIncoming(payload: object) {
    this.livingRoom.handleIncoming(payload);
    this.kitchen.handleIncoming(payload);
    this.liamsRoom.handleIncoming(payload);
    this.study.handleIncoming(payload);
    this.ourRoom.handleIncoming(payload);
  }

  updateOffsets(payload: object) {
    const newOffsets = JSON.parse(payload.toString());

    this.livingRoom.updateOffset(newOffsets);
    this.kitchen.updateOffset(newOffsets);
    this.liamsRoom.updateOffset(newOffsets);
    this.study.updateOffset(newOffsets);
    this.ourRoom.updateOffset(newOffsets);
  }

  getCurrent() {
    return JSON.stringify({
      livingRoomTemperature: this.livingRoom.getTemp(),
      livingRoomHumidity: this.livingRoom.getHumidity(),

      kitchenTemperature: this.kitchen.getTemp(),
      kitchenHumidity: this.kitchen.getHumidity(),

      liamsRoomTemperature: this.liamsRoom.getTemp(),
      liamsRoomHumidity: this.liamsRoom.getHumidity(),

      studyTemperature: this.study.getTemp(),
      studyHumidity: this.study.getHumidity(),

      ourRoomTemperature: this.ourRoom.getTemp(),
      ourRoomHumidity: this.ourRoom.getHumidity(),
    });
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
    return this.temperature;
  }

  getHumidity() {
    return this.humidity;
  }

  getPressure() {
    return this.pressure;
  }
}
