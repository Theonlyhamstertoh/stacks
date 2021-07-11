import calculateOverlapData from "../calculateOverlap";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "../CreateBlock";
import { createOverhangBlock } from "../CreateOverhang";
import { useState, useEffect } from "react";
import useStackStore from "./useStore";
import useLvl from "./useLvl";
import { playAudio } from "../playAudio";

const useGame = () => {
  const [gameOver, setGameOver] = useState(false);
  const [start, setStart] = useState(false);
  const [destroyMode, setDestroyMode] = useState(false);
  const state = useStackStore();
  const lvl = useLvl();

  const resetGame = () => {
    state.resetStore();
    setGameOver(false);
    lvl.resetLvl();
    setDestroyMode(false);
    // state.addBlock(createBlockData(state.stacks, state.hue, 3, 3, 0, 0, true));
  };

  useEffect(() => gameOver && state.updateBlock(null, state.topLayer.size, state.topLayer.mesh.position, false, true), [gameOver]);
  useEffect(() => {
    const INITIAL = createBlockData(state.stacks, state.hue, 3, 3, 0, 0, true);
    state.addBlock(INITIAL);
  }, []);

  const destroyTower = () => {
    state.makeBlocksFall();
    setDestroyMode(true);
  };

  const playNextLayer = () => {
    state.setMove(false);
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
      const nextBlock = createBlockData(state.stacks, state.hue, ...nextBlockData);

      state.addBlock(nextBlock);
    } else if (overlap < 0) {
      setGameOver(true);
    }
  };

  const handlePress = (e) => {
    if (e.target.classList.contains("gameButton")) return;
    if (gameOver === true) return;
    (e.code === "Space" || e.code === undefined) && playNextLayer();
  };
  return { gameOver, resetGame, handlePress, lvl, destroyTower, speed: lvl.speed, start, setStart, destroyMode, playNextLayer, setGameOver };
};

export default useGame;
