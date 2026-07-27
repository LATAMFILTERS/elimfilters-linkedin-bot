/**
 * ELIMFILTERS Conversation Worker for LinkedIn
 * Replaces NVIDIA-based funnel with expert consultant B2B flow
 */

import { createConversationFlow } from "../conversation.js";
import { createMasterClient } from "../master.js";
import { createLinkedinClient } from "../linkedin.js";

export function createELIMFILTERSConversationWorker({
  config,
  db,
  logger = console,
  sendMessage: injectSendMessage = null
} = {}) {
  // Create shared ELIMFILTERS modules
  const master = createMasterClient({ config });
  const conversationFlow = createConversationFlow({ storage: createELIMFILTERSStorage(db), master });
  const linkedin = injectSendMessage || createLinkedinClient({
    accessToken: config.linkedinAccessToken,
    organizationId: config.linkedinOrganizationId,
    apiVersion: config.linkedinApiVersion
  });

  return {
    async run() {
      // Claim up to 5 pending jobs
      const jobs = await db.claim(5);
      if (!jobs.length) return;

      for (const job of jobs) {
        try {
          const {
            event_id: eventId,
            author_urn: authorUrn,
            author_name: authorName,
            message_text: messageText,
            target_urn: targetUrn,
            event_type: eventType
          } = job;

          // Use author URN as the unique identifier
          const contactId = authorUrn || authorName;

          try {
            // Process message through ELIMFILTERS conversation flow
            const result = await conversationFlow.processMessage(
              contactId,
              messageText,
              authorName
            );

            // Send response via LinkedIn
            if (result.response) {
              if (!config.dryRun) {
                try {
                  // LinkedIn primarily supports comment replies, not DMs
                  if (eventType === "message" || eventType === "dm") {
                    logger.warn(`[ELIMFILTERS] LinkedIn DM from ${authorName} not supported; skipping`, { eventId });
                    await db.complete(eventId, "LINKEDIN_DM_NOT_SUPPORTED");
                  } else {
                    // Reply to comment
                    await linkedin.replyToComment({
                      targetUrn,
                      replyText: result.response
                    });
                    logger.info(`[ELIMFILTERS] Replied to comment from ${authorName}`, {
                      eventId,
                      state: result.state,
                      intent: result.intent
                    });
                  }
                } catch (sendError) {
                  logger.error(`[ELIMFILTERS] Failed to send message on LinkedIn`, {
                    eventId,
                    error: sendError.message
                  });
                  await db.fail(eventId, sendError.message);
                  continue;
                }
              } else {
                // In dry run, save draft
                logger.info(`[ELIMFILTERS DRY_RUN] Draft for ${authorName}`, {
                  eventId,
                  state: result.state,
                  response: result.response
                });
              }

              // Mark as processed
              await db.complete(eventId, result.response);

            } else {
              // No response generated
              await db.complete(eventId, "NO_RESPONSE");
            }

          } catch (processingError) {
            logger.error(`[ELIMFILTERS] Error processing LinkedIn event from ${authorName}`, {
              eventId,
              error: processingError.message
            });
            await db.fail(eventId, processingError.message);
          }

        } catch (error) {
          logger.error(`[ELIMFILTERS] Fatal error in worker loop:`, error);
        }
      }
    }
  };
}

/**
 * Adapter to use ELIMFILTERS storage interface with LinkedIn DB
 */
function createELIMFILTERSStorage(db) {
  return {
    async getContact(phoneNumber) {
      // For LinkedIn, phoneNumber is actually the authorUrn
      // Query the pool for conversation history with this author
      const pool = db.pool || null;
      if (!pool) return null;

      try {
        // Get last message from this author
        const result = await pool.query(
          `SELECT * FROM linkedin_jobs
           WHERE author_urn = $1
           ORDER BY created_at DESC LIMIT 1`,
          [phoneNumber]
        );

        if (result.rows.length === 0) return null;

        const lastEvent = result.rows[0];
        const messages = await pool.query(
          `SELECT * FROM linkedin_jobs
           WHERE author_urn = $1
           ORDER BY created_at ASC`,
          [phoneNumber]
        );

        return {
          phoneNumber,
          name: lastEvent.author_name || phoneNumber,
          state: 'greeting',
          intent: null,
          customerType: null,
          suggestedAgent: null,
          messages: messages.rows.map(msg => ({
            type: 'incoming',
            body: msg.message_text,
            timestamp: msg.created_at
          }))
        };
      } catch (error) {
        console.error('Error retrieving contact from LinkedIn store:', error);
        return null;
      }
    },

    async saveContact(phoneNumber, data) {
      // LinkedIn store doesn't persist contact state directly
      // This is handled by updating event records
      return data;
    },

    async addMessage(phoneNumber, message) {
      // LinkedIn messages are added via the db.enqueue() in webhook
      // This adapter just validates the message structure
      return { success: true };
    },

    async updateContactState(phoneNumber, state) {
      // Update state in the most recent message record for this author
      const pool = db.pool || null;
      if (!pool) return;

      try {
        await pool.query(
          `UPDATE linkedin_jobs SET response_text = response_text || $2
           WHERE author_urn = $1
           ORDER BY created_at DESC LIMIT 1`,
          [phoneNumber, ` [State: ${state}]`]
        );
      } catch (error) {
        console.error('Error updating contact state:', error);
      }
    }
  };
}
