import { useRef, useEffect, useState, useMemo } from "react";
import { OrthographicCamera, useHelper } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useStackStore from "./hooks/useStore";
import { CameraHelper } from "three";
import { useSpring, animated } from "@react-spring/three";

const Camera = ({ group, gameOver }) => {
  const stacks = useStackStore((state) => state.stacks);
  const { camera } = useThree();

  const speed = 0.1;
  const cubeRef = useRef();
  const stackPosition = stacks.length / 2;

  const ref = useRef();

  useFrame(({ camera }) => {
    const groupRotation = group.current.rotation;
    const groupPosition = group.current.position;
    const cubePosition = cubeRef.current.position;

    if (gameOver === false) {
      const toFullCircle = (groupRotation.y % (Math.PI * 2)) / (Math.PI * 2);
      const roundedRotationPosition = parseFloat(toFullCircle.toFixed(1));
      // move the camera to the height of the topLayer
      stackPosition - 0.5 > cubePosition.y && (cubePosition.y += speed);
      // rotate the group back to the origin position
      groupPosition.y < 0 && (groupPosition.y += speed * 4);

      if (roundedRotationPosition !== 1.0 && toFullCircle !== 0) {
        groupRotation.y += speed;
      }
      camera.zoom < 60 && (camera.zoom += speed * 8);
    } else if (gameOver === true) {
      // zoom out and position camera to original position
      cubePosition.y > 0 && (cubePosition.y -= speed);
      camera.zoom > 20 && (camera.zoom -= speed * 4);

      // spin the group and put it a bit lower.
      groupPosition.y > -10 && (groupPosition.y -= speed);
      groupRotation.y += speed / 8;

      camera.updateProjectionMatrix();
    }

    camera.lookAt(cubeRef.current.position);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <OrthographicCamera ref={ref} makeDefault position={[100, 120, 100]} zoom={60} />;
      <mesh ref={cubeRef} visible={false}>
        <boxBufferGeometry args={[0.5, 0.5, 0.5]} />
        <meshNormalMaterial />
      </mesh>
    </>
  );
};

export default Camera;
