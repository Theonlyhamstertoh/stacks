import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import Camera from "./Components/Camera";
import { useControls } from "leva";
import { useEffect, useState, useRef } from "react";
import { Block } from "./Components/CreateBlock";
import useStackStore from "./Components/hooks/useStore";
import shallow from "zustand/shallow";
import playNextLayer from "./Components/playNextLayer";
import { Overhang } from "./Components/CreateOverhang";

export default function App() {
  const [move, setMove] = useState(false);
  const state = useStackStore(
    (state) => ({
      addBlock: state.addBlock,
      resetBlocks: state.resetBlocks,
      topLayer: state.topLayer,
      prevLayer: state.prevLayer,
      stacks: state.stacks,
      addOverhangBlock: state.addOverhangBlock,
      reposition: state.reposition,
      setReposition: state.setReposition,
    }),
    shallow
  );

  const handleKey = (e) => {
    e.code === "Space" && setMove(false);
    e.code === "Space" && playNextLayer({ ...state });
    e.code === "Space" && setMove(true);
  };
  const handleClick = (e) => {
    setMove(false);

    playNextLayer({ ...state });
    // console.log(move);
  };

  return (
    <div className="fullScreen" onClick={handleClick} onKeyDown={handleKey} tabIndex={-1}>
      <Canvas gl={{ antialias: true }} dpr={Math.max(window.devicePixelRatio, 2)}>
        <Camera />
        <color attach="background" args={["#222"]} />
        <ambientLight args={[0xffffff, 0.4]} />
        <directionalLight args={[0xffffff, 0.6]} position={[50, 100, 50]} />
        <OrbitControls />
        <Physics>
          <Blocks {...state} move={move} setMove={setMove} />
          <OverHangs />
          <Plane />
        </Physics>
      </Canvas>
    </div>
  );
}

const OverHangs = () => {
  const overhangsArray = useStackStore((state) => state.overhangsArray);

  return overhangsArray.map((overhangInfo) => (
    <Overhang key={overhangInfo.key} {...overhangInfo} />
  ));
};

const Blocks = ({ stacks, topLayer, move, prevLayer, setMove }) => {
  const { speed } = useControls({
    speed: {
      value: 3.5,
      min: 0,
      max: 20,
      step: 0.25,
    },
  });
  useEffect(() => {
    topLayer && (physicPosition.current = topLayer.mesh.position);
    setMove(true);
    console.log(move);
  }, [topLayer]);
  const { clock } = useThree();
  const physicPosition = useRef(null);

  clock.start();
  let oldTime = 0;
  useFrame(({ clock }) => {
    if (move && topLayer !== null) {
      const current = physicPosition.current;
      const direction = topLayer.direction;
      const dt = clock.getElapsedTime() - oldTime;
      // current[direction] += dt * speed;
      topLayer.mesh.position[direction] += dt * speed;
      // topLayer.cannon.position.set(current.x, current.y, current.z);
      oldTime = clock.getElapsedTime();
    } else if (move === false) {
      console.log("STOP");
      clock.stop();
    }
  });
  return stacks.map((blockInfo) => {
    return <Block {...blockInfo} key={blockInfo.key} />;
  });
};
const Plane = () => {
  const [ref] = usePlane(() => ({ mass: 0, rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[100, 100]} />
      <meshLambertMaterial color="#141817" />
    </mesh>
  );
};
