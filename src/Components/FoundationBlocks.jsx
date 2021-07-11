import { useBox } from "@react-three/cannon";

const FoundationBlock = ({ position, size, layer }) => {
  const color = `hsl(${40 - layer * 12},50%, 90%)`;
  const [block1] = useBox(() => ({
    mass: 0,
    args: size,
    position,
  }));
  return (
    <mesh ref={block1} receiveShadow castShadow>
      <boxBufferGeometry args={size} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
export default FoundationBlock;
