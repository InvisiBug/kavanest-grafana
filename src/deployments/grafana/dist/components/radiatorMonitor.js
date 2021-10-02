"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RadiatorMonitor {
    constructor(client) {
        this.inlet = 0;
        this.outlet = 0;
        this.client = client;
    }
    handleIncoming(payload) {
        this.inlet = parseFloat((JSON.parse(payload.toString()).inlet - 0.56).toFixed(2));
        this.outlet = parseFloat((JSON.parse(payload.toString()).outlet - 0).toFixed(2));
    }
    getCurrent() {
        return JSON.stringify({
            radiatorInlet: this.inlet,
            radiatorOutlet: this.outlet,
        });
    }
}
exports.default = RadiatorMonitor;
