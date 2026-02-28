import { pathEntropy } from './entropy.js';

export const buildFeatureVector = (events) =>
{
  let clicks = 0;
  let scrollValues = [];
  let dwellTimes = [];
  let errors = 0;
  let paths = [];

  events.forEach(e =>
  {
    if (e.type === "click") clicks++;
    if (e.type === "scroll_depth") scrollValues.push(e.extra?.scrollPercent || 0);
    if (e.type === "dwell_time") dwellTimes.push(e.duration || 0);
    if (e.type === "error_event") errors++;
    if (e.type === "click") paths.push(e.element);
  });

  const avgScroll =
    scrollValues.length > 0
      ? scrollValues.reduce((a,b)=>a+b,0)/scrollValues.length
      : 0;

  const avgDwell =
    dwellTimes.length > 0
      ? dwellTimes.reduce((a,b)=>a+b,0)/dwellTimes.length
      : 0;

  const entropy = pathEntropy(paths);

  return [
    clicks,
    avgScroll,
    avgDwell,
    errors,
    entropy
  ];
};