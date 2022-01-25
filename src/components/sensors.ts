import { request, gql } from "graphql-request";
import { apiUrl } from "../utils";

export default class Sensor {
  topic: string = "Temperatures";
  constructor() {}

  async getSensors() {
    try {
      const sensor = await request(
        apiUrl,
        gql`
          query GetSensors {
            response: getSensors {
              room
              temperature
              connected
            }
          }
        `,
      );
      return sensor.response;
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrent() {
    const sensors = await this.getSensors();

    let obj: any = {};
    sensors.forEach((sensor: any) => {
      obj[`${sensor.room}Temperature`] = sensor.connected ? sensor.temperature : undefined;
    });

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
