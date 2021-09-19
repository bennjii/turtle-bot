import { count } from "console";
import { randomBytes } from "crypto";
import EventEmitter from "events";
import WebSocket from "ws";
import { DroneFleet } from "./drone_fleet";

// export enum BlockDirection { FORWARD, UP, DOWN }
// export enum Direction { NORTH, EAST, SOUTH, WEST }
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

interface Slot {
	count: number;
	name: string;
	damage: number;
}
export class Drone extends EventEmitter {
    drone_id: string;
    drone_name: string;

    ws: WebSocket;
    parent: DroneFleet;

    inventory: Slot[];
    selected_slot: number;

    fuel: number;
    max_fuel: number;

    constructor(json: any, parent: DroneFleet) {
        super();
        this.parent = parent;

        this.ws = json.socket;
        this.fuel = json.fuel;
        this.max_fuel = json.max_fuel;
        this.drone_id = json.drone_id;
        this.inventory = json.inventory;
        this.drone_name = json.drone_name;
        this.selected_slot = json.selected_slot;

        (async () => {
            await this.updateInventory();
            this.emit('init');
        })

        this.ws?.on('message', (data: string) => {
            const parsed: DroneUpdate = JSON.parse(data);

            if(parsed.type == "delete") {
                parent.removeDrone(parsed.data.drone_id);
            }
        });
    }

    execute<T>(string: string): Promise<T> {
        return new Promise(r => {
            const nonce = getNonce();

            this.ws.send(JSON.stringify({
                type: "eval",
                function: `return + ${string}`,
                nonce
            }));

            const listener = (_res: string) => {
                try {
                    let res = JSON.parse(_res);
                    if(res?.nonce == nonce) {
                        r(res.data);
                        this.ws.off('message', listener)
                    }
                } catch(e) {}
            };

            this.ws.on('message', listener);
        })   
    }

    toJSON() {
        return {
            drone_id: this.drone_id,
            drone_name: this.drone_name,

			inventory: this.inventory,
			selectedSlot: this.selected_slot,

			fuel: this.fuel,
			maxFuel: this.max_fuel,
        }
    }

    async move(direction: MovementDirection) {
        let r = await this.execute<boolean>(`turtle.${direction}()`);
        if(r) this.fuel--; await this.updatePosition(direction);

        return r
    }

    async turn(direction: TurnDirection) {
        const d = direction == "left" ? "turnLeft" : "turnRight";
        let r = await this.execute<boolean>(`turtle.turn${d}()`);
		if (r) await this.updatePosition(direction);
		
		return r;
    }

    async dig(direction: BlockDirection) {
		let r = await this.execute<boolean>(`turtle.dig${this.parseDirection("dig", direction)}()`);
		await this.updateInventory();
		return r;
	}

    async refuel(ammount?: number) {
		let r = await this.execute<boolean>(`turtle.refuel${typeof ammount === 'number' ? count.toString() : ''}()`);
		this.fuel = await this.execute<number>('turtle.getFuelLevel()');
		await this.updateInventory();
		return r;
	}

    async refresh() {
		await this.updateInventory();

		this.selected_slot = await this.execute<number>('turtle.getSelectedSlot()');
		this.max_fuel = await this.execute<number>('turtle.getFuelLimit()');
		this.fuel = await this.execute<number>('turtle.getFuelLevel()');
	}

    private parseDirection(prefix: string, direction: BlockDirection): string {
		switch (direction) {
			case "forward":
				return prefix;
			case "up":
				return prefix + 'Up';
			case "down":
				return prefix + 'Down';
		}
	}

    async updatePosition(direction: MovementDirection | TurnDirection) {
        // Future planning for creating a mapping protocol.
        console.log(direction);
        this.emit('update');

        return true;
    }

    async updateInventory() {
        this.inventory = await this.execute<Slot[]>('{' + new Array(16).fill(0).map((_, i) => `turtle.getItemDetail(${i + 1})`).join(', ') + '}');
        
        while (this.inventory.length < 16) {
            this.inventory.push({
                count: 0,
                name: '',
                damage: 0
            });
        }

        this.emit('update');
    }
}