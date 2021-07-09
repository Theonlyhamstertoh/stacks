import calculateOverlapData from "./calculateOverlap";
import gameOver from "./gameOver";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "./CreateBlock";
import { createOverhangBlock } from "./CreateOverhang";
import brickDropAudio from "../assets/sounds/brickdrop.wav";
const brickDrop = new Audio(brickDropAudio);
// const brickDrop = new Audio("/sounds/brickDrop.wav");
const playNextLayer = (state) => {
  // take snapshot of position so the time is uniform across the functions
  const snapShotPosition = state.topLayer.mesh.position[state.topLayer.direction];
  const size = state.topLayer.direction === "x" ? state.topLayer.size.x : state.topLayer.size.z;

  const [overlap, delta, offset] = calculateOverlapData({ ...state, size });
  if (overlap > 0 || overlap === null) {
    /* ========================== Touching ============================== */
    if (overlap !== null) {
      brickDrop.currentTime = 0;
      brickDrop.play();
      state.setPoints((prev) => prev + 1);
      createOverhangBlock({ ...state, snapShotPosition, delta, overlap, offset });
      const position = repositionBlockInside({
        size,
        snapShotPosition,
        ...state,
        delta,
        overlap,
        offset,
      });
      state.setReposition([overlap, position]);
    }

    // overhang block creation
    const nextBlockData = initializeNextBlockData(state.topLayer, overlap, state.updateBlock);
    const nextBlock = createBlockData(state.stacks, ...nextBlockData);

    state.addBlock(nextBlock);
  } else if (overlap < 0) {
    gameOver(true);
    state.resetStore();
  }
};

export default playNextLayer;
