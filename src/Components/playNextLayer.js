import calculateOverlapData from "./calculateOverlap";
import gameOver from "./gameOver";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "./CreateBlock";
import { createOverhangBlock } from "./CreateOverhang";
const playNextLayer = (state) => {
  // take snapshot of position so the time is uniform across the functions
  const snapShotPosition = state.topLayer.mesh.position[state.topLayer.direction];
  const size = state.topLayer.direction === "x" ? state.topLayer.size.x : state.topLayer.size.z;

  const [overlap, delta, offset] = calculateOverlapData({ ...state, size });
  state.setReposition([overlap, delta, offset]);
  if (overlap > 0 || overlap === null) {
    /* ========================== Touching ============================== */
    state.stacks.length > 1 && createOverhangBlock({ ...state, snapShotPosition });
    repositionBlockInside({ size, snapShotPosition, ...state, delta, overlap, offset });

    // overhang block creation

    const nextBlockData = initializeNextBlockData(state.topLayer, overlap);
    const nextBlock = createBlockData(state.stacks, ...nextBlockData);

    console.log(nextBlock);
    state.addBlock(nextBlock);
  } else if (overlap < 0) {
    gameOver();
  }
};

export default playNextLayer;
