import { useRef } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useStackStore from "./hooks/useStore";

const Camera = () => {
  const stacks = useStackStore((state) => state.stacks);

  const ref = useRef();
  const { camera } = useThree();
  const speed = 0.1;
  useFrame(({ camera }) => {
    if (stacks.length - 1 > camera.position.y - 120) {
      camera.position.y += speed;
    }
  });

  camera.lookAt(new THREE.Vector3(0, stacks.length, 0));
  camera.updateProjectionMatrix();

  return <OrthographicCamera ref={ref} makeDefault position={[100, 120, 100]} zoom={80} />;
};
export default Camera;
