// ELIMFILTERS product catalog with technical specs and field test data
export const PRODUCTS = {
  // Water filtration systems
  WF_001: {
    sku: 'WF-001',
    name: 'Filtro de Agua Premium 5μm',
    category: 'water_filtration',
    technology: 'Malla de microfibra multicapa',
    filtrationLevel: '5 micrones',
    flowRate: '50 L/min',
    lifespan: '6-12 meses',
    fieldTestResults: {
      contaminationRemoval: '99.2%',
      particleRemoval: '98.7%',
      sedimentRemoval: '99.5%',
      testSites: ['Planta industrial (Argentina)', 'Sistema comercial (Chile)']
    },
    applicableTo: ['water_systems', 'industrial_plants'],
    recommendedFor: ['contamination', 'particles', 'sediment'],
    operatingContexts: ['industrial', 'commercial', 'manufacturing']
  },

  WF_002: {
    sku: 'WF-002',
    name: 'Filtro Antibiológico+ (Agua)',
    category: 'water_filtration',
    technology: 'Carbón activado + membrana antimicrobiana',
    filtrationLevel: '0.5 micrones',
    flowRate: '30 L/min',
    lifespan: '3-6 meses',
    fieldTestResults: {
      bacteriaRemoval: '99.99%',
      virusRemoval: '99.9%',
      fungusRemoval: '99.8%',
      testSites: ['Hospital (Perú)', 'Industria alimentaria (Colombia)']
    },
    applicableTo: ['water_systems', 'food_industry', 'pharmaceutical'],
    recommendedFor: ['microorganisms', 'contamination'],
    operatingContexts: ['industrial', 'healthcare', 'food_beverage', 'pharmaceutical']
  },

  WF_003: {
    sku: 'WF-003',
    name: 'Sistema Desalinizador Industrial',
    category: 'water_filtration',
    technology: 'Ósmosis inversa + prefiltración',
    filtrationLevel: '0.0001 micrones',
    flowRate: '100 L/min',
    lifespan: '12-24 meses',
    fieldTestResults: {
      saltRemoval: '99.5%',
      mineralRemoval: '98.9%',
      hardnessReduction: '99.2%',
      testSites: ['Planta desalinizadora (México)', 'Industria de manufactura (Brasil)']
    },
    applicableTo: ['water_systems', 'industrial_plants', 'production_equipment'],
    recommendedFor: ['scale', 'corrosion', 'contamination'],
    operatingContexts: ['industrial', 'manufacturing']
  },

  // Air filtration systems
  AF_001: {
    sku: 'AF-001',
    name: 'Filtro de Aire Industrial 0.3μm',
    category: 'air_filtration',
    technology: 'Fibra de vidrio + electrostático',
    filtrationLevel: '0.3 micrones',
    flowRate: '500 m³/h',
    lifespan: '4-8 semanas',
    fieldTestResults: {
      particleRemoval: '99.97%',
      dustRemoval: '99.9%',
      odorRemoval: '85%',
      testSites: ['Fábrica de textiles (Argentina)', 'Centro de datos (Chile)']
    },
    applicableTo: ['air_systems', 'industrial_plants', 'data_centers'],
    recommendedFor: ['particles', 'contamination', 'odor'],
    operatingContexts: ['industrial', 'manufacturing']
  },

  AF_002: {
    sku: 'AF-002',
    name: 'Compresor con Filtro Integrado',
    category: 'compressed_air',
    technology: 'Filtración en etapas: partículas + humedad + vapor de aceite',
    filtrationLevel: '0.01 micrones (aceite), 1 micron (partículas)',
    flowRate: '80-300 CFM',
    lifespan: '6-12 meses',
    fieldTestResults: {
      oilVaporRemoval: '99.99%',
      waterRemoval: '98.5%',
      particleRemoval: '99.5%',
      testSites: ['Neumática industrial (Colombia)', 'Pintura automotriz (Perú)']
    },
    applicableTo: ['compressed_air', 'production_equipment'],
    recommendedFor: ['contamination', 'particles', 'microorganisms'],
    operatingContexts: ['industrial', 'manufacturing']
  },

  // HVAC systems
  HVAC_001: {
    sku: 'HVAC-001',
    name: 'Filtro HVAC Premium MERV 13',
    category: 'hvac_filtration',
    technology: 'Malla electroestática de alta densidad',
    filtrationLevel: 'MERV 13 (1-3 micrones)',
    flowRate: '1000-2000 CFM',
    lifespan: '3-4 meses',
    fieldTestResults: {
      dustRemoval: '98%',
      pollenRemoval: '99%',
      moldSporeRemoval: '95%',
      testSites: ['Edificio comercial (Argentina)', 'Centro médico (Ecuador)']
    },
    applicableTo: ['hvac_systems', 'office_spaces'],
    recommendedFor: ['particles', 'microorganisms', 'contamination'],
    operatingContexts: ['commercial', 'healthcare']
  },

  // Specialized systems
  DATA_001: {
    sku: 'DATA-001',
    name: 'Sistema de Refrigeración Filtrada para Data Centers',
    category: 'data_center_cooling',
    technology: 'Filtración en línea + enfriamiento evaporativo',
    filtrationLevel: '1 micrón + humedad controlada',
    flowRate: '500-1500 m³/h',
    lifespan: '12-18 meses',
    fieldTestResults: {
      dustRemoval: '99.9%',
      temperatureStability: '±2°C',
      downtime: '0% (redundancia integrada)',
      testSites: ['Data center Tier 3 (Argentina)', 'Nube privada (Chile)']
    },
    applicableTo: ['data_centers'],
    recommendedFor: ['contamination', 'particles'],
    operatingContexts: ['industrial']
  },

  FOOD_001: {
    sku: 'FOOD-001',
    name: 'Filtro Alimentario NSF Certified',
    category: 'food_beverage',
    technology: 'Membrana polimérica biocompatible',
    filtrationLevel: '10 micrones',
    flowRate: '200 L/min',
    lifespan: '2-4 semanas',
    fieldTestResults: {
      bacteriaRemoval: '99.99%',
      chemicalRemoval: '98%',
      allergenRemoval: '99.5%',
      testSites: ['Cervecería artesanal (Colombia)', 'Planta de bebidas (Brasil)']
    },
    applicableTo: ['food_industry', 'production_equipment'],
    recommendedFor: ['microorganisms', 'contamination', 'particles'],
    operatingContexts: ['food_beverage', 'manufacturing']
  }
};

export const PRODUCT_CATEGORIES = {
  water_filtration: 'Filtración de Agua',
  air_filtration: 'Filtración de Aire',
  compressed_air: 'Aire Comprimido',
  hvac_filtration: 'Sistemas HVAC',
  data_center_cooling: 'Enfriamiento Data Center',
  food_beverage: 'Industria Alimentaria'
};

export function getProductsByRisks(risks) {
  const riskToProducts = {
    contamination: ['WF_001', 'WF_002', 'AF_001', 'DATA_001', 'FOOD_001'],
    particles: ['WF_001', 'AF_001', 'AF_002', 'HVAC_001'],
    microorganisms: ['WF_002', 'AF_002', 'HVAC_001', 'FOOD_001'],
    corrosion: ['WF_003'],
    sediment: ['WF_001'],
    chemical: ['WF_002', 'FOOD_001'],
    biological: ['WF_002', 'AF_002', 'HVAC_001'],
    particulate: ['WF_001', 'AF_001', 'HVAC_001'],
    odor: ['AF_001'],
    scale: ['WF_003'],
    unknown: []
  };

  const products = new Set();
  for (const risk of risks) {
    const skus = riskToProducts[risk] || [];
    skus.forEach(sku => products.add(sku));
  }

  return Array.from(products)
    .map(sku => PRODUCTS[sku])
    .filter(p => p);
}

export function getProductsByAssets(assets) {
  const assetToProducts = {
    water_systems: ['WF_001', 'WF_002', 'WF_003'],
    air_systems: ['AF_001'],
    industrial_plants: ['WF_001', 'WF_003', 'AF_001', 'AF_002'],
    production_equipment: ['WF_002', 'AF_002', 'FOOD_001'],
    hvac_systems: ['HVAC_001'],
    compressed_air: ['AF_002'],
    office_spaces: ['HVAC_001'],
    data_centers: ['DATA_001'],
    food_industry: ['FOOD_001'],
    pharmaceutical: ['WF_002']
  };

  const products = new Set();
  for (const asset of assets) {
    const skus = assetToProducts[asset] || [];
    skus.forEach(sku => products.add(sku));
  }

  return Array.from(products)
    .map(sku => PRODUCTS[sku])
    .filter(p => p);
}

export function getProductsByContext(context) {
  const contextToProducts = {
    industrial: ['WF_001', 'WF_003', 'AF_001', 'AF_002', 'DATA_001'],
    commercial: ['WF_001', 'HVAC_001'],
    residential: ['WF_001', 'AF_001', 'HVAC_001'],
    food_beverage: ['FOOD_001'],
    healthcare: ['WF_002', 'HVAC_001'],
    manufacturing: ['WF_001', 'WF_003', 'AF_002', 'FOOD_001'],
    pharmaceutical: ['WF_002']
  };

  return (contextToProducts[context] || [])
    .map(sku => PRODUCTS[sku])
    .filter(p => p);
}

export function getRecommendedProducts(assets, risks, context) {
  const byRisks = getProductsByRisks(risks);
  const byAssets = getProductsByAssets(assets);
  const byContext = getProductsByContext(context);

  // Score products by how many categories they match
  const productMap = new Map();
  [...byRisks, ...byAssets, ...byContext].forEach(product => {
    const current = productMap.get(product.sku) || { product, score: 0 };
    current.score += 1;
    productMap.set(product.sku, current);
  });

  // Sort by score (higher is better match) and return top products
  return Array.from(productMap.values())
    .sort((a, b) => b.score - a.score)
    .map(item => item.product)
    .slice(0, 3);
}

export function buildProductRecommendationText(products) {
  if (!products || products.length === 0) {
    return null;
  }

  const recommendations = products.map(p => {
    return `**${p.sku} - ${p.name}**
Tecnología: ${p.technology}
Filtración: ${p.filtrationLevel}
Rendimiento: ${p.flowRate}
Durabilidad: ${p.lifespan}
Pruebas de campo: ${p.fieldTestResults[Object.keys(p.fieldTestResults)[0]]} en ${p.fieldTestResults.testSites?.[0] || 'múltiples sitios'}`;
  }).join('\n\n');

  return recommendations;
}
