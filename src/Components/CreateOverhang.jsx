import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBox } from "@react-three/cannon";
export const createOverhangBlock = (
  snapShotPosition,
  offset,
  overlap,
  stacks,
  topLayer,
  addOverhangBlock,
  delta,
  size
) => {
  const overhangShift = (overlap / 2) * Math.sign(delta);
  const xPosition =
    topLayer.direction === "x" ? snapShotPosition + overhangShift : topLayer.mesh.position.x;
  const zPosition =
    topLayer.direction === "z" ? snapShotPosition + overhangShift : topLayer.mesh.position.z;
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
  // const [ref, api] = useBox(() => ({
  //   mass: 1,
  //   position: [position.x, position.y, position.z],
  //   args: [size.x, size.y, size.z],
  //   material: {
  //     friction: 0.3,
  //     restitution: 0.8,
  //   },
  // }));
  return (
    <mesh position={[position.x, position.y, position.z]}>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
