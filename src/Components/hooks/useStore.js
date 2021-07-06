import create from "zustand";
import { createBlockData } from "../CreateBlock";
import { v4 as uuidv4 } from "uuid";

const INITIAL_BLOCK = {
  position: { x: 0, y: 0, z: 0 },
  size: { x: 3, y: 1, z: 3 },
  color: `hsl(${180 + 1 * 2},  100%, 60%)`,
  direction: undefined,
  key: uuidv4(),
  move: false,
  mass: 0,
};

const useStackStore = create((set) => ({
  topLayer: "",
  prevLayer: "",
  move: false,
  stacks: [INITIAL_BLOCK],
  setBlockToCorrectLayer: (block) =>
    set((state) => ({
      prevLayer: state.topLayer,
      topLayer: block,
    })),
  addBlock: () =>
    set((state) => {
      const newStacksArray = state.stacks.map((block) => ({ ...block, move: false }));
      // console.log("PAUSED", state.topLayer.mesh.position[state.topLayer.direction]);
      // console.log(state.stacks[state.stacks.length - 1].move);
      const nextLayerData = calculateBlockDistance(state.topLayer, state.prevLayer);
      if (nextLayerData === null) return;
      // console.log("asdlaksjd");
      const newLayer = createBlockData(state.stacks, nextLayerData);

      // CalculateBlockDistance(state.topLayer, state.prevLayer);
      // set all previous blocks  movement to false. Add new block.
      return { stacks: [...newStacksArray, newLayer] };
    }),
  stopBlocksAnimation: () =>
    set((state) => ({
      stacks: state.stacks.map((block) => ({ ...block, move: false, yolo: "false" })),
    })),
  setMove: (boolean) => set((state) => ({ move: boolean })),
  resetBlocks: () => set((state) => ({ stacks: INITIAL_BLOCK })),

  // calculateBlockDistance: () => {
  //   set((state) => {
  //     console.log(state.topLayer);
  //     console.log(state.prevLayer);
  //   });
  // },
}));

function stopAnimation() {}
const calculateBlockDistance = (topLayer, prevLayer) => {
  if (topLayer.direction === undefined) {
    return [topLayer.size.x, topLayer.size.z, -10, 0];
  }
  const topMeshPosition = topLayer && topLayer.mesh.position;
  const prevMeshPosition = prevLayer && prevLayer.mesh.position;

  const direction = topLayer.direction;
  const size = topLayer.direction === "x" ? topLayer.size.x : topLayer.size.z;
  const delta = topMeshPosition[direction] - prevMeshPosition[direction];
  const offset = Math.abs(delta);

  const overlap = size - offset;

  console.log("asldkj");
  if (overlap > 0) {
    /* ========================== Touching ============================== */
    /* Move block to inside */
    topLayer.mesh.scale[direction] = overlap / size;
    topLayer.mesh.position[direction] -= delta / 2;

    const newWidth = direction === "x" ? overlap : topLayer.size.x;
    const newDepth = direction === "z" ? overlap : topLayer.size.z;

    const nextX = direction === "x" ? topLayer.mesh.position.x : -10;
    const nextZ = direction === "z" ? topLayer.mesh.position.z : -10;

    return [newWidth, newDepth, nextX, nextZ];
    // topLayer.mesh.position[direction] = (topLayer.mesh.position[direction] + 0) / 2;
  } else if (overlap < 0) {
    console.log("not touching");
    return null;
  }
};
export default useStackStore;
