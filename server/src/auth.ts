import { betterAuth } from "better-auth";
import { pool } from "./db.js";

const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

const socialProviders = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    }
  : {};

export const auth = betterAuth({
  appName: "AKSANI",
  baseURL,
  database: pool,
  trustedOrigins: [clientOrigin, "http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders,
  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await pool.query(
            `insert into aksani.profiles (user_id, email, full_name, avatar_url)
             values ($1, $2, $3, $4)
             on conflict (user_id) do update
             set email = excluded.email,
                 full_name = excluded.full_name,
                 avatar_url = excluded.avatar_url,
                 updated_at = now()`,
            [user.id, user.email, user.name, user.image ?? null],
          );
        },
      },
      update: {
        after: async (user) => {
          await pool.query(
            `update aksani.profiles
             set email = $2, full_name = $3, avatar_url = $4, updated_at = now()
             where user_id = $1`,
            [user.id, user.email, user.name, user.image ?? null],
          );
        },
      },
      delete: {
        after: async (user) => {
          await pool.query("delete from aksani.profiles where user_id = $1", [user.id]);
        },
      },
    },
  },
});
