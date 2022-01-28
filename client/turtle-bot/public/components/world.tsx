import { Drone, Drone as DroneType } from "./drone";
import styles from "../../styles/Home.module.css"
import { ArrowRight } from "react-feather";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { DroneContext, FleetContext } from "./context";
import router from "next/router";

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Block from "./block";
import { EffectComposer, SMAA } from "@react-three/postprocessing";
import DroneBox from "./world_drone";

const World: React.FC<{ }> = ({ }) => {
    const { wsInstance, drone, fleet } = useContext(DroneContext);
    const [ currentDrone, setCurrentDrone ] = useState(drone);
    
    useEffect(() => {
        setCurrentDrone(drone);
    }, [drone])

    console.log("From", fleet?.drones);

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
                rotation={[0, -(currentDrone.d + 2) * Math.PI / 2, 0]}
                enablePan={false} 
                enableZoom={true} 
                enableRotate={true} 
                />

            <ambientLight intensity={1} />
            {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> */}
            {/* <pointLight position={[-10, -10, -10]} /> */}

            {
                // fleet?.drones ? 
                //     (fleet?.drones)?.map((__d: Drone, i: number) => {  
                //         // if(fleet.drones[i].drone_id == currentDrone.drone_id) return <></>;    
                //         console.log(" -> ", __d, fleet.drones[i]);
                                    
                //         return ( 
                //             <DroneBox drone={__d}  droneChange={setCurrentDrone} key={`WORLD.DRONE${__d.drone_id}`}/> 
                //         )
                //     })
                // :
                //     <></>
            }

            {
                fleet?.map?.data?.world ? 
                    Object.keys(fleet?.map?.data?.world).map((position: any) => {
                        let positions = position.split(',').map(p => parseInt(p)) as [number, number, number];

                        return fleet?.map?.data?.world[position].name !== "minecraft:stone" ? (
                            <Block 
                                key={position} 
                                position={[positions[0], positions[1], positions[2]]}
                                data={fleet?.map?.data?.world[position]}
                                ></Block>
                        ) : <></>
                    })
                :
                    <></>
            }

            <DroneBox 
                drone={currentDrone} 
                droneChange={setCurrentDrone} 
                key={`WORLD.DRONE-${currentDrone.drone_id}`}
                /> 

        </Canvas>
    )
}

export default World;