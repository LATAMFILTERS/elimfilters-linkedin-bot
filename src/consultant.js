// Professional consultant responses for asset protection
export const ASSET_TYPES = {
  WATER_SYSTEMS: 'water_systems',
  AIR_SYSTEMS: 'air_systems',
  INDUSTRIAL_PLANTS: 'industrial_plants',
  PRODUCTION_EQUIPMENT: 'production_equipment',
  HVAC_SYSTEMS: 'hvac_systems',
  COMPRESSED_AIR: 'compressed_air',
  OFFICE_SPACES: 'office_spaces',
  DATA_CENTERS: 'data_centers',
  FOOD_INDUSTRY: 'food_industry',
  PHARMACEUTICAL: 'pharmaceutical',
  OTHER: 'other'
};

export const RISK_TYPES = {
  CONTAMINATION: 'contamination',
  PARTICLES: 'particles',
  MICROORGANISMS: 'microorganisms',
  CORROSION: 'corrosion',
  SEDIMENT: 'sediment',
  CHEMICAL: 'chemical',
  BIOLOGICAL: 'biological',
  PARTICULATE: 'particulate',
  ODOR: 'odor',
  SCALE: 'scale',
  UNKNOWN: 'unknown'
};

export const OPERATING_CONTEXT = {
  INDUSTRIAL: 'industrial',
  COMMERCIAL: 'commercial',
  RESIDENTIAL: 'residential',
  FOOD_BEVERAGE: 'food_beverage',
  HEALTHCARE: 'healthcare',
  MANUFACTURING: 'manufacturing',
  PHARMACEUTICAL: 'pharmaceutical',
  OTHER: 'other'
};

export function extractAssetsFromMessage(messageText) {
  if (!messageText) return [];

  const normalized = messageText.toLowerCase();
  const detectedAssets = [];

  const assetKeywords = {
    [ASSET_TYPES.WATER_SYSTEMS]: ['agua', 'sistema de agua', 'tuberías', 'tanque', 'piscina', 'fuente'],
    [ASSET_TYPES.AIR_SYSTEMS]: ['aire', 'aire comprimido', 'compresor', 'neumático', 'aire acondicionado'],
    [ASSET_TYPES.INDUSTRIAL_PLANTS]: ['planta', 'fábrica', 'producción', 'industrial', 'manufactura'],
    [ASSET_TYPES.PRODUCTION_EQUIPMENT]: ['máquinas', 'equipos', 'producción', 'línea de producción'],
    [ASSET_TYPES.HVAC_SYSTEMS]: ['hvac', 'aire acondicionado', 'ventilación', 'climatización'],
    [ASSET_TYPES.COMPRESSED_AIR]: ['aire comprimido', 'compresor', 'neumático'],
    [ASSET_TYPES.OFFICE_SPACES]: ['oficina', 'oficinas', 'despacho', 'edificio de oficinas'],
    [ASSET_TYPES.DATA_CENTERS]: ['data center', 'servidor', 'equipos informáticos', 'centro de datos'],
    [ASSET_TYPES.FOOD_INDUSTRY]: ['alimentos', 'bebidas', 'industria alimentaria', 'cocina industrial'],
    [ASSET_TYPES.PHARMACEUTICAL]: ['farmacéutica', 'farmacia', 'medicamentos', 'laboratorio']
  };

  for (const [assetType, keywords] of Object.entries(assetKeywords)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      detectedAssets.push(assetType);
    }
  }

  return detectedAssets.length > 0 ? detectedAssets : [ASSET_TYPES.OTHER];
}

export function extractRisksFromMessage(messageText) {
  if (!messageText) return [];

  const normalized = messageText.toLowerCase();
  const detectedRisks = [];

  const riskKeywords = {
    [RISK_TYPES.CONTAMINATION]: ['contamina', 'sucio', 'impuro', 'contaminante'],
    [RISK_TYPES.PARTICLES]: ['particula', 'polvo', 'sedimento', 'arena'],
    [RISK_TYPES.MICROORGANISMS]: ['bacteria', 'virus', 'microorganismo', 'hongo', 'moho'],
    [RISK_TYPES.CORROSION]: ['corrosion', 'oxido', 'herrumbre'],
    [RISK_TYPES.SEDIMENT]: ['sedimento', 'deposito', 'acumulacion'],
    [RISK_TYPES.CHEMICAL]: ['quimico', 'quimica', 'producto quimico'],
    [RISK_TYPES.BIOLOGICAL]: ['biologico', 'organico'],
    [RISK_TYPES.PARTICULATE]: ['particula', 'particulado'],
    [RISK_TYPES.ODOR]: ['olor', 'hedor'],
    [RISK_TYPES.SCALE]: ['sarro', 'incrustacion', 'escala']
  };

  for (const [riskType, keywords] of Object.entries(riskKeywords)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      detectedRisks.push(riskType);
    }
  }

  return detectedRisks.length > 0 ? detectedRisks : [RISK_TYPES.UNKNOWN];
}

export function extractContextFromMessage(messageText) {
  if (!messageText) return OPERATING_CONTEXT.OTHER;

  const normalized = messageText.toLowerCase();

  const contextKeywords = {
    [OPERATING_CONTEXT.INDUSTRIAL]: ['industrial', 'fábrica', 'planta', 'manufactura'],
    [OPERATING_CONTEXT.COMMERCIAL]: ['comercial', 'empresa', 'negocio'],
    [OPERATING_CONTEXT.RESIDENTIAL]: ['casa', 'hogar', 'departamento', 'residencial'],
    [OPERATING_CONTEXT.FOOD_BEVERAGE]: ['alimentos', 'bebidas', 'cocina'],
    [OPERATING_CONTEXT.HEALTHCARE]: ['hospital', 'clínica', 'salud', 'médico'],
    [OPERATING_CONTEXT.MANUFACTURING]: ['fabricación', 'producción', 'manufactura'],
    [OPERATING_CONTEXT.PHARMACEUTICAL]: ['farmacéutica', 'medicamentos', 'fármacos']
  };

  for (const [context, keywords] of Object.entries(contextKeywords)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return context;
    }
  }

  return OPERATING_CONTEXT.OTHER;
}

export function getRiskCauses(riskType) {
  const causes = {
    [RISK_TYPES.CONTAMINATION]: [
      'condensación en tanques',
      'falta de purga del sistema',
      'sedimentación',
      'acumulación de partículas',
      'entrada de suciedad externa',
      'tuberías corroídas'
    ],
    [RISK_TYPES.PARTICLES]: [
      'desgaste de componentes',
      'sedimentación',
      'erosión de tuberías',
      'falta de filtración',
      'entrada de polvo/arena'
    ],
    [RISK_TYPES.MICROORGANISMS]: [
      'estancamiento del agua',
      'falta de circulación',
      'temperatura inadecuada',
      'biofilm en tuberías',
      'contaminación biológica del agua'
    ],
    [RISK_TYPES.CORROSION]: [
      'agua con alto contenido mineral',
      'pH desbalanceado',
      'falta de inhibidores de corrosión',
      'reacciones electroquímicas',
      'oxígeno disuelto alto'
    ],
    [RISK_TYPES.SEDIMENT]: [
      'acumulación de partículas',
      'falta de purga',
      'sedimentación natural',
      'erosión de tuberías',
      'depósitos minerales'
    ],
    [RISK_TYPES.SCALE]: [
      'agua dura',
      'mineral disuelto alto',
      'temperatura alta',
      'falta de descalcificación',
      'depósitos de calcio/magnesio'
    ]
  };

  return causes[riskType] || [];
}

export function buildConsultantSummary(contact) {
  if (!contact || !contact.messages) return null;

  const summary = {
    assets: [],
    risks: [],
    context: OPERATING_CONTEXT.OTHER,
    budget: null,
    timeline: null
  };

  // Extract from all client messages
  for (const msg of contact.messages || []) {
    if (msg.type === 'incoming') {
      summary.assets.push(...extractAssetsFromMessage(msg.body));
      summary.risks.push(...extractRisksFromMessage(msg.body));

      const context = extractContextFromMessage(msg.body);
      if (context !== OPERATING_CONTEXT.OTHER) {
        summary.context = context;
      }

      // Try to detect budget/timeline
      if (/presupuesto|costo|precio/i.test(msg.body)) {
        summary.budget = true;
      }
      if (/urgente|rápido|pronto|inmediato/i.test(msg.body)) {
        summary.timeline = 'urgent';
      }
    }
  }

  // Deduplicate
  summary.assets = [...new Set(summary.assets)];
  summary.risks = [...new Set(summary.risks)];

  return summary;
}
