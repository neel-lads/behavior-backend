import { pool } from "../config/db.js";

export const createSession = async (req,res)=>
{
  try
  {
    const { sessionId, phase } = req.body;

    await pool.query(
      `INSERT INTO sessions (session_id, phase, user_id)
       VALUES ($1,$2,$3)`,
      [sessionId, phase, req.user.id]
    );

    res.json({ message:"Session created" });
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const logEvent = async (req,res)=>
{
  try
  {
    const { sessionId, eventType, metadata } = req.body;

    if(!sessionId || !eventType)
    {
      return res.status(400).json({
        error:"sessionId and eventType are required"
      });
    }

    await pool.query(
      `INSERT INTO events (session_id,event_type,metadata)
       VALUES ($1,$2,$3)`,
      [sessionId, eventType, metadata || {}]
    );

    res.json({ message:"Event logged" });
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};