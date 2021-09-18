"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DroneFleet = void 0;
var drone_1 = require("./drone");
var DroneFleet = /** @class */ (function () {
    function DroneFleet(fleet_id, fleet_name) {
        this.drones = new Map();
        this.fleet_id = fleet_id;
        this.fleet_name = fleet_name;
    }
    DroneFleet.prototype.addDrone = function (drone_id, drone_name, ws) {
        console.log("[CREATE] drone." + drone_id + " (" + drone_name + ")");
        return this.drones.set(drone_id, new drone_1.Drone(drone_id, drone_name, ws, this));
    };
    DroneFleet.prototype.getDrone = function (drone_id) {
        return this.drones.get(drone_id);
    };
    DroneFleet.prototype.removeDrone = function (drone_id) {
        var _a;
        console.log("[DELETE] drone." + drone_id + " (" + ((_a = this.getDrone(drone_id)) === null || _a === void 0 ? void 0 : _a.drone_name) + ")");
        return this.drones.delete(drone_id);
    };
    return DroneFleet;
}());
exports.DroneFleet = DroneFleet;
