const calculateOverlapData = (topLayer, prevLayer) => {
  // this is needed for the second block
  if (topLayer.direction === undefined) {
    return [null, null, null];
  }

  // get position of the top and prev
  const topLayerPosition = topLayer && topLayer.mesh.position;
  const prevLayerPosition = prevLayer && prevLayer.mesh.position;

  const direction = topLayer.direction;
  const size = topLayer.direction === "x" ? topLayer.size.x : topLayer.size.z;

  // finds the offset
  const delta = topLayerPosition[direction] - prevLayerPosition[direction];
  const offset = Math.abs(delta);

  // calculate the part where there was overlap
  const overlap = size - offset;

  return [direction, overlap, size];
};

export default calculateOverlapData;
