import { Drone as DroneType } from "./drone";
import styles from "../../styles/Home.module.css"
import { ArrowRight } from "react-feather";
import { useContext, useEffect, useRef, useState } from "react";
import { DroneContext, FleetContext } from "./context";
import router from "next/router";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Text, useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";

const DroneBox: React.FC<any> = ({ drone }) => {
    // const { wsInstance, drone, fleet_id } = useContext(DroneContext);
    const mesh = useRef();

    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    const obj = useGLTF("/models/turtle.glb");
    
    return (
        <>
            <mesh
                    position={[drone?.x, drone?.y, drone?.z]}
                    ref={mesh}
                    scale={active ? 1.5 : 1}
                    onClick={(event) => setActive(!active)}
                    onPointerOver={(event) => setHover(true)}
                    onPointerOut={(event) => setHover(false)}
                >
                    {/* 
                    //@ts-expect-error */}
                    <Text 
                        color={"white"} 
                        position={[drone?.x, drone?.y+1, drone?.z]} 
                        anchorX={"center"} 
                        anchorY={"bottom"}
                        fontSize={.7}
                        >{drone.drone_name}</Text>
                    {/* <boxGeometry args={[1, 1, 1]} /> */}
                    {/* <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} /> */}
            </mesh>
            {
                obj ? 
                <primitive object={obj.scene} />
                :
                null
            }
        </>
    )
}

useGLTF.preload('/models/turtle.glb')

export default DroneBox;