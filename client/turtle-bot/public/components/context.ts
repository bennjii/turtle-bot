import { createContext } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

const FleetContext = createContext<{ wsInstance: Socket<DefaultEventsMap, DefaultEventsMap>, fleet: any }>(null);

export { FleetContext }