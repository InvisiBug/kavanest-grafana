import { MqttClient } from "mqtt";

export default class RadiatorMonitor {
  client: MqttClient;
  topic: string;
  inlet: number = 0;
  outlet: number = 0;

  constructor(client: MqttClient) {
    this.client = client;
    this.topic = "Radiator";
  }

  handleIncoming(topic: string, payload: object) {
    if (topic === "Radiator Monitor") {
      this.inlet = parseFloat((JSON.parse(payload.toString()).inlet - 0.56).toFixed(2));
      this.outlet = parseFloat((JSON.parse(payload.toString()).outlet - 0).toFixed(2));
    }
  }

  getCurrent() {
    return JSON.stringify({
      radiatorInlet: this.inlet,
      radiatorOutlet: this.outlet,
    });
  }
}
