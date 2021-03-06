import brickDropAudio from "../assets/sounds/brickdrop.wav";
const brickDrop = new Audio(brickDropAudio);

export const playAudio = (e) => {
  if (e !== undefined && e.contact.impactVelocity > 3) {
    brickDrop.currentTime = 0;
    brickDrop.volume = e.contact.impactVelocity / 80;
    brickDrop.play();
  } else if (e === undefined) {
    brickDrop.volume = 1;
    brickDrop.currentTime = 0;
    brickDrop.play();
  }
};
