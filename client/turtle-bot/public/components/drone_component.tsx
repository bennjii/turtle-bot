import { Drone as DroneType } from "./drone";
import styles from "../../styles/Home.module.css"
import { ArrowRight } from "react-feather";
import { useContext, useEffect, useState } from "react";
import { FleetContext } from "./context";

const Drone: React.FC<{ drone_id: string }> = ({ drone_id }) => {
    const { wsInstance, fleet } = useContext(FleetContext);

    const [ data, setData ] = useState(fleet.drones.find(e => e.drone_id == drone_id));

    // useEffect(() => {
        
    // }, [fleet.drones])

    return (
        <div className={styles.droneListElement}>
            <h3>{ data.drone_name }</h3>
            <div className={styles.statusOnline}>
                Online
            </div>
            <p>{ data.drone_id }</p>

            <div>
                <p>{data.fuel} / {data.max_fuel}</p>
            </div>

            <div className={styles.takeControl} onClick={() => {
                wsInstance.send({
                    type: "action",
                    data: {
                        fleet: fleet.fleet_id,
                        drone: data.drone_id,
                        query: `refuel`,
                        args: ['1']
                    }
                })
            }}> 
                Run
                <ArrowRight size={16} color={"#063c04"}/>
            </div>
        </div>
    )
}

export default Drone;