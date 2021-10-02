"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TemperatureSensor {
    constructor(client) {
        this.inlet = 0;
        this.outlet = 0;
        this.livingRoom = new sensor("Living Room");
        this.kitchen = new sensor("Kitchen");
        this.liamsRoom = new sensor("Liams Room");
        this.study = new sensor("Study");
        this.ourRoom = new sensor("Our Room");
        this.client = client;
    }
    handleIncoming(payload) {
        this.livingRoom.handleIncoming(payload);
        this.kitchen.handleIncoming(payload);
        this.liamsRoom.handleIncoming(payload);
        this.study.handleIncoming(payload);
        this.ourRoom.handleIncoming(payload);
    }
    updateOffsets(payload) {
        const newOffsets = JSON.parse(payload.toString());
        this.livingRoom.updateOffset(newOffsets);
        this.kitchen.updateOffset(newOffsets);
        this.liamsRoom.updateOffset(newOffsets);
        this.study.updateOffset(newOffsets);
        this.ourRoom.updateOffset(newOffsets);
    }
    getCurrent() {
        return JSON.stringify({
            livingRoomTemperature: this.livingRoom.getTemp(),
            livingRoomHumidity: this.livingRoom.getHumidity(),
            kitchenTemperature: this.kitchen.getTemp(),
            kitchenHumidity: this.kitchen.getHumidity(),
            liamsRoomTemperature: this.liamsRoom.getTemp(),
            liamsRoomHumidity: this.liamsRoom.getHumidity(),
            studyTemperature: this.study.getTemp(),
            studyHumidity: this.study.getHumidity(),
            ourRoomTemperature: this.ourRoom.getTemp(),
            ourRoomHumidity: this.ourRoom.getHumidity(),
        });
    }
}
exports.default = TemperatureSensor;
class sensor {
    constructor(id) {
        this.temperature = undefined;
        this.humidity = undefined;
        this.pressure = undefined;
        this.offset = 0;
        this.id = "";
        this.id = id;
    }
    handleIncoming(payload) {
        let message = JSON.parse(payload.toString());
        if (message.node.includes(this.id)) {
            this.temperature = parseFloat((message.temperature + this.offset).toFixed(2));
            this.humidity = parseFloat(message.humidity.toFixed(2));
            this.pressure = parseFloat(message.pressure.toFixed(2));
        }
    }
    updateOffset(newOffset) {
        this.offset = newOffset[this.id];
    }
    getCurrent() {
        return {
            temperature: this.temperature,
            pressure: this.pressure,
            humidity: this.humidity,
        };
    }
    getTemp() {
        return this.temperature;
    }
    getHumidity() {
        return this.humidity;
    }
    getPressure() {
        return this.pressure;
    }
}
