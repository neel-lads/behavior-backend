// Entropy based divergence between prototype and deployed phases
export const divergenceScore = (
  entropyProto,
  entropyDeploy,
  taskDelta,
  alpha = 0.6,
  beta = 0.4
) =>
{
  // safety checks
  if (entropyProto === undefined || entropyDeploy === undefined)
    return 0;

  const entropyDiff = Math.abs(entropyProto - entropyDeploy);

  return (alpha * entropyDiff) + (beta * taskDelta);
};


// Transition matrix divergence (behavior path differences)
export const transitionDivergence = (m1 = {}, m2 = {}) =>
{
  let sum = 0;

  const states = new Set([
    ...Object.keys(m1 || {}),
    ...Object.keys(m2 || {})
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

      const diff = p1 - p2;

      sum += diff * diff;
    });
  });

  return Math.sqrt(sum);
};


// Final anomaly severity score
export const severityScore = (
  entropyDiff,
  transitionDiff,
  taskDelta
) =>
{
  const w1 = 0.3;  // entropy importance
  const w2 = 0.5;  // transition behavior importance
  const w3 = 0.2;  // task completion impact

  entropyDiff = entropyDiff || 0;
  transitionDiff = transitionDiff || 0;
  taskDelta = taskDelta || 0;

  const score =
    (w1 * entropyDiff) +
    (w2 * transitionDiff) +
    (w3 * taskDelta);

  return Number(score.toFixed(4));
};