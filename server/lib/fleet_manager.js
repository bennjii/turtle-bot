"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetManager = void 0;
var drone_fleet_1 = require("./drone_fleet");
var FleetManager = /** @class */ (function () {
    function FleetManager(io) {
        this.fleets = new Map();
        this.io = io;
    }
    FleetManager.prototype.newDroneFleet = function (fleet_id, fleet_name) {
        console.log("[CREATE] fleet." + fleet_id + " (" + fleet_name + ")");
        return this.fleets.set(fleet_id, new drone_fleet_1.DroneFleet(fleet_id, fleet_name));
    };
    FleetManager.prototype.removeDroneFleet = function (fleet_id) {
        var _a;
        console.log("[DELETE] fleet." + fleet_id + " (" + ((_a = this.getFleet(fleet_id)) === null || _a === void 0 ? void 0 : _a.fleet_name) + "})");
        return this.fleets.delete(fleet_id);
    };
    FleetManager.prototype.getFleet = function (fleet_id) {
        return this.fleets.get(fleet_id);
    };
    FleetManager.prototype.getFleetByName = function (fleet_name) {
        return this.fleets.forEach(function (e) { return e.fleet_name == fleet_name; });
    };
    FleetManager.prototype.toJSON = function () {
        return [this.fleets.forEach(function (fleet) { [fleet.drones.forEach(function (drone) { return drone; })]; })];
    };
    return FleetManager;
}());
exports.FleetManager = FleetManager;
