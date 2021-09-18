import { Drone } from './drone';
import { DroneFleet } from './drone_fleet'

export class FleetManager {
    io;
    fleets = new Map<string, DroneFleet>();

    constructor(io: any) {
        this.io = io;
    }

    newDroneFleet(fleet_id: string, fleet_name: string) {
        console.log(`[CREATE] fleet.${fleet_id} (${fleet_name})`);
        return this.fleets.set(fleet_id, new DroneFleet(fleet_id, fleet_name));
    }

    removeDroneFleet(fleet_id: string) {
        console.log(`[DELETE] fleet.${fleet_id} (${this.getFleet(fleet_id)?.fleet_name}})`);
        return this.fleets.delete(fleet_id);
    }

    getFleet(fleet_id: string) {
        return this.fleets.get(fleet_id)
    }

    getFleetByName(fleet_name: string) {
        return this.fleets.forEach(e => e.fleet_name == fleet_name)
    }

    toJSON() {
        return this.fleets.forEach((fleet: DroneFleet) => { fleet.drones.forEach((drone: Drone) => drone) })
    }
}