import { MqttClient } from "mqtt";

export default class Heating {
  client: MqttClient;
  state: number = 0;

  constructor(client: MqttClient) {
    this.client = client;
  }

  handleIncoming(payload: object) {
    let message = JSON.parse(payload.toString());
    this.state = message.state ? 1 : 0;
  }

  getCurrent() {
    return JSON.stringify({
      heating: this.state,
    });
  }
}
