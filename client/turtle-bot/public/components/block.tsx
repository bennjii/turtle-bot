import { Drone as DroneType } from "./drone";
import styles from "../../styles/Home.module.css"
import { ArrowRight } from "react-feather";
import { useContext, useEffect, useRef, useState } from "react";
import { DroneContext, FleetContext } from "./context";
import router from "next/router";
import { Canvas, useFrame } from "@react-three/fiber";

const Block: React.FC<any> = (args) => {
    // const { wsInstance, drone, fleet_id } = useContext(DroneContext);
    const mesh = useRef()
    const { data } = args;

    const [hovered, setHover] = useState(false)

    // useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
    
    return (
        <mesh
            {...args}
            ref={mesh}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
                color={data.name == "minecraft:stone" ? "grey" : "red"} 
                transparent 
                opacity={0.1} 
                border={1}
            />
        </mesh>
    )
}

export default Block;