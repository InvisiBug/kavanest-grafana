"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Valves {
    constructor(client) {
        this.inlet = 0;
        this.outlet = 0;
        this.livingRoom = 0;
        this.liamsRoom = 0;
        this.study = 0;
        this.ourRoom = 0;
        this.client = client;
    }
    handleIncoming(payload) {
        let message = JSON.parse(payload.toString());
        message.state = message.state ? 1 : 0; // Map the true / false state to a 1 / 0
        if (message.node.includes("Living Room")) {
            this.livingRoom = message.state;
        }
        else if (message.node.includes("Liams Room")) {
            this.liamsRoom = message.state;
        }
        else if (message.node.includes("Study")) {
            this.study = message.state;
        }
        else if (message.node.includes("Our Room")) {
            this.ourRoom = message.state;
        }
    }
    getCurrent() {
        return JSON.stringify({
            livingRoomValve: this.livingRoom,
            liamsRoomValve: this.liamsRoom,
            studyValve: this.study,
            ourRoomValve: this.ourRoom,
        });
    }
}
exports.default = Valves;
