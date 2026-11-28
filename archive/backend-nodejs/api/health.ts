export default function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true,
    service: "aksani-api-diagnostic",
    runtime: "vercel-node-function",
    database: "not-connected",
    auth: "disabled",
    timestamp: new Date().toISOString(),
  });
}
