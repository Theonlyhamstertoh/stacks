import calculateOverlapData from "./calculateOverlap";
import gameOver from "./gameOver";
import { createBlockData, initializeNextBlockData, repositionBlockInside } from "./CreateBlock";
const playNextLayer = (topLayer, prevLayer, stacks, resetBlocks, addBlock, setMove) => {
  // take snapshot of position so the time is uniform across the functions
  const snapShotPosition = topLayer.mesh.position[topLayer.direction];
  const size = topLayer.direction === "x" ? topLayer.size.x : topLayer.size.z;
  const [overlap, delta, offset] = calculateOverlapData(topLayer, prevLayer, size);
  if (overlap > 0 || overlap === null) {
    /* ========================== Touching ============================== */
    repositionBlockInside(topLayer, delta, overlap, size, snapShotPosition);

    // overhang block creation
    createOverhangBlock(snapShotPosition, offset, stacks, topLayer);

    const nextBlockData = initializeNextBlockData(topLayer, overlap, size);
    const nextBlock = createBlockData(stacks, ...nextBlockData);
    addBlock(nextBlock);
  } else if (overlap < 0) {
    gameOver();
  }
};

const createOverhangBlock = (snapShotPosition, offset, stacks, topLayer) => {
  const xPosition =
    topLayer.direction === "x" ? snapShotPosition - offset / 2 : topLayer.mesh.position.x;
  const zPosition =
    topLayer.direction === "z" ? snapShotPosition - offset / 2 : topLayer.mesh.position.z;
  const width = topLayer.direction === "x" ? offset : topLayer.size.x;
  const depth = topLayer.direction === "z" ? offset : topLayer.size.z;

  const overhangBlock = createOverhangData(stacks, width, depth, xPosition, zPosition);
  console.log(overhangBlock);
};

export const createOverhangData = (stacks, width, depth, x, z) => {
  const color = `hsl(${140 + stacks.length * 4}, 100%, 60%)`;
  const position = { x: x, y: stacks.length, z: z };
  const direction = stacks.length % 2 ? "x" : "z";
  const size = { x: width, y: 1, z: depth };

  return {
    color,
    position,
    direction,
    size,
  };
};

export default playNextLayer;

/**
 * -0.2947999999523283
   0.2947999999523283
   2.7052000000476717
 */
