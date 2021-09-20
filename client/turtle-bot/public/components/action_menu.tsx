import { Drone as DroneType } from "./drone";
import styles from "../../styles/Home.module.css"
import { ArrowDown, ArrowRight, ArrowUp } from "react-feather";
import { useContext, useEffect, useState } from "react";
import { DroneContext, FleetContext } from "./context";
import router from "next/router";

const ActionMenu: React.FC<{ name: string, action: string }> = ({ name, action }) => {
    const { wsInstance, drone, fleet_id } = useContext(DroneContext);

    return (
        <div className={styles.droneAction}>
        <ArrowUp onClick={() => 
            wsInstance.send({
                type: "action",
                data: {
                    fleet: fleet_id,
                    drone: drone.drone_id,
                    query: `dig`,
                    args: ['up']
                }
            })
        } size={16} strokeWidth={1} />

        <div onClick={() => 
            wsInstance.send({
                type: "action",
                data: {
                    fleet: fleet_id,
                    drone: drone.drone_id,
                    query: `dig`,
                    args: ['forward']
                }
            })
        }>{name}</div>

        <ArrowDown onClick={() => 
            wsInstance.send({
                type: "action",
                data: {
                    fleet: fleet_id,
                    drone: drone.drone_id,
                    query: `dig`,
                    args: ['down']
                }
            })
        } size={16} strokeWidth={1} />
    </div>
    )
}

export default ActionMenu;