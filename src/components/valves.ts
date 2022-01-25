import { request, gql } from "graphql-request";
import { apiUrl } from "../utils";

export default class Valve {
  topic: string = "Valves";

  constructor() {}

  async getValves() {
    const sensor = await request(
      apiUrl,
      gql`
        query GetValves {
          response: getValves {
            room
            connected
            state
          }
        }
      `,
    );
    return sensor.response;
  }

  async getCurrent() {
    const valves = await this.getValves();

    // console.log(valves);

    let obj: any = {};
    valves.forEach((valve: any) => {
      obj[`${valve.room}Valve`] = valve.connected ? (valve.state ? 1 : 0) : undefined;
    });

    // console.log(obj);
    // console.log(obj.livingRoomValve);
    return JSON.stringify(obj);
  }

  handleIncoming() {}
}

// {
//   livingRoomTemperature: 21,
//   diningRoomTemperature: 14.4,
//   frontStudyTemperature: 26.7,
//   rearStudyTemperature: 23.1,
//   frontBedroomTemperature: 18.1,
//   rearBedroomTemperature: undefined
// }
