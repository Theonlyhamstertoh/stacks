import { useState } from "react";

const useScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const resetScore = () => setScore(0);
  const updateScore = (points) => {
    setScore((prevScore) => {
      const newScore = prevScore + points;
      highScore < newScore && setHighScore(newScore);
      return newScore;
    });
  };
  return { score, highScore, resetScore, updateScore };
};
export default useScore;
