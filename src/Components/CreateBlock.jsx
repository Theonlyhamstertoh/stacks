import { useRef, useEffect } from "react";
import useStackStore from "./hooks/useStore";
import { v4 as uuidv4 } from "uuid";

export const initializeNextBlockData = (topLayer, direction, overlap, size) => {
  /* ========================== Touching ============================== */
  if (direction === null && overlap === null && size === null) {
    console.log(topLayer);
    return [topLayer.size.x, topLayer.size.z, -10, 0];
  }

  /* Cut block to be within the prevblock */
  topLayer.mesh.scale[direction] = overlap / size;
  topLayer.mesh.position[direction] = (topLayer.mesh.position[direction] + 0) / 2;

  // provide new data
  const newWidth = direction === "x" ? overlap : topLayer.size.x;
  const newDepth = direction === "z" ? overlap : topLayer.size.z;

  const nextX = direction === "x" ? topLayer.mesh.position.x : -10;
  const nextZ = direction === "z" ? topLayer.mesh.position.z : -10;

  return [newWidth, newDepth, nextX, nextZ];
};

export const createBlockData = (stacks, [newWidth, newDepth, nextX, nextZ]) => {
  const color = `hsl(${180 + stacks.length * 4}, 100%, 60%)`;
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
    move: true,
  };
};

export const Block = ({ position, color, direction, move, size, mass }) => {
  const setBlockToCorrectLayer = useStackStore((state) => state.setBlockToCorrectLayer);

  const mesh = useRef();

  useEffect(() => {
    setBlockToCorrectLayer({ mesh: mesh.current, direction, size, move });
  }, []);

  const offset = 10;
  if (direction === "x" || direction === "z") {
    position[direction] = -offset;
  }
  return (
    <mesh ref={mesh} position={[position.x, position.y, position.z]}>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
