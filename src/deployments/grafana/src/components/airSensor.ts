import { MqttClient } from "mqtt";

export default class AirSensor {
  client: MqttClient;
  topic: string;
  inlet: number = 0;
  outlet: number = 0;
  data: any = {};

  constructor(client: MqttClient) {
    this.client = client;
    this.topic = "pm2";
  }

  handleIncoming(topic: String, rawPayload: Object) {
    if (topic === this.topic) {
      try {
        const payload: any = JSON.parse(rawPayload.toString());
        this.data = payload;
      } catch (error) {}
    }
  }

  getCurrent() {
    return JSON.stringify(this.data);
  }
}
