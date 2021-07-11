import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox } from "@react-three/cannon";
import Camera from "./Components/Camera";
import { useEffect, useRef } from "react";
import { Block } from "./Components/CreateBlock";
import useStackStore from "./Components/hooks/useStore";
import useGame from "./Components/hooks/useGame";
import { Overhang } from "./Components/CreateOverhang";
import useColor from "./Components/hooks/useColor";
import Blocks from "./Components/Blocks";
import FoundationBlock from "./Components/FoundationBlocks";
import OverHangs from "./Components/Overhangs";

export default function App() {
  const GAME = useGame();
  useEffect(() => {
    GAME.start === true && (document.body.onclick = (e) => GAME.handlePress(e));
    GAME.start === true && (document.body.onkeydown = (e) => GAME.handlePress(e));
  });

  return (
    <>
      {/* Game UI */}
      <GameUI {...GAME} />
      {/* Canvas */}
      <Scene {...GAME} />
    </>
  );
}

const GameUI = ({ gameOver, speed, lvl, destroyTower, destroyMode, resetGame, start, setStart, playNextLayer }) => {
  return (
    <>
      <div className="gameContainer">
        {start && (
          <>
            <div className="scoreBox">
              <div className="points">{lvl.score}</div>
              <div className="lvl">Level {lvl.lvl}</div>
              <div className="normalSize speed">Speed: {speed - 4}x</div>
            </div>
            {gameOver && <input type="button" value="Play Again" className="gameButton" onClick={resetGame} />}
            {gameOver && <input type="button" value="Destroy Tower" className="gameButton" onClick={destroyTower} disabled={destroyMode} />}
          </>
        )}
        {!start && <div className="title">Stacks: Recreated</div>}
      </div>
      {!start && (
        <input
          type="button"
          value="Start Game"
          className="gameButton start"
          onClick={(e) => {
            setStart(true);
            playNextLayer();
          }}
        />
      )}
    </>
  );
};
const Scene = ({ gameOver, speed, setGameOver }) => {
  const ref = useRef();

  return (
    <div className="fullScreen">
      <Canvas gl={{ antialias: true, shadowMap: THREE.PCFShadowMap }} dpr={Math.max(window.devicePixelRatio, 2)} shadows>
        <Camera group={ref} gameOver={gameOver} />
        <color attach="background" args={[useColor(2, 40, 50, 10)]} />
        <ambientLight args={[0xffffff, 0.3]} />
        <directionalLight args={[0xffffff, 0.8]} position={[50, 100, 50]} castShadow />
        <Physics broadphase="SAP" gravity={[0, -50, 0]} allowSleep={true}>
          <group ref={ref}>
            <Blocks speed={speed} setGameOver={setGameOver} />
            <OverHangs />
            <FoundationBlock size={[4, 0.5, 4]} position={[0, -0.5, 0]} layer={1} />
            <FoundationBlock size={[5, 3.5, 5]} position={[0, -2.5, 0]} layer={2} />
          </group>
        </Physics>
      </Canvas>
    </div>
  );
};
