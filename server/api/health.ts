import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    ok: true,
    service: "aksani-api-diagnostic",
    runtime: "vercel-node-function",
    database: "not-connected",
    auth: "disabled",
    timestamp: new Date().toISOString(),
  });
}
