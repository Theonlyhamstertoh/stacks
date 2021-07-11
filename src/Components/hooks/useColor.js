import useStackStore from "./useStore";

const useColor = (factor, hue, sat, light) => {
  const stacks = useStackStore((state) => state.stacks);
  const color = `hsl(${hue + stacks.length * factor},${sat}%, ${light}%)`;
  return color;
};

export default useColor;
