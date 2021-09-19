import { Drone } from './drone'

export class DroneFleet {
    fleet_id: string;
    fleet_name: string;
    drones: Drone[] = [];

    constructor(fleet_id: string, fleet_name: string) {
        this.fleet_id = fleet_id;
        this.fleet_name = fleet_name;
    }

    addDrone(drone_id: string, drone_name: string, ws: any) {
        console.log(`[CREATE] drone.${drone_id} (${drone_name})`);
        return this.drones.push(new Drone(drone_id, drone_name, ws, this))
    }

    getDrone(drone_id: string) {
        return this.drones.find(drone => drone.drone_id == drone_id)
    }

    removeDrone(drone_id: string) {
        console.log(`[DELETE] drone.${drone_id} (${this.getDrone(drone_id)?.drone_name})`);
        return this.drones = this.drones.filter(e => e.drone_id !== drone_id);
    }
}