# Compatibility Scoring System

## Overview

The compatibility scoring algorithm calculates love compatibility between two people based on their zodiac signs. The system uses a deterministic, multi-factor approach combining element compatibility, quality compatibility, and traditional astrological aspects.

## Implementation

### Files Created

1. **`scoring.ts`** - Core scoring algorithm with the following functions:
   - `calculateElementScore()` - Element compatibility (40% weight)
   - `calculateQualityScore()` - Quality compatibility (30% weight)
   - `getSignSpecificAdjustment()` - Traditional aspect adjustments
   - `calculateOverallScore()` - Combined compatibility score
   - `calculateDetailedScores()` - Detailed breakdown for all aspects

2. **`scoring.test.ts`** - Comprehensive unit tests covering:
   - Element compatibility rules
   - Quality compatibility rules
   - Sign-specific adjustments
   - Overall score calculation
   - Detailed score breakdown
   - Determinism and symmetry
   - Edge cases and known pairings

3. **`scoring.verify.ts`** - Manual verification script for testing

## Scoring Rules

### Element Compatibility (40% weight)

Elements interact according to traditional astrology:

- **Same Element**: 90-100 points
  - Fire + Fire = 95
  - Earth + Earth = 92
  - Air + Air = 90
  - Water + Water = 93

- **Compatible Elements**: 70-85 points
  - Fire + Air = 80 (air feeds fire)
  - Earth + Water = 78 (water nourishes earth)

- **Challenging Elements**: 30-45 points
  - Fire + Water = 35 (water extinguishes fire)
  - Fire + Earth = 40 (fire scorches earth)
  - Air + Water = 42 (water dampens air)
  - Air + Earth = 38 (earth grounds air)

### Quality Compatibility (30% weight)

Qualities (Cardinal, Fixed, Mutable) have different dynamics:

- **Same Quality**: 80-90 points
  - Cardinal + Cardinal = 85 (both initiators)
  - Fixed + Fixed = 88 (both stable)
  - Mutable + Mutable = 82 (both adaptable)

- **Mixed Qualities**: 60-75 points
  - Cardinal + Mutable = 70 (good synergy)
  - Cardinal + Fixed = 65 (moderate tension)
  - Fixed + Mutable = 60 (challenging)

### Sign-Specific Rules (30% base + adjustments)

Traditional astrological aspects provide bonuses/penalties:

- **Trines** (+10 points): Same element signs 120° apart
  - Fire: Aries-Leo, Aries-Sagittarius, Leo-Sagittarius
  - Earth: Taurus-Virgo, Taurus-Capricorn, Virgo-Capricorn
  - Air: Gemini-Libra, Gemini-Aquarius, Libra-Aquarius
  - Water: Cancer-Scorpio, Cancer-Pisces, Scorpio-Pisces

- **Oppositions** (-5 points): Signs 180° apart
  - Aries-Libra, Taurus-Scorpio, Gemini-Sagittarius, etc.

- **Squares** (-8 points): Signs 90° apart
  - Aries-Cancer, Taurus-Leo, Gemini-Virgo, etc.

## Detailed Scores

The system calculates four specific compatibility aspects:

### 1. Overall Compatibility
Base score combining all factors with proper weighting.

### 2. Communication
Influenced by:
- Air element presence (+5 bonus)
- Mutable quality presence (+5 bonus)
- Base compatibility (70% weight)

### 3. Emotional Connection
Influenced by:
- Water element presence (+5 bonus)
- Cardinal quality presence (+5 bonus)
- Base compatibility (70% weight)

### 4. Long-term Potential
Influenced by:
- Earth element presence (+5 bonus)
- Fixed quality presence (+5 bonus)
- Base compatibility (70% weight)

## Properties Validated

The implementation satisfies the following correctness properties:

- **Property 5**: Compatibility scores are always in range [0, 100]
- **Property 6**: Scores are deterministic (same inputs = same outputs)
- **Property 8**: All required score categories are present

## Usage Example

```typescript
import { calculateDetailedScores } from './scoring';
import { ZodiacSign } from '../horoscope/types';

// Calculate compatibility between Aries and Leo
const scores = calculateDetailedScores(ZodiacSign.ARIES, ZodiacSign.LEO);

console.log(scores);
// {
//   overall: 95,
//   communication: 88,
//   emotional: 85,
//   longTerm: 90
// }
```

## Testing

Run tests with:
```bash
npm test -- src/lib/compatibility/scoring.test.ts
```

The test suite includes:
- 50+ unit tests
- Edge case coverage
- Known pairing validation
- Determinism verification
- Symmetry verification
- All 144 zodiac combinations tested

## Requirements Satisfied

- ✅ Requirement 3.2: Compatibility score between 0-100
- ✅ Requirement 3.6: Deterministic scoring
- ✅ Element compatibility rules implemented
- ✅ Quality compatibility rules implemented
- ✅ Sign-specific pairing rules implemented
- ✅ All scores properly weighted and clamped
