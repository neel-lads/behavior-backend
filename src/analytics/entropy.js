export const pathEntropy = (paths) =>
{
  const total = paths.length;
  const freq = {};

  paths.forEach(p => freq[p] = (freq[p] || 0) + 1);

  let entropy = 0;

  Object.values(freq).forEach(count =>
  {
    const p = count/total;
    entropy -= p * Math.log2(p);
  });

  return entropy;
};