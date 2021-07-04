import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, OrbitControls, Html, OrthographicCamera, useHelper } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateBlock = ({ position, color, direction, move, size }) => {
  return (
    <mesh position={position}>
      <boxBufferGeometry args={size} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};

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

  const moveCameraUp = ({ position }) => {};
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
  };

  return (
    <div className="fullScreen" onClick={handleClick} onKeyDown={handleKey} tabIndex={-1}>
      <Canvas>
        <Camera stacks={stacks} />
        <color attach="background" args={["#222"]} />
        <ambientLight args={[0xffffff, 0.4]} />
        <directionalLight args={[0xffffff, 0.6]} position={[50, 100, 50]} />

        {/* Block */}
        {stacks.map((blockInfo) => {
          moveCameraUp(blockInfo.position);
          return <CreateBlock {...blockInfo} key={blockInfo.key} />;
        })}
      </Canvas>
    </div>
  );
}

const Camera = ({ stacks }) => {
  const ref = useRef();
  const { camera } = useThree();
  const speed = 0.15;
  useFrame(({ camera, clock }) => {
    console.log(stacks.length, camera.position.y - 120);
    if (stacks.length > camera.position.y - 120) {
      camera.position.y += speed;
    }
    // console.log(stacks.length - 1, camera.position.y - 50);
  });

  camera.lookAt(new THREE.Vector3(0, stacks.length, 0));
  camera.updateProjectionMatrix();
  // useHelper(ref, THREE.CameraHelper, 1, "hotpink");

  return <OrthographicCamera ref={ref} makeDefault position={[100, 120, 100]} zoom={75} />;
};
