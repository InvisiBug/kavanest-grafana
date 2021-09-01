"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
// console.clear();
let client = mqtt_1.default.connect("mqtt://kavanet.io");
let intClient = mqtt_1.default.connect("mqtt://mosquitto"); // Docker & Kubernetes
// let intClient = mqtt.connect("mqtt://localhost"); // Development
client.subscribe("#", (err) => {
    // err ? console.log(err) : console.log("Subscribed to all \t", chalk.cyan("MQTT messages will appear shortly"));
    let x = err;
    console.log("Subscribed to all");
});
var sensors = {
    livingRoom: { temperature: undefined, humidity: undefined },
    kitchen: { temperature: undefined, humidity: undefined },
    liamsRoom: { temperature: undefined, humidity: undefined },
    study: { temperature: undefined, humidity: undefined },
    ourRoom: { temperature: undefined, humidity: undefined },
};
var heating = {
    state: undefined,
};
var valves = {
    livingRoom: { state: 0 },
    // kitchen: { state: 0 }, // think it may be something with the software
    liamsRoom: { state: 0 },
    study: { state: 0 },
    ourRoom: { state: 0 },
};
let tempOffsets = {
    "Living Room": -0.5,
    Kitchen: 0,
    "Liams Room": 0.2,
    Study: -7.6,
    "Our Room": 1.9,
};
client.on("message", (topic, payload) => {
    try {
        if (topic == "Room Offsets") {
            tempOffsets = JSON.parse(payload.toString());
        }
        if (topic == "Heating") {
            let message = JSON.parse(payload.toString());
            heating.heatingState = message.state ? 1 : 0;
            // console.log(JSON.parse(payload.toString()).state);
        }
        if (topic.includes("Sensor")) {
            dealWithSensors(payload, sensors);
        }
        else if (topic.includes("Valve")) {
            let message = JSON.parse(payload.toString());
            message.state = message.state ? 1 : 0; // Map the true / false state to a 1 / 0
            if (message.node.includes("Living Room")) {
                valves.livingRoom.state = message.state;
            }
            else if (message.node.includes("Liams Room")) {
                valves.liamsRoom.state = message.state;
            }
            else if (message.node.includes("Study")) {
                valves.study.state = message.state;
            }
            else if (message.node.includes("Our Room")) {
                valves.ourRoom.state = message.state;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
/*
  Each room has a timer that will set its sensor values to -1
  if the sensor hasnt sent out a ping within the last 10 seconds
  Hacky way to do this but it works well enough
*/
let livingRoomTimer;
let kitchenTimer;
let liamsRoomTimer;
let studyTimer;
let ourRoomTimer;
let dealWithSensors = (payload, sensors) => {
    let message = JSON.parse(payload.toString());
    if (message.node.includes("Living Room")) {
        clearTimeout(livingRoomTimer);
        livingRoomTimer = setTimeout(() => {
            sensors.livingRoom.temperature = -1;
            sensors.livingRoom.humidity = -1;
        }, 10 * 1000);
        sensors.livingRoom.temperature = (message.temperature + tempOffsets["Living Room"]).toFixed(2) * 1;
        sensors.livingRoom.humidity = message.humidity;
        // console.log(sensors.livingRoom.temperature);
    }
    else if (message.node.includes("Kitchen")) {
        clearTimeout(kitchenTimer);
        kitchenTimer = setTimeout(() => {
            sensors.kitchen.temperature = -1;
            sensors.kitchen.humidity = -1;
        }, 10 * 1000);
        sensors.kitchen.temperature = (message.temperature + tempOffsets["Kitchen"]).toFixed(2) * 1;
        sensors.kitchen.humidity = message.humidity;
    }
    else if (message.node.includes("Liams Room")) {
        clearTimeout(liamsRoomTimer);
        liamsRoomTimer = setTimeout(() => {
            sensors.liamsRoom.temperature = -1;
            sensors.liamsRoom.humidity = -1;
        }, 10 * 1000);
        sensors.liamsRoom.temperature = (message.temperature + tempOffsets["Liams Room"]).toFixed(2) * 1;
        sensors.liamsRoom.humidity = message.humidity;
    }
    else if (message.node.includes("Study")) {
        clearTimeout(studyTimer);
        studyTimer = setTimeout(() => {
            sensors.study.temperature = -1;
            sensors.study.humidity = -1;
        }, 10 * 1000);
        sensors.study.temperature = (message.temperature + tempOffsets["Study"]).toFixed(2) * 1;
        sensors.study.humidity = message.humidity;
    }
    else if (message.node.includes("Our Room")) {
        clearTimeout(ourRoomTimer);
        ourRoomTimer = setTimeout(() => {
            sensors.ourRoom.temperature = -1;
            sensors.ourRoom.humidity = -1;
        }, 10 * 1000);
        sensors.ourRoom.temperature = (message.temperature + tempOffsets["Our Room"]).toFixed(2) * 1;
        sensors.ourRoom.humidity = message.humidity;
    }
};
// Send to grafana
setInterval(() => {
    publish();
}, 5 * 1000);
let publish = () => {
    intClient.publish("temperatures", JSON.stringify(sensors));
    intClient.publish("valves", JSON.stringify(valves));
    intClient.publish("heating", JSON.stringify(heating));
    // console.log(JSON.stringify(valves));
};
publish();
client.on("connect", () => console.log("Connected to KavaNet MQTT"));
intClient.on("connect", () => console.log("Connected to internal MQTT network"));
