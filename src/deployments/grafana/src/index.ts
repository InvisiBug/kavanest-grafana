import mqtt from "mqtt";
import { RadiatorMonitor, TemperatureSensor, Heating, Weather, RadiatorValve } from "./components/index";
require("dotenv").config();

// Use environment variables to see if we're running in a cluster
const runningInCluster: boolean = process.env.CLUSTER == "cluster" ? true : false; // Kuberneted didnt like this value being boolean so its now "cluster"

// Connect to MQTT networks
let client: mqtt.MqttClient = mqtt.connect("mqtt://kavanet.io");
let intClient: mqtt.MqttClient;

// Connect to a different internal network if we're running on a cluster
if (runningInCluster) {
  intClient = mqtt.connect("mqtt://mosquitto");
} else {
  intClient = mqtt.connect("mqtt://localhost"); // Development
  console.log("Not running in cluster");
}

client.subscribe("#", (error: Error) => {
  if (error) console.log(error);
  else console.log("Subscribed to all");
});

// Devices
let devices: Array<Heating> = [];
const temperatureSensorInput: TemperatureSensor = new TemperatureSensor(client);
const radiatorMonitorInput: RadiatorMonitor = new RadiatorMonitor(client);
const radiatorValveInput: RadiatorValve = new RadiatorValve(client);
// const heatingInput: Heating = new Heating(client);
devices.push(new Heating(client));
const weather: Weather = new Weather();

client.on("message", (topic: string, payload: object) => {
  try {
    console.log(devices.length);
    for (let i = 0; i < devices.length; i++) {
      devices[i].handleIncoming(topic, payload);
    }
    // heatingInput.handleIncoming(topic, payload);
    if (topic == "Room Offsets") {
      temperatureSensorInput.updateOffsets(payload);
    } else if (topic == "Radiator Monitor") {
      radiatorMonitorInput.handleIncoming(payload);
    } else if (topic.includes("Sensor")) {
      temperatureSensorInput.handleIncoming(payload);
    } else if (topic.includes("Valve")) {
      radiatorValveInput.handleIncoming(payload);
    }
  } catch (error: unknown) {
    console.log(error);
  }
});

// Send to grafana
setInterval(() => {
  publish();
}, 5 * 1000);

let publish = () => {
  intClient.publish("sensors", temperatureSensorInput.getCurrent());
  intClient.publish("valves", radiatorValveInput.getCurrent());
  // intClient.publish("heating", heatingInput.getCurrent());
  intClient.publish("outside", weather.getCurrent());
  intClient.publish("radiatorMonitor", radiatorMonitorInput.getCurrent());
};

publish();

client.on("connect", () => console.log("Connected to KavaNet MQTT"));
intClient.on("connect", () => console.log("Connected to Grafana MQTT network"));
