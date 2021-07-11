import { useState } from "react";

const useSpeed = () => {
  const [speed, setSpeed] = useState(5);

  const increaseSpeed = () => {
    setSpeed((prevSpeed) => prevSpeed + 0.5);
  };

  const resetSpeed = () => {
    setSpeed(5);
  };

  return { speed, increaseSpeed, resetSpeed };
};

export default useSpeed;
