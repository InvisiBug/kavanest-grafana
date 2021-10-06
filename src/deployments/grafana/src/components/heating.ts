import { MqttClient } from "mqtt";

export default class Heating {
  client: MqttClient;
  state: number = 0;

  constructor(client: MqttClient) {
    this.client = client;
  }

  handleIncoming(topic: string, payload: object) {
    if (topic === "Heating") {
      let message = JSON.parse(payload.toString());
      this.state = message.state ? 1 : 0;
      console.log(this.state);
    }
  }

  getCurrent() {
    return JSON.stringify({
      heating: this.state,
    });
  }
}
