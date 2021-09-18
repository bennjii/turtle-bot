import WebSocket from "ws";
import { DroneFleet } from "./drone_fleet";

export class Drone {
    drone_id: string;
    drone_name: string;
    ws: any;
    parent: DroneFleet;

    constructor(drone_id: string, drone_name: string, socket: WebSocket, parent: DroneFleet) {
        this.drone_id = drone_id;
        this.ws = socket;
        this.drone_name = drone_name;
        this.parent = parent;

        this.ws?.on('message', (data: string) => {
            const parsed: DroneUpdate = JSON.parse(data);

            if(parsed.type == "delete") {
                parent.removeDrone(parsed.data.drone_id);
            }
        });
    }

    execute(string: string) {
        this.ws.send(JSON.stringify({
            type: "eval",
            function: `return + ${string}`
        }));
    }
}