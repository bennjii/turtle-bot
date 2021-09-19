"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DroneFleet = void 0;
var drone_1 = require("./drone");
var DroneFleet = /** @class */ (function () {
    function DroneFleet(fleet_id, fleet_name) {
        this.drones = [];
        this.fleet_id = fleet_id;
        this.fleet_name = fleet_name;
    }
    DroneFleet.prototype.addDrone = function (droneData, ws) {
        console.log("[CREATE] drone." + droneData.drone_id + " (" + droneData.drone_name + ")");
        var drone = new drone_1.Drone(__assign(__assign({}, droneData), { ws: ws }), this);
        drone.on('init', function () {
            //...
            console.log("Drone Initialised");
        });
        return this.drones.push(drone);
    };
    DroneFleet.prototype.getDrone = function (drone_id) {
        return this.drones.find(function (drone) { return drone.drone_id == drone_id; });
    };
    DroneFleet.prototype.removeDrone = function (drone_id) {
        var _a;
        console.log("[DELETE] drone." + drone_id + " (" + ((_a = this.getDrone(drone_id)) === null || _a === void 0 ? void 0 : _a.drone_name) + ")");
        return this.drones = this.drones.filter(function (e) { return e.drone_id !== drone_id; });
    };
    return DroneFleet;
}());
exports.DroneFleet = DroneFleet;
