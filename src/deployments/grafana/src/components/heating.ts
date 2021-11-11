import { MqttClient } from "mqtt";

export default class Heating {
  client: MqttClient;
  state: number = 0;
  topic: string;

  constructor(client: MqttClient) {
    this.client = client;
    this.topic = "Heating";
  }

  handleIncoming(topic: string, payload: object) {
    if (topic === "Heating") {
      let message: Message = JSON.parse(payload.toString());
      this.state = message.state ? 1 : 0;
    }
  }

  getCurrent() {
    return JSON.stringify({
      heating: this.state,
    });
  }
}

type Message = {
  node: string;
  state: boolean;
};
