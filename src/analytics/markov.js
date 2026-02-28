export const buildTransitionMatrix = (events) =>
{
  const transitions = {};
  let previous = null;

  events.forEach(e =>
  {
    if (e.type === "click")
    {
      if (previous)
      {
        if (!transitions[previous])
          transitions[previous] = {};

        transitions[previous][e.element] =
          (transitions[previous][e.element] || 0) + 1;
      }

      previous = e.element;
    }
  });

  // Convert to probabilities
  Object.keys(transitions).forEach(state =>
  {
    const total = Object.values(transitions[state])
      .reduce((a,b)=>a+b,0);

    Object.keys(transitions[state]).forEach(next =>
    {
      transitions[state][next] /= total;
    });
  });

  return transitions;
};