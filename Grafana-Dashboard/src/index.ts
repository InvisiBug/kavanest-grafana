import mqtt from "mqtt";
import chalk from "chalk";

// console.clear();
let client = mqtt.connect("mqtt://mqtt.kavanet.io");
let intClient = mqtt.connect("mqtt://mosquitto"); // Docker
// let intClient = mqtt.connect("mqtt://localhost"); // Development

client.subscribe("#", (err) => {
  // err ? console.log(err) : console.log("Subscribed to all \t", chalk.cyan("MQTT messages will appear shortly"));
  let x = err;
  console.log("Subscribed to all");
});

var sensors: any = {
  livingRoom: { temperature: undefined, humidity: undefined },
  kitchen: { temperature: undefined, humidity: undefined },
  liamsRoom: { temperature: undefined, humidity: undefined },
  study: { temperature: undefined, humidity: undefined },
  ourRoom: { temperature: undefined, humidity: undefined },
};

var valves: any = {
  livingRoom: { state: 0 }, // not having the humidity breaks things
  // kitchen: { state: 0 }, // think it may be something with the software
  liamsRoom: { state: 0 }, // not liking a non number datapoint on its own
  study: { state: 0 },
  ourRoom: { state: 0 },
};

let tempOffsets: any = {
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

// Send to grafana
setInterval(() => {
  publish();
}, 5 * 1000);

let publish = () => {
  intClient.publish("temperatures", JSON.stringify(sensors));
  intClient.publish("valves", JSON.stringify(valves));

  // console.log(JSON.stringify(valves));
};

publish();

client.on("connect", () => console.log("Connected to KavaNet MQTT"));
intClient.on("connect", () => console.log("Connected to internal MQTT network"));
