// import { Drone } from './drone';
import { DroneFleet } from './drone_fleet'

export class FleetManager {
    io;
    fleets: DroneFleet[] = [];

    constructor(io: any) {
        this.io = io;
    }

    newDroneFleet(fleet_id: string, fleet_name: string) {
        console.log(`[CREATE] fleet.${fleet_id} (${fleet_name})`);
        return this.fleets.push(new DroneFleet(fleet_id, fleet_name));
    }

    removeDroneFleet(fleet_id: string) {
        console.log(`[DELETE] fleet.${fleet_id} (${this.getFleet(fleet_id)?.fleet_name}})`);
        return this.fleets = this.fleets.filter(e => e.fleet_id !== fleet_id);
    }

    getFleet(fleet_id: string) {
        return this.fleets.find(fleet => fleet.fleet_id == fleet_id)
    }

    getFleetByName(fleet_name: string) {
        return this.fleets.find(fleet => fleet.fleet_name == fleet_name)
        // const filtered = ([...this.fleets].filter(([__, v]) => v.fleet_name == fleet_name))[0][1]
        // filtered.drones = [...filtered.drones]
    
        // return filtered;
    }

    toJSON() {
        return this;
        // return [this.fleets.forEach((fleet: DroneFleet) => { [fleet.drones.forEach((drone: Drone) => drone)] })]
    }
}