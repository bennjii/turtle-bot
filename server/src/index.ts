import { Server } from 'ws';
import { Server as SocketIO } from "socket.io";
// import { connect } from 'ngrok';
import { FleetManager } from './fleet_manager'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const fleet = new Server({ port: 5757 });
const web = new SocketIO(5758, {
    cors: {
      origin: true,
      methods: ["GET", "POST"]
    }
});

const fleetManager = new FleetManager(fleet, web);

(async () => {
	// const fleetURL = await connect(5757);
	console.log(`[URL] 128.199.234.165:5757`);

    // const webURL = await connect(5758);
    fs.writeFileSync('../client/turtle-bot/public/ip.json', `{ "url": "http://128.199.234.165:5758" }`);
	// console.log(`[URL] ${webURL.replace("https", "ws")}`);

    web.on('connection', async (ws) => {
        console.log(`[CONNECTION] Web`);
    
        ws.on('message', (req: WebRequest) => {
            if(req.type == "request") {
                if(req.data.fleet == "*") {
                    fleetManager.fleets.forEach(element => {
                        ws.join(element.fleet_id)
                    });

                    ws.send({
                        type: "response",
                        data: fleetManager.fleets
                    });
                }else {
                    const req_fleet = fleetManager.getFleetByName(req.data.fleet);

                    if(req_fleet) {
                        ws.send({
                            type: "response",
                            data: req_fleet
                        });
    
                        ws.join(req_fleet.fleet_id)
                    }
                }
            }

            if(req.type == "exec") {
                fleetManager.getFleet(req.data.fleet)?.getDrone(req.data.drone)?.execute(req.data.query)
            }

            if(req.type == "action") {
                const drone = fleetManager.getFleet(req.data.fleet)?.getDrone(req.data.drone);
                console.log(`${req.data.query}(${[...req.data.args]})`)
                
                //@ts-expect-error
                drone[req.data.query](...req.data.args);
            }
        })
    });
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
            }
            else {
                const fleetId = uuidv4();
                fleetManager.newDroneFleet(fleetId, droneData.fleet_name);
                fleetManager.getFleet(fleetId)?.addDrone(droneData, ws)
            }
        }
    })
});