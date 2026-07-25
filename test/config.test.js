import {test} from "node:test";
import assert from "node:assert/strict";

const REQUIRED_KEYS = ["LINKEDIN_CLIENT_SECRET", "LINKEDIN_VERIFY_TOKEN", "DATABASE_URL"];
const BASE_ENV = {
  LINKEDIN_CLIENT_SECRET: "secret",
  LINKEDIN_VERIFY_TOKEN: "verify-me",
  DATABASE_URL: "postgres://user:pass@host:5432/db",
  DRY_RUN: "true"
};

async function loadConfigWithEnv(env) {
  const saved = {};
  for (const key of [...REQUIRED_KEYS, "DRY_RUN", "LINKEDIN_ACCESS_TOKEN", "NODE_ENV"]) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
  Object.assign(process.env, env);
  try {
    // Bust the module cache so getConfig() re-reads process.env each time.
    const mod = await import(`../src/config.js?t=${Date.now()}-${Math.random()}`);
    return mod.getConfig();
  } finally {
    for (const key of [...REQUIRED_KEYS, "DRY_RUN", "LINKEDIN_ACCESS_TOKEN", "NODE_ENV"]) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

test("getConfig succeeds when all required vars are set, regardless of NODE_ENV", async () => {
  const config = await loadConfigWithEnv({...BASE_ENV, NODE_ENV: "development"});
  assert.equal(config.linkedinClientSecret, "secret");
  assert.equal(config.databaseUrl, BASE_ENV.DATABASE_URL);
});

for (const missingKey of REQUIRED_KEYS) {
  test(`getConfig throws when ${missingKey} is missing, even without NODE_ENV=production (regression)`, async () => {
    const env = {...BASE_ENV};
    delete env[missingKey];
    await assert.rejects(
      () => loadConfigWithEnv(env),
      (err) => err.message.includes(missingKey)
    );
  });
}

test("getConfig does not require NVIDIA_NIM_API_KEY (nvidia.js has a graceful fallback)", async () => {
  const config = await loadConfigWithEnv({...BASE_ENV});
  assert.equal(config.nvidiaApiKey, "");
});

test("getConfig throws when DRY_RUN=false and LINKEDIN_ACCESS_TOKEN is not set", async () => {
  await assert.rejects(
    () => loadConfigWithEnv({...BASE_ENV, DRY_RUN: "false"}),
    /LINKEDIN_ACCESS_TOKEN is required when DRY_RUN=false/
  );
});
