import { useRef } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useStackStore from "./hooks/useStore";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";

const Camera = () => {
  const stacks = useStackStore((state) => state.stacks);

  const { rotateCamera } = useControls({
    rotateCamera: true,
  });
  const cameraRef = useRef();
  const controlsRef = useRef();
  const { camera } = useThree();
  const speed = 0.1;

  useFrame(({ camera, clock }) => {
    if (stacks.length - 1 > camera.position.y - 120) {
      camera.position.y += speed;
      controlsRef.current.target.set(0, camera.position.y - 120, 0);
    }
  });
  camera.lookAt(new THREE.Vector3(0, stacks.length, 0));
  camera.updateProjectionMatrix();

  return (
    <>
      <OrthographicCamera ref={cameraRef} makeDefault position={[100, 120, 100]} zoom={70} />
      <OrbitControls
        camera={cameraRef.current}
        ref={controlsRef}
        autoRotate={rotateCamera ? true : false}
        enableZoom={false}
      />
      );
    </>
  );
};
export default Camera;
