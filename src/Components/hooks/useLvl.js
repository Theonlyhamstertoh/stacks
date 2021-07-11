import { useState, useEffect } from "react";
import useScore from "./useScore";
import useSpeed from "./useSpeed";

const useLvl = () => {
  const [lvl, setLvl] = useState(1);
  const speed = useSpeed();
  const points = useScore();

  useEffect(() => {
    points.score % 10 === 0 && points.score !== 0 && nextLvl();
  }, [points.score]);

  const nextLvl = () => {
    setLvl((prevLvl) => prevLvl + 1);
    speed.increaseSpeed();
  };
  const resetLvl = () => {
    setLvl(1);
    speed.resetSpeed();
    points.resetScore();
  };
  return { lvl, nextLvl, resetLvl, ...speed, ...points };
};
export default useLvl;
