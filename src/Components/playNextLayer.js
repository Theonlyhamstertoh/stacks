import calculateOverlapData from "./calculateOverlap";
import gameOver from "./gameOver";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "./CreateBlock";
import { createOverhangBlock } from "./CreateOverhang";
const playNextLayer = (topLayer, prevLayer, stacks, resetBlocks, addBlock, addOverhangBlock) => {
  // take snapshot of position so the time is uniform across the functions
  const snapShotPosition = topLayer.mesh.position[topLayer.direction];
  console.log(snapShotPosition);
  const size = topLayer.direction === "x" ? topLayer.size.x : topLayer.size.z;
  const [overlap, delta, offset] = calculateOverlapData(topLayer, prevLayer, size);
  if (overlap > 0 || overlap === null) {
    /* ========================== Touching ============================== */
    stacks.length > 1 &&
      createOverhangBlock(snapShotPosition, offset, overlap, topLayer, addOverhangBlock, delta);
    repositionBlockInside(topLayer, delta, overlap, size, snapShotPosition);

    // overhang block creation

    const nextBlockData = initializeNextBlockData(topLayer, overlap, size);
    const nextBlock = createBlockData(stacks, ...nextBlockData);
    addBlock(nextBlock);
  } else if (overlap < 0) {
    gameOver();
  }
};

export default playNextLayer;
