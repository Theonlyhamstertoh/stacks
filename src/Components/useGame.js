import calculateOverlapData from "./calculateOverlap";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "./CreateBlock";
import { createOverhangBlock } from "./CreateOverhang";
import brickDropAudio from "../assets/sounds/brickdrop.wav";
import { useState, useEffect } from "react";
import useStackStore from "./hooks/useStore";

const brickDrop = new Audio(brickDropAudio);

const useGame = () => {
  const [gameOver, setGameOver] = useState(false);
  const state = useStackStore();
  const lvl = useLvl();

  const resetGame = () => {
    setGameOver(false);
    lvl.resetLvl();
    state.resetStore();
  };

  const destroyTower = () => {
    state.makeBlocksFall();
  };

  const playNextLayer = () => {
    // take snapshot of position so the time is uniform across the functions
    const snapShotPosition = state.topLayer.mesh.position[state.topLayer.direction];
    const size = state.topLayer.direction === "x" ? state.topLayer.size.x : state.topLayer.size.z;

    const [overlap, delta, offset] = calculateOverlapData({ ...state, size });
    if (overlap > 0 || overlap === null) {
      /* ========================== Touching ============================== */
      if (overlap !== null) {
        playAudio();
        lvl.updateScore(1);
        createOverhangBlock({ ...state, snapShotPosition, delta, overlap, offset });
        const pos = repositionBlockInside({
          size,
          snapShotPosition,
          ...state,
          delta,
          overlap,
          offset,
        });
        state.setReposition([overlap, pos]);
      }

      // overhang block creation
      const nextBlockData = initializeNextBlockData(state.topLayer, overlap, state.updateBlock);
      const nextBlock = createBlockData(state.stacks, ...nextBlockData);

      state.addBlock(nextBlock);
    } else if (overlap < 0) {
      setGameOver(true);
      console.log(state.topLayer);
      state.updateBlock(null, state.topLayer.size, state.topLayer.mesh.position, false, true);
    }
  };

  const handlePress = (e) => {
    if (e.target.classList.contains("gameButton")) return;
    if (gameOver === true) return;
    (e.code === "Space" || e.code === undefined) && state.setMove(false);
    (e.code === "Space" || e.code === undefined) && playNextLayer();
  };
  return { gameOver, resetGame, handlePress, lvl, destroyTower, speed: lvl.speed };
};

const useScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const resetScore = () => setScore(0);
  const updateScore = (points) => {
    setScore((prevScore) => {
      const newScore = prevScore + points;
      highScore < newScore && setHighScore(newScore);
      return newScore;
    });
  };
  return { score, highScore, resetScore, updateScore };
};

const useSpeed = () => {
  const [speed, setSpeed] = useState(5);

  const increaseSpeed = () => {
    setSpeed((prevSpeed) => prevSpeed + 0.5);
  };

  const resetSpeed = () => {
    setSpeed(5);
  };

  return { speed, increaseSpeed, resetSpeed };
};
export const useLvl = () => {
  const [lvl, setLvl] = useState(1);
  const speed = useSpeed();
  const points = useScore();

  useEffect(() => {
    points.score % 10 === 0 && points.score !== 0 && nextLvl();
  }, [points.score]);
  const nextLvl = () => {
    setLvl((prevLvl) => prevLvl + 1);
    speed.increaseSpeed();
  };
  const resetLvl = () => {
    setLvl(1);
    speed.resetSpeed();
    points.resetScore();
  };
  return { lvl, nextLvl, resetLvl, ...speed, ...points };
};

export const playAudio = () => {
  brickDrop.currentTime = 0;
  brickDrop.play();
};

export default useGame;
