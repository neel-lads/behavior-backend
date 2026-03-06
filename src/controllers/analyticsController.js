import { pool } from "../config/db.js";
import { buildFeatureVector } from "../analytics/featureExtractor.js";
import { clusterSessions } from "../analytics/clustering.js";

export const getAnalytics = async (req,res)=>
{
  try
  {
    const sessions =
      await pool.query(
        "SELECT session_id, phase FROM sessions"
      );

    let featureVectors = [];
    let prototypeVectors = [];
    let deployedVectors = [];

    for(const s of sessions.rows)
    {
      const events =
        await pool.query(
          "SELECT event_type FROM events WHERE session_id=$1",
          [s.session_id]
        );

      const vector =
        buildFeatureVector(events.rows);

      featureVectors.push(vector);

      if(s.phase === "prototype")
        prototypeVectors.push(vector);

      if(s.phase === "deployed")
        deployedVectors.push(vector);
    }

    const clusters =
      clusterSessions(featureVectors);

    const avg = (arr)=>
    {
      if(arr.length === 0) return [0,0,0,0,0];

      let sum=[0,0,0,0,0];

      for(const v of arr)
      {
        for(let i=0;i<5;i++)
          sum[i]+=v[i];
      }

      return sum.map(v=>v/arr.length);
    };

    const protoAvg = avg(prototypeVectors);
    const deployAvg = avg(deployedVectors);

    let divergence = 0;

    for(let i=0;i<5;i++)
    {
      divergence += Math.abs(protoAvg[i]-deployAvg[i]);
    }

    res.json({
      sessions: sessions.rows.length,
      featureVectors,
      clusters,
      prototypeAvg: protoAvg,
      deployedAvg: deployAvg,
      divergence
    });

  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({error:err.message});
  }
};