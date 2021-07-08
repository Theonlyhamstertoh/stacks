import { useRef, useEffect } from "react";
import useStackStore from "./hooks/useStore";
import { v4 as uuidv4 } from "uuid";
import { useBox } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import * as CANNON from "cannon-es";
import { Html } from "@react-three/drei";

export const repositionBlockInside = ({ topLayer, delta, overlap, size, snapShotPosition }) => {
  // problem is here. You can't just scale a block like this
  const position = snapShotPosition - delta / 2;
  // InnerBlock(position, overlap, topLayer);

  topLayer.mesh.scale[topLayer.direction] = overlap / size;
  topLayer.mesh.position[topLayer.direction] = position;
  console.log(topLayer.mesh.position.x);
  return position;
};

export const initializeNextBlockData = (topLayer, overlap, updateBlock) => {
  // if the topBlock is still the very first one, create second block position
  if (topLayer.direction === null) return [topLayer.size.x, topLayer.size.z, -10, 0];
  const direction = topLayer.direction;
  const position = topLayer.mesh.position;
  // provide new data
  const newWidth = direction === "x" ? overlap : topLayer.size.x;
  const newDepth = direction === "z" ? overlap : topLayer.size.z;

  const nextX = direction === "x" ? position.x : -10;
  const nextZ = direction === "z" ? position.z : -10;

  updateBlock(
    overlap,
    { x: newWidth, y: topLayer.size.y, z: newDepth },
    { x: position.x, y: position.y, z: position.z }
  );
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
    stationary: false,
    size,
  };
};

export const Block = ({ position, color, direction, size, id, stationary }) => {
  const setBlockToCorrectLayer = useStackStore((state) => state.setBlockToCorrectLayer);

  const [physicRef, api] = useBox(() => ({
    mass: 0,
    args: [size.x, size.y, size.z],
    position: [position.x, position.y, position.z],
  }));

  const ref = useRef();
  useEffect(() => {
    setBlockToCorrectLayer({
      mesh: stationary ? physicRef.current : ref.current,
      key: id,
      direction,
      size,
    });
    console.log(position);
  }, []);
  const offset = 10;
  if (!stationary && direction !== null) {
    position[direction] = -offset;
  }

  return (
    <mesh ref={stationary ? physicRef : ref} position={[position.x, position.y, position.z]}>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshNormalMaterial color={color} />
    </mesh>
  );
};
