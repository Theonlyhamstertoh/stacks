import calculateOverlapData from "./calculateOverlap";
import gameOver from "./gameOver";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "./CreateBlock";
import { createOverhangBlock } from "./CreateOverhang";

const playNextLayer = (state) => {
  // take snapshot of position so the time is uniform across the functions
  const snapShotPosition = state.topLayer.mesh.position[state.topLayer.direction];
  const size = state.topLayer.direction === "x" ? state.topLayer.size.x : state.topLayer.size.z;

  const [overlap, delta, offset] = calculateOverlapData({ ...state, size });
  if (overlap > 0 || overlap === null) {
    /* ========================== Touching ============================== */
    if (overlap !== null) {
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
    gameOver();
    state.resetStore();

    // state.resetStore();
  }
};

export default playNextLayer;
