import { useRef, useState, useEffect } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useStackStore from "./hooks/useStore";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { useSpring, animated, config } from "@react-spring/three";

const Camera = () => {
  const stacks = useStackStore((state) => state.stacks);
  const gameOver = useStackStore((state) => state.gameOver);
  const [rotate, setRotate] = useState(false);
  const { rotateCamera } = useControls({
    rotateCamera: false,
  });
  const cameraRef = useRef();
  const controlsRef = useRef();
  const { camera } = useThree();
  const speed = 0.1;

  useEffect(() => {
    gameOver && setRotate(true);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }, [gameOver]);
  const stackPosition = stacks.length / 2;
  useFrame(({ camera, clock }) => {
    if (!gameOver && stackPosition - 0.5 > camera.position.y - 120) {
      camera.position.y += speed;
      controlsRef.current.target.set(0, camera.position.y - 120, 0);
      // if(camera.zoom !==)
    }
    if (gameOver && camera.zoom > 30 && camera.position.y > 120) {
      camera.position.y -= speed;
      camera.zoom -= speed;
      console.log(camera.position.y - 120);

      controlsRef.current.target.set(0, camera.position.y - 120, 0);
      camera.updateProjectionMatrix();
    }
  });
  camera.lookAt(new THREE.Vector3(0, stackPosition, 0));
  camera.updateProjectionMatrix();

  return (
    <>
      <OrthographicCamera ref={cameraRef} makeDefault position={[100, 120, 100]} zoom={60} />
      <OrbitControls
        camera={cameraRef.current}
        ref={controlsRef}
        enableRotate={false}
        autoRotate={rotate ? true : false}
        enableZoom={false}
      />
      );
    </>
  );
};
export default Camera;
