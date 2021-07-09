import { useRef, useState, useEffect } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useStackStore from "./hooks/useStore";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { useSpring, animated, config } from "@react-spring/three";

const Camera = ({ group }) => {
  const stacks = useStackStore((state) => state.stacks);
  const gameOver = useStackStore((state) => state.gameOver);
  const { rotateCamera } = useControls({
    rotateCamera: false,
  });
  const cameraRef = useRef();
  const controlsRef = useRef();
  const { camera } = useThree();
  const speed = 0.1;

  const stackPosition = stacks.length / 2;

  useEffect(() => {
    camera.lookAt(new THREE.Vector3(0, stackPosition, 0));
    camera.updateProjectionMatrix();
  });

  const time = useRef(0);
  useFrame(({ camera, clock }) => {
    if (!gameOver && stackPosition - 0.5 > camera.position.y - 120) {
      camera.position.y += speed;
    }
    group.current.rotation > 0 && (group.current.rotation.y -= speed);
    if (gameOver) {
      if (camera.position.y > 120) camera.position.y -= speed;
      group.current.position.y > -10 && (group.current.position.y -= speed);
      group.current.rotation.y += speed / 8;
      if (camera.zoom > 20) camera.zoom -= speed * 4;
      time.current += 0.01;

      camera.updateProjectionMatrix();
    }
  });

  return <OrthographicCamera ref={cameraRef} makeDefault position={[100, 120, 100]} zoom={60} />;
};
export default Camera;
