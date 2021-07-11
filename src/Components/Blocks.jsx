import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Block } from "./CreateBlock";
import useStackStore from "./hooks/useStore";

const Blocks = ({ speed, setGameOver }) => {
  const [stacks, topLayer, setMove, move] = useStackStore((state) => [state.stacks, state.topLayer, state.setMove, state.move]);

  useEffect(() => {
    topLayer && (physicPosition.current = topLayer.mesh.position);
    setMove(true);
  }, [topLayer]);
  const { clock } = useThree();
  const physicPosition = useRef(null);

  clock.start();
  let oldTime = 0;
  useFrame(({ clock }) => {
    if (move && topLayer !== null) {
      const direction = topLayer.direction;
      const dt = clock.getElapsedTime() - oldTime;
      topLayer.mesh.position[direction] += dt * speed;

      if (topLayer.mesh.position[direction] > 8) setGameOver(true);
      oldTime = clock.getElapsedTime();
    } else if (move === false) {
      clock.stop();
    }
  });
  return stacks.map((blockInfo) => <Block {...blockInfo} key={blockInfo.key} id={blockInfo.key} />);
};

export default Blocks;
