import create from "zustand";
import { v4 as uuidv4 } from "uuid";

const INITIAL_BLOCK = {
  position: { x: 0, y: 0, z: 0 },
  size: { x: 3, y: 0.5, z: 3 },
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
  stacks: [{ ...INITIAL_BLOCK }],
  overhangsArray: [],
  reposition: null,
  gameOver: false,
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
  setMove: (boolean) => set(() => ({ move: boolean })),
  resetStore: () => {
    // useStackStore.setState(savedState, true);
    // set(() => ({ stacks: [{ ...INITIAL_BLOCK, key: uuidv4() }] }));
    set(() => ({ gameOver: true }));
  },
  addOverhangBlock: (newBlock) =>
    set((state) => ({ overhangsArray: [...state.overhangsArray, newBlock] })),
}));

const savedState = useStackStore.getState();
export default useStackStore;
