import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import Camera from "./Components/Camera";
import { useControls } from "leva";
import { useEffect, useState, useRef, useMemo } from "react";
import { Block } from "./Components/CreateBlock";
import useStackStore from "./Components/hooks/useStore";
import shallow from "zustand/shallow";
import playNextLayer from "./Components/playNextLayer";
import { Overhang } from "./Components/CreateOverhang";
import { Html } from "@react-three/drei";

export default function App() {
  const brickDrop = useMemo(() => new Audio("sounds/brickDrop.wav"));
  const [points, setPoints] = useState(0);
  const state = useStackStore(
    (state) => ({
      addBlock: state.addBlock,
      move: state.move,
      setMove: state.setMove,
      resetBlocks: state.resetBlocks,
      topLayer: state.topLayer,
      prevLayer: state.prevLayer,
      stacks: state.stacks,
      addOverhangBlock: state.addOverhangBlock,
      reposition: state.reposition,
      setReposition: state.setReposition,
      updateBlock: state.updateBlock,
      resetStore: state.resetStore,
    }),
    shallow
  );

  const handleKey = (e) => {
    e.code === "Space" && state.setMove(false);
    e.code === "Space" && playNextLayer({ ...state });
  };
  const handleClick = (e) => {
    state.setMove(false);
    playNextLayer({ ...state, setPoints });
  };

  return (
    <div className="fullScreen" onClick={handleClick} onKeyDown={handleKey} tabIndex={-1}>
      <Canvas gl={{ antialias: true }} dpr={Math.max(window.devicePixelRatio, 2)}>
        <Camera />
        <color attach="background" args={["#222"]} />
        <ambientLight args={[0xffffff, 0.4]} />
        <directionalLight args={[0xffffff, 0.6]} position={[50, 100, 50]} />
        <Physics debug={{ color: "white", scale: 1.1 }} gravity={[0, -50, 0]}>
          <Blocks {...state} />
          <OverHangs />
          <Ground size={[4, 0.5, 4]} position={[0, -0.5, 0]} layer={1} />
          <Ground size={[5, 3.5, 5]} position={[0, -2.5, 0]} layer={2} />
          {/* <Plane /> */}
        </Physics>
      </Canvas>
      <div className="flexCenterTop">{points}</div>
    </div>
  );
}

const Ground = ({ position, size, layer }) => {
  const color = `hsl(${40 - layer * 12},50%, 90%)`;
  const [block1] = useBox(() => ({
    mass: 0,
    args: size,
    position,
  }));
  return (
    <mesh ref={block1}>
      <boxBufferGeometry args={size} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
const OverHangs = () => {
  const overhangsArray = useStackStore((state) => state.overhangsArray);

  return overhangsArray.map((overhangInfo) => (
    <Overhang key={overhangInfo.key} {...overhangInfo} />
  ));
};

const Blocks = ({ stacks, topLayer, move, setMove }) => {
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
