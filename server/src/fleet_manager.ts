// import { Drone } from './drone';
import { Server as SocketIO } from 'socket.io';
import { Server } from 'ws';
import { DroneFleet } from './drone_fleet'

export class FleetManager {
    io: Server;
    web: SocketIO;
    fleets: DroneFleet[] = [];

    constructor(io: Server, web: SocketIO) {
        this.io = io;
        this.web = web;
    }

    newDroneFleet(fleet_id: string, fleet_name: string) {
        console.log(`[CREATE] fleet.${fleet_id} (${fleet_name})`);
        const fleet = new DroneFleet(fleet_id, fleet_name);

        fleet.on('update', (drone_id) => {
            this.web.sockets.in(fleet.fleet_id).emit('message', {
                type: "update",
                data: fleet
            });

            this.web.sockets.in("*").emit('message', {
                type: "update",
                data: fleet
            });

            this.web.sockets.in(drone_id).emit('message', {
                type: "update",
                data: fleet.getDrone(drone_id)
            })
        });

        return this.fleets.push(fleet);
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
    }

    searchForDrone(drone_id: string) {
        let drones = this.fleets.map(e => {
            return e.drones.filter(e => e.drone_id == drone_id)[0];
        });

        return drones.filter(e => e?.drone_id == drone_id)[0];
    }

    toJSON() {
        return this;
    }
}