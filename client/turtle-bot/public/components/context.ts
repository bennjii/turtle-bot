import { createContext } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { Drone } from "./drone";

const FleetContext = createContext<{ wsInstance: Socket<DefaultEventsMap, DefaultEventsMap>, fleet: any }>(null);

const DroneContext = createContext<{ wsInstance: Socket<DefaultEventsMap, DefaultEventsMap>, drone: Drone, fleet_id: string }>(null);

export { FleetContext, DroneContext }