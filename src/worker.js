import { createNvidiaClient } from "./nvidia.js";
import { createLinkedinClient } from "./linkedin.js";

export function createWorker({ config, db }) {
  const nvidia = createNvidiaClient({ apiKey: config.nvidiaApiKey, model: config.nvidiaModel, pool: db.pool });
  const linkedin = createLinkedinClient({
    accessToken: config.linkedinAccessToken,
    organizationId: config.linkedinOrganizationId,
    apiVersion: config.linkedinApiVersion
  });

  return {
    publisherConfigured: linkedin.isConfigured(),

    async run() {
      const jobs = await db.claim(5);
      if (!jobs.length) return;

      for (const job of jobs) {
        try {
          const replyText = await nvidia.generateReply(job.message_text, {
            conversationId: job.author_urn || job.target_urn || job.event_id,
            authorName: job.author_name
          });
          if (!replyText || replyText === "NO_REPLY") {
            await db.complete(job.event_id, "NO_REPLY");
            continue;
          }
          if (config.dryRun) {
            await db.complete(job.event_id, `[DRY_RUN DRAFT] ${replyText}`);
            continue;
          }
          if (job.event_type === "message" || job.event_type === "dm") {
            await linkedin.replyToDirectMessage({ senderUrn: job.author_urn, replyText });
          } else {
            await linkedin.replyToComment({ targetUrn: job.target_urn, replyText });
          }
          await db.complete(job.event_id, replyText);
        } catch (err) {
          await db.fail(job.event_id, err.message);
        }
      }
    }
  };
}
