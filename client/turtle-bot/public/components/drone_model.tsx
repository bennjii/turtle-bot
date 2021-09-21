import { useContext, useEffect, useRef, useState } from "react";

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