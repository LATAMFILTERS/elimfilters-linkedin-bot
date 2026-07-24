function headers(accessToken, apiVersion) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "LinkedIn-Version": apiVersion,
    "X-Restli-Protocol-Version": "2.0.0",
    "Content-Type": "application/json"
  };
}

async function parseResponse(response) {
  const text = await response.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = { raw: text }; }
  if (!response.ok) {
    const detail = payload?.message || payload?.errorDetails?.[0]?.message || text || "request failed";
    throw new Error(`LinkedIn API ${response.status}: ${detail}`);
  }
  return { payload, restliId: response.headers.get("x-restli-id") };
}

export function createLinkedinClient({ accessToken, organizationId, apiVersion = "202606" }) {
  const actor = `urn:li:organization:${organizationId}`;

  return {
    isConfigured() {
      return Boolean(accessToken && organizationId);
    },

    async replyToComment({ targetUrn, replyText }) {
      if (!accessToken) throw new Error("LINKEDIN_ACCESS_TOKEN is not configured");
      if (!targetUrn?.startsWith("urn:li:")) {
        throw new Error("LinkedIn event is missing a valid target/comment URN");
      }

      const response = await fetch(
        `https://api.linkedin.com/rest/socialActions/${encodeURIComponent(targetUrn)}/comments`,
        {
          method: "POST",
          headers: headers(accessToken, apiVersion),
          body: JSON.stringify({
            actor,
            parentComment: targetUrn,
            message: { text: replyText }
          }),
          signal: AbortSignal.timeout(30000)
        }
      );

      const result = await parseResponse(response);
      return { success: true, messageId: result.restliId, payload: result.payload };
    },

    async replyToDirectMessage() {
      throw new Error("LinkedIn direct-message publishing is not enabled for this application; only organization comment replies are supported");
    }
  };
}
