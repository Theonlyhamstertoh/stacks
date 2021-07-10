import calculateOverlapData from "./calculateOverlap";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "./CreateBlock";
import { createOverhangBlock } from "./CreateOverhang";
import brickDropAudio from "../assets/sounds/brickdrop.wav";
import { useState, useEffect } from "react";
import useStackStore from "./hooks/useStore";

const brickDrop = new Audio(brickDropAudio);

const useGame = () => {
  const [playGame, setPlayGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const points = useScore();
  const state = useStackStore();
  const lvl = useLvl();

  useEffect(() => {
    points.score % 10 === 0 && points.score !== 0 && lvl.nextLvl();
  }, [points.score]);

  const resetGame = () => {
    setGameOver(false);
    setPlayGame(true);
    points.resetScore();
    lvl.resetLvl();
    state.makeBlocksFall();
    // state.resetStore();
  };
  const pauseGame = () => {
    setGameOver(false);
    setPlayGame(false);
  };

  const endGame = () => {
    setGameOver(true);
    setPlayGame(false);
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
        points.updateScore(1);
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
      endGame();
      console.log(state.topLayer);
      state.updateBlock(null, state.topLayer.size, state.topLayer.mesh.position, false, true);
    }
  };

  const handlePress = (e) => {
    if (e.target.classList.contains("gameButton")) return;
    e.code === "Space" || (e.code === undefined && state.setMove(false));
    e.code === "Space" || (e.code === undefined && playNextLayer());
  };
  return { gameOver, pauseGame, playGame, playNextLayer, handlePress, points, lvl, resetGame };
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

export const useLvl = () => {
  const [lvl, setLvl] = useState(1);
  const [isInitialLvl, setIsInitialLvl] = useState(true);
  const nextLvl = () => {
    setIsInitialLvl(false);
    setLvl((prevLvl) => prevLvl + 1);
  };
  const resetLvl = () => {
    setIsInitialLvl(true);
    setLvl(1);
  };
  return { lvl, nextLvl, resetLvl, isInitialLvl };
};

const useWitchMode = () => {};

const useLambMode = () => {};

const useRabbitMode = () => {};

const useHealth = () => {};

const expandBlock = () => {};
const playAudio = () => {
  brickDrop.currentTime = 0;
  brickDrop.play();
};

export default useGame;
