import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { fromNodeHeaders } from "better-auth/node";
import { z } from "zod";
import { auth } from "./auth.js";
import { pool } from "./db.js";

const app = Fastify({
  logger: true,
  trustProxy: true,
  bodyLimit: 1_048_576,
});

const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

await app.register(cors, {
  origin: [clientOrigin, "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86_400,
});

app.get("/health", async (request, reply) => {
  try {
    const result = await pool.query(
      "select count(*)::int as categories from aksani.activity_categories",
    );
    return {
      ok: true,
      service: "aksani-api",
      database: "connected",
      seededCategories: result.rows[0]?.categories ?? 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    request.log.error({ error }, "Database readiness check failed");
    return reply.code(503).send({
      ok: false,
      service: "aksani-api",
      database: "unavailable",
      timestamp: new Date().toISOString(),
    });
  }
});

app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
      const headers = fromNodeHeaders(request.headers);
      const body = request.body;

      const authRequest = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });

      const response = await auth.handler(authRequest);
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      const setCookies = response.headers.getSetCookie?.();
      if (setCookies?.length) reply.header("set-cookie", setCookies);
      return reply.send(response.body ? await response.text() : null);
    } catch (error) {
      request.log.error({ error }, "Authentication request failed");
      return reply.status(500).send({ error: "Authentication request failed" });
    }
  },
});

async function requireSession(request: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });
  if (!session) {
    reply.code(401).send({ error: "Unauthorized" });
    return null;
  }
  return session;
}

app.get("/api/me", async (request, reply) => {
  const session = await requireSession(request, reply);
  if (!session) return;

  const result = await pool.query(
    "select user_id, email, full_name, avatar_url, role, is_active from aksani.profiles where user_id = $1 limit 1",
    [session.user.id],
  );

  return { user: session.user, profile: result.rows[0] ?? null };
});

app.get("/api/activity-categories", async (request, reply) => {
  const session = await requireSession(request, reply);
  if (!session) return;

  const result = await pool.query(
    "select id, slug, name, description, sort_order from aksani.activity_categories where is_active = true order by sort_order, name",
  );
  return { data: result.rows };
});

const dailyEntrySchema = z.object({
  entryDate: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  activityName: z.string().trim().min(1).max(160),
  quantity: z.number().min(0).max(1_000_000).default(1),
  unitLabel: z.string().trim().min(1).max(32).default("kali"),
  isCompleted: z.boolean().default(true),
  notes: z.string().trim().max(2_000).nullable().optional(),
});

app.get("/api/daily-entries", async (request, reply) => {
  const session = await requireSession(request, reply);
  if (!session) return;

  const query = request.query as { date?: string };
  const entryDate = query.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(entryDate)) {
    return reply.code(400).send({ error: "Invalid date. Use YYYY-MM-DD." });
  }

  const result = await pool.query(
    `select id, entry_date, category_id, activity_name, quantity, unit_label, is_completed, notes, created_at
     from aksani.daily_entries
     where user_id = $1 and entry_date = $2
     order by created_at`,
    [session.user.id, entryDate],
  );
  return { data: result.rows };
});

app.post("/api/daily-entries", async (request, reply) => {
  const session = await requireSession(request, reply);
  if (!session) return;

  const parsed = dailyEntrySchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: "Invalid activity entry",
      details: parsed.error.flatten(),
    });
  }

  const value = parsed.data;
  const result = await pool.query(
    `insert into aksani.daily_entries
       (user_id, entry_date, category_id, activity_name, quantity, unit_label, is_completed, notes)
     values ($1, coalesce($2::date, current_date), $3, $4, $5, $6, $7, $8)
     returning id, entry_date, category_id, activity_name, quantity, unit_label, is_completed, notes, created_at`,
    [
      session.user.id,
      value.entryDate ?? null,
      value.categoryId ?? null,
      value.activityName,
      value.quantity,
      value.unitLabel,
      value.isCompleted,
      value.notes ?? null,
    ],
  );

  return reply.code(201).send({ data: result.rows[0] });
});

app.setErrorHandler((error, request, reply) => {
  request.log.error({ error }, "Unhandled API error");
  return reply.code(500).send({ error: "Internal server error" });
});

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: "0.0.0.0" });
