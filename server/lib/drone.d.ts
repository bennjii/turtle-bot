import WebSocket from "ws";
import { DroneFleet } from "./drone_fleet";
export declare class Drone {
    drone_id: string;
    drone_name: string;
    ws: WebSocket;
    parent: DroneFleet;
    constructor(drone_id: string, drone_name: string, socket: WebSocket, parent: DroneFleet);
    execute(string: string): void;
}
