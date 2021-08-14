import mqtt from "mqtt";
import chalk from "chalk";

// console.clear();
let client = mqtt.connect("mqtt://mqtt.kavanet.io");
// let intClient = mqtt.connect("mqtt://Grafana-Interconnector-Mosquitto");
// let intClient = mqtt.connect("mqtt://mosquitto"); // Docker
let intClient = mqtt.connect("mqtt://localhost");

client.subscribe("#", (err) => {
  err ? console.log(err) : console.log("Subscribed to all \t", chalk.cyan("MQTT messages will appear shortly"));
});

var sensors: any = {
  livingRoom: { temperature: 20, humidity: 20 },
  kitchen: { temperature: 20, humidity: 20 },
  liamsRoom: { temperature: 20, humidity: 20 },
  study: { temperature: 20, humidity: 20 },
  ourRoom: { temperature: 20, humidity: 20 },
};

var tempOffsets;

client.on("message", (topic, payload) => {
  // if (_ === "Radiator Fan" || _ === "Radiator Fan Control") {
  // console.log(chalk.white(_) + chalk.cyan(" \t" + payload));
  // }

  if (topic == "Room Offsets") {
    tempOffsets = JSON.parse(payload.toString());
    // console.log(chalk.yellow(payload.toString()));
    console.log(tempOffsets);
  }
  let x = payload;
  // console.log(chalk.yellow(payload.toString()));
  // intClient.publish("node", "Hello");
  // client.publish("boo", "also Boo");
});

setInterval(() => {
  console.log("publish");
  intClient.publish("node", JSON.stringify(sensors));
}, 5 * 1000);

// client.on("connect", () => console.log("Simulator Connected"));
// intClient.on("connect", () => console.log("Simulator Connected"));
