import mqtt from "mqtt";
import chalk from "chalk";

// console.clear();
let client = mqtt.connect("mqtt://mqtt.kavanet.io");
// let intClient = mqtt.connect("mqtt://mosquitto"); // Docker
let intClient = mqtt.connect("mqtt://localhost");

client.subscribe("#", (err) => {
  // err ? console.log(err) : console.log("Subscribed to all \t", chalk.cyan("MQTT messages will appear shortly"));
  let x = err;
  console.log("Subscribed to all");
});

var sensors: any = {
  livingRoom: { temperature: 0, humidity: 0 },
  kitchen: { temperature: 0, humidity: 0 },
  liamsRoom: { temperature: 0, humidity: 0 },
  study: { temperature: 0, humidity: 0 },
  ourRoom: { temperature: 0, humidity: 0 },
};

// var tempOffsets: any;
let tempOffsets: any = {
  "Living Room": -0.5,
  Kitchen: 0,
  "Liams Room": 0.2,
  Study: -7.6,
  "Our Room": 1.9,
};

let valves: any = {
  livingRoom: false,
  kitchen: false,
  liamsRoom: false,
  study: false,
  ourRoom: false,
};

client.on("message", (topic, payload) => {
  try {
    if (topic == "Room Offsets") {
      tempOffsets = JSON.parse(payload.toString());
    }

    if (topic.includes("Sensor")) {
      let message = JSON.parse(payload.toString());

      if (message.node.includes("Living Room")) {
        sensors.livingRoom.temperature = (message.temperature + tempOffsets["Living Room"]).toFixed(2) * 1;
        sensors.livingRoom.humidity = message.humidity;
      } else if (message.node.includes("Kitchen")) {
        sensors.kitchen.temperature = (message.temperature + tempOffsets["Kitchen"]).toFixed(2) * 1;
        sensors.kitchen.humidity = message.humidity;
      } else if (message.node.includes("Liams Room")) {
        sensors.liamsRoom.temperature = (message.temperature + tempOffsets["Liams Room"]).toFixed(2) * 1;
        sensors.liamsRoom.humidity = message.humidity;
      } else if (message.node.includes("Study")) {
        sensors.study.temperature = (message.temperature + tempOffsets["Study"]).toFixed(2) * 1;
        sensors.study.humidity = message.humidity;
      } else if (message.node.includes("Our Room")) {
        sensors.ourRoom.temperature = (message.temperature + tempOffsets["Our Room"]).toFixed(2) * 1;
        sensors.ourRoom.humidity = message.humidity;
      }
    } else if (topic.includes("Valve")) {
      let message = JSON.parse(payload.toString());
      if (message.node.includes("Living Room")) {
        valves.livingRoom = message.state;
      } else if (message.node.includes("Liams Room")) {
        valves.liamsRoom = message.state;
      } else if (message.node.includes("Study")) {
        valves.study = message.state;
      } else if (message.node.includes("Our Room")) {
        valves.ourRoom = message.state;
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// Send to grafana
setInterval(() => {
  // console.log("publish");
  intClient.publish("temperatures", JSON.stringify(sensors));
  intClient.publish("valves", JSON.stringify(valves));
}, 5 * 1000);

client.on("connect", () => console.log("Connected to KavaNet MQTT"));
intClient.on("connect", () => console.log("Connected to internal MQTT network"));
