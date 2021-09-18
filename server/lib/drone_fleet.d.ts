import { Drone } from './drone';
export declare class DroneFleet {
    fleet_id: string;
    fleet_name: string;
    drones: Map<string, Drone>;
    constructor(fleet_id: string, fleet_name: string);
    addDrone(drone_id: string, drone_name: string, ws: any): Map<string, Drone>;
    getDrone(drone_id: string): Drone | undefined;
    removeDrone(drone_id: string): boolean;
}
