import EventEmitter from 'events';
import { JsonDB } from 'node-json-db';
import WebSocket from 'ws';
import { Drone } from './drone'

export class DroneFleet extends EventEmitter {
    fleet_id: string;
    fleet_name: string;
    drones: Drone[] = [];
    map: JsonDB;

    constructor(fleet_id: string, fleet_name: string) {
        super();
        this.fleet_id = fleet_id;
        this.fleet_name = fleet_name;
        this.map = new JsonDB(`${fleet_name}.json`);
    }

    addDrone(droneData: Partial<Drone>, ws: WebSocket) {
        console.log(`[CREATE] drone.${droneData.drone_id} (${droneData.drone_name})`);
        const drone = new Drone({
            ...droneData
        }, ws, this);

        drone.on('init', () => {
            console.log(`Drone Initialised`)
        });

        drone.on('update', () => {
            this.emit('update', drone.drone_id);
        });

        return this.drones.push(drone)
    }

    getDrone(drone_id: string) {
        return this.drones.find(drone => drone.drone_id == drone_id)
    }

    removeDrone(drone_id: string) {
        console.log(`[DELETE] drone.${drone_id} (${this.getDrone(drone_id)?.drone_name})`);
        return this.drones = this.drones.filter(e => e.drone_id !== drone_id);
    }

    updateBlock(x: number, y: number, z: number, block: any) {
        let dataPath = `/world/${x},${y},${z}`;
		if (block === 'No block to inspect') {
			if (this.map.exists(dataPath)) {
				this.map.delete(dataPath);
				this.emit('update');
			}

			return;
		}

		this.map.push(dataPath, block);
		this.emit('update');
    }

    getBlock(x: number, y: number, z: number) {
        return this.map.getData(`/world/${x},${y},${z}`);
    }

    getAllBlocks(): { [index: string]: any } {
		return this.map.getData('/world');
	}
}