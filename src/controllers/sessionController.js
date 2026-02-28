import { pool } from '../config/db.js';

export const createSession = async (req,res) =>
{
  const { sessionId, phase } = req.body;

  await pool.query(
    `INSERT INTO sessions(id,user_id,phase,started_at)
     VALUES($1,$2,$3,NOW())`,
    [sessionId, req.user.id, phase]
  );

  res.json({ message:"Session created" });
};

export const logEvent = async (req,res) =>
{
  const { sessionId, type, element, duration, extra } = req.body;

  await pool.query(
    `INSERT INTO events(session_id,type,element,timestamp,duration,extra)
     VALUES($1,$2,$3,NOW(),$4,$5)`,
    [sessionId,type,element,duration,extra]
  );

  res.json({ message:"Event logged" });
};