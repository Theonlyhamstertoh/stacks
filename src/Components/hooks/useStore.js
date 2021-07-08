// import create from "zustand";
// import { createBlockData } from "../CreateBlock";
// import { v4 as uuidv4 } from "uuid";

// const INITIAL_BLOCK = {
//   position: { x: 0, y: 0, z: 0 },
//   size: { x: 3, y: 1, z: 3 },
//   color: `hsl(${180 + 1 * 2},  100%, 60%)`,
//   direction: undefined,
//   key: uuidv4(),
//   move: false,
//   mass: 0,
// };

// const useStackStore = create((set) => ({
//   topLayer: "",
//   prevLayer: "",
//   move: false,
//   stacks: [INITIAL_BLOCK],
//   setBlockToCorrectLayer: (block) =>
//     set((state) => ({
//       prevLayer: state.topLayer,
//       topLayer: block,
//     })),
//   addBlock: () =>
//     set((state) => {
//       const nextLayerData = calculateBlockDistance(state.topLayer, state.prevLayer);
//       // console.log(nextLayerData);
//       if (nextLayerData === null) return;
//       const newLayer = createBlockData(state.stacks, nextLayerData);

//       // set all previous blocks  movement to false. Add new block.
//       return { stacks: [...state.stacks, newLayer] };
//     }),
//   setMove: (boolean) => set((state) => ({ move: boolean })),
//   resetBlocks: () => set((state) => ({ stacks: INITIAL_BLOCK })),
// }));

// const calculateBlockDistance = (topLayer, prevLayer) => {
//   // this is needed for the second block
//   if (topLayer.direction === undefined) {
//     return [topLayer.size.x, topLayer.size.z, -10, 0];
//   }

//   // get position of the top and prev
//   const topMeshPosition = topLayer && topLayer.mesh.position;
//   const prevMeshPosition = prevLayer && prevLayer.mesh.position;

//   const direction = topLayer.direction;
//   const size = topLayer.direction === "x" ? topLayer.size.x : topLayer.size.z;

//   // finds the offset
//   const delta = topMeshPosition[direction] - prevMeshPosition[direction];
//   const offset = Math.abs(delta);

//   // calculate the part where there was overlap
//   const overlap = size - offset;

//   if (overlap > 0) {
//     /* ========================== Touching ============================== */
//     /* Move block to inside */
//     topLayer.mesh.scale[direction] = overlap / size;
//     topLayer.mesh.position[direction] -= delta / 2;

//     const newWidth = direction === "x" ? overlap : topLayer.size.x;
//     const newDepth = direction === "z" ? overlap : topLayer.size.z;

//     const nextX = direction === "x" ? topLayer.mesh.position.x : -10;
//     const nextZ = direction === "z" ? topLayer.mesh.position.z : -10;

//     return [newWidth, newDepth, nextX, nextZ];
//   } else if (overlap < 0) {
//     console.log("not touching");
//     return null;
//   }
// };

// export default useStackStore;

import create from "zustand";
import { v4 as uuidv4 } from "uuid";

const INITIAL_BLOCK = {
  position: { x: 0, y: 0, z: 0 },
  size: { x: 3, y: 1, z: 3 },
  color: `hsl(${140 + 1 * 4},  100%, 60%)`,
  direction: null,
  key: uuidv4(),
  stationary: true,
  mass: 0,
};

const useStackStore = create((set) => ({
  topLayer: null,
  prevLayer: null,
  move: false,
  stacks: [INITIAL_BLOCK],
  overhangsArray: [],
  reposition: null,
  setReposition: (newReposition) => set((state) => ({ reposition: newReposition })),
  setBlockToCorrectLayer: (block) =>
    set((state) => ({
      prevLayer: state.topLayer,
      topLayer: block,
    })),
  updateBlock: (overlap, size, position) =>
    set((state) => ({
      stacks: state.stacks.map((block) => {
        if (block.key === state.topLayer.key) {
          return {
            ...block,
            stationary: true,
            overlap,
            size,
            position,
            key: uuidv4(),
          };
        }
        return { ...block, stationary: true };
      }),
    })),
  addBlock: (nextBlock) => set((state) => ({ stacks: [...state.stacks, nextBlock] })),
  setMove: (boolean) => set((state) => ({ move: boolean })),
  resetBlocks: () => set((state) => ({ stacks: INITIAL_BLOCK })),
  addOverhangBlock: (newBlock) =>
    set((state) => ({ overhangsArray: [...state.overhangsArray, newBlock] })),
}));

export default useStackStore;
