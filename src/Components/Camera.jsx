import { useRef, useEffect } from "react";
import { OrthographicCamera, useHelper } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useStackStore from "./hooks/useStore";
import { CameraHelper } from "three";

const Camera = ({ group, gameOver }) => {
  const stacks = useStackStore((state) => state.stacks);
  console.log(stacks);
  const { camera } = useThree();

  const ref = useRef();
  useHelper(ref, CameraHelper, "cyan");
  const speed = 0.1;
  const stackPosition = stacks.length / 2;

  useEffect(() => {
    camera.lookAt(new THREE.Vector3(0, stackPosition, 0));

    camera.updateProjectionMatrix();
  });

  useFrame(({ camera }) => {
    const groupRotation = group.current.rotation;
    const groupPosition = group.current.position;

    const toFullCircle = (groupRotation.y % (Math.PI * 2)) / (Math.PI * 2);

    if (gameOver === false) {
      // move the camera to the height of the topLayer
      stackPosition - 0.5 > camera.position.y - 120 && (camera.position.y += speed);
      // rotate the group back to the origin position
      groupPosition.y < 0 && (groupPosition.y += speed);
      parseFloat(toFullCircle.toFixed(1)) !== 1.0 && (groupRotation.y += speed / 4);
      camera.zoom < 60 && (camera.zoom += speed * 4);
      camera.updateProjectionMatrix();
    } else if (gameOver === true) {
      // zoom out and position camera to original position
      camera.position.y > 120 && (camera.position.y -= speed);
      camera.zoom > 20 && (camera.zoom -= speed * 4);

      // spin the group and put it a bit lower.
      groupPosition.y > -10 && (groupPosition.y -= speed);
      groupRotation.y += speed / 8;

      camera.updateProjectionMatrix();
    }
  });

  return <OrthographicCamera ref={ref} makeDefault position={[100, 120, 100]} zoom={60} />;
};
export default Camera;
