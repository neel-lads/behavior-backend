import { pool } from "../config/db.js";
import { buildFeatureVector } from "../analytics/featureExtractor.js";
import { clusterSessions } from "../analytics/clustering.js";

export const getSummary = async (req, res) =>
{
  const sessions = await pool.query("SELECT id FROM sessions");

  let featureVectors = [];

  for (let s of sessions.rows)
  {
    const events =
      await pool.query(
        "SELECT * FROM events WHERE session_id=$1",
        [s.id]
      );

    const vector = buildFeatureVector(events.rows);
    featureVectors.push(vector);
  }

  const clusters = clusterSessions(featureVectors);

  res.json({
    divergence: 0,
    clusters,
    anomalies: []
  });
};