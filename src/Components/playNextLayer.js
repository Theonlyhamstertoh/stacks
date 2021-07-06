import calculateOverlapData from "./calculateOverlap";
import gameOver from "./gameOver";
import { createBlockData, initializeNextBlockData } from "./CreateBlock";
const playNextLayer = (topLayer, prevLayer, stacks, resetBlocks, addBlock) => {
  const [direction, overlap, size] = calculateOverlapData(topLayer, prevLayer);
  if (overlap > 0 || (direction === null && overlap === null && size === null)) {
    console.log("alsdkj");
    const nextLayerData = initializeNextBlockData(topLayer, direction, overlap, size);
    const newLayer = createBlockData(stacks, nextLayerData);
    console.log(newLayer);
    addBlock(newLayer);
  } else if (overlap < 0) {
    gameOver();
  }
};

export default playNextLayer;
