export const divergenceScore = (
  entropyProto,
  entropyDeploy,
  taskDelta,
  alpha = 0.6,
  beta = 0.4
) =>
{
  return (alpha * (entropyProto - entropyDeploy)) + (beta * taskDelta);
};
export const transitionDivergence = (m1, m2) =>
{
  let sum = 0;

  const states = new Set([
    ...Object.keys(m1),
    ...Object.keys(m2)
  ]);

  states.forEach(state =>
  {
    const nextStates = new Set([
      ...Object.keys(m1[state] || {}),
      ...Object.keys(m2[state] || {})
    ]);

    nextStates.forEach(next =>
    {
      const p1 = m1[state]?.[next] || 0;
      const p2 = m2[state]?.[next] || 0;

      sum += Math.pow(p1 - p2, 2);
    });
  });

  return Math.sqrt(sum);
};
export const severityScore = (
  entropyDiff,
  transitionDiff,
  taskDelta
) =>
{
  const w1 = 0.3;
  const w2 = 0.5;
  const w3 = 0.2;

  return (w1 * entropyDiff) +
         (w2 * transitionDiff) +
         (w3 * taskDelta);
};