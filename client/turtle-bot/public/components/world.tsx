import { Drone, Drone as DroneType } from "./drone";
import styles from "../../styles/Home.module.css"
import { ArrowRight } from "react-feather";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { DroneContext, FleetContext } from "./context";
import router from "next/router";

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from "@react-three/fiber";
import Block from "./block";
import { EffectComposer, SMAA } from "@react-three/postprocessing";
import DroneBox from "./world_drone";

const World: React.FC<{ }> = ({ }) => {
    const { wsInstance, drone, fleet } = useContext(DroneContext);
    const [ currentDrone, setCurrentDrone ] = useState(drone);

    useEffect(() => {
        setCurrentDrone(drone);
    }, [drone])

    return (
        <Canvas>
            <Suspense fallback={null}>
                <EffectComposer multisampling={0}>
                    <SMAA />
                </EffectComposer>
            </Suspense>

            {/* 
            //@ts-expect-error */}
            <OrbitControls 
                target={[currentDrone.x, currentDrone.y, currentDrone.z]}
                enablePan={false} 
                enableZoom={true} 
                enableRotate={true} />

            <ambientLight intensity={1} />
            {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> */}
            {/* <pointLight position={[-10, -10, -10]} /> */}

            {/* {
                fleet?.drones?.map((d: Drone) => {                    
                    return ( 
                        <DroneBox drone={d} key={`WORLD.DRONE-${d.drone_id}`}/> 
                    )
                })
            } */}

            <DroneBox drone={currentDrone} key={`WORLD.DRONE-${currentDrone.drone_id}`}/> 
        </Canvas>
    )
}

export default World;