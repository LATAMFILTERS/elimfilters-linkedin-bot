import express from "express";
import { getConfig } from "./config.js";
import { createDb } from "./db.js";
import { verifyLinkedinSignature, normalizeLinkedinEvents } from "./security.js";
import { createWorker } from "./worker.js";

const config = getConfig();
const db = createDb(config.databaseUrl);
await db.init();
const worker = createWorker({ config, db });
const app = express();

const webhookStats = { received: 0, rejected: 0, lastEventCount: 0, lastReceivedAt: null, lastError: null };

app.get("/health", async (_req, res) => res.json({
  ok: true,
  service: "elimfilters-linkedin-bot",
  organizationId: config.linkedinOrganizationId,
  apiVersion: config.linkedinApiVersion,
  dryRun: config.dryRun,
  publisherConfigured: worker.publisherConfigured,
  knowledgeBaseConfigured: Boolean(config.knowledgeBaseUrl),
  queue: await db.status(),
  webhook: webhookStats
}));

app.get("/ready", (_req, res) => {
  const checks = {
    database: Boolean(config.databaseUrl),
    nvidia: Boolean(config.nvidiaApiKey),
    webhookToken: Boolean(config.linkedinVerifyToken),
    publisher: config.dryRun || worker.publisherConfigured
  };
  const ready = Object.values(checks).every(Boolean);
  res.status(ready ? 200 : 503).json({ ready, dryRun: config.dryRun, checks });
});

app.get("/review-drafts", async (_req, res) => {
  if (!config.dryRun) return res.sendStatus(404);
  res.json({ ok: true, dryRun: true, drafts: await db.recentDrafts(10) });
});

app.get("/webhook", (req, res) => {
  const challenge = req.query.challenge || req.query["hub.challenge"];
  const token = req.query.verify_token || req.query["hub.verify_token"];
  if (!challenge || token !== config.linkedinVerifyToken) return res.sendStatus(403);
  res.status(200).send(String(challenge));
});

app.post("/webhook", express.raw({ type: "application/json", limit: "1mb" }), async (req, res) => {
  webhookStats.received++;
  webhookStats.lastReceivedAt = new Date().toISOString();
  const signature = req.get("x-li-signature") || req.get("x-linkedin-signature");
  if (signature && !verifyLinkedinSignature(req.body, signature, config.linkedinClientSecret)) {
    webhookStats.rejected++;
    webhookStats.lastError = "invalid_signature";
    return res.sendStatus(401);
  }
  let body;
  try { body = JSON.parse(req.body.toString("utf8")); }
  catch {
    webhookStats.rejected++;
    webhookStats.lastError = "invalid_json";
    return res.sendStatus(400);
  }
  try {
    const events = normalizeLinkedinEvents(body, config.linkedinOrganizationId);
    webhookStats.lastEventCount = events.length;
    await Promise.all(events.map(event => db.enqueue(event)));
    res.sendStatus(200);
    setImmediate(() => worker.run().catch(console.error));
  } catch (error) {
    webhookStats.lastError = error.message;
    res.sendStatus(500);
  }
});

app.listen(config.port, () => console.log(`ELIMFILTERS LinkedIn bot listening on ${config.port}; dryRun=${config.dryRun}`));
setInterval(() => worker.run().catch(console.error), 5 * 60 * 1000).unref();
