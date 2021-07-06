import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import Camera from "./Components/Camera";
import { useControls } from "leva";
import { Block } from "./Components/CreateBlock";
import useStackStore from "./Components/hooks/useStore";
import shallow from "zustand/shallow";
import playNextLayer from "./Components/playNextLayer";

export default function App() {
  const [move, setMove, addBlock, resetBlocks, topLayer, prevLayer, stacks] = useStackStore(
    (state) => [
      state.move,
      state.setMove,
      state.addBlock,
      state.resetBlocks,
      state.topLayer,
      state.prevLayer,
      state.stacks,
    ],
    shallow
  );

  const handleKey = (e) => {
    e.code === "Space" && setMove(false);
    e.code === "Space" && playNextLayer(topLayer, prevLayer, stacks, resetBlocks, addBlock);
    e.code === "Space" && setMove(true);
  };
  const handleClick = (e) => {
    setMove(false);
    playNextLayer(topLayer, prevLayer, stacks, resetBlocks, addBlock);
    setMove(true);
  };

  return (
    <div className="fullScreen" onClick={handleClick} onKeyDown={handleKey} tabIndex={-1}>
      <Canvas gl={{ antialias: true }} dpr={Math.max(window.devicePixelRatio, 2)}>
        <Camera />
        <color attach="background" args={["#222"]} />
        <ambientLight args={[0xffffff, 0.4]} />
        <directionalLight args={[0xffffff, 0.6]} position={[50, 100, 50]} />
        {/* <OrbitControls /> */}
        <Physics>
          <Blocks move={move} />
          {/* <Plane /> */}
        </Physics>
      </Canvas>
    </div>
  );
}

const Blocks = ({ move }) => {
  const stacks = useStackStore((state) => state.stacks);
  const topLayer = useStackStore((state) => state.topLayer);

  const { speed } = useControls({
    speed: {
      value: 2,
      min: 0,
      max: 20,
      step: 0.25,
    },
  });
  const { clock } = useThree();

  clock.start();
  let oldTime = 0;
  useFrame(({ clock }) => {
    const direction = topLayer.direction;
    if (move) {
      const position = topLayer.mesh.position;
      const dt = clock.getElapsedTime() - oldTime;
      position[direction] += dt * speed;
      oldTime = clock.getElapsedTime();
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
      <meshPhongMaterial color="hotpink" />
    </mesh>
  );
};
