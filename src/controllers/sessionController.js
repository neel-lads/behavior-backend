import { pool } from '../config/db.js';

export const createSession = async (req,res) =>
{
  try
  {
    const { sessionId, phase } = req.body;

    await pool.query(
      `INSERT INTO sessions(session_id,user_id,phase)
       VALUES($1,$2,$3)`,
      [sessionId, req.user.id, phase]
    );

    res.json({ message:"Session created" });
  }
  catch(err)
  {
    console.error("CREATE SESSION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const logEvent = async (req,res) =>
{
  try
  {
    const { sessionId, type, element, duration, extra } = req.body;

    await pool.query(
      `INSERT INTO events(session_id,event_type,metadata)
       VALUES($1,$2,$3)`,
      [
        sessionId,
        type,
        JSON.stringify({ element, duration, extra })
      ]
    );

    res.json({ message:"Event logged" });
  }
  catch(err)
  {
    console.error("LOG EVENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};