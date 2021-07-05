import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { useRef, useState, useEffect } from "react";
import Camera from "./Components/Camera";
import { useControls } from "leva";
import { CreateBlock } from "./Components/CreateBlock";
import useStackStore from "./Components/hooks/useStore";

export default function App() {
  const [gameMode, setGameMode] = useState("gameNotStarted");
  const addBlock = useStackStore((state) => state.addBlock);
  const stacks = useStackStore((state) => state.stacks);
  const { speed } = useControls({
    speed: {
      value: 2,
      min: 1,
      max: 20,
      step: 1,
    },
  });

  const handleKey = (e) => e.code === "Space" && addBlock();
  const handleClick = (e) => addBlock();

  return (
    <div className="fullScreen" onClick={handleClick} onKeyDown={handleKey} tabIndex={-1}>
      <Canvas>
        <Camera stacks={stacks} />
        <color attach="background" args={["#222"]} />
        <ambientLight args={[0xffffff, 0.4]} />
        <directionalLight args={[0xffffff, 0.6]} position={[50, 100, 50]} />
        <OrbitControls />
        {/* Block */}
        <Physics>
          {stacks.map((blockInfo) => {
            console.log(blockInfo.position);
            return (
              <CreateBlock
                {...blockInfo}
                key={blockInfo.key}
                setGameMode={setGameMode}
                speed={speed}
                blockPosition={blockInfo.position}
              />
            );
          })}
          {/* <Plane /> */}
        </Physics>
      </Canvas>
    </div>
  );
}

const Blocks = () => {};
const Plane = () => {
  const [ref] = usePlane(() => ({ mass: 0, rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[100, 100]} />
      <meshPhongMaterial color="hotpink" />
    </mesh>
  );
};
