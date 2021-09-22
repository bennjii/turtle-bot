import { useContext, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text,useGLTF } from "@react-three/drei";
import { useSpring, animated, config } from '@react-spring/three'
import * as THREE from 'three';

const DroneBox: React.FC<any> = ({ drone, droneChange }) => {
    const mesh = useRef();
    const ref = useRef()
    
    // //@ts-expect-error
    // useFrame(() => ref.current.position.x = drone ? THREE.MathUtils.lerp(ref?.current?.position.x, [drone.x, drone.y, drone.z], 0.1) : ref?.current?.position.x)

    const obj = useGLTF("/models/turtle.glb");

    return (
        <>
            {/* <mesh
                position={[drone.x, drone?.y, drone?.z]}
                rotation={[0, -(drone.d + 2) * Math.PI / 2, 0]}
                ref={mesh}
                visible={false}
                onClick={(event) => droneChange(drone)}
                >
                    <boxBufferGeometry args={[1, 1, 1]} />

                    <Text 
                        color={"white"} 
                        position={[drone?.x, drone?.y+.5, drone?.z]} 
                        anchorX={"center"} 
                        anchorY={"bottom"}
                        fontSize={.5}
                        >{drone.drone_name}</Text>
            </mesh> */}
            {
                obj ? 
                <animated.primitive 
                    ref={ref}
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