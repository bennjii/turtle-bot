import { count } from "console";
import { randomBytes } from "crypto";
import EventEmitter from "events";
import { DroneUpdate } from "./@types/drone_types";

// export enum BlockDirection { FORWARD, UP, DOWN }
export enum Direction { NORTH, EAST, SOUTH, WEST }
// export enum Side { LEFT, RIGHT }

type MovementDirection = "forward" | "back" | "up" | "down";
type TurnDirection = "left" | "right";
type BlockDirection = "forward" | "up" | "down";

const nonces = new Set();
function getNonce(): string {
	let nonce = '';
	while (nonce === '' || nonces.has(nonce)) {
		nonce = randomBytes(4).toString('hex');
	}
	nonces.add(nonce);
	return nonce;
}

export interface Slot {
	count: number;
	name: string;
	damage: number;
}
export class Drone extends EventEmitter {
    drone_id: string;
    drone_name: string;

    ws: WebSocket;

    x: number;
    y: number;
    z: number;
    d: Direction;

    inventory: Slot[];
    selected_slot: number;

    fuel: number;
    max_fuel: number;

    online: boolean;

    constructor(json: any, ws: WebSocket) {
        super();

        this.ws = ws;
        this.fuel = json.fuel;
        this.max_fuel = json.max_fuel;
        this.drone_id = json.drone_id;
        this.inventory = json.inventory;
        this.drone_name = json.drone_name;
        this.selected_slot = json.selected_slot;
        this.online = json.online;
    }

    execute<T>(string: string): Promise<T> {
        // Calll server
        return new Promise(r => {
            return r;
        })  
    }

    toJSON() {
        return {
            drone_id: this.drone_id,
            drone_name: this.drone_name,

			inventory: this.inventory,
			selected_slot: this.selected_slot,

			fuel: this.fuel,
			max_fuel: this.max_fuel,
        }
    }

    async move(direction: MovementDirection) {
        
    }

    async turn(direction: TurnDirection) {
        
    }

    async dig(direction: BlockDirection) {
		
	}

    async refuel(ammount?: number) {
		
	}

    async refresh() {
		
	}
}