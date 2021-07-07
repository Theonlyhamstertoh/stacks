import { useRef, useEffect } from "react";
import useStackStore from "./hooks/useStore";
import { v4 as uuidv4 } from "uuid";
import { useBox } from "@react-three/cannon";

export const repositionBlockInside = (topLayer, delta, overlap, size, snapShotPosition) => {
  if (overlap === null) return;

  topLayer.mesh.scale[topLayer.direction] = overlap / size;
  topLayer.mesh.position[topLayer.direction] = snapShotPosition - delta / 2;
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
    mass: 1,
  };
};

export const Block = ({ position, color, direction, size, mass }) => {
  const setBlockToCorrectLayer = useStackStore((state) => state.setBlockToCorrectLayer);

  const mesh = useRef();

  useEffect(() => {
    setBlockToCorrectLayer({ mesh: mesh.current, direction, size });
  }, []);

  const [ref] = useBox(() => ({
    type: "Static",
    mass: 0,
    position: [position.x, position.y, position.z],
  }));
  const offset = 10;
  if (direction === "x" || direction === "z") {
    position[direction] = -offset;
  }
  return (
    <mesh ref={mesh} position={[position.x, position.y, position.z]}>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshNormalMaterial color={color} />
    </mesh>
  );
};
