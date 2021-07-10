import { v4 as uuidv4 } from "uuid";
import { useBox } from "@react-three/cannon";

export const createOverhangBlock = ({ snapShotPosition, offset, overlap, topLayer, addOverhangBlock, delta }) => {
  const overhangShift = (overlap / 2) * Math.sign(delta);
  const overhangPosition = snapShotPosition + overhangShift;
  const xPosition = topLayer.direction === "x" ? overhangPosition : topLayer.mesh.position.x;
  const yPosition = topLayer.mesh.position.y;
  const zPosition = topLayer.direction === "z" ? overhangPosition : topLayer.mesh.position.z;
  const width = topLayer.direction === "x" ? offset : topLayer.size.x;
  const depth = topLayer.direction === "z" ? offset : topLayer.size.z;

  const overhangData = {
    size: { x: width, y: 0.5, z: depth },
    position: { x: xPosition, y: yPosition, z: zPosition },
    key: uuidv4(),
    color: topLayer.color,
  };

  addOverhangBlock(overhangData);
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
    <mesh ref={ref} receiveShadow castShadow>
      <boxBufferGeometry args={[size.x, size.y, size.z]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
