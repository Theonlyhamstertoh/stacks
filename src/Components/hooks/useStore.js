import create from "zustand";
import { v4 as uuidv4 } from "uuid";
import { createBlockData } from "../CreateBlock";

const useStackStore = create((set) => ({
  topLayer: null,
  prevLayer: null,
  move: false,
  stacks: [],
  overhangsArray: [],
  reposition: null,
  hue: Math.floor(Math.random() * 360),
  setHue: (newColor) => set((state) => ({ hue: newColor })),
  setReposition: (newReposition) => set((state) => ({ reposition: newReposition })),
  setBlockToCorrectLayer: (block) =>
    set((state) => ({
      prevLayer: state.topLayer,
      topLayer: block,
    })),
  updateBlock: (overlap, size, position, stationary, addPhysics) =>
    set((state) => ({
      stacks: state.stacks.map((block) => {
        if (block.key === state.topLayer.key) {
          return {
            ...block,
            stationary,
            addPhysics,
            overlap,
            size,
            position,
            key: uuidv4(),
          };
        }
        return { ...block, stationary: true };
      }),
    })),
  makeBlocksFall: () =>
    set((state) => {
      const makeAllBlocksFall = state.stacks.map((block) => ({ ...block, stationary: false, key: uuidv4(), explode: true }));
      const makeOverhangBlocksFly = state.overhangsArray.map((block) => ({ ...block, explode: true, key: uuidv4() }));
      return { stacks: makeAllBlocksFall, overhangsArray: makeOverhangBlocksFly };
    }),
  addBlock: (nextBlock) => set((state) => ({ stacks: [...state.stacks, nextBlock] })),
  setMove: (boolean) => set(() => ({ move: boolean })),
  resetStore: () => {
    useStackStore.setState(savedState, true);
    set(() => ({ stacks: [] }));
    set((state) => {
      const newHue = Math.floor(Math.random() * 360);
      state.setHue(newHue);
      state.addBlock(createBlockData(state.stacks, newHue, 3, 3, 0, 0, true));
    });
  },
  addInitialBlock: (blockData) => set(() => ({ stacks: [blockData] })),
  addOverhangBlock: (newBlock) => set((state) => ({ overhangsArray: [...state.overhangsArray, newBlock] })),
}));

const savedState = useStackStore.getState();
export default useStackStore;
