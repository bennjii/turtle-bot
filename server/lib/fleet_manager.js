"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
        var filtered = __spreadArray([], __read(this.fleets), false).filter(function (_a) {
            var _b = __read(_a, 2), __ = _b[0], v = _b[1];
            return v.fleet_name == fleet_name;
        });
        return filtered[0][1];
    };
    FleetManager.prototype.toJSON = function () {
        return [this.fleets.forEach(function (fleet) { [fleet.drones.forEach(function (drone) { return drone; })]; })];
    };
    return FleetManager;
}());
exports.FleetManager = FleetManager;
