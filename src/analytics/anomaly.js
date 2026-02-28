export const detectAnomaly = (score, threshold = 0.75) =>
{
  return score > threshold;
};
export const zScoreAnomaly = (values, threshold = 2) =>
{
  const mean =
    values.reduce((a,b)=>a+b,0) / values.length;

  const std =
    Math.sqrt(
      values.reduce((a,b)=>a+Math.pow(b-mean,2),0)
      / values.length
    );

  return values.map(v =>
  {
    const z = (v - mean) / std;
    return { value: v, z, isAnomaly: Math.abs(z) > threshold };
  });
};