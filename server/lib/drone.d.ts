/// <reference types="node" />
import EventEmitter from "events";
import WebSocket from "ws";
import { DroneFleet } from "./drone_fleet";
declare type MovementDirection = "forward" | "back" | "up" | "down";
declare type TurnDirection = "left" | "right";
declare type BlockDirection = "forward" | "up" | "down";
interface Slot {
    count: number;
    name: string;
    damage: number;
}
export declare class Drone extends EventEmitter {
    drone_id: string;
    drone_name: string;
    ws: WebSocket;
    parent: DroneFleet;
    inventory: Slot[];
    selected_slot: number;
    fuel: number;
    max_fuel: number;
    constructor(json: any, parent: DroneFleet);
    execute<T>(string: string): Promise<T>;
    toJSON(): {
        drone_id: string;
        drone_name: string;
        inventory: Slot[];
        selectedSlot: number;
        fuel: number;
        maxFuel: number;
    };
    move(direction: MovementDirection): Promise<boolean>;
    turn(direction: TurnDirection): Promise<boolean>;
    dig(direction: BlockDirection): Promise<boolean>;
    refuel(ammount?: number): Promise<boolean>;
    refresh(): Promise<void>;
    private parseDirection;
    updatePosition(direction: MovementDirection | TurnDirection): Promise<boolean>;
    updateInventory(): Promise<void>;
}
export {};
