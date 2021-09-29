import mqtt from "mqtt";
import { Sensors, TimerType, TemperatureOffsets, Valves, Heating } from "./types";
const request = require("request");
require("dotenv").config();

const runningInCluster: boolean = process.env.CLUSTER == "cluster" ? true : false; // Kuberneted didnt like this value being boolean so its now "cluster"

let client: mqtt.MqttClient = mqtt.connect("mqtt://kavanet.io");
let intClient: mqtt.MqttClient;

if (runningInCluster) {
  intClient = mqtt.connect("mqtt://mosquitto");
} else {
  intClient = mqtt.connect("mqtt://localhost"); // Development
  console.log("Not running in cluster");
}

client.subscribe("#", (err: any) => {
  // err ? console.log(err) : console.log("Subscribed to all \t", chalk.cyan("MQTT messages will appear shortly"));
  let x = err;
  console.log("Subscribed to all");
});

var weather: any = {
  current: undefined,
};

const getCurrent = () => {
  request(
    "https://api.openweathermap.org/data/2.5/weather?q=Sheffield&APPID=85c05ad811ead4d20eac5bb0e1ce640d&units=metric",
    (error: any, response: any, body: string) => {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        weather.current = data.main.temp;
        console.log(data.main.temp);
      }
    },
  );
};

setInterval(() => {
  getCurrent();
}, 5 * 1000);

getCurrent();

var sensors: Sensors = {
  livingRoom: { temperature: undefined, humidity: undefined },
  kitchen: { temperature: undefined, humidity: undefined },
  liamsRoom: { temperature: undefined, humidity: undefined },
  study: { temperature: undefined, humidity: undefined },
  ourRoom: { temperature: undefined, humidity: undefined },
};

var heating: Heating = {
  heatingState: undefined,
};

var valves: Valves = {
  livingRoom: { state: 0 }, // not having the humidity breaks things
  // kitchen: { state: 0 }, // think it may be something with the software
  liamsRoom: { state: 0 }, // not liking a non number datapoint on its own
  study: { state: 0 },
  ourRoom: { state: 0 },
};

let tempOffsets: TemperatureOffsets = {
  "Living Room": -0.5,
  Kitchen: 0,
  "Liams Room": 0.2,
  Study: -7.6,
  "Our Room": 1.9,
};

client.on("message", (topic: string, payload: object) => {
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
      } else if (message.node.includes("Liams Room")) {
        valves.liamsRoom.state = message.state;
      } else if (message.node.includes("Study")) {
        valves.study.state = message.state;
      } else if (message.node.includes("Our Room")) {
        valves.ourRoom.state = message.state;
      }
    }
  } catch (error) {
    console.log(error);
  }
});

/*
  Each room has a timer that will set its sensor values to -1
  if the sensor hasnt sent out a ping within the last 10 seconds
  Hacky way to do this but it works well enough
*/
let livingRoomTimer: TimerType;
let kitchenTimer: TimerType;
let liamsRoomTimer: TimerType;
let studyTimer: TimerType;
let ourRoomTimer: TimerType;

let dealWithSensors = (payload: any, sensors: any) => {
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
  } else if (message.node.includes("Kitchen")) {
    clearTimeout(kitchenTimer);
    kitchenTimer = setTimeout(() => {
      sensors.kitchen.temperature = undefined;
      sensors.kitchen.humidity = undefined;
    }, 10 * 1000);
    sensors.kitchen.temperature = (message.temperature + tempOffsets["Kitchen"]).toFixed(2) * 1;
    sensors.kitchen.humidity = message.humidity;
  } else if (message.node.includes("Liams Room")) {
    clearTimeout(liamsRoomTimer);
    liamsRoomTimer = setTimeout(() => {
      sensors.liamsRoom.temperature = undefined;
      sensors.liamsRoom.humidity = undefined;
    }, 10 * 1000);
    sensors.liamsRoom.temperature = (message.temperature + tempOffsets["Liams Room"]).toFixed(2) * 1;
    sensors.liamsRoom.humidity = message.humidity;
  } else if (message.node.includes("Study")) {
    clearTimeout(studyTimer);
    studyTimer = setTimeout(() => {
      sensors.study.temperature = undefined;
      sensors.study.humidity = undefined;
    }, 10 * 1000);
    sensors.study.temperature = (message.temperature + tempOffsets["Study"]).toFixed(2) * 1;
    sensors.study.humidity = message.humidity;
  } else if (message.node.includes("Our Room")) {
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
