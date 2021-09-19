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

    constructor(json: any, ws: WebSocket, parent: DroneFleet) {
        super();
        this.parent = parent;

        this.ws = ws;
        this.fuel = json.fuel;
        this.max_fuel = json.max_fuel;
        this.drone_id = json.drone_id;
        this.inventory = json.inventory;
        this.drone_name = json.drone_name;
        this.selected_slot = json.selected_slot;

        (async () => {
            await this.updateInventory();

            ws.send(JSON.stringify({
                type: "setup",
                data: this.toJSON()
            }));

            this.emit('init');
        })();

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
                function: `return ${string}`,
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
            this.emit('update')
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
        let r = await this.execute<boolean>(`turtle.${direction}()`);
        if(r) this.fuel--; await this.updatePosition(direction);

        return r
    }

    async turn(direction: TurnDirection) {
        let r = await this.execute<boolean>(`turtle.${this.parseDirection("turn", direction)}()`);
		if (r) await this.updatePosition(direction);
		
		return r;
    }

    async dig(direction: BlockDirection) {
		let r = await this.execute<boolean>(`turtle.${this.parseDirection("dig", direction)}()`);
		await this.updateInventory();
		return r;
	}

    async place(direction: BlockDirection) {
		let r = await this.execute<boolean>(`turtle.${this.parseDirection("place", direction)}()`);
		await this.updateInventory();
		return r;
	}

    async suck(direction: BlockDirection) {
		let r = await this.execute<boolean>(`turtle.${this.parseDirection("suck", direction)}()`);
		await this.updateInventory();
		return r;
	}

    async drop(direction: BlockDirection) {
		let r = await this.execute<boolean>(`turtle.${this.parseDirection("drop", direction)}()`);
		await this.updateInventory();
		return r;
	}

    async refuel(ammount?: number) {
		let r = await this.execute<boolean>(`turtle.refuel(${typeof ammount === 'number' ? count.toString() : ''})`);
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

    async digHeight(height: number) {
        for(let h = 0; h < height; h++) {
            if(h !== height - 1) {
                await this.dig('up')
                await this.dig('forward');
                await this.move('up');
            }else {
                await this.dig('forward');
                await this.move('up');
            }
        }

        for(let h = 0; h < height; h++) await this.move('down')
    }

    async digHalfRow(direction: TurnDirection, length: number) {
        await this.turn(direction);

        for(let w = 1; w <= length; w++) {
            await this.digHeight(length);
            await this.move('forward');
        }

        for(let w = 1; w <= length; w++) {
            await this.move('back')
        }

        if(direction == 'left') await this.turn('right');
        else await this.turn('left');
    }

    async mineTunnel(height: number, width: number, depth: number) {
        for(let i = 0; i < depth; i++) {
            const half_width = (width-1) / 2;

            await this.digHeight(height);
            await this.move('forward');

            await this.digHalfRow('left', Math.floor(half_width));
            await this.digHalfRow('right', Math.ceil(half_width));
        }
    }

    private parseDirection(prefix: string, direction: BlockDirection | TurnDirection): string {
		switch (direction) {
			case "forward":
				return prefix;
			case "up":
				return prefix + 'Up';
			case "down":
				return prefix + 'Down';
            case "left":
                return prefix + 'Left';
            case "right":
                return prefix + 'Right';
		}
	}

    //@ts-ignore
    async updatePosition(direction: MovementDirection | TurnDirection) {
        // Future planning for creating a mapping protocol.
        // console.log(direction);
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