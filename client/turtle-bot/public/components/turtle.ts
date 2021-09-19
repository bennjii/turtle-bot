export enum BlockDirection { FORWARD, UP, DOWN }
export enum Direction { NORTH, EAST, SOUTH, WEST }
export enum Side { LEFT, RIGHT }

import { randomBytes } from "crypto";

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

export class Turtle {
    inventory: Slot[];
	selectedSlot: number;
	x: number;
	y: number;
	z: number;
	d: Direction;
	label: string;
	fuel: number;
	maxFuel: number;
	id: number;
    ws: WebSocket;

    constructor(json: any) {
		this.inventory = json.inventory;
		this.selectedSlot = json.selectedSlot;
		this.x = json.x;
		this.y = json.y;
		this.z = json.z;
		this.d = json.d;
		this.fuel = json.fuel;
		this.maxFuel = json.maxFuel;
		this.label = json.label;
		this.id = json.id;
        this.ws = json.ws;
	}

    execute(command) {
        return new Promise(r => {
            const nonce = getNonce();

            this.ws.send(JSON.stringify({
                type: 'eval',
                function: `return ${command}`,
                nonce
            }));

            const listener = (resp: string) => {
				try {
					let res = JSON.parse(resp);
					if (res?.nonce === nonce) {
						r(res.data);
						this.ws.off('message', listener);
					}
				} catch (e) { }
			};
            
			this.ws.on('message', listener);
        })
    }
}