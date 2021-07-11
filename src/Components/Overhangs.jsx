import { Overhang } from "./CreateOverhang";
import useStackStore from "./hooks/useStore";
const OverHangs = () => {
  const overhangsArray = useStackStore((state) => state.overhangsArray);

  return overhangsArray.map((overhangInfo) => <Overhang key={overhangInfo.key} {...overhangInfo} />);
};

export default OverHangs;
