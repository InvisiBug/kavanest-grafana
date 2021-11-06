import mqtt from "mqtt";
import { RadiatorMonitor, TemperatureSensors, Heating, Weather, RadiatorValves } from "./components/index";
require("dotenv").config();

// Connect to MQTT networks
let client: mqtt.MqttClient = mqtt.connect("mqtt://kavanet.io");
let intClient: mqtt.MqttClient;

// Use environment variables to see if we're running in a cluster
const runningInCluster: boolean = process.env.CLUSTER == "cluster" ? true : false; // Kuberneted didnt like this value being boolean so its now "cluster"

// Connect to a different internal network if we're running on a cluster
if (runningInCluster) {
  intClient = mqtt.connect("mqtt://mosquitto");
} else {
  intClient = mqtt.connect("mqtt://localhost"); // Development
  console.log("Running on a laptop 💻");
}

client.subscribe("#", (error: Error) => {
  if (error) console.log(error);
  else console.log("Subscribed to all");
});

// Devices
let devices: Array<PossibleDevices> = [];

devices.push(new Heating(client));
devices.push(new RadiatorValves(client));
devices.push(new RadiatorMonitor(client));
devices.push(new TemperatureSensors(client));
devices.push(new Weather());

//? Incoming message
client.on("message", (topic: string, payload: object) => {
  try {
    for (let i = 0; i < devices.length; i++) {
      devices[i].handleIncoming(topic, payload);
    }
  } catch (error: unknown) {
    console.log(error);
  }
});

//? Send to grafana
setInterval(() => {
  publish();
}, 5 * 1000);

let publish = () => {
  for (let i = 0; i < devices.length; i++) {
    intClient.publish(devices[i].topic, devices[i].getCurrent());
  }
};

publish();

client.on("connect", () => console.log("Connected to KavaNet MQTT"));
intClient.on("connect", () => console.log("Connected to Grafana MQTT network"));

type PossibleDevices = RadiatorMonitor | TemperatureSensors | Weather | Heating | RadiatorValves;
