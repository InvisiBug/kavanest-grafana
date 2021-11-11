import { MqttClient } from "mqtt";

export default class Valves {
  client: MqttClient;
  topic: string;
  inlet: number = 0;
  outlet: number = 0;

  livingRoom: number = 0;
  liamsRoom: number = 0;
  study: number = 0;
  ourRoom: number = 0;

  constructor(client: MqttClient) {
    this.client = client;
    this.topic = "Valves";
  }

  handleIncoming(topic: string, payload: object) {
    if (topic.includes("Valve")) {
      let message = JSON.parse(payload.toString());
      message.state = message.state ? 1 : 0; // Map the true / false state to a 1 / 0

      if (message.node.includes("Living Room")) {
        this.livingRoom = message.state;
      } else if (message.node.includes("Liams Room")) {
        this.liamsRoom = message.state;
      } else if (message.node.includes("Study")) {
        this.study = message.state;
      } else if (message.node.includes("Our Room")) {
        this.ourRoom = message.state;
      }
    }
  }

  getCurrent() {
    return JSON.stringify({
      livingRoomValve: this.livingRoom,
      liamsRoomValve: this.liamsRoom,
      studyValve: this.study,
      ourRoomValve: this.ourRoom,
    });
  }
}
