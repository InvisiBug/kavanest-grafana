import { request, gql } from "graphql-request";
import { apiUrl } from "../utils";

export default class Radiators {
  topic: string = "Radiators";
  constructor() {}

  async getRadiators() {
    try {
      const radiators = await request(
        apiUrl,
        gql`
          query GetRadiators {
            response: getRadiators {
              name
              valve
              fan
              temperature
              connected
            }
          }
        `,
      );
      return radiators.response;
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrent() {
    const radiators = await this.getRadiators();

    let obj: any = {};

    radiators.forEach((radiator: any) => {
      const { connected, valve, fan, temperature, name } = radiator;

      obj[`${radiator.name}RadiatorTemperature`] = temperature !== null ? parseFloat(temperature.toFixed(2)) : undefined;
      obj[`${radiator.name}RadiatorFan`] = fan !== null ? (fan ? 1 : 0) : undefined;
      obj[`${radiator.name}RadiatorValve`] = valve !== null ? (valve ? 1 : 0) : undefined;
    });

    return JSON.stringify(obj);
  }

  handleIncoming() {}
}
