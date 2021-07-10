import { useRef, useEffect } from "react";
import useStackStore from "./hooks/useStore";
import { v4 as uuidv4 } from "uuid";
import { useBox } from "@react-three/cannon";

export const repositionBlockInside = ({ topLayer, delta, overlap, size, snapShotPosition }) => {
  const position = snapShotPosition - delta / 2;
  topLayer.mesh.scale[topLayer.direction] = overlap / size;
  topLayer.mesh.position[topLayer.direction] = position;
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

  const newSize = { x: newWidth, y: topLayer.size.y, z: newDepth };
  const newPos = { x: position.x, y: position.y, z: position.z };
  updateBlock(overlap, newSize, newPos, true, true);
  return [newWidth, newDepth, nextX, nextZ];
};

export const createBlockData = (stacks, newWidth, newDepth, nextX, nextZ) => {
  const color = `hsl(${40 + stacks.length * 6},50%, 50%)`;
  const position = { x: nextX, y: stacks.length / 2, z: nextZ };
  const direction = stacks.length % 2 ? "x" : "z";
  const size = { x: newWidth, y: 0.5, z: newDepth };

  // create new block
  return {
    position,
    color,
    key: uuidv4(),
    direction,
    stationary: false,
    addPhysics: false,
    size,
    overlap: null,
  };
};

export const Block = ({ position, color, direction, addPhysics, size, id, stationary }) => {
  const setBlockToCorrectLayer = useStackStore((state) => state.setBlockToCorrectLayer);

  const [physicRef, api] = useBox(() => ({
    mass: stationary ? 0 : 1,
    args: [size.x, size.y, size.z],
    position: [position.x, position.y, position.z],
  }));

  const ref = useRef();
  useEffect(() => {
    const block = {
      mesh: addPhysics ? physicRef.current : ref.current,
      key: id,
      direction,
      size,
      color,
    };
    setBlockToCorrectLayer(block);
  }, []);
  const offset = 5;
  if (!addPhysics && direction !== null) {
    position[direction] = -offset;
  }

  return (
    <mesh ref={addPhysics ? physicRef : ref} position={[position.x, position.y, position.z]} receiveShadow>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
