import { DroneFleet } from './drone_fleet';
export declare class FleetManager {
    io: any;
    fleets: Map<string, DroneFleet>;
    constructor(io: any);
    newDroneFleet(fleet_id: string, fleet_name: string): Map<string, DroneFleet>;
    removeDroneFleet(fleet_id: string): boolean;
    getFleet(fleet_id: string): DroneFleet | undefined;
    getFleetByName(fleet_name: string): void;
    toJSON(): void[];
}
