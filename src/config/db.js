import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(client => {
    console.log("DATABASE CONNECTED");
    client.release();
  })
  .catch(err => {
    console.error("DATABASE CONNECTION FAILED");
    console.error(err);
  });