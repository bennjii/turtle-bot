interface DroneUpdate {
    type: "setup" | "update" | "delete";
    data: any;
}
interface DroneSetup extends DroneUpdate {
    type: "setup";
    data: {
        drone_name: string;
        drone_id: string;
        fleet_id: string;
        fleet_name: string;
    };
}
