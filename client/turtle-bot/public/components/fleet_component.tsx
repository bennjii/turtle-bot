import { Drone as DroneType } from "./drone";
import styles from "../../styles/Home.module.css"
import { ArrowRight } from "react-feather";
import { useContext, useEffect, useState } from "react";
import { FleetContext } from "./context";
import router from "next/router";

const Fleet: React.FC<{ fleet_id: string }> = ({ fleet_id }) => {
    const { wsInstance, fleet: fleets } = useContext(FleetContext);

    const [ data, setData ] = useState(fleets.find(e => e.fleet_id == fleet_id));

    useEffect(() => {
        setData(fleets.find(e => e.fleet_id == fleet_id))
    }, [fleet_id, fleets])

    return (
        <div className={styles.droneListElement}>
            <h3>{ data?.fleet_name }</h3>
            <div className={styles.statusOnline}>
                { data?.drones?.length }
            </div>
            <p className={styles.trailingIdentifier}>{ data?.fleet_id }</p>

            <div className={styles.takeControl} onClick={() => {
                window.location.href += `/${data?.fleet_name}`;
            }}> 
                View
                <ArrowRight size={16} color={"#063c04"}/>
            </div>
        </div>
    )
}

export default Fleet;