"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const index_1 = require("./components/index");
require("dotenv").config();
// Use environment variables to see if we're running in a cluster
const runningInCluster = process.env.CLUSTER == "cluster" ? true : false; // Kuberneted didnt like this value being boolean so its now "cluster"
// Connect to MQTT networks
let client = mqtt_1.default.connect("mqtt://kavanet.io");
let intClient;
// Connect to a different internal network if we're running on a cluster
if (runningInCluster) {
    intClient = mqtt_1.default.connect("mqtt://mosquitto");
}
else {
    intClient = mqtt_1.default.connect("mqtt://localhost"); // Development
    console.log("Not running in cluster");
}
client.subscribe("#", (error) => {
    if (error)
        console.log(error);
    else
        console.log("Subscribed to all");
});
// Devices
const temperatureSensorInput = new index_1.TemperatureSensor(client);
const radiatorMonitorInput = new index_1.RadiatorMonitor(client);
const radiatorValveInput = new index_1.RadiatorValve(client);
const heatingInput = new index_1.Heating(client);
const weather = new index_1.Weather();
client.on("message", (topic, payload) => {
    try {
        if (topic == "Room Offsets") {
            temperatureSensorInput.updateOffsets(payload);
        }
        else if (topic == "Radiator Monitor") {
            radiatorMonitorInput.handleIncoming(payload);
        }
        else if (topic == "Heating") {
            heatingInput.handleIncoming(payload);
        }
        else if (topic.includes("Sensor")) {
            temperatureSensorInput.handleIncoming(payload);
        }
        else if (topic.includes("Valve")) {
            radiatorValveInput.handleIncoming(payload);
        }
    }
    catch (error) {
        console.log(error);
    }
});
// Send to grafana
setInterval(() => {
    publish();
    // console.log(temperatureSensorInput.getCurrent());
    // intClient.publish("temperatures", temperatureSensorInput.getCurrent());
    // intClient.publish("valves", radiatorValveInput.getCurrent());
    // intClient.publish("heating", heatingInput.getCurrent());
    // intClient.publish("outside", weather.getCurrent());
    // intClient.publish("radiatorMonitor", radiatorMonitorInput.getCurrent());
}, 5 * 1000);
let publish = () => {
    intClient.publish("sensors", temperatureSensorInput.getCurrent());
    intClient.publish("valves", radiatorValveInput.getCurrent());
    intClient.publish("heating", heatingInput.getCurrent());
    intClient.publish("outside", weather.getCurrent());
    intClient.publish("radiatorMonitor", radiatorMonitorInput.getCurrent());
};
publish();
client.on("connect", () => console.log("Connected to KavaNet MQTT"));
intClient.on("connect", () => console.log("Connected to Grafana MQTT network"));
