import { pool } from '../config/db.js';
import { pathEntropy } from '../analytics/entropy.js';
import { divergenceScore } from '../analytics/divergence.js';

export const getAnalytics = async (req, res) =>
{
  try
  {
    // Fetch sessions grouped by phase
    const prototypeSessions = await pool.query(
      `SELECT id FROM sessions WHERE phase = 'prototype'`
    );

    const deployedSessions = await pool.query(
      `SELECT id FROM sessions WHERE phase = 'deployed'`
    );

    // Fetch event paths
    const protoEvents = await pool.query(
      `SELECT element FROM events 
       WHERE session_id = ANY($1)`,
      [prototypeSessions.rows.map(s => s.id)]
    );

    const deployEvents = await pool.query(
      `SELECT element FROM events 
       WHERE session_id = ANY($1)`,
      [deployedSessions.rows.map(s => s.id)]
    );

    const protoPaths = protoEvents.rows.map(e => e.element);
    const deployPaths = deployEvents.rows.map(e => e.element);

    const entropyProto = pathEntropy(protoPaths);
    const entropyDeploy = pathEntropy(deployPaths);

    const taskDelta = protoPaths.length - deployPaths.length;

    const divergence = divergenceScore(
      entropyProto,
      entropyDeploy,
      taskDelta
    );

    res.json({
      entropyProto,
      entropyDeploy,
      divergence
    });
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({ message: "Analytics error" });
  }
};
import { clusterSessions } from '../analytics/sessionClustering.js';
import { pool } from '../config/db.js';

export const clusterAnalysis = async (req, res) =>
{
  const result = await pool.query(`
    SELECT s.id as session_id, e.*
    FROM sessions s
    JOIN events e ON s.id = e.session_id
  `);

  const sessionsMap = {};

  result.rows.forEach(row =>
  {
    if (!sessionsMap[row.session_id])
      sessionsMap[row.session_id] = { events: [] };

    sessionsMap[row.session_id].events.push(row);
  });

  const clustered = clusterSessions(
    Object.values(sessionsMap)
  );

  res.json(clustered);
};
import { pool } from "../config/db.js";
import { buildFeatureVector } from "../analytics/featureExtractor.js";
import { clusterSessions } from "../analytics/clustering.js";

export const getSummary = async (req,res) =>
{
  const sessions =
    await pool.query("SELECT id FROM sessions");

  let featureVectors = [];

  for (let s of sessions.rows)
  {
    const events =
      await pool.query(
        "SELECT * FROM events WHERE session_id=$1",
        [s.id]
      );

    const vector =
      buildFeatureVector(events.rows);

    featureVectors.push(vector);
  }

  const clusters =
    clusterSessions(featureVectors);

  res.json({
    divergence: Math.random(), // replace with real divergence
    clusters,
    anomalies: []
  });
};
router.get("/summary", authenticate, getSummary);