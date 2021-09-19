import { Server as SocketIO } from 'socket.io';
import EventEmitter from 'events';
import WebSocket from 'ws';
import { Drone } from './drone'

export class DroneFleet extends EventEmitter {
    fleet_id: string;
    fleet_name: string;
    drones: Drone[] = [];
    web: SocketIO;

    constructor(fleet_id: string, fleet_name: string, web: SocketIO) {
        super();
        this.fleet_id = fleet_id;
        this.fleet_name = fleet_name;
        this.web = web;
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
            this.emit('update');

            this.web.sockets.in(drone.drone_id).emit('message', {
                type: "update",
                data: drone
            });
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
}