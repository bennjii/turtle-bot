import { Drone } from './drone'

export class DroneFleet {
    fleet_id: string;
    fleet_name: string;
    drones: Drone[] = [];

    constructor(fleet_id: string, fleet_name: string) {
        this.fleet_id = fleet_id;
        this.fleet_name = fleet_name;
    }

    addDrone(droneData: Partial<Drone>, ws: any) {
        console.log(`[CREATE] drone.${droneData.drone_id} (${droneData.drone_name})`);
        const drone = new Drone({
            ...droneData,
            ws: ws
        }, this);

        drone.on('init', () => {
            //...
            console.log(`Drone Initialised`)
        })

        return this.drones.push(drone)
    }

    getDrone(drone_id: string) {
        return this.drones.find(drone => drone.drone_id == drone_id)
    }

    removeDrone(drone_id: string) {
        console.log(`[DELETE] drone.${drone_id} (${this.getDrone(drone_id)?.drone_name})`);
        return this.drones = this.drones.filter(e => e.drone_id !== drone_id);
    }
}