import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  options: "-c search_path=better_auth,public",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: true } : undefined,
  max: Number(process.env.DB_POOL_MAX ?? 5),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  allowExitOnIdle: true,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error);
});
