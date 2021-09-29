"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const request = require("request");
require("dotenv").config();
const runningInCluster = process.env.CLUSTER == "cluster" ? true : false;
let client = mqtt_1.default.connect("mqtt://kavanet.io");
let intClient;
if (runningInCluster) {
    intClient = mqtt_1.default.connect("mqtt://mosquitto");
}
else {
    intClient = mqtt_1.default.connect("mqtt://localhost"); // Development
    console.log("Not running in cluster");
}
client.subscribe("#", (err) => {
    // err ? console.log(err) : console.log("Subscribed to all \t", chalk.cyan("MQTT messages will appear shortly"));
    let x = err;
    console.log("Subscribed to all");
});
var weather = {
    current: undefined,
};
const getCurrent = () => {
    request("https://api.openweathermap.org/data/2.5/weather?q=Sheffield&APPID=85c05ad811ead4d20eac5bb0e1ce640d&units=metric", (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            weather.current = data.main.temp;
            console.log(data.main.temp);
        }
    });
};
setInterval(() => {
    getCurrent();
}, 5 * 1000);
getCurrent();
var sensors = {
    livingRoom: { temperature: undefined, humidity: undefined },
    kitchen: { temperature: undefined, humidity: undefined },
    liamsRoom: { temperature: undefined, humidity: undefined },
    study: { temperature: undefined, humidity: undefined },
    ourRoom: { temperature: undefined, humidity: undefined },
};
var heating = {
    heatingState: undefined,
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
        }
        if (topic.includes("Sensor")) {
            dealWithSensors(payload, sensors);
        }
        if (topic.includes("Valve")) {
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
            sensors.livingRoom.temperature = undefined;
            sensors.livingRoom.humidity = undefined;
        }, 10 * 1000);
        sensors.livingRoom.temperature = (message.temperature + tempOffsets["Living Room"]).toFixed(2) * 1;
        sensors.livingRoom.humidity = message.humidity;
        // console.log(sensors.livingRoom.temperature);
    }
    else if (message.node.includes("Kitchen")) {
        clearTimeout(kitchenTimer);
        kitchenTimer = setTimeout(() => {
            sensors.kitchen.temperature = undefined;
            sensors.kitchen.humidity = undefined;
        }, 10 * 1000);
        sensors.kitchen.temperature = (message.temperature + tempOffsets["Kitchen"]).toFixed(2) * 1;
        sensors.kitchen.humidity = message.humidity;
    }
    else if (message.node.includes("Liams Room")) {
        clearTimeout(liamsRoomTimer);
        liamsRoomTimer = setTimeout(() => {
            sensors.liamsRoom.temperature = undefined;
            sensors.liamsRoom.humidity = undefined;
        }, 10 * 1000);
        sensors.liamsRoom.temperature = (message.temperature + tempOffsets["Liams Room"]).toFixed(2) * 1;
        sensors.liamsRoom.humidity = message.humidity;
    }
    else if (message.node.includes("Study")) {
        clearTimeout(studyTimer);
        studyTimer = setTimeout(() => {
            sensors.study.temperature = undefined;
            sensors.study.humidity = undefined;
        }, 10 * 1000);
        sensors.study.temperature = (message.temperature + tempOffsets["Study"]).toFixed(2) * 1;
        sensors.study.humidity = message.humidity;
    }
    else if (message.node.includes("Our Room")) {
        clearTimeout(ourRoomTimer);
        ourRoomTimer = setTimeout(() => {
            sensors.ourRoom.temperature = undefined;
            sensors.ourRoom.humidity = undefined;
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
    intClient.publish("outside", JSON.stringify(weather));
};
publish();
client.on("connect", () => console.log("Connected to KavaNet MQTT"));
intClient.on("connect", () => console.log("Connected to internal MQTT network"));
