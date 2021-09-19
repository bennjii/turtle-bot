export interface DroneUpdate {
    type: "setup" | "update" | "delete",
    data: any
}