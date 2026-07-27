import { isGreeting } from './greeting.js';
import { detectIntent, getIntentDescription, getSuggestedAgent, inferCustomerTypeFromIntent, CUSTOMER_TYPES } from './intent.js';
import { extractAssetsFromMessage, extractRisksFromMessage, extractContextFromMessage, RISK_TYPES, ASSET_TYPES, OPERATING_CONTEXT } from './consultant.js';
import { getRecommendedProducts, buildProductRecommendationText } from './products.js';
import { TECHNICAL_KNOWLEDGE, getKnowledgeForRisk, buildDetailedTechnicalResponse } from './knowledge.js';

const CONVERSATION_STATES = {
  GREETING: 'greeting',
  UNDERSTANDING_PROBLEM: 'understanding_problem',
  IDENTIFYING_ASSETS: 'identifying_assets',
  ASSESSING_RISKS: 'assessing_risks',
  EXPLORING_CURRENT_EQUIPMENT: 'exploring_current_equipment',
  PROPOSING_SOLUTION: 'proposing_solution',
  CONFIRMING_SOLUTION: 'confirming_solution',
  HANDOFF_TO_TEAM: 'handoff_to_team'
};

export function createConversationFlow({ storage, master }) {
  function getResponseForState(state, contactName, messageText, contact = {}) {
    // Detect assets and risks mentioned in the current message
    const detectedAssets = messageText ? extractAssetsFromMessage(messageText) : [];
    const detectedRisks = messageText ? extractRisksFromMessage(messageText) : [];

    switch (state) {
      case CONVERSATION_STATES.GREETING:
        return contactName
          ? `Hola ${contactName}. ¿Qué te trae a ELIMFILTERS?`
          : `Hola. ¿Qué te trae a ELIMFILTERS?`;

      case CONVERSATION_STATES.UNDERSTANDING_PROBLEM:
        // If assets were mentioned, ask about risks for those assets
        if (detectedAssets.length > 0 && !detectedAssets.includes('OTHER')) {
          return `Entiendo que necesitás proteger eso. ¿Qué riesgos específicos enfrentás?`;
        }
        return `¿Qué activos específicos necesitás proteger?`;

      case CONVERSATION_STATES.IDENTIFYING_ASSETS:
        // If contamination or water-related risks detected, ask about causes
        if (detectedRisks.some(r => [RISK_TYPES.CONTAMINATION, RISK_TYPES.PARTICLES, RISK_TYPES.SEDIMENT].includes(r))) {
          return `Entiendo tu problema. ¿De dónde viene la contaminación? Puede ser por condensación en tanques, sedimentación, falta de purga de sistemas, o acumulación de partículas. ¿Qué notás?`;
        }
        // If microorganism risks detected, ask about causes
        if (detectedRisks.includes(RISK_TYPES.MICROORGANISMS)) {
          return `Entiendo tu problema. ¿Cuál es la fuente? Puede ser por estancamiento del agua, falta de circulación, o contaminación biológica. ¿Qué observás?`;
        }
        // If corrosion detected, ask about causes
        if (detectedRisks.includes(RISK_TYPES.CORROSION)) {
          return `Entiendo tu problema. ¿Cuál es la causa de la corrosión? Puede ser por agua con alto contenido mineral, pH desbalanceado, o falta de inhibidores. ¿Qué evidencia tenés?`;
        }
        // Generic case if risks detected but not specific
        if (detectedRisks.length > 0 && !detectedRisks.includes(RISK_TYPES.UNKNOWN)) {
          return `Entiendo. ¿Cuál creés que es la causa principal de ese problema?`;
        }
        return `¿Qué riesgos específicos enfrentás?`;

      case CONVERSATION_STATES.ASSESSING_RISKS:
        return `Perfecto. Para dar la mejor recomendación, ¿en qué contexto operas? ¿Industrial, comercial, o algo más específico? ¿Y qué escala de operación estamos hablando?`;

      case CONVERSATION_STATES.EXPLORING_CURRENT_EQUIPMENT:
        return `Excelente. Ahora me gustaría conocer tu situación actual. ¿Qué equipo de filtración ya tenés instalado? ¿Cómo te ha funcionado hasta ahora? ¿Qué problemas ha tenido?`;

      case CONVERSATION_STATES.PROPOSING_SOLUTION:
        // Generate detailed technical response with knowledge base
        if (contact && contact.messages && contact.messages.length > 0) {
          const allAssets = [];
          const allRisks = [];
          let context = OPERATING_CONTEXT.OTHER;

          for (const msg of contact.messages) {
            if (msg.type === 'incoming') {
              allAssets.push(...extractAssetsFromMessage(msg.body));
              allRisks.push(...extractRisksFromMessage(msg.body));
              const msgContext = extractContextFromMessage(msg.body);
              if (msgContext !== OPERATING_CONTEXT.OTHER) {
                context = msgContext;
              }
            }
          }

          const uniqueAssets = [...new Set(allAssets)].filter(a => a !== ASSET_TYPES.OTHER);
          const uniqueRisks = [...new Set(allRisks)].filter(r => r !== RISK_TYPES.UNKNOWN);

          if (uniqueAssets.length > 0 && uniqueRisks.length > 0) {
            const products = getRecommendedProducts(uniqueAssets, uniqueRisks, context);

            // If we have products, build technical response
            if (products.length > 0) {
              const topProduct = products[0];
              const primaryRisk = uniqueRisks[0];

              // Find knowledge key by matching risk type
              let knowledgeKey = null;
              for (const key in TECHNICAL_KNOWLEDGE) {
                const kb = TECHNICAL_KNOWLEDGE[key];
                if (kb.recommendedFor && kb.recommendedFor.includes(primaryRisk)) {
                  knowledgeKey = key;
                  break;
                }
              }

              if (knowledgeKey) {
                return buildDetailedTechnicalResponse(topProduct, knowledgeKey);
              } else {
                // Fallback - simple product recommendation
                return `Te recomiendo: **${topProduct.sku}** - ${topProduct.name}\n\n` +
                       `Tecnología: ${topProduct.technology}\n` +
                       `Filtra a: ${topProduct.filtrationLevel}\n` +
                       `Rendimiento: ${topProduct.flowRate}\n\n¿Te interesa proceder?`;
              }
            } else {
              // No matching products - direct to support
              return `Tu caso es especializado y necesita atención técnica profesional.\n\n` +
                     `Por favor contacta a nuestro equipo de soporte en support@elimfilters.com ` +
                     `con los detalles que me contaste. ` +
                     `Con gusto te contestarán a la brevedad con una solución customizada.`;
            }
          }
        }

        return `Basándome en tu situación, te presento la solución ideal. ¿Te interesa proceder?`;

      case CONVERSATION_STATES.CONFIRMING_SOLUTION:
        return `Perfecto. Para que nuestro distribuidor en tu país te contacte con presupuesto e instalación, necesito confirmar tus datos. ¿Cuál es tu nombre completo, email y número de teléfono?`;

      case CONVERSATION_STATES.HANDOFF_TO_TEAM:
        return `Excelente. Pasamos tu información al distribuidor de ELIMFILTERS en tu país. Se pondrán en contacto contigo en las próximas 24-48 horas con presupuesto, cronograma e instalación. ¿Hay algo más que necesites saber técnicamente sobre la solución?`;

      default:
        return 'Contame más.';
    }
  }

  function getNextState(currentState, messageText, contact = {}) {
    // Only progress if there's meaningful input
    if (!messageText || messageText.trim().length < 2) {
      return currentState;
    }

    // Detect assets and risks mentioned in the current message
    const detectedAssets = extractAssetsFromMessage(messageText);
    const detectedRisks = extractRisksFromMessage(messageText);
    const detectedContext = extractContextFromMessage(messageText);
    const hasValidAssets = detectedAssets.length > 0 && !detectedAssets.includes('OTHER');
    const hasValidRisks = detectedRisks.length > 0 && !detectedRisks.includes('UNKNOWN');
    const hasContext = detectedContext !== OPERATING_CONTEXT.OTHER;

    // Common patterns used across multiple states
    const messageLength = messageText?.trim().length || 0;
    const hasCauseKeywords = /condensacion|purga|sedimento|estancamiento|acumulacion|oxido|mineral|ph|inhibidor/i.test(messageText);
    const hasEquipmentKeywords = /filtro|equipo|sistema|tengo|instalado|actualizado|viejo|nuevo/i.test(messageText);
    const hasConfirmKeywords = /si|perfecto|excelente|bueno|me interesa|vamos|sí|claro|de acuerdo/i.test(messageText);
    const hasEmailPhone = /@|(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/.test(messageText);
    const hasContactInfo = messageText.length > 20 || hasEmailPhone;

    switch (currentState) {
      case CONVERSATION_STATES.GREETING:
        return CONVERSATION_STATES.UNDERSTANDING_PROBLEM;

      case CONVERSATION_STATES.UNDERSTANDING_PROBLEM:
        // Only progress if we have meaningful input about assets
        if (messageLength > 10) {
          return CONVERSATION_STATES.IDENTIFYING_ASSETS;
        }
        return CONVERSATION_STATES.UNDERSTANDING_PROBLEM;

      case CONVERSATION_STATES.IDENTIFYING_ASSETS:
        // Stay until we understand the risks deeply
        if (hasValidRisks && (messageLength > 30 || hasCauseKeywords)) {
          return CONVERSATION_STATES.ASSESSING_RISKS;
        }
        return CONVERSATION_STATES.IDENTIFYING_ASSETS;

      case CONVERSATION_STATES.ASSESSING_RISKS:
        // Progress when context is mentioned
        if (hasContext) {
          return CONVERSATION_STATES.EXPLORING_CURRENT_EQUIPMENT;
        }
        return CONVERSATION_STATES.ASSESSING_RISKS;

      case CONVERSATION_STATES.EXPLORING_CURRENT_EQUIPMENT:
        // Progress when they describe current equipment
        if (hasEquipmentKeywords && messageLength > 15) {
          return CONVERSATION_STATES.PROPOSING_SOLUTION;
        }
        return CONVERSATION_STATES.EXPLORING_CURRENT_EQUIPMENT;

      case CONVERSATION_STATES.PROPOSING_SOLUTION:
        // If they confirm or express interest, move to confirming
        if (hasConfirmKeywords) {
          return CONVERSATION_STATES.CONFIRMING_SOLUTION;
        }
        // If they have questions, stay to clarify
        if (/como|cuanto|cuál|precio|costo|tiempo|cuánto|que diferencia/i.test(messageText)) {
          return CONVERSATION_STATES.PROPOSING_SOLUTION;
        }
        return CONVERSATION_STATES.PROPOSING_SOLUTION;

      case CONVERSATION_STATES.CONFIRMING_SOLUTION:
        // Move to handoff when they provide contact information
        if (hasContactInfo) {
          return CONVERSATION_STATES.HANDOFF_TO_TEAM;
        }
        return CONVERSATION_STATES.CONFIRMING_SOLUTION;

      case CONVERSATION_STATES.HANDOFF_TO_TEAM:
        return CONVERSATION_STATES.HANDOFF_TO_TEAM;

      default:
        return currentState;
    }
  }

  return {
    async processMessage(phoneNumber, messageText, contactName = null) {
      // Detect intent from message
      const intent = detectIntent(messageText);

      // Detect customer type (B2B/B2C)
      const customerType = inferCustomerTypeFromIntent(intent, messageText);

      // Get or create contact
      let contact = await storage.getContact(phoneNumber);
      if (!contact) {
        contact = await storage.saveContact(phoneNumber, {
          phoneNumber,
          name: contactName,
          state: CONVERSATION_STATES.GREETING,
          intent,
          customerType,
          suggestedAgent: getSuggestedAgent(intent),
          messages: []
        });
      } else {
        // Update intent, customer type and suggested agent if it's a new message
        await storage.saveContact(phoneNumber, {
          intent,
          customerType,
          suggestedAgent: getSuggestedAgent(intent)
        });
      }

      // Add message to history with intent
      await storage.addMessage(phoneNumber, {
        type: 'incoming',
        body: messageText,
        intent
      });

      // Determine response based on current state
      const currentState = contact.state || CONVERSATION_STATES.GREETING;
      const responseText = getResponseForState(currentState, contact.name, messageText);

      // Add response to history
      await storage.addMessage(phoneNumber, {
        type: 'outgoing',
        body: responseText,
        intent
      });

      // Update state for next message
      const nextState = getNextState(currentState, messageText);
      await storage.updateContactState(phoneNumber, nextState);

      // Get lead info if needed (to eventually pass to agent)
      const leadInfo = await master.getLeadInfo(phoneNumber);

      return {
        response: responseText,
        state: nextState,
        intent,
        customerType,
        suggestedAgent: getSuggestedAgent(intent),
        contact,
        leadInfo
      };
    },

    async getConversationSummary(phoneNumber) {
      const contact = await storage.getContact(phoneNumber);
      if (!contact) return null;

      return {
        phoneNumber,
        name: contact.name,
        state: contact.state,
        messageCount: contact.messages?.length || 0,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
        lastMessages: (contact.messages || []).slice(-3)
      };
    }
  };
}
