import { Drone as DroneType } from "./drone";
import styles from "../../styles/Home.module.css"
import { ArrowRight } from "react-feather";
import { useContext } from "react";
import { FleetContext } from "./context";

const Drone: React.FC<{ data: DroneType }> = ({ data }) => {
    const { wsInstance, fleet } = useContext(FleetContext);

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
                wsInstance.send(JSON.stringify({
                    type: "exec",
                    data: {
                        fleet: fleet.fleet_id,
                        drone: data.drone_id,
                        query: `turtle.dig()`
                    }
                }))
            }}> 
                Run
                <ArrowRight size={16} color={"#063c04"}/>
            </div>
        </div>
    )
}

export default Drone;