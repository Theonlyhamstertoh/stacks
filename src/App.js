import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, OrbitControls, Html, OrthographicCamera, useHelper } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { useControls } from "leva";
import { MaskPass } from "three-stdlib";

const INITIAL_BLOCK = {
  position: { x: 0, y: 0, z: 0 },
  size: [3, 1, 3],
  color: `hsl(${180 + 1 * 2},  100%, 60%)`,
  direction: undefined,
  key: uuidv4(),
  move: false,
  mass: 0,
};
const CreateBlock = ({ position, color, speed, direction, move, size, setGameMode, mass }) => {
  const mesh = useRef();
  const { clock } = useThree();

  const offset = 10;
  if (direction !== undefined) {
    position[direction] = -offset;
  }

  /**
   * Physics
   */
  const [ref, api] = useBox(() => ({
    mass,
    position: [position.x, position.y, position.z],
    args: size,
  }));

  clock.start();
  let oldTime = 0;
  console.log(api);
  useFrame(({ clock }) => {
    if (move === true) {
      const dt = clock.getElapsedTime() - oldTime;
      position[direction] += dt * speed;
      api.position.set(position.x, position.y, position.z);

      oldTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={size} />
      <meshNormalMaterial color={color} />
    </mesh>
  );
};

export default function App() {
  const [stacks, setStacks] = useState([INITIAL_BLOCK]);
  const [gameMode, setGameMode] = useState("gameNotStarted");

  const { speed } = useControls({
    speed: {
      value: 2,
      min: 1,
      max: 20,
      step: 1,
    },
  });
  const handleKey = (e) => {
    switch (e.code) {
      case "Space":
        createNewLayer();
    }
  };

  const handleClick = (e) => createNewLayer();

  const createNewLayer = () => {
    const color = `hsl(${180 + stacks.length * 2},  100%, 60%)`;
    const position = { x: 0, y: stacks.length, z: 0 };
    const direction = stacks.length % 2 ? "x" : "z";
    const size = [3, 1, 3];

    // create new block
    const newBlock = {
      position,
      color,
      key: uuidv4(),
      direction,
      size,
      mass: 0,
      move: true,
    };

    // set all previous blocks  movement to false. Add new block.
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
        {/* <OrbitControls /> */}
        {/* Block */}
        <Physics>
          {stacks.map((blockInfo) => {
            return (
              <CreateBlock
                {...blockInfo}
                key={blockInfo.key}
                setGameMode={setGameMode}
                speed={speed}
              />
            );
          })}
          <Plane />
        </Physics>
      </Canvas>
    </div>
  );
}

const Plane = () => {
  const [ref] = usePlane(() => ({ mass: 0, rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[100, 100]} />
      <meshPhongMaterial color="hotpink" />
    </mesh>
  );
};

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
