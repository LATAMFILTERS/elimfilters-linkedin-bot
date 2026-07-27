// ELIMFILTERS technical knowledge base - bot is the expert, not just a gateway
export const TECHNICAL_KNOWLEDGE = {
  // How filtration works and solutions for specific problems
  contamination_water: {
    problem: 'Contaminación del agua',
    causes: [
      'Condensación en tanques de almacenamiento',
      'Falta de purga regular del sistema',
      'Sedimentación natural del agua',
      'Acumulación de partículas en tuberías',
      'Entrada de suciedad desde fuentes externas'
    ],
    solution: 'Filtración multicapa con microfibra de 5 micrones',
    howItWorks: 'La malla multicapa atrapa partículas de diferentes tamaños en capas sucesivas, logrando 99.5% de remoción de sedimento',
    installation: '1-2 horas, compatible con sistemas existentes',
    maintenance: 'Reemplazo cada 6-12 meses dependiendo del volumen y contaminación inicial',
    benefits: [
      'Reduce 99.2% de contaminación',
      'Extiende vida útil de equipos downstream',
      'Mantiene calidad de agua constante',
      'ROI en 2-3 meses por reducción de paros'
    ]
  },

  microorganisms_water: {
    problem: 'Bacterias, hongos o microorganismos en agua',
    causes: [
      'Agua estancada sin circulación',
      'Temperatura inadecuada (15-30°C favorece crecimiento)',
      'Falta de desinfección o tratamiento',
      'Biofilm acumulado en tuberías antiguas',
      'Contaminación biológica del agua de entrada'
    ],
    solution: 'Filtro antibiológico con carbón activado y membrana antimicrobiana',
    howItWorks: 'El carbón activado adsorbe impurezas orgánicas mientras la membrana de 0.5 micrones elimina bacterias y virus',
    installation: '2-3 horas, requiere limpieza previa del sistema',
    maintenance: 'Reemplazo cada 3-6 meses, monitoreo semanal de pH y cloro residual',
    benefits: [
      'Elimina 99.99% de bacterias',
      'Protege salud de operarios',
      'Cumple normas ISO 13485 para industria alimentaria',
      'Reduce olores y sabores desagradables'
    ]
  },

  sediment_accumulation: {
    problem: 'Acumulación de sedimento en tanques y tuberías',
    causes: [
      'Falta de purga del sistema (no se drena periódicamente)',
      'Sedimentación natural del agua dura',
      'Erosión de tuberías metálicas corroídas',
      'Detritos acumulados en puntos bajos',
      'Baja velocidad de flujo en líneas de retorno'
    ],
    solution: 'Sistema de prefiltración 5μm + purga automática programada',
    howItWorks: 'Filtra partículas antes de que sedimenten. La purga automática drena sedimento acumulado cada 24-48 horas',
    installation: '3-4 horas con válvula de purga y timer programable',
    maintenance: 'Limpiar línea de purga mensualmente, inspeccionar cada 3 meses',
    benefits: [
      'Previene 99.5% de sedimentación',
      'Reduce mantenimiento manual',
      'Evita paros de producción por atascos',
      'Extiende vida de equipos presión 5-7 años más'
    ]
  },

  scale_hardness: {
    problem: 'Sarro/incrustaciones por agua dura',
    causes: [
      'Agua con alto contenido de minerales (calcio/magnesio)',
      'pH elevado (>8) favorece precipitación',
      'Temperatura alta acelera formación de depósitos',
      'Falta de inhibidores de escala',
      'Evaporación concentra minerales'
    ],
    solution: 'Sistema de ósmosis inversa o suavizador de agua',
    howItWorks: 'Ósmosis inversa: membrana de 0.0001 micrones rechaza minerales (99.5% remoción). Suavizador: intercambio iónico reemplaza calcio/magnesio por sodio',
    installation: 'OI: 4-6 horas. Suavizador: 2-3 horas. Requiere drenaje',
    maintenance: 'OI: cambiar membrana cada 12-24 meses. Suavizador: regenerar con sal cada 2-4 semanas',
    benefits: [
      'Elimina 99.5% de minerales',
      'Reduce consumo de energía en calderas',
      'Extiende vida de equipos 2-3x',
      'Mejora eficiencia térmica 30%'
    ]
  },

  corrosion_prevention: {
    problem: 'Corrosión de tuberías y equipos',
    causes: [
      'Agua con bajo pH (<6.5) es corrosiva',
      'Alto contenido de oxígeno disuelto',
      'Falta de inhibidores de corrosión',
      'Reacciones electroquímicas entre metales diferentes',
      'Agua con dióxido de carbono disuelto'
    ],
    solution: 'Filtro estabilizador de pH + inhibidores de corrosión',
    howItWorks: 'Neutraliza agua ácida elevando pH a 7.0-7.5. Inhibe capa protectora de óxido en metal',
    installation: '2-3 horas, se integra en línea de entrada',
    maintenance: 'Monitoreo de pH mensual, reemplazo cada 12 meses',
    benefits: [
      'Detiene corrosión activa',
      'Protege inversión de 10-15 años',
      'Reduce fallas por pinchazos',
      'Cumple ASME B16.1 para equipos presurizado'
    ]
  },

  compressed_air_oil: {
    problem: 'Aire comprimido contaminado con aceite y humedad',
    causes: [
      'Compresor viejo con desgaste en sellos',
      'Falta de drenaje de condensación en tanque',
      'Tuberías con óxido interno',
      'Vapor de aceite del compresor no filtrado',
      'Aire húmedo sin secador'
    ],
    solution: 'Compresor con filtración integrada en 3 etapas',
    howItWorks: 'Etapa 1: partículas 1μm. Etapa 2: vapor de aceite 0.01μm. Etapa 3: humedad (secador desecante)',
    installation: '4-6 horas, requiere purga de sistema anterior',
    maintenance: 'Drenar condensación diaria, cambiar cartuchos cada 6-12 meses',
    benefits: [
      'Aire limpio 99.99% libre de aceite',
      'Protege herramientas neumáticas',
      'Extiende vida de cilindros y válvulas',
      'Mejora precisión en procesos de pintura/chorreado'
    ]
  },

  maintenance_best_practices: {
    weekly: [
      'Inspeccionar visual de tuberías por fugas',
      'Escuchar ruidos anormales (atascos, cavitación)',
      'Anotar presión diferencial del filtro'
    ],
    monthly: [
      'Medir presión de entrada/salida',
      'Verificar nivel de condensación en tanque',
      'Drenar válvula de purga si existe',
      'Revisar pH del agua (si aplica)'
    ],
    quarterly: [
      'Inspeccionar interior de tuberías (endoscopio si es posible)',
      'Limpiar filtros secundarios',
      'Prueba de caudal',
      'Documentar todos los datos'
    ],
    annually: [
      'Cambio de cartuchos principales',
      'Calibración de instrumentos de medición',
      'Inspección profesional con reporte',
      'Planificación de siguiente año'
    ]
  }
};

export function getKnowledgeForRisk(riskType) {
  const riskToKnowledge = {
    'contamination': 'contamination_water',
    'microorganisms': 'microorganisms_water',
    'sediment': 'sediment_accumulation',
    'scale': 'scale_hardness',
    'corrosion': 'corrosion_prevention',
    'particles': 'contamination_water',
    'chemical': 'contamination_water',
    'biological': 'microorganisms_water',
    'particulate': 'contamination_water',
    'odor': 'contamination_water'
  };

  const knowledgeKey = riskToKnowledge[riskType];
  return knowledgeKey ? TECHNICAL_KNOWLEDGE[knowledgeKey] : null;
}

export function buildDetailedTechnicalResponse(product, knowledgeKey) {
  const knowledge = TECHNICAL_KNOWLEDGE[knowledgeKey];
  if (!knowledge) return null;

  const response = `Te explico técnicamente cómo se resuelve tu problema:

**El problema:** ${knowledge.problem}
- ${knowledge.causes.join('\n- ')}

**La solución:** ${product.name} (${product.sku})

**Cómo funciona:**
${knowledge.howItWorks}

**Instalación y mantenimiento:**
- Instalación: ${knowledge.installation}
- Mantenimiento: ${knowledge.maintenance}

**Beneficios específicos para tu caso:**
${knowledge.benefits.map(b => `• ${b}`).join('\n')}

¿Esto aclara cómo resolvemos tu problema de ${knowledge.problem.toLowerCase()}?`;

  return response;
}

export function getMaintenanceSchedule() {
  return TECHNICAL_KNOWLEDGE.maintenance_best_practices;
}
