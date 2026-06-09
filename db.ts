import { Pool } from "pg";

const pool = new Pool({
  host: "aws-1-us-east-2.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  user: "postgres.sglrmvoyqjimbfxdccls",
  password: "Ronditas2026+", // 👈 el que configuraste en Supabase
  ssl: { rejectUnauthorized: false }
});

export default pool;
