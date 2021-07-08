import { useRef, useEffect } from "react";
import useStackStore from "./hooks/useStore";
import { v4 as uuidv4 } from "uuid";
import { useBox } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import * as CANNON from "cannon-es";
import { Html } from "@react-three/drei";

export const repositionBlockInside = (topLayer, delta, overlap, size, snapShotPosition) => {
  if (overlap === null) return;

  // problem is here. You can't just scale a block like this
  const position = snapShotPosition - delta / 2;
  // InnerBlock(position, overlap, topLayer);
  topLayer.mesh.scale[topLayer.direction] = overlap / size;
  topLayer.mesh.position[topLayer.direction] = position;
};

export const initializeNextBlockData = (topLayer, overlap) => {
  // if the topBlock is still the very first one, create second block position
  if (topLayer.direction === null) return [topLayer.size.x, topLayer.size.z, -10, 0];
  const direction = topLayer.direction;

  // provide new data
  const newWidth = direction === "x" ? overlap : topLayer.size.x;
  const newDepth = direction === "z" ? overlap : topLayer.size.z;

  const nextX = direction === "x" ? topLayer.mesh.position.x : -10;
  const nextZ = direction === "z" ? topLayer.mesh.position.z : -10;

  return [newWidth, newDepth, nextX, nextZ];
};

export const createBlockData = (stacks, newWidth, newDepth, nextX, nextZ) => {
  const color = `hsl(${140 + stacks.length * 4}, 100%, 60%)`;
  const position = { x: nextX, y: stacks.length, z: nextZ };
  const direction = stacks.length % 2 ? "x" : "z";
  const size = { x: newWidth, y: 1, z: newDepth };

  // create new block
  return {
    position,
    color,
    key: uuidv4(),
    direction,
    size,
  };
};

export const Block = ({ position, color, direction, size }) => {
  const setBlockToCorrectLayer = useStackStore((state) => state.setBlockToCorrectLayer);
  // const [ref, api] = useBox(() => ({
  //   // type: "Static",
  //   mass: 0,
  //   args: [size.x, size.y, size.z],
  //   position: [position.x, position.y, position.z],
  // }));

  const ref = useRef();
  useEffect(() => {
    setBlockToCorrectLayer({
      mesh: ref.current,
      // cannon: api,
      direction,
      size,
    });
  }, []);

  const offset = 10;
  if (direction === "x" || direction === "z") {
    position[direction] = -offset;
  }
  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshNormalMaterial color={color} />
    </mesh>
  );
};

export const InnerBlock = (position, overlap, topLayer) => {
  const direction = topLayer.direction;

  const newWidth = direction === "x" ? overlap : topLayer.size.x;
  const newDepth = direction === "z" ? overlap : topLayer.size.z;

  const x = direction === "x" ? position : topLayer.mesh.position.x;
  const z = direction === "z" ? position : topLayer.mesh.position.z;

  const [ref, api] = useBox(() => ({
    mass: 0,
    args: [newWidth, topLayer.size.y, newDepth],
    position: [x, topLayer.mesh.position.y, z],
  }));

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={[newWidth, topLayer.size.y, newDepth]} />
      <meshNormalMaterial />
    </mesh>
  );
};
