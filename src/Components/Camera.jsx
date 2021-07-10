import { useRef, useEffect } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useStackStore from "./hooks/useStore";

const Camera = ({ group, gameOver }) => {
  const stacks = useStackStore((state) => state.stacks);
  const { camera } = useThree();

  const speed = 0.1;
  const time = useRef(0);
  const stackPosition = stacks.length / 2;

  useEffect(() => {
    camera.lookAt(new THREE.Vector3(0, stackPosition, 0));
    camera.updateProjectionMatrix();
  });

  useFrame(({ camera }) => {
    const groupRotation = group.current.rotation;
    const groupPosition = group.current.position;
    if (!gameOver && stackPosition - 0.5 > camera.position.y - 120) {
      // move the camera to the height of the topLayer
      camera.position.y += speed;

      // rotate the group back to the origin position
      groupRotation.y >= 0 && (groupRotation.y -= speed);
      console.log(gameOver);
    } else if (gameOver) {
      // zoom out and position camera to original position
      camera.position.y > 120 && (camera.position.y -= speed);
      camera.zoom > 20 && (camera.zoom -= speed * 4);

      // spin the group and put it a bit lower.
      groupPosition.y > -10 && (groupPosition.y -= speed);
      groupRotation.y += speed / 8;
      camera.updateProjectionMatrix();
      time.current += 0.01;
    }
  });

  return <OrthographicCamera makeDefault position={[100, 120, 100]} zoom={60} />;
};
export default Camera;
