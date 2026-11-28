import Fastify from "fastify";

// Isolated diagnostic server: deliberately no database, auth, or app imports.
const app = Fastify({ logger: true });

app.get("/", async () => ({
  ok: true,
  service: "aksani-api-diagnostic",
}));

app.get("/health", async () => ({
  ok: true,
  service: "aksani-api-diagnostic",
  database: "not-connected",
  auth: "disabled",
  timestamp: new Date().toISOString(),
}));

await app.listen({
  port: Number(process.env.PORT ?? 3000),
  host: "0.0.0.0",
});
