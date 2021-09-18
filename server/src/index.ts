import { Server } from 'ws';
import { Server as SocketIO } from "socket.io";
import { connect } from 'ngrok';
import { FleetManager } from './fleet_manager'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const fleet = new Server({ port: 5757 });
const fleetManager = new FleetManager(fleet);

(async () => {
	const fleetURL = await connect(5757);
	console.log(`[URL] ${fleetURL.replace("https", "ws")}`);

    const webURL = await connect(5758);
    fs.writeFileSync('../client/turtle-bot/public/ip.json', `{ "url": "${webURL}" }`);
	console.log(`[URL] ${webURL.replace("https", "ws")}`);

    const web = new SocketIO(5758, {
        cors: {
          origin: true,
          methods: ["GET", "POST"]
        }
    });

    web.on('connection', async (ws) => {
        console.log(`[CONNECTION] Web`);
    
        ws.on('message', (data: WebRequest) => {
            if(data.type == "request") {
                ws.send(JSON.stringify({
                    type: "response",
                    data: fleetManager.toJSON()
                }))
            }
        })
    })
})();

fleet.on('open', (e) => {
    console.log("[OPEN] MC Drone Fleet Initized", e)
});

fleet.on('connection', async function connection(ws) {
    console.log(`[CONNECTION] Drone`)

    ws.on('message', (data: string) => {
        const parsed: DroneSetup = JSON.parse(data);

        if(parsed.type == "setup") {
            const droneData = parsed.data;
            //@ts-expect-error
            const fleetExists = fleetManager.getFleet(parsed.fleet_id)

            if(fleetExists) {
                const droneId = uuidv4();
                fleetExists.addDrone(droneId, droneData.drone_name, ws);

                console.log(`Added drone to existing fleet ${fleetExists.fleet_name}`)

                const drone = fleetExists?.getDrone(droneId);

                ws.send(JSON.stringify({
                    type: "setup",
                    data: {
                        drone_name: drone?.drone_name,
                        drone_id: drone?.drone_id,
                        fleet_id: fleetExists.fleet_id,
                        fleet_name: fleetExists.fleet_name,
                        setup: true
                    }
                }));
            }
            else {
                const fleetId = uuidv4();
                fleetManager.newDroneFleet(fleetId, droneData.fleet_name);
                
                const droneId = uuidv4();
                fleetManager.getFleet(fleetId)?.addDrone(droneId, droneData.drone_name, ws)

                const drone = fleetManager.getFleet(fleetId)?.getDrone(droneId);

                ws.send(JSON.stringify({
                    type: "setup",
                    data: {
                        drone_name: drone?.drone_name,
                        drone_id: drone?.drone_id,
                        fleet_id: fleetId,
                        fleet_name: fleetManager.getFleet(fleetId)?.fleet_name,
                        setup: true
                    }
                }))
            }
        }
    })
});