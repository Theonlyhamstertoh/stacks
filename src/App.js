import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { useRef, useState, useEffect } from "react";
import Camera from "./Components/Camera";
import { useControls } from "leva";
import { CreateBlock } from "./Components/CreateBlock";
import useStackStore from "./Components/hooks/useStore";
import shallow from "zustand/shallow";

export default function App() {
  const addBlock = useStackStore((state) => state.addBlock);
  const [move, setMove] = useStackStore((state) => [state.move, state.setMove], shallow);
  // const topLayer = useStackStore((state) => state.topLayer);
  // const prevLayer = useStackStore((state) => state.prevLayer);
  const stopBlocksAnimation = useStackStore((state) => state.stopBlocksAnimation);
  // console.log(stopBlockAnimation);
  const handleKey = (e) => {
    e.code === "Space" && setMove(false);
    e.code === "Space" && addBlock();
    e.code === "Space" && setMove(true);
  };
  const handleClick = (e) => {
    setMove(false);
    addBlock();
    setMove(true);
  };

  return (
    <div className="fullScreen" onClick={handleClick} onKeyDown={handleKey} tabIndex={-1}>
      <Canvas>
        <Camera />
        <color attach="background" args={["#222"]} />
        <ambientLight args={[0xffffff, 0.4]} />
        <directionalLight args={[0xffffff, 0.6]} position={[50, 100, 50]} />
        {/* <OrbitControls /> */}
        <Physics>
          <Blocks move={move} />
          {/* <Plane /> */}
        </Physics>
      </Canvas>
    </div>
  );
}

const Blocks = ({ move }) => {
  const stacks = useStackStore((state) => state.stacks);
  const topLayer = useStackStore((state) => state.topLayer);

  const { speed } = useControls({
    speed: {
      value: 2,
      min: 0,
      max: 20,
      step: 0.25,
    },
  });
  const { clock } = useThree();

  clock.start();
  let oldTime = 0;
  useFrame(({ clock }) => {
    const direction = topLayer.direction;
    if (move) {
      const position = topLayer.mesh.position;
      const dt = clock.getElapsedTime() - oldTime;
      position[direction] += dt * speed;
      oldTime = clock.getElapsedTime();
    }
  });
  return stacks.map((blockInfo) => {
    return <CreateBlock {...blockInfo} key={blockInfo.key} speed={speed} />;
  });
};
const Plane = () => {
  const [ref] = usePlane(() => ({ mass: 0, rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[100, 100]} />
      <meshPhongMaterial color="hotpink" />
    </mesh>
  );
};
