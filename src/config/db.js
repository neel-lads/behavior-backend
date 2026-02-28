import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () =>
{
  try
  {
    const client = await pool.connect();
    console.log("DATABASE CONNECTED");
    client.release();
  }
  catch (err)
  {
    console.error("DATABASE CONNECTION FAILED");
    console.error(err);
  }
})();