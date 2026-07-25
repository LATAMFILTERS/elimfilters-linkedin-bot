function requireValue(name, val) {
  // Previously only enforced when NODE_ENV === "production" - but neither
  // this app's render.yaml nor Render itself sets NODE_ENV, so this never
  // actually threw in production and every "required" var below silently
  // fell back to an empty/unusable default instead.
  if (!val) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

export function getConfig() {
  const dryRun = (process.env.DRY_RUN || "true").toLowerCase() === "true";
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN || "";

  if (!dryRun && !accessToken) {
    throw new Error("LINKEDIN_ACCESS_TOKEN is required when DRY_RUN=false");
  }

  return {
    port: parseInt(process.env.PORT || "10000", 10),
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID || "866h35ln0x9989",
    linkedinClientSecret: requireValue("LINKEDIN_CLIENT_SECRET", process.env.LINKEDIN_CLIENT_SECRET),
    linkedinAccessToken: accessToken,
    linkedinOrganizationId: process.env.LINKEDIN_ORGANIZATION_ID || "133064152",
    linkedinVerifyToken: requireValue("LINKEDIN_VERIFY_TOKEN", process.env.LINKEDIN_VERIFY_TOKEN),
    linkedinApiVersion: process.env.LINKEDIN_API_VERSION || "202606",
    databaseUrl: requireValue("DATABASE_URL", process.env.DATABASE_URL),
    // Intentionally NOT required: nvidia.js falls back to a canned reply
    // when this is unset, so the bot still runs (with generic replies)
    // rather than refusing to boot.
    nvidiaApiKey: process.env.NVIDIA_NIM_API_KEY || "",
    nvidiaModel: process.env.NVIDIA_MODEL || "nvidia/nemotron-3-super-120b-a12b",
    knowledgeBaseUrl: process.env.KNOWLEDGE_BASE_URL || "",
    dryRun
  };
}
