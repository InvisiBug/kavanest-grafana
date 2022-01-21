import { MqttClient } from "mqtt";

export default class Valves {
  client: MqttClient;
  topic: string;
  inlet: number = 0;
  outlet: number = 0;

  livingRoom: number = 0;
  diningRoom: number = 0;
  frontStudy: number = 0;
  rearStudy: number = 0;
  frontBedroom: number = 0;
  rearBedroom: number = 0;

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
      } else if (message.node.includes("Dining Room")) {
        this.diningRoom = message.state;
      } else if (message.node.includes("Front Study")) {
        this.frontStudy = message.state;
      } else if (message.node.includes("Rear Study")) {
        this.rearStudy = message.state;
      } else if (message.node.includes("Front Bedroom")) {
        this.rearStudy = message.state;
      } else if (message.node.includes("Rear Bedroom")) {
        this.rearBedroom = message.state;
      }
    }
  }

  getCurrent() {
    const data = {
      livingRoomValve: this.livingRoom,
      diningRoomValve: this.diningRoom,
      frontStudyValve: this.frontStudy,
      rearStudyValve: this.rearStudy,
      frontBedroom: this.frontBedroom,
      rearBedroom: this.rearBedroom,
    };
    return JSON.stringify(data);
  }
}
