import crypto from "crypto";

export function verifyLinkedinSignature(rawBody, signature, secret) {
  // A missing signature or secret must be rejected, not accepted. The
  // previous version returned true here, which meant any POST /webhook
  // request without an x-li-signature header skipped verification
  // entirely (server.js only called this function when a signature was
  // present, so this fallback compounded that into a full bypass).
  if (!signature || !secret) return false;
  try {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const expected = hmac.digest("hex");
    const actual = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);
    return actual.length === expectedBuf.length && crypto.timingSafeEqual(actual, expectedBuf);
  } catch {
    return false;
  }
}

export function normalizeLinkedinEvents(body, orgId) {
  if (!body) return [];
  const events = [];

  // Handle LinkedIn Webhook payload types (Comments, Direct Messages, Share Mentions)
  if (Array.isArray(body.events)) {
    for (const item of body.events) {
      if (item.id && (item.text || item.message)) {
        events.push({
          id: String(item.id),
          type: item.type || 'comment',
          text: item.text || item.message || '',
          authorUrn: item.author || item.sender || '',
          authorName: item.authorName || item.senderName || 'LinkedIn Member',
          targetUrn: item.targetUrn || item.postUrn || `urn:li:organization:${orgId}`
        });
      }
    }
  } else if (body.id && (body.text || body.message)) {
    events.push({
      id: String(body.id),
      type: body.type || 'comment',
      text: body.text || body.message || '',
      authorUrn: body.author || body.sender || '',
      authorName: body.authorName || body.senderName || 'LinkedIn Member',
      targetUrn: body.targetUrn || `urn:li:organization:${orgId}`
    });
  }

  return events;
}
