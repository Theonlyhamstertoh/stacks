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
  }, [gameOver]);
  useFrame(({ camera, clock }) => {
    if (stacks.length - 1 > camera.position.y - 120) {
      camera.position.y += speed;
      // controlsRef.current.target.set(0, camera.position.y - 120, 0);
      // if(camera.zoom !==)
    }
    if (gameOver && camera.zoom > 30 && camera.position.y > 120) {
      camera.position.y = camera.position.y - speed;
      // camera.zoom -= speed;
      console.log(camera.position.y);
      // controlsRef.current.target.set(0, camera.position.y - 120, 0);
      // camera.updateProjectionMatrix();
    }
  });
  camera.lookAt(new THREE.Vector3(0, stacks.length, 0));
  camera.updateProjectionMatrix();

  return (
    <>
      <OrthographicCamera ref={cameraRef} makeDefault position={[100, 120, 100]} zoom={70} />
      {/* <OrbitControls
        camera={cameraRef.current}
        ref={controlsRef}
        enableRotate={false}
        autoRotate={rotate ? true : false}
        enableZoom={false}
      /> */}
      );
    </>
  );
};
export default Camera;
