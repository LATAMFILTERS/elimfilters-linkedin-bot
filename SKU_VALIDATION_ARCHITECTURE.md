# SKU Validation Architecture - Unified Rule Across All Channels

**Document Status**: ✅ Approved Architecture  
**Last Updated**: 2026-07-27  
**Applies To**: WhatsApp, Instagram, Facebook, LinkedIn, Web Chat, Facebook Messenger  

---

## The Rule

> **CORE PRINCIPLE**: Every product recommendation across all channels must be validated against the ELIMFILTERS product database. If no product exists or the match is insufficient, redirect to `support@elimfilters.com` instead of recommending anything.

---

## Triple Validation Gate

Before any SKU is recommended on ANY channel, it MUST pass:

```
┌─────────────────────────────────────────────────────────┐
│  VALIDATION GATE (All Channels)                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✅ GATE 1: Does SKU exist in PRODUCTS database?       │
│     If NO  → Redirect to support@elimfilters.com        │
│                                                         │
│  ✅ GATE 2: Is SKU appropriate for this use case?      │
│     If NO  → Redirect to support@elimfilters.com        │
│                                                         │
│  ✅ GATE 3: Does match score exceed 0.5?              │
│     If NO  → Redirect to support@elimfilters.com        │
│                                                         │
│  ✓ PASS ALL 3 → Recommend SKU                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Product Database Reference

**Location**: `src/products.js` (master copy)

**Validated SKUs** (as of 2026-07-27):

| SKU | Product Name | Category | Assets | Risks | Status |
|-----|--------------|----------|--------|-------|--------|
| WF-001 | Filtro de Agua Premium 5μm | Water | industrial, commercial | sediment, corrosion, particles | ✅ Production |
| WF-002 | Filtro de Agua Residencial | Water | residential | particles, odor | ✅ Production |
| AF-001 | Filtro de Aire Industrial | Air | industrial, hvac | particles, dust | ✅ Production |
| DATA-001 | Filtro para Data Centers | Data | data_centers | contamination, particles | ✅ Production |
| FOOD-001 | Filtro Industria Alimentaria | Food | food_industry, pharma | contamination, microorganisms | ✅ Production |

**New SKUs must be added to this document AND to src/products.js before any channel can recommend them.**

---

## Channel Implementation

### 1. WhatsApp Bot
**Repository**: `elimfilters-whatsapp-bot`  
**Implementation**: `src/conversation.js` → `proposeSolution()` function

```javascript
// PROPOSING_SOLUTION state
const products = getRecommendedProducts(assets, risks, context);

if (products.length === 0 || score < 0.5) {
  return `Tu caso es especializado...\n\n` +
         `support@elimfilters.com`;
}
return buildRecommendation(products[0]); // ✅ SKU validated
```

**Validation Triggers**:
- After understanding problem (IDENTIFYING_ASSETS state)
- Score calculated from extracted risks + assets
- Database lookup before response generation

---

### 2. Instagram Bot
**Repository**: `elimfilters-instagram-bot`  
**Implementation**: `src/queue/elimfilters-worker.js` + conversation module (shared)

```javascript
// Uses SAME conversation.js as WhatsApp
const result = await conversationFlow.processMessage(
  senderId,
  messageText,
  senderUsername
);

// SKU validation happens inside processMessage()
// Storage adapter handles DB queries
```

**Validation Triggers**:
- DM events processed through conversation flow
- Same proposeSolution() logic as WhatsApp
- Database query via Instagram adapter

---

### 3. Facebook Messenger
**Repository**: `elimfilters-facebook-bot`  
**Implementation**: `src/queue/elimfilters-worker.js` + conversation module (shared)

```javascript
// Uses SAME conversation.js as WhatsApp + Instagram
const result = await conversationFlow.processMessage(
  contactId,
  messageText,
  contactName
);

// SKU validation inherited from shared modules
// Storage adapter handles Facebook DB schema
```

**Validation Triggers**:
- Message events from webhook
- Processed through unified conversation flow
- Database validation before publishReply()

---

### 4. LinkedIn Bot
**Repository**: `elimfilters-linkedin-bot`  
**Implementation**: `src/queue/elimfilters-worker.js` + conversation module (shared)

```javascript
// Uses SAME conversation.js as other platforms
const result = await conversationFlow.processMessage(
  authorUrn,
  messageText,
  authorName
);

// SKU validation identical to all channels
// LinkedIn-specific: Comment replies only (API limitation)
```

**Validation Triggers**:
- Comment/message events from webhook
- Processed through unified conversation flow
- Database validation before replyToComment()

---

### 5. Web Chat (Future)
**Repository**: TBD  
**Implementation**: Shared `src/conversation.js` + Web-specific handler

```javascript
// Same pattern as all channels
const result = await conversationFlow.processMessage(
  visitorId,
  messageText,
  visitorName
);

// SKU validation inherited from core modules
```

**Validation Triggers**:
- Chat messages from web widget
- Same conversation flow
- Database lookup before response

---

### 6. Facebook Messenger (separate from Messenger Platform)
**Repository**: `elimfilters-whatsapp-bot` (integrated)  
**Implementation**: `src/facebook.js` + conversation module (shared)

```javascript
// Uses SAME conversation flow
const app = createFacebookApp({
  conversation: conversationFlow, // ✅ Shared, validated
  storage,
  config
});
```

**Validation Triggers**:
- Messenger Platform webhooks
- Processed through unified conversation flow
- Database validation before sendFacebookMessage()

---

## Fallback Response Template

**When SKU validation FAILS on any channel:**

```
Tu caso es especializado y necesita atención técnica profesional.

Por favor contacta a nuestro equipo de soporte en:

📧 support@elimfilters.com

Con estos detalles:
• Activos que necesitás proteger: [EXTRACTED FROM CONVERSATION]
• Riesgos específicos: [EXTRACTED FROM CONVERSATION]
• Contexto operacional: [EXTRACTED FROM CONVERSATION]
• Volumen/Escala: [IF AVAILABLE]

Con gusto te contestarán a la brevedad con una solución customizada.
```

**This response is IDENTICAL across all channels.**

---

## Database Validation Logic (Shared)

**File**: `src/conversation.js` → `proposeSolution()` function

```javascript
function proposeSolution(contact) {
  const assets = extractAllAssets(contact.messages);
  const risks = extractAllRisks(contact.messages);
  const context = extractContext(contact.messages);

  // GATE 1: Does product exist?
  const candidates = getRecommendedProducts(assets, risks, context);
  if (candidates.length === 0) {
    return FALLBACK_TO_SUPPORT(assets, risks, context);
  }

  // GATE 2: Is it appropriate?
  const topProduct = candidates[0];
  if (!topProduct.recommendedFor.includes(context)) {
    return FALLBACK_TO_SUPPORT(assets, risks, context);
  }

  // GATE 3: Score check
  const score = calculateMatchScore(topProduct, assets, risks);
  if (score < 0.5) {
    return FALLBACK_TO_SUPPORT(assets, risks, context);
  }

  // ✅ All gates passed
  return buildRecommendation(topProduct);
}
```

**This function is SHARED and IDENTICAL across all bots.**

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIFIED CONVERSATION FLOW                    │
│                                                                 │
│  Shared Modules (src/):                                         │
│  ├─ conversation.js (8 states + SKU validation) ✅ VALIDATED   │
│  ├─ products.js (SKU database)                                  │
│  ├─ knowledge.js (Technical knowledge base)                     │
│  ├─ consultant.js (Asset/risk extraction)                       │
│  ├─ storage.js (Contact persistence interface)                  │
│  └─ intent.js (Intent detection)                                │
│                                                                 │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┬──────────┬──────────┐
        │          │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │WhatsApp│ │Instagram│ │Facebook│ │LinkedIn│ │Web Chat│ │Messenger│
    │  Bot   │ │  Bot   │ │  Bot   │ │  Bot   │ │ (TBD) │ │Platform │
    └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
        │          │          │          │          │          │
        │ Shared conversation flow = Shared SKU validation ✅
        │
        ▼
    ┌─────────────────────────────────┐
    │  PRODUCTS DATABASE              │
    │  (src/products.js)              │
    │                                 │
    │  WF-001 ✅                      │
    │  WF-002 ✅                      │
    │  AF-001 ✅                      │
    │  DATA-001 ✅                    │
    │  FOOD-001 ✅                    │
    │                                 │
    │  Any channel can ONLY recommend │
    │  these validated SKUs           │
    └─────────────────────────────────┘
```

---

## Testing & Validation

### All Channels Must Pass:

1. **SKU Exists Test**: Recommend existing product → ✅ Show it
2. **SKU Missing Test**: Recommend non-existent product → ✅ Fallback
3. **Score Low Test**: Low match score → ✅ Fallback
4. **Context Mismatch Test**: SKU wrong for context → ✅ Fallback
5. **Fallback Response Test**: Correct email shown → ✅ `support@elimfilters.com`

### Test Coverage By Channel:

| Channel | SKU Exists | SKU Missing | Low Score | Fallback | Status |
|---------|-----------|-----------|-----------|----------|--------|
| WhatsApp | ✅ | ✅ | ✅ | ✅ | Production |
| Instagram | ✅ | ✅ | ✅ | ✅ | Ready |
| Facebook | ✅ | ✅ | ✅ | ✅ | Ready |
| LinkedIn | ✅ | ✅ | ✅ | ✅ | Ready |
| Web Chat | ⏳ | ⏳ | ⏳ | ⏳ | Not Started |
| Messenger | ✅ | ✅ | ✅ | ✅ | Production |

---

## Implementation Checklist

- [x] WhatsApp Bot implements triple validation
- [x] Instagram Bot inherits from shared conversation.js
- [x] Facebook Bot inherits from shared conversation.js
- [x] LinkedIn Bot inherits from shared conversation.js
- [ ] Web Chat (TBD) will inherit from shared conversation.js
- [x] Facebook Messenger inherits from shared conversation.js
- [x] products.js contains all validated SKUs
- [x] Fallback response template documented
- [x] All channels use identical SKU validation logic
- [ ] E2E tests verify validation across all channels

---

## Enforcement

**Code Review Rule**: 

Any PR that:
- Recommends a SKU not in products.js
- Skips the triple validation gate
- Uses a different fallback response on one channel vs another

**MUST be rejected** until aligned.

---

## Future Additions

When adding a new SKU:

1. **Add to `src/products.js`** with full specs
2. **Update this document** (SKU table)
3. **Run validation tests** on all channels
4. **Verify all 6 channels** recommend it correctly
5. **Merge after all tests pass**

No channel gets special treatment. All follow the same gate.

