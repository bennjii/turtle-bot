import { DroneFleet } from './drone_fleet';
export declare class FleetManager {
    io: any;
    fleets: DroneFleet[];
    constructor(io: any);
    newDroneFleet(fleet_id: string, fleet_name: string): number;
    removeDroneFleet(fleet_id: string): DroneFleet[];
    getFleet(fleet_id: string): DroneFleet | undefined;
    getFleetByName(fleet_name: string): DroneFleet | undefined;
    toJSON(): this;
}
