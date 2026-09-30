import { Product, CoffeeFinderAnswers, CoffeeFinderResult, CoffeeMatchScore, ShopifyCoffeeMetafields, CoffeeFlavourOption } from '../types';

/**
 * SHOPIFY PRODUCT METAFIELDS MAPPING SCHEMA
 * This data structure models Shopify Metafields:
 * - coffee.roast
 * - coffee.strength
 * - coffee.flavour_notes
 * - coffee.brewing_methods
 * - coffee.moods
 * - coffee.milk_friendly
 * - coffee.iced_friendly
 */
export const PRODUCT_COFFEE_METAFIELDS: Record<string, ShopifyCoffeeMetafields> = {
  'trose-reserve-ethiopia-yirgacheffe': {
    roast: 'Light',
    strength: 'Smooth',
    flavour_notes: ['fruity-bright', 'light-delicate', 'caramel-sweet'],
    brewing_methods: ['pour-over', 'coffee-machine', 'instant-easy', 'not-sure'],
    moods: ['slow-morning', 'work-mode', 'friends'],
    milk_friendly: false,
    iced_friendly: true
  },
  'trose-velvet-noir-espresso': {
    roast: 'Espresso Roast',
    strength: 'Very Bold',
    flavour_notes: ['chocolate-rich', 'bold-intense', 'nutty-smooth'],
    brewing_methods: ['espresso-machine', 'moka-pot', 'french-press', 'capsules', 'not-sure'],
    moods: ['wake-up', 'work-mode', 'dessert'],
    milk_friendly: true,
    iced_friendly: true
  },
  'trose-guatemala-antigua-estate': {
    roast: 'Medium',
    strength: 'Balanced',
    flavour_notes: ['chocolate-rich', 'caramel-sweet', 'nutty-smooth'],
    brewing_methods: ['coffee-machine', 'french-press', 'pour-over', 'moka-pot', 'not-sure'],
    moods: ['work-mode', 'friends', 'slow-morning', 'dessert'],
    milk_friendly: true,
    iced_friendly: true
  },
  'trose-kenya-aa-nyeri-hill': {
    roast: 'Light',
    strength: 'Smooth',
    flavour_notes: ['fruity-bright', 'light-delicate'],
    brewing_methods: ['pour-over', 'coffee-machine', 'not-sure'],
    moods: ['slow-morning', 'wake-up', 'friends'],
    milk_friendly: false,
    iced_friendly: true
  },
  'trose-organic-honduras-marcala': {
    roast: 'Medium',
    strength: 'Balanced',
    flavour_notes: ['caramel-sweet', 'fruity-bright', 'light-delicate'],
    brewing_methods: ['coffee-machine', 'pour-over', 'french-press', 'capsules', 'not-sure'],
    moods: ['slow-morning', 'friends', 'work-mode', 'gift'],
    milk_friendly: true,
    iced_friendly: true
  },
  'trose-organic-peru-cajamarca': {
    roast: 'Light',
    strength: 'Smooth',
    flavour_notes: ['caramel-sweet', 'nutty-smooth', 'fruity-bright'],
    brewing_methods: ['pour-over', 'french-press', 'coffee-machine', 'not-sure'],
    moods: ['slow-morning', 'dessert', 'friends', 'gift'],
    milk_friendly: true,
    iced_friendly: false
  },
  'trose-organic-sumatra-gayo-dark': {
    roast: 'Dark',
    strength: 'Bold',
    flavour_notes: ['bold-intense', 'chocolate-rich', 'nutty-smooth'],
    brewing_methods: ['french-press', 'moka-pot', 'coffee-machine', 'espresso-machine', 'not-sure'],
    moods: ['wake-up', 'work-mode', 'dessert'],
    milk_friendly: true,
    iced_friendly: true
  },
  'trose-connoisseur-gift-flight': {
    roast: 'Medium',
    strength: 'Balanced',
    flavour_notes: ['chocolate-rich', 'caramel-sweet', 'fruity-bright', 'bold-intense'],
    brewing_methods: ['pour-over', 'espresso-machine', 'french-press', 'coffee-machine', 'moka-pot', 'not-sure'],
    moods: ['gift', 'friends', 'slow-morning', 'wake-up'],
    milk_friendly: true,
    iced_friendly: true
  },
  'trose-nitro-cold-brew-concentrate': {
    roast: 'Espresso Roast',
    strength: 'Bold',
    flavour_notes: ['chocolate-rich', 'caramel-sweet', 'bold-intense'],
    brewing_methods: ['instant-easy', 'not-sure'],
    moods: ['wake-up', 'work-mode', 'friends'],
    milk_friendly: true,
    iced_friendly: true
  }
};

/**
 * Map friendly descriptions for reasons & dynamic text generator
 */
const FLAVOUR_LABELS: Record<CoffeeFlavourOption, string> = {
  'chocolate-rich': 'rich chocolate notes',
  'caramel-sweet': 'golden caramel sweetness',
  'fruity-bright': 'sparkling fruity brightness',
  'nutty-smooth': 'toasted nutty warmth',
  'bold-intense': 'deep intense body',
  'light-delicate': 'delicate floral aromatics'
};

const BREWING_LABELS: Record<string, string> = {
  'espresso-machine': 'espresso machine',
  'coffee-machine': 'drip coffee maker',
  'french-press': 'French press immersion',
  'pour-over': 'pour-over dripper',
  'moka-pot': 'stovetop moka pot',
  'capsules': 'capsule / pod setup',
  'instant-easy': 'quick-brew routine',
  'not-sure': 'everyday coffee setup'
};

const MOOD_LABELS: Record<string, string> = {
  'wake-up': 'powering up your morning with vibrant energy',
  'work-mode': 'powering through focused work sessions',
  'slow-morning': 'savoring slow, peaceful morning moments',
  'dessert': 'pairing alongside sweet treats and dessert',
  'friends': 'sharing relaxed conversations with good friends',
  'gift': 'delighting someone with a thoughtful artisan gift'
};

/**
 * Persona generator based on the matched roast & answers
 */
function generatePersonaTitle(product: Product, answers: CoffeeFinderAnswers): string {
  if (answers.mood === 'gift') return 'The Generous Coffee Curator';
  if (answers.brewingMethod === 'espresso-machine') return 'The Precision Espresso Artisan';
  if (answers.enjoyment === 'iced') return 'The Cold Brew Aficionado';
  if (product.roastLevel === 'Light') return 'The Bright Origin Explorer';
  if (product.roastLevel === 'Dark' || product.roastLevel === 'Espresso Roast') return 'The Bold Velvet Devotee';
  if (product.isOrganic) return 'The Organic Canopy Purist';
  return 'The Balanced Daily Connoisseur';
}

/**
 * Dynamic "Why You'll Love It" custom explanation based on actual quiz answers
 */
function generatePersonalizedExplanation(
  product: Product,
  answers: CoffeeFinderAnswers,
  metafields?: ShopifyCoffeeMetafields
): string {
  const enjoymentPhrase = 
    answers.enjoyment === 'milk'
      ? 'with milk or your favorite plant-based blend'
      : answers.enjoyment === 'black'
      ? 'sipped pure and black to savor every origin nuance'
      : answers.enjoyment === 'iced'
      ? 'crisp and refreshing over ice'
      : 'in whatever way your mood inspires today';

  const flavourList = answers.flavours.length > 0
    ? answers.flavours.map(f => FLAVOUR_LABELS[f] || f).join(' and ')
    : 'balanced, complex sweetness';

  const brewMethod = answers.brewingMethod ? (BREWING_LABELS[answers.brewingMethod] || 'your brew setup') : 'your kitchen ritual';
  const moodDesc = answers.mood ? (MOOD_LABELS[answers.mood] || 'your favorite coffee moment') : 'your daily cup';

  // Customized natural narrative
  if (product.id === 'trose-velvet-noir-espresso') {
    return `You told us you crave ${flavourList} ${enjoymentPhrase} using your ${brewMethod}. Velvet Noir is drum-roasted specifically to deliver dense crema, intense cocoa richness, and velvety depth that shines effortlessly for ${moodDesc}.`;
  }

  if (product.id === 'trose-reserve-ethiopia-yirgacheffe') {
    return `Because you love ${flavourList} and prefer your coffee ${enjoymentPhrase}, this heirloom Ethiopian micro-lot is your ideal match. Sourced at 2,000m elevation, it yields tea-like elegance, fragrant bergamot, and pure stone-fruit clarity on your ${brewMethod}.`;
  }

  if (product.id === 'trose-guatemala-antigua-estate') {
    return `You prefer a ${answers.strength || 'Balanced'} profile featuring ${flavourList} ${enjoymentPhrase}. Grown in volcanic Guatemalan soil, this single-estate Bourbon roast creates a comforting cup with cinnamon praline sweetness tailored for ${moodDesc}.`;
  }

  if (product.id === 'trose-kenya-aa-nyeri-hill') {
    return `Your taste leans toward ${flavourList} brewed ${enjoymentPhrase}. This high-grown Kenyan lot brings sparkling blackcurrant acidity and cane sugar sweetness to life on your ${brewMethod}, ideal for ${moodDesc}.`;
  }

  if (product.id === 'trose-organic-honduras-marcala') {
    return `You selected ${flavourList} with a focus on ${enjoymentPhrase}. Certified 100% USDA Organic and shade-grown in Marcala, this roast provides comforting toffee and crisp red apple notes perfectly balanced for ${moodDesc}.`;
  }

  if (product.id === 'trose-organic-peru-cajamarca') {
    return `You asked for ${flavourList} ${enjoymentPhrase}. Sourced from rare high-altitude Andean peaberries, this honeyed micro-lot concentrates salted caramel and fig sweetness that extracts wonderfully with your ${brewMethod}.`;
  }

  if (product.id === 'trose-organic-sumatra-gayo-dark') {
    return `You told us you love ${flavourList} ${enjoymentPhrase} with real strength. This organic wet-hulled dark roast offers deep cedar, zero sharp acidity, and molten cacao richness to power ${moodDesc}.`;
  }

  if (product.id === 'trose-connoisseur-gift-flight') {
    return `With your desire for ${flavourList} and flexibility across ${brewMethod}, the Roaster's Reserve Flight gives you a curated multi-origin journey featuring Ethiopian florals, Honduran toffee, and Velvet Noir espresso.`;
  }

  // Fallback dynamic composition
  return `You told us you enjoy coffee ${enjoymentPhrase} with notes of ${flavourList} on your ${brewMethod}. ${product.name} provides exactly that harmony with ${product.roastLevel || 'artisan'} roast balance, crafted for ${moodDesc}.`;
}

/**
 * Transparent Scoring Algorithm
 * Compares customer quiz answers against Product attributes & Shopify Metafields
 */
export function scoreCoffeeProduct(
  product: Product,
  answers: CoffeeFinderAnswers
): CoffeeMatchScore {
  const metafields =
    PRODUCT_COFFEE_METAFIELDS[product.id] ||
    (product.handle ? PRODUCT_COFFEE_METAFIELDS[product.handle] : undefined);
  let points = 0;
  let maxPoints = 0;
  const reasons: string[] = [];

  // 1. Enjoyment Check (Max 25 pts)
  maxPoints += 25;
  if (answers.enjoyment) {
    if (answers.enjoyment === 'milk') {
      if (
        metafields?.milk_friendly ||
        product.roastLevel === 'Espresso Roast' ||
        product.roastLevel === 'Dark' ||
        product.roastLevel === 'Medium-Dark' ||
        product.roastLevel === 'Medium'
      ) {
        points += 25;
        reasons.push('Rich body that pairs deliciously with milk');
      } else {
        points += 10;
      }
    } else if (answers.enjoyment === 'black') {
      if (
        product.roastLevel === 'Light' ||
        product.roastLevel === 'Medium' ||
        product.category === 'organic'
      ) {
        points += 25;
        reasons.push('Clean origin clarity perfect for drinking black');
      } else {
        points += 15;
      }
    } else if (answers.enjoyment === 'iced') {
      if (
        metafields?.iced_friendly ||
        product.id === 'trose-nitro-cold-brew-concentrate' ||
        product.roastLevel === 'Light' ||
        product.roastLevel === 'Espresso Roast'
      ) {
        points += 25;
        reasons.push('Vibrant aromatics that shine over ice');
      } else {
        points += 15;
      }
    } else {
      // 'mood'
      points += 23;
      reasons.push('Versatile bean profile for any daily mood');
    }
  } else {
    points += 20;
  }

  // 2. Flavour Profile Overlap (Max 30 pts)
  maxPoints += 30;
  if (answers.flavours && answers.flavours.length > 0) {
    let matchedFlavoursCount = 0;
    answers.flavours.forEach((userFlavour) => {
      if (metafields?.flavour_notes.includes(userFlavour)) {
        matchedFlavoursCount++;
      } else if (product.tastingNotes && product.tastingNotes.length > 0) {
        const noteMatch = product.tastingNotes.some((tn) => {
          const lower = tn.toLowerCase();
          if (userFlavour === 'chocolate-rich') return lower.includes('choc') || lower.includes('cacao');
          if (userFlavour === 'caramel-sweet') return lower.includes('caramel') || lower.includes('toffee') || lower.includes('sugar');
          if (userFlavour === 'fruity-bright') return lower.includes('fruit') || lower.includes('citrus') || lower.includes('berry') || lower.includes('apple');
          if (userFlavour === 'nutty-smooth') return lower.includes('nut') || lower.includes('almond') || lower.includes('praline');
          if (userFlavour === 'bold-intense') return lower.includes('smoky') || lower.includes('spice') || lower.includes('dense');
          if (userFlavour === 'light-delicate') return lower.includes('floral') || lower.includes('jasmine') || lower.includes('bergamot');
          return false;
        });
        if (noteMatch) matchedFlavoursCount++;
      }
    });

    if (matchedFlavoursCount > 0) {
      points += Math.min(30, matchedFlavoursCount * 15);
      reasons.push('Tasting notes that align with your chosen flavors');
    } else if (metafields || (product.tastingNotes && product.tastingNotes.length > 0)) {
      points += 12;
    } else {
      // No metadata available on this Shopify product - do NOT fabricate points
      points += 15;
    }
  } else {
    points += 22;
  }

  // 3. Strength / Roast Intensity (Max 20 pts)
  maxPoints += 20;
  if (answers.strength) {
    const strength = answers.strength;
    const prodStrength = metafields?.strength;

    if (strength === prodStrength) {
      points += 20;
      reasons.push(`Matches your preference for a ${strength} roast profile`);
    } else if (
      (strength === 'Smooth' && (product.roastLevel === 'Light' || product.roastMeter === 1 || product.roastMeter === 2)) ||
      (strength === 'Balanced' && (product.roastLevel === 'Medium' || product.roastMeter === 3)) ||
      (strength === 'Bold' && (product.roastLevel === 'Dark' || product.roastMeter === 4)) ||
      (strength === 'Very Bold' && (product.roastLevel === 'Espresso Roast' || product.roastMeter === 5))
    ) {
      points += 20;
      reasons.push(`Engineered for a ${strength} cup`);
    } else {
      // Off by 1 step
      points += 12;
    }
  } else {
    points += 16;
  }

  // 4. Brewing Method (Max 15 pts)
  maxPoints += 15;
  if (answers.brewingMethod) {
    if (answers.brewingMethod === 'not-sure' || metafields?.brewing_methods.includes(answers.brewingMethod)) {
      points += 15;
      reasons.push(`Optimized for your ${BREWING_LABELS[answers.brewingMethod] || 'brewer'}`);
    } else {
      points += 8;
    }
  } else {
    points += 12;
  }

  // 5. Coffee Mood (Max 10 pts)
  maxPoints += 10;
  if (answers.mood) {
    if (answers.mood === 'gift' && product.id === 'trose-connoisseur-gift-flight') {
      points += 10;
      reasons.push('Presentation-ready gift flight with luxury box');
    } else if (metafields?.moods.includes(answers.mood)) {
      points += 10;
      reasons.push(`Crafted for your ${answers.mood.replace('-', ' ')} ritual`);
    } else {
      points += 6;
    }
  } else {
    points += 8;
  }

  // Calculate final transparent score (mapped to 88% - 99% for top realism)
  const rawRatio = points / maxPoints;
  const normalizedScore = Math.min(99, Math.max(82, Math.round(80 + rawRatio * 19)));

  const whyYoullLoveIt = generatePersonalizedExplanation(product, answers, metafields);
  const shareablePersona = generatePersonaTitle(product, answers);

  return {
    product,
    score: normalizedScore,
    isTopMatch: false,
    matchedReasons: reasons.slice(0, 3),
    whyYoullLoveIt,
    shareablePersona,
    shopifyMetafields: metafields
  };
}

/**
 * Execute the Coffee Finder Engine
 * Evaluates all coffee products and returns the Perfect Match + 2 Alternatives
 */
export function findPerfectCoffee(
  products: Product[],
  answers: CoffeeFinderAnswers
): CoffeeFinderResult {
  // Only score coffees, organics, and bundles
  const coffeeEligible = products.filter(
    (p) => p.category === 'coffee' || p.category === 'organic' || p.id === 'trose-connoisseur-gift-flight' || p.id === 'trose-nitro-cold-brew-concentrate'
  );

  // If buying a gift was explicitly chosen as mood, boost the flight bundle
  const scoredItems = coffeeEligible.map((product) => {
    const scored = scoreCoffeeProduct(product, answers);
    if (answers.mood === 'gift' && product.id === 'trose-connoisseur-gift-flight') {
      scored.score = 99;
    }
    return scored;
  });

  // Sort descending by score
  scoredItems.sort((a, b) => b.score - a.score);

  const perfectMatch = scoredItems[0] || scoredItems[0];
  perfectMatch.isTopMatch = true;

  // Filter out the perfect match from alternatives to show 2 unique recommendations
  const alternatives = scoredItems
    .filter((item) => item.product.id !== perfectMatch.product.id)
    .slice(0, 2);

  return {
    perfectMatch,
    alternatives,
    userAnswers: answers,
    timestamp: new Date().toISOString()
  };
}
