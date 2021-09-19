import { Server } from 'ws';
import { Server as SocketIO } from "socket.io";
// import { connect } from 'ngrok';
import { FleetManager } from './fleet_manager'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const fleet = new Server({ port: 5757 });
const fleetManager = new FleetManager(fleet);

(async () => {
	// const fleetURL = await connect(5757);
	console.log(`[URL] 128.199.234.165:5757`);

    // const webURL = await connect(5758);
    fs.writeFileSync('../client/turtle-bot/public/ip.json', `{ "url": "http://128.199.234.165:5758" }`);
	// console.log(`[URL] ${webURL.replace("https", "ws")}`);

    const web = new SocketIO(5758, {
        cors: {
          origin: true,
          methods: ["GET", "POST"]
        }
    });

    web.on('connection', async (ws) => {
        console.log(`[CONNECTION] Web`);
    
        ws.on('message', (req: WebRequest) => {
            if(req.type == "request") {
                ws.send({
                    type: "response",
                    data: fleetManager.getFleetByName(req.data.fleet)
                })
            }

            if(req.type == "exec") {
                fleetManager.getFleet(req.data.fleet)?.getDrone(req.data.drone)?.execute(req.data.query)
            }

            if(req.type == "action") {
                const drone = fleetManager.getFleet(req.data.fleet)?.getDrone(req.data.drone);
                //@ts-expect-error
                drone[req.data.query](...req.data.args);
            }
        })
    })
})();


fleet.on('connection', async function connection(ws) {
    console.log(`[CONNECTION] Drone`)

    ws.on('message', (data: string) => {
        const parsed: DroneSetup = JSON.parse(data);

        if(parsed.type == "setup") {
            const droneData = parsed.data;
            //@ts-expect-error
            const fleetExists = fleetManager.getFleet(parsed.fleet_id)

            if(fleetExists) {
                fleetExists.addDrone(droneData, ws);

                // const drone = fleetExists?.getDrone(droneData.drone_id);

                // ws.send(JSON.stringify({
                //     type: "setup",
                //     data: {
                //         drone_name: drone?.drone_name,
                //         drone_id: drone?.drone_id,
                //         fleet_id: fleetExists.fleet_id,
                //         fleet_name: fleetExists.fleet_name,
                //         setup: true
                //     }
                // }));
            }
            else {
                const fleetId = uuidv4();
                fleetManager.newDroneFleet(fleetId, droneData.fleet_name);
                fleetManager.getFleet(fleetId)?.addDrone(droneData, ws)

                // const drone = fleetManager.getFleet(fleetId)?.getDrone(droneData.drone_id);

                // ws.send(JSON.stringify({
                //     type: "setup",
                //     data: {
                //         drone_name: drone?.drone_name,
                //         drone_id: drone?.drone_id,
                //         fleet_id: fleetId,
                //         fleet_name: fleetManager.getFleet(fleetId)?.fleet_name,
                //         setup: true
                //     }
                // }))
            }
        }
    })
});