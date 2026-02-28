export const kMeans = (data, k = 3, iterations = 10) =>
{
  let centroids = data.slice(0, k);

  for (let i = 0; i < iterations; i++)
  {
    const clusters = Array.from({ length: k }, () => []);

    data.forEach(point =>
    {
      let minDist = Infinity;
      let clusterIndex = 0;

      centroids.forEach((centroid, index) =>
      {
        const dist = euclidean(point, centroid);
        if (dist < minDist)
        {
          minDist = dist;
          clusterIndex = index;
        }
      });

      clusters[clusterIndex].push(point);
    });

    centroids = clusters.map(cluster =>
    {
      const mean = cluster[0].map((_, i) =>
        cluster.reduce((sum,p)=>sum+p[i],0)/cluster.length
      );
      return mean;
    });
  }

  return centroids;
};

const euclidean = (a,b) =>
{
  return Math.sqrt(
    a.reduce((sum,val,i)=>sum+Math.pow(val-b[i],2),0)
  );
};
import { kMeans } from './clustering.js';

export const clusterSessions = (featureVectors) =>
{
  return kMeans(featureVectors, 3, 15);
};