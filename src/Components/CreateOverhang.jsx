import { useRef, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBox } from "@react-three/cannon";
export const createOverhangBlock = ({
  snapShotPosition,
  offset,
  overlap,
  topLayer,
  addOverhangBlock,
  delta,
}) => {
  const overhangShift = (overlap / 2) * Math.sign(delta);
  const overhangPosition = snapShotPosition + overhangShift;
  const xPosition = topLayer.direction === "x" ? overhangPosition : topLayer.mesh.position.x;
  const yPosition = topLayer.mesh.position.y;
  const zPosition = topLayer.direction === "z" ? overhangPosition : topLayer.mesh.position.z;
  const width = topLayer.direction === "x" ? offset : topLayer.size.x;
  const depth = topLayer.direction === "z" ? offset : topLayer.size.z;

  const overhangBlock = createOverhangData(
    width,
    depth,
    xPosition,
    yPosition,
    zPosition,
    topLayer.color
  );
  console.log(topLayer);
  addOverhangBlock(overhangBlock);
};

const createOverhangData = (width, depth, x, y, z, color) => {
  // const color = `hsl(${140 + y * 4}, 100%, 60%)`;
  const position = { x, y, z };
  console.log(color);
  const size = { x: width, y: 0.5, z: depth };
  return {
    color,
    position,
    key: uuidv4(),
    size,
  };
};

export const Overhang = ({ color, position, size }) => {
  const [ref] = useBox(() => ({
    mass: 1,
    position: [position.x, position.y, position.z],
    args: [size.x, size.y, size.z],
    material: {
      friction: 0.2,
      restitution: 0.7,
    },
  }));

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
