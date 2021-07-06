import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import useStackStore from "./hooks/useStore";
import { v4 as uuidv4 } from "uuid";
import shallow from "zustand/shallow";

export const createBlockData = (stacks, [newWidth, newDepth, nextX, nextZ]) => {
  const color = `hsl(${180 + stacks.length * 4}, 100%, 60%)`;
  const position = { x: nextX, y: stacks.length, z: nextZ };
  const direction = stacks.length % 2 ? "x" : "z";
  const size = { x: newWidth, y: 1, z: newDepth };

  console.log(stacks, newWidth, newDepth, nextX, nextZ);
  // create new block
  const newBlock = {
    position,
    color,
    key: uuidv4(),
    direction,
    size,
    mass: 1,
    move: true,
  };

  return newBlock;
};

export const CreateBlock = ({
  position,
  color,
  speed,
  direction,
  move,
  size,
  setGameMode,
  mass,
}) => {
  const setBlockToCorrectLayer = useStackStore((state) => state.setBlockToCorrectLayer);

  const mesh = useRef();

  useEffect(() => {
    setBlockToCorrectLayer({ mesh: mesh.current, direction, size, move });
    console.log("setLayer");
  }, []);

  // const { clock } = useThree();

  const offset = 10;
  if (direction === "x" || direction === "z") {
    position[direction] = -offset;
  }

  // clock.start();
  // let oldTime = 0;
  // useFrame(({ clock }) => {
  //   if (move === true) {
  //     const position = mesh.current.position;
  //     const dt = clock.getElapsedTime() - oldTime;
  //     position[direction] += dt * speed;
  //     oldTime = clock.getElapsedTime();
  //     // console.log(position[direction]);
  //   } else if (position[direction] > offset) {
  //     setGameMode("gameOver");
  //   }
  // });

  return (
    <mesh ref={mesh} position={[position.x, position.y, position.z]}>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
