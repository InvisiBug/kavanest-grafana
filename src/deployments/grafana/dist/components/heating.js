"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Heating {
    constructor(client) {
        this.state = 0;
        this.client = client;
    }
    handleIncoming(payload) {
        let message = JSON.parse(payload.toString());
        this.state = message.state ? 1 : 0;
    }
    getCurrent() {
        return JSON.stringify({
            heating: this.state,
        });
    }
}
exports.default = Heating;
