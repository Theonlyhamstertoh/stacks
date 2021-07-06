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
  stacks: [INITIAL_BLOCK],
  setBlockToCorrectLayer: (block) =>
    set((state) => ({
      prevLayer: state.topLayer,
      topLayer: block,
    })),
  addBlock: () => {
    set((state) => {
      const newLayer = createBlockData(state.stacks);
      // CalculateBlockDistance(state.topLayer, state.prevLayer);
      // set all previous blocks  movement to false. Add new block.
      const newStacksArray = state.stacks.map((block) => ({ ...block, move: false }));
      return { stacks: [...newStacksArray, newLayer] };
    });
  },

  resetBlocks: () => set((state) => ({ stacks: INITIAL_BLOCK })),
  // calculateBlockDistance: () => {
  //   set((state) => {
  //     console.log(state.topLayer);
  //     console.log(state.prevLayer);
  //   });
  // },
}));

export default useStackStore;
