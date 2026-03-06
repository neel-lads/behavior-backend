export const buildFeatureVector = (events) =>
{
  let clicks = 0;
  let transitions = 0;
  let hovers = 0;
  let scrolls = 0;
  let errors = 0;

  for (const event of events)
  {
    const type = event.event_type;   // IMPORTANT

    if (!type) continue;

    if (type === "click")
    {
      clicks++;
    }
    else if (type === "frame_transition")
    {
      transitions++;
    }
    else if (type === "hover")
    {
      hovers++;
    }
    else if (type === "scroll")
    {
      scrolls++;
    }
    else if (type === "error")
    {
      errors++;
    }
  }

  return [
    clicks,
    transitions,
    hovers,
    scrolls,
    errors
  ];
};