import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const register = async (req, res) =>
{
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)",
    [name,email,hashed,role]
  );

  res.json({ message: "User registered" });
};

export const login = async (req,res) =>
{
  const { email, password } = req.body;
  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",[email]
  );

  if (result.rows.length === 0)
    return res.status(400).json({message:"Invalid credentials"});

  const user = result.rows[0];
  const valid = await bcrypt.compare(password,user.password);

  if (!valid)
    return res.status(400).json({message:"Invalid credentials"});

  const token = jwt.sign(
    { id:user.id, role:user.role },
    process.env.JWT_SECRET,
    { expiresIn:'8h' }
  );

  res.json({ token });
};