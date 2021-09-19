"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetManager = void 0;
// import { Drone } from './drone';
var drone_fleet_1 = require("./drone_fleet");
var FleetManager = /** @class */ (function () {
    function FleetManager(io) {
        this.fleets = [];
        this.io = io;
    }
    FleetManager.prototype.newDroneFleet = function (fleet_id, fleet_name) {
        console.log("[CREATE] fleet." + fleet_id + " (" + fleet_name + ")");
        return this.fleets.push(new drone_fleet_1.DroneFleet(fleet_id, fleet_name));
    };
    FleetManager.prototype.removeDroneFleet = function (fleet_id) {
        var _a;
        console.log("[DELETE] fleet." + fleet_id + " (" + ((_a = this.getFleet(fleet_id)) === null || _a === void 0 ? void 0 : _a.fleet_name) + "})");
        return this.fleets = this.fleets.filter(function (e) { return e.fleet_id !== fleet_id; });
    };
    FleetManager.prototype.getFleet = function (fleet_id) {
        return this.fleets.find(function (fleet) { return fleet.fleet_id == fleet_id; });
    };
    FleetManager.prototype.getFleetByName = function (fleet_name) {
        return this.fleets.find(function (fleet) { return fleet.fleet_name == fleet_name; });
        // const filtered = ([...this.fleets].filter(([__, v]) => v.fleet_name == fleet_name))[0][1]
        // filtered.drones = [...filtered.drones]
        // return filtered;
    };
    FleetManager.prototype.toJSON = function () {
        return this;
        // return [this.fleets.forEach((fleet: DroneFleet) => { [fleet.drones.forEach((drone: Drone) => drone)] })]
    };
    return FleetManager;
}());
exports.FleetManager = FleetManager;
