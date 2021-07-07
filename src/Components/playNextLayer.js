import calculateOverlapData from "./calculateOverlap";
import gameOver from "./gameOver";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "./CreateBlock";
const playNextLayer = (topLayer, prevLayer, stacks, resetBlocks, addBlock, setMove) => {
  // take snapshot of position so the time is uniform across the functions
  const snapShotPosition = topLayer.mesh.position[topLayer.direction];
  const size = topLayer.direction === "x" ? topLayer.size.x : topLayer.size.z;
  const overlap = calculateOverlapData(topLayer, prevLayer, size);
  if (overlap > 0 || overlap === null) {
    /* ========================== Touching ============================== */
    repositionBlockInside(topLayer, snapShotPosition, overlap, size);
    const nextBlockData = initializeNextBlockData(topLayer, overlap, size);
    const nextBlock = createBlockData(stacks, nextBlockData);
    addBlock(nextBlock);
  } else if (overlap < 0) {
    gameOver();
  }
};

export default playNextLayer;
