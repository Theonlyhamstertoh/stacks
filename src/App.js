import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import Camera from "./Components/Camera";
import { useControls } from "leva";
import { useEffect, useState, useRef, useMemo } from "react";
import { Block } from "./Components/CreateBlock";
import useStackStore from "./Components/hooks/useStore";
import useGame from "./Components/useGame";
import { Overhang } from "./Components/CreateOverhang";
import { Html, Stars, Sky } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/web";
export default function App() {
  const { handlePress, gameOver, resetGame, pauseGame, playGame, playNextLayer, points, lvl } = useGame();

  useEffect(() => {
    document.body.onclick = (e) => handlePress(e);
    document.body.onkeydown = (e) => handlePress(e);
  });
  return (
    <>
      <div className="gameContainer">
        <div className="scoreBox">
          <div className="points">{points.score}</div>
          <div className="lvl">Level {lvl.lvl}</div>
        </div>
        {gameOver && (
          <button className="gameButton" onClick={resetGame}>
            Play Again
          </button>
        )}
      </div>
      <Scene gameOver={gameOver} />
    </>
  );
}

const Scene = ({ gameOver }) => {
  const ref = useRef();

  const props = useSpring({ background: useColor(-2, 40, 50, 10) });

  return (
    <animated.div className="fullScreen" style={props}>
      <Canvas gl={{ antialias: true, shadowMap: THREE.PCFShadowMap }} dpr={Math.max(window.devicePixelRatio, 2)} shadows>
        <Camera group={ref} gameOver={gameOver} />
        <ambientLight args={[0xffffff, 0.3]} />
        <directionalLight args={[0xffffff, 0.8]} position={[50, 100, 50]} castShadow />
        <Physics broadphase="SAP" gravity={[0, -50, 0]}>
          <group ref={ref}>
            <Blocks />
            <OverHangs />
            <Ground size={[4, 0.5, 4]} position={[0, -0.5, 0]} layer={1} />
            <Ground size={[5, 3.5, 5]} position={[0, -2.5, 0]} layer={2} />
          </group>
        </Physics>
      </Canvas>
    </animated.div>
  );
};
const useColor = (factor, hue, sat, light) => {
  const stacks = useStackStore((state) => state.stacks);
  const color = `hsl(${hue + stacks.length * factor},${sat}%, ${light}%)`;
  return color;
};

const Ground = ({ position, size, layer }) => {
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
const OverHangs = () => {
  const overhangsArray = useStackStore((state) => state.overhangsArray);

  return overhangsArray.map((overhangInfo) => <Overhang key={overhangInfo.key} {...overhangInfo} />);
};

const Blocks = () => {
  const [stacks, topLayer, setMove, move] = useStackStore((state) => [state.stacks, state.topLayer, state.setMove, state.move]);
  const { speed } = useControls({
    speed: {
      value: 5.5,
      min: 0,
      max: 20,
      step: 0.25,
    },
  });
  useEffect(() => {
    topLayer && (physicPosition.current = topLayer.mesh.position);
    setMove(true);
  }, [topLayer]);
  const { clock } = useThree();
  const physicPosition = useRef(null);

  clock.start();
  let oldTime = 0;
  useFrame(({ clock }) => {
    if (move && topLayer !== null) {
      const direction = topLayer.direction;
      const dt = clock.getElapsedTime() - oldTime;
      topLayer.mesh.position[direction] += dt * speed;
      oldTime = clock.getElapsedTime();
    } else if (move === false) {
      clock.stop();
    }
  });
  return stacks.map((blockInfo) => <Block {...blockInfo} key={blockInfo.key} id={blockInfo.key} />);
};

const Plane = () => {
  const [ref] = usePlane(() => ({
    mass: 0,
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.25, 0],
  }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[100, 100]} />
      <meshLambertMaterial color="#141817" />
    </mesh>
  );
};
