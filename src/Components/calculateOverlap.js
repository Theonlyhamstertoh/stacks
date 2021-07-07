const calculateOverlapData = (topLayer, prevLayer, size) => {
  // this is needed for the second block
  const direction = topLayer.direction;
  if (direction === undefined) {
    return null;
  }

  // get position of the top and prev
  const topLayerPosition = topLayer && topLayer.mesh.position;
  const prevLayerPosition = prevLayer && prevLayer.mesh.position;

  // finds the offset
  const delta = topLayerPosition[direction] - prevLayerPosition[direction];
  const offset = Math.abs(delta);

  // calculate the part where there was overlap
  const overlap = size - offset;

  return overlap;
};

export default calculateOverlapData;
