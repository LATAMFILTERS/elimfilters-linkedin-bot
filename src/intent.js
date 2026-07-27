export const INTENTS = {
  GREETING: 'greeting',
  PURCHASE: 'purchase',
  INFORMATION: 'information',
  PRICE_QUOTE: 'price_quote',
  SUPPORT: 'support',
  COMPLAINT: 'complaint',
  TECHNICAL: 'technical',
  DELIVERY: 'delivery',
  OTHER: 'other'
};

export const CUSTOMER_TYPES = {
  B2B: 'b2b',
  B2C: 'b2c',
  UNKNOWN: 'unknown'
};

const INTENT_KEYWORDS = [
  // Check most specific first
  { intent: INTENTS.PRICE_QUOTE, keywords: [
    'cuánto cuesta', 'cual es el precio', 'cuál es el precio', 'cuánto saldría',
    'precio', 'costo', 'valor', 'cotización', 'presupuesto', 'aranceles', 'tarifa'
  ]},
  { intent: INTENTS.COMPLAINT, keywords: [
    'reclam', 'queja', 'insatisfecho', 'malo', 'pésimo', 'no me gusta',
    'decepcionado', 'estafado', 'falso', 'engañado', 'no cumple', 'defectuoso'
  ]},
  { intent: INTENTS.SUPPORT, keywords: [
    'no funciona', 'problema', 'error', 'no anda', 'falla',
    'roto', 'no prende', 'no sirve', 'soporte', 'ayuda', 'garantía'
  ]},
  { intent: INTENTS.TECHNICAL, keywords: [
    'instal', 'mantenimiento', 'limpieza', 'cambiar', 'reemplazo', 'repuesto', 'compatibilidad', 'tecnico'
  ]},
  { intent: INTENTS.DELIVERY, keywords: [
    'cuándo', 'cuando', 'llega', 'envío', 'envio', 'entrega', 'retiro', 'dirección',
    'tiempo', 'demora', 'urgente', 'express'
  ]},
  { intent: INTENTS.INFORMATION, keywords: [
    'cómo funciona', 'como funciona', 'información', 'informacion', 'me expliques',
    'cuéntame', 'qué es', 'que es', 'características', 'especificacion',
    'detalles', 'cómo es', 'como es', 'saber', 'conocer', 'explica'
  ]},
  { intent: INTENTS.PURCHASE, keywords: [
    'quiero comprar', 'comprar', 'me interesa', 'quisiera', 'quiero pedir',
    'necesito', 'pedir', 'ordenar', 'solicitar'
  ]}
];

export function detectIntent(messageText) {
  if (!messageText) return INTENTS.OTHER;

  const normalized = messageText.toLowerCase().trim();

  // Check each intent group (in order of priority)
  for (const group of INTENT_KEYWORDS) {
    for (const keyword of group.keywords) {
      if (normalized.includes(keyword)) {
        return group.intent;
      }
    }
  }

  return INTENTS.OTHER;
}

export function getIntentDescription(intent) {
  const descriptions = {
    [INTENTS.GREETING]: 'Saludo inicial',
    [INTENTS.PURCHASE]: 'Interés en compra',
    [INTENTS.INFORMATION]: 'Solicitud de información',
    [INTENTS.PRICE_QUOTE]: 'Consulta de precio',
    [INTENTS.SUPPORT]: 'Soporte técnico',
    [INTENTS.COMPLAINT]: 'Reclamo o queja',
    [INTENTS.TECHNICAL]: 'Consulta técnica',
    [INTENTS.DELIVERY]: 'Consulta sobre entrega',
    [INTENTS.OTHER]: 'Otro'
  };

  return descriptions[intent] || 'Desconocido';
}

export function getSuggestedAgent(intent) {
  const agentMap = {
    [INTENTS.GREETING]: 'sales',
    [INTENTS.PURCHASE]: 'sales',
    [INTENTS.INFORMATION]: 'sales',
    [INTENTS.PRICE_QUOTE]: 'sales',
    [INTENTS.SUPPORT]: 'support',
    [INTENTS.COMPLAINT]: 'manager',
    [INTENTS.TECHNICAL]: 'technical',
    [INTENTS.DELIVERY]: 'logistics',
    [INTENTS.OTHER]: 'general'
  };

  return agentMap[intent] || 'general';
}

const B2B_KEYWORDS = [
  'empresa', 'negocio', 'comercial', 'industrial', 'fábrica', 'producción',
  'distribución', 'mayorista', 'proveedor', 'pedido grande', 'volumen',
  'contrato', 'facturación', 'empresa grande', 'cliente corporativo',
  'oficina corporativa', 'planta', 'instalación industrial', 'comercio',
  'negocio grande', 'empresa distribuidora'
];

const B2C_KEYWORDS = [
  'casa', 'hogar', 'apartamento', 'departamento', 'residencia', 'familia',
  'personal', 'uso doméstico', 'cocina', 'baño', 'filtro para casa',
  'filtro personal', 'usuario final', 'consumidor', 'cliente particular',
  'residencial', 'domicilio'
];

export function detectCustomerType(messageText) {
  if (!messageText) return CUSTOMER_TYPES.UNKNOWN;

  const normalized = messageText.toLowerCase();

  // Count B2B keywords
  const b2bCount = B2B_KEYWORDS.filter(keyword => normalized.includes(keyword)).length;

  // Count B2C keywords
  const b2cCount = B2C_KEYWORDS.filter(keyword => normalized.includes(keyword)).length;

  // Determine type based on keyword matches
  if (b2bCount > 0 && b2bCount > b2cCount) {
    return CUSTOMER_TYPES.B2B;
  }

  if (b2cCount > 0 && b2cCount >= b2bCount) {
    return CUSTOMER_TYPES.B2C;
  }

  return CUSTOMER_TYPES.UNKNOWN;
}

export function inferCustomerTypeFromIntent(intent, messageText) {
  // First try to detect from message content
  const detectedType = detectCustomerType(messageText);
  if (detectedType !== CUSTOMER_TYPES.UNKNOWN) {
    return detectedType;
  }

  // Infer from intent patterns
  switch (intent) {
    case INTENTS.PURCHASE:
      // If asking for bulk/large quantities, likely B2B
      if (messageText && /volumen|cantidad|varios|múltiples|mayorista/i.test(messageText)) {
        return CUSTOMER_TYPES.B2B;
      }
      return CUSTOMER_TYPES.B2C;

    case INTENTS.PRICE_QUOTE:
      // Price quotes for large orders suggest B2B
      if (messageText && /para.*empresa|para.*negocio|pedido.*grande/i.test(messageText)) {
        return CUSTOMER_TYPES.B2B;
      }
      return CUSTOMER_TYPES.B2C;

    case INTENTS.TECHNICAL:
    case INTENTS.SUPPORT:
      // Industrial installations suggest B2B
      if (messageText && /industrial|planta|fábrica|comercial|distribución/i.test(messageText)) {
        return CUSTOMER_TYPES.B2B;
      }
      return CUSTOMER_TYPES.B2C;

    case INTENTS.DELIVERY:
      // Large deliveries suggest B2B
      if (messageText && /volumen|cantidades|distribución|logística/i.test(messageText)) {
        return CUSTOMER_TYPES.B2B;
      }
      return CUSTOMER_TYPES.B2C;

    default:
      return CUSTOMER_TYPES.UNKNOWN;
  }
}
