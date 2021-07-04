import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, OrbitControls, Html, OrthographicCamera, useHelper } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const INITIAL_BLOCK = {
  position: { x: 0, y: 0, z: 0 },
  size: [3, 1, 3],
  color: `hsl(${180 + 1 * 2},  100%, 60%)`,
  direction: undefined,
  key: uuidv4(),
  move: false,
};
const CreateBlock = ({ position, color, direction, move, size }) => {
  if (direction !== undefined) {
    position[direction] = -10;
  }

  const mesh = useRef();

  const { clock } = useThree();
  clock.start();
  useFrame(({ clock }) => {
    if (mesh.current.position[direction] < 0 && move === true) {
      mesh.current.position[direction] = clock.getElapsedTime() - 10;
    } else if (mesh.current.position[direction] > 0) {
    }
  });

  return (
    <mesh ref={mesh} position={[position.x, position.y, position.z]}>
      <boxBufferGeometry args={size} />
      <meshNormalMaterial color={color} />
    </mesh>
  );
};

export default function App() {
  const [stacks, setStacks] = useState([INITIAL_BLOCK]);

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
    const position = { x: 0, y: stacks.length, z: 0 };
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
    const newStacksArray = stacks.map((block) => ({ ...block, move: false }));
    newStacksArray.push(newBlock);
    setStacks(newStacksArray);
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
  const speed = 0.1;
  useFrame(({ camera, clock }) => {
    if (stacks.length - 1 > camera.position.y - 120) {
      camera.position.y += speed;
    }
  });

  camera.lookAt(new THREE.Vector3(0, stacks.length, 0));
  camera.updateProjectionMatrix();

  return <OrthographicCamera ref={ref} makeDefault position={[100, 120, 100]} zoom={40} />;
};
