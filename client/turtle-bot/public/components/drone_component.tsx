import { Drone as DroneType } from "./drone";

const Drone: React.FC<{ data: DroneType }> = ({ data }) => {


    return (
        <div>
            <h2>{ data.drone_name }</h2>
            <p>alias { data.drone_id }</p>

            <div>
                <p>{data.fuel} / {data.max_fuel}</p>
            </div>
        </div>
    )
}

export default Drone;