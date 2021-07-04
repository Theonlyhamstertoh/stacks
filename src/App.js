import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, OrbitControls, Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
export default function App() {
  const [stacks, setStacks] = useState([]);

  const handleKey = (e) => {
    switch (e.code) {
      case "Space":
        createNewLayer();
    }
  };

  const handleClick = (e) => {
    createNewLayer();
  };

  const createNewLayer = () => {
    const color = `hsl(${180 + stacks.length * 2},  100%, 60%)`;
    const position = [0, stacks.length, 0];
    const direction = stacks.length % 2 ? "x" : "z";
    const size = [3, 1, 3];
    const newBlock = {
      position,
      color,
      key: uuidv4(),
      direction,
      size,
      move: true,
    };
    setStacks((prev) => [...prev, newBlock]);
    // useEffect(() => {
    //   console.log(ref);
    // }, []);

    // return (
    //   <mesh ref={ref} {...props}>
    //     <boxBufferGeometry />
    //     <meshLambertMaterial />
    //   </mesh>
    // );
  };

  return (
    <div className="fullScreen" onClick={handleClick} onKeyDown={handleKey} tabIndex={-1}>
      <Canvas orthographic camera={{ zoom: 100, position: [100, 50, 100] }}>
        <OrbitControls enablePan={false} rotateSpeed={1} />
        <color attach="background" args={["#222"]} />
        <ambientLight args={[0xffffff, 0.4]} />
        <directionalLight args={[0xffffff, 0.6]} position={[50, 100, 50]} />

        {/* Block */}
        {stacks.map((blockInfo) => {
          return <CreateBlock {...blockInfo} />;
        })}
      </Canvas>
    </div>
  );
}

const CreateBlock = ({ position, color, direction, move, size }) => {
  return (
    <mesh position={position}>
      <boxBufferGeometry args={size} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
