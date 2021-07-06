import create from "zustand";
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
  addBlock: (newLayer) => set((state) => ({ stacks: [...state.stacks, newLayer] })),
  setMove: (boolean) => set((state) => ({ move: boolean })),
  resetBlocks: () => set((state) => ({ stacks: INITIAL_BLOCK })),
}));

export default useStackStore;
