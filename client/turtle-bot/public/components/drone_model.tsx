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

    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    // useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
    
    return (
        <mesh
            {...args}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
            position={[-1.2, 0, 0]}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

export default Block;