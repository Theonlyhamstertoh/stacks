import calculateOverlapData from "../calculateOverlap";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "../CreateBlock";
import { createOverhangBlock } from "../CreateOverhang";
import brickDropAudio from "../../assets/sounds/brickdrop.wav";
import { useState, useEffect } from "react";
import useStackStore from "./useStore";
import useLvl from "./useLvl";

const brickDrop = new Audio(brickDropAudio);

const useGame = () => {
  const [gameOver, setGameOver] = useState(false);
  const state = useStackStore();
  const lvl = useLvl();

  const resetGame = () => {
    state.resetStore();
    setGameOver(false);
    // state.addBlock(createBlockData(state.stacks, state.hue, 3, 3, 0, 0, true));
  };

  useEffect(() => {
    const INITIAL = createBlockData(state.stacks, state.hue, 3, 3, 0, 0, true);
    state.addBlock(INITIAL);
  }, []);
  useEffect(() => console.log(state.hue), [state.hue]);
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
      const nextBlock = createBlockData(state.stacks, state.hue, ...nextBlockData);

      state.addBlock(nextBlock);
    } else if (overlap < 0) {
      setGameOver(true);
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

export const playAudio = () => {
  brickDrop.currentTime = 0;
  brickDrop.play();
};

export default useGame;
