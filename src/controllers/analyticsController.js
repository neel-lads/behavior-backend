import { pool } from "../config/db.js";
import { buildFeatureVector } from "../analytics/featureExtractor.js";
import { clusterSessions } from "../analytics/clustering.js";

export const getAnalytics = async (req,res)=>
{
  const sessions =
    await pool.query("SELECT session_id, phase FROM sessions");

  let featureVectors = [];

  for (let s of sessions.rows)
  {
    const events =
      await pool.query(
        "SELECT * FROM events WHERE session_id=$1",
        [s.session_id]
      );

    const vector = buildFeatureVector(events.rows);

    featureVectors.push({
      session_id: s.session_id,
      phase: s.phase,
      vector
    });
  }

  const clusters = clusterSessions(
    featureVectors.map(v => v.vector)
  );

  res.json({
    sessions: featureVectors.length,
    clusters
  });
};