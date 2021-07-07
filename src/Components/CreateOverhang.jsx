import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export const createOverhangBlock = (
  snapShotPosition,
  offset,
  overlap,
  stacks,
  topLayer,
  addOverhangBlock
) => {
  const xPosition =
    topLayer.direction === "x" ? snapShotPosition - overlap / 2 : topLayer.mesh.position.x;
  const zPosition =
    topLayer.direction === "z" ? snapShotPosition - overlap / 2 : topLayer.mesh.position.z;
  const width = topLayer.direction === "x" ? offset : topLayer.size.x;
  const depth = topLayer.direction === "z" ? offset : topLayer.size.z;

  const yPosition = topLayer.mesh.position.y;
  const overhangBlock = createOverhangData(width, depth, xPosition, yPosition, zPosition);
  addOverhangBlock(overhangBlock);
};

const createOverhangData = (width, depth, x, y, z) => {
  // const color = `hsl(${140 + y * 4}, 100%, 60%)`;
  const color = "red";
  const position = { x, y, z };
  const size = { x: width, y: 1, z: depth };

  return {
    color,
    position,
    key: uuidv4(),
    size,
  };
};

export const Overhang = ({ color, position, size }) => {
  const mesh = useRef();
  return (
    <mesh ref={mesh} position={[position.x, position.y, position.z]}>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
