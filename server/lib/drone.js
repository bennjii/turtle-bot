"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drone = void 0;
var Drone = /** @class */ (function () {
    function Drone(drone_id, drone_name, socket, parent) {
        this.drone_id = drone_id;
        this.ws = socket;
        this.drone_name = drone_name;
        this.parent = parent;
        this.ws.on('message', function (data) {
            var parsed = JSON.parse(data);
            if (parsed.type == "delete") {
                parent.removeDrone(parsed.data.drone_id);
            }
        });
    }
    Drone.prototype.execute = function (string) {
        this.ws.send(JSON.stringify({
            type: "eval",
            function: "return + " + string
        }));
    };
    return Drone;
}());
exports.Drone = Drone;
