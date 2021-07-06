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
  const addBlock = useStackStore((state) => state.addBlock);
  const topLayer = useStackStore((state) => state.topLayer);
  const prevLayer = useStackStore((state) => state.prevLayer);
  const handleKey = (e) => {
    e.code === "Space" && addBlock();
    e.code === "Space" && calculateBlockDistance();
  };
  // const handleClick = (e) => {
  //   addBlock();
  //   calculateBlockDistance();
  // };

  const calculateBlockDistance = () => {
    if (topLayer.direction === undefined) return;
    const topMeshPosition = topLayer && topLayer.mesh.position;
    const prevMeshPosition = prevLayer && prevLayer.mesh.position;

    const direction = topLayer.direction;
    const size = topLayer.direction === "x" ? topLayer.size.x : topLayer.size.z;
    const delta = topMeshPosition[direction] - prevMeshPosition[direction];
    const offset = Math.abs(delta);

    const overlap = size - offset;

    console.log(delta);
    if (overlap > 0) {
      // ========================== Touching ==============================
      topLayer.mesh.scale[direction] = overlap / size;
      topLayer.mesh.position[direction] -= delta / 2;
    } else if (overlap < 0) {
      console.log("not touching");
    }
    // console.log("new", topMeshPosition  );
    // console.log("old", prevMeshPosition);
    // console.log(offset);
    // console.log("=======end===========");
  };

  return (
    <div className="fullScreen" onKeyDown={handleKey} tabIndex={-1}>
      <Canvas>
        <Camera />
        <color attach="background" args={["#222"]} />
        <ambientLight args={[0xffffff, 0.4]} />
        <directionalLight args={[0xffffff, 0.6]} position={[50, 100, 50]} />
        <OrbitControls />
        <Physics>
          <Blocks />
          {/* <Plane /> */}
        </Physics>
      </Canvas>
    </div>
  );
}

const Blocks = () => {
  const stacks = useStackStore((state) => state.stacks);

  const { speed } = useControls({
    speed: {
      value: 1,
      min: 0,
      max: 20,
      step: 0.25,
    },
  });

  return stacks.map((blockInfo) => {
    return (
      <CreateBlock
        {...blockInfo}
        key={blockInfo.key}
        speed={speed}
        blockPosition={blockInfo.position}
      />
    );
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
