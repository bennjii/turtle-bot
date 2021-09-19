import { Drone } from './drone';
export declare class DroneFleet {
    fleet_id: string;
    fleet_name: string;
    drones: Drone[];
    constructor(fleet_id: string, fleet_name: string);
    addDrone(droneData: Partial<Drone>, ws: any): number;
    getDrone(drone_id: string): Drone | undefined;
    removeDrone(drone_id: string): Drone[];
}
