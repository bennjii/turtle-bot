import { createContext } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { Drone } from "./drone";

interface Fleet {
    drones: Drone[],
    fleet_name: string,
    fleet_id: string
}

const FleetContext = createContext<{ wsInstance: Socket<DefaultEventsMap, DefaultEventsMap>, fleet: Fleet[] | Fleet }>(null);

const DroneContext = createContext<{ wsInstance: Socket<DefaultEventsMap, DefaultEventsMap>, drone: Drone, fleet: Fleet }>(null);

export { FleetContext, DroneContext }