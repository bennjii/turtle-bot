import { Drone as DroneType } from "./drone";
import styles from "../../styles/Home.module.css"
import { ArrowRight } from "react-feather";
import { useContext, useEffect, useRef, useState } from "react";
import { DroneContext, FleetContext } from "./context";
import router from "next/router";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Billboard, Text, useCamera, useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";

const DroneBox: React.FC<any> = ({ drone, droneChange }) => {
    // const { wsInstance, drone, fleet_id } = useContext(DroneContext);
    const mesh = useRef();

    const obj = useGLTF("/models/turtle.glb");
    const { camera } = useThree();

    return (
        <>
            <mesh
                position={[drone?.x, drone?.y, drone?.z]}
                rotation={[0, -(drone.d + 2) * Math.PI / 2, 0]}
                ref={mesh}
                visible={false}
                onClick={(event) => droneChange(drone)}
                >
                    <boxBufferGeometry args={[1, 1, 1]} />
                    {/* <Billboard
                        position={[drone?.x, drone?.y, drone?.z]}
                        follow={true} // Follow the camera (default=true)
                        lockX={false} // Lock the rotation on the x axis (default=false)
                        lockY={false} // Lock the rotation on the y axis (default=false)
                        lockZ={false} // Lock the rotation on the z axis (default=false)
                        > */}
                            {/* 
                            //@ts-expect-error */}
                            <Text 
                                color={"white"} 
                                position={[drone?.x, drone?.y+.5, drone?.z]} 
                                anchorX={"center"} 
                                anchorY={"bottom"}
                                fontSize={.5}
                                >{drone.drone_name}</Text>
                        {/* </Billboard> */}
 
                    
            </mesh>
            {
                obj ? 
                <primitive 
                    object={obj.scene} 
                    position={[drone?.x, drone?.y, drone?.z]}
                    rotation={[0, -(drone.d + 2) * Math.PI / 2, 0]}
                />
                :
                null
            }
        </>
    )
}

useGLTF.preload('/models/turtle.glb')

export default DroneBox;