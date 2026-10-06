import { Product, CustomerReview } from '../types';
import { classifyProduct } from '../services/productClassification';

const RAW_PRODUCTS: Omit<Product, 'department' | 'departmentLabel' | 'subcategory' | 'classificationReason' | 'isAmbiguous'>[] = [
  // --- SIGNATURE SPECIALTY COFFEE ---
  {
    id: 'trose-reserve-ethiopia-yirgacheffe',
    name: 'TROSE Grand Reserve Yirgacheffe',
    subtitle: 'Washed Heirloom • High-Altitude Micro-Lot',
    category: 'coffee',
    price: 24.50,
    originalPrice: 28.00,
    rating: 4.9,
    reviewsCount: 142,
    isOrganic: false,
    isBestSeller: true,
    isNew: false,
    roastLevel: 'Light',
    roastMeter: 1,
    country: 'Ethiopia',
    origin: 'Gedeo Zone, Yirgacheffe, Ethiopia',
    altitude: '1,950m – 2,200m MASL',
    process: 'Fully Washed & Raised Sun-Beds',
    tastingNotes: ['Bergamot Blossom', 'White Peach', 'Wild Honey', 'Jasmine'],
    description: 'Our crown jewel single-origin. Sourced from smallholder heirloom gardens in southern Ethiopia, this cup offers a silken tea-like body, crystalline floral aromatics, and a luminous stone-fruit finish.',
    details: [
      'Origin Cupping Score: 89.5',
      'Harvest Season: November – January',
      'Varietal: Indigenous Heirloom Cultivars',
      'Nitrogen-flushed valve packaging for peak freshness'
    ],
    formats: ['12 oz (340g)', '2 lb (908g)', '5 lb Roaster Bag'],
    brewingRecommendation: 'Pour-Over (V60 / Chemex): 1:16 brew ratio with 93°C (200°F) filtered water. Grind medium-fine. Total brew time: 3:00 to 3:30 minutes.',
    ingredients: 'Whole Bean Coffee. Single-origin Ethiopian heirloom. Zero additives or artificial flavorings.',
    shippingInfo: 'Sealed fresh in valved packaging. Complimentary priority climate-neutral dispatch on orders over $50.',
    images: [
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '12 oz (340g) / Whole Bean',
    availableGrinds: ['Whole Bean', 'Pour Over', 'Espresso', 'French Press', 'Cold Brew']
  },
  {
    id: 'trose-velvet-noir-espresso',
    name: 'Velvet Noir Signature Espresso',
    subtitle: 'Artisan Blend • Colombia Huila & Sumatra Mandheling',
    category: 'coffee',
    price: 22.00,
    rating: 5.0,
    reviewsCount: 238,
    isOrganic: false,
    isBestSeller: true,
    isNew: false,
    roastLevel: 'Espresso Roast',
    roastMeter: 5,
    country: 'Colombia',
    origin: 'Huila (Colombia) & Aceh (Sumatra)',
    altitude: '1,600m – 1,850m MASL',
    process: 'Honey Processed & Wet-Hulled',
    tastingNotes: ['Dark Cocoa', 'Toasted Hazelnut', 'Black Cherry', 'Cane Molasses'],
    description: 'Engineered specifically for prosumer lever and pump espresso extractions. Delivers a dense tiger-striped crema, viscous velvety mouthfeel, and rich dark chocolate sweetness that cuts effortlessly through steamed milk.',
    details: [
      'Optimized extraction ratio: 1:2 in 28-32 seconds',
      'Calibrated batch roast profile',
      'Velvety, syrupy body with low acidity',
      'Ideal for straight shots, lattes, and flat whites'
    ],
    formats: ['12 oz (340g)', '2 lb (908g)', '5 lb Barista Pack'],
    brewingRecommendation: '9-Bar Espresso: 18g dose in, 36g liquid espresso out in 28-30 seconds at 93.5°C (200.3°F). Also exquisite on Moka Pot and French Press.',
    ingredients: 'Artisan Roast Blend (Washed Colombia Huila & Wet-Hulled Sumatra Mandheling). No preservatives or additives.',
    shippingInfo: 'Degassed for 48 hours post-roast for immediate optimal espresso extraction upon arrival. Ships in nitrogen-sealed valved foil pouches.',
    images: [
      'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '12 oz (340g) / Whole Bean',
    availableGrinds: ['Whole Bean', 'Espresso', 'Pour Over', 'French Press', 'Standard Grind']
  },
  {
    id: 'trose-guatemala-antigua-estate',
    name: 'Antigua Volcanic Bourbon',
    subtitle: 'Estate Harvest • Shade Grown Single-Origin',
    category: 'coffee',
    price: 23.00,
    rating: 4.8,
    reviewsCount: 96,
    isOrganic: false,
    isBestSeller: false,
    isNew: true,
    roastLevel: 'Medium',
    roastMeter: 3,
    country: 'Guatemala',
    origin: 'Antigua Valley, Guatemala',
    altitude: '1,700m MASL (Volcanic Soil)',
    process: 'Traditional Washed & Patio Dried',
    tastingNotes: ['Milk Chocolate', 'Clementine', 'Spiced Cinnamon', 'Almond Praline'],
    description: 'Cultivated in rich volcanic pumice framed by three grand Guatemalan volcanoes. This harvest strikes a harmonious equilibrium between mild citrus brightness and decadent praline sweetness.',
    details: [
      'Single Estate: Finca San Sebastián',
      'Varietal: 100% Red Bourbon',
      'Fairly traded with direct farmer premiums',
      'Gentle balanced roast designed for all brewing styles'
    ],
    formats: ['12 oz (340g)', '2 lb (908g)', '5 lb Roaster Bag'],
    brewingRecommendation: 'Aeropress / Drip / French Press: 1:15 ratio with 92°C water. Produces a creamy cup with pronounced milk chocolate and cinnamon.',
    ingredients: '100% Single Estate Arabica (Red Bourbon varietal). Direct-trade sourced.',
    shippingInfo: 'Dispatched directly from roastery within 24 hours of roasting. 30-day palate satisfaction guarantee.',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '12 oz (340g) / Whole Bean',
    availableGrinds: ['Whole Bean', 'Pour Over', 'Espresso', 'French Press']
  },
  {
    id: 'trose-kenya-aa-nyeri-hill',
    name: 'Kenya AA Nyeri Hill Single-Origin',
    subtitle: 'Washed SL28 & SL34 • High Mount Kenya Slopes',
    category: 'coffee',
    price: 26.00,
    rating: 4.9,
    reviewsCount: 118,
    isOrganic: false,
    isBestSeller: true,
    isNew: true,
    roastLevel: 'Light',
    roastMeter: 1,
    country: 'Kenya',
    origin: 'Nyeri County, Mount Kenya Slopes, Africa',
    altitude: '1,800m – 2,100m MASL',
    process: 'Double Washed & African Sun Raised Beds',
    tastingNotes: ['Blackcurrant', 'Pink Grapefruit', 'Brown Sugar Cane', 'Hibiscus'],
    description: 'Prized by specialty connoisseurs worldwide. Grown in volcanic red soil on the southern slopes of Mount Kenya, this classic African lot produces an effervescent cup overflowing with blackcurrant vibrancy and sweet citrus.',
    details: [
      'Grade: AA Top Screen 18 Selection',
      'Varietals: SL28, SL34 & Ruiru 11',
      'African drying beds for even moisture reduction',
      'Ultra-complex acidity with clean cane sugar sweetness'
    ],
    formats: ['12 oz (340g)', '2 lb (908g)', '5 lb Roaster Sack'],
    brewingRecommendation: 'Pour-Over (Kalita Wave or V60): 1:16 ratio at 94°C. Brings forth sparkling blackcurrant and sweet floral honey.',
    ingredients: 'Single-Origin Kenyan Coffee Beans.',
    shippingInfo: 'Sealed in valved packaging. Ships with fresh roast seal.',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '12 oz (340g) / Whole Bean',
    availableGrinds: ['Whole Bean', 'Pour Over', 'Espresso', 'French Press']
  },

  // --- ORGANIC SPECIALTY COFFEE ---
  {
    id: 'trose-organic-honduras-marcala',
    name: 'TROSE Organic Marcala Reserve',
    subtitle: 'USDA Organic & Fair Trade Certified • Shade Canopy',
    category: 'organic',
    price: 25.00,
    originalPrice: 29.00,
    rating: 4.9,
    reviewsCount: 178,
    isOrganic: true,
    isBestSeller: true,
    isNew: false,
    roastLevel: 'Medium',
    roastMeter: 3,
    country: 'Honduras',
    origin: 'La Paz, Marcala, Honduras',
    altitude: '1,650m MASL',
    process: 'Washed Organic Micro-Lot',
    tastingNotes: ['Raw Turbinado Sugar', 'Crisp Red Apple', 'Toffee', 'Meyer Lemon'],
    description: 'Certified 100% USDA Organic and Fair Trade. Grown beneath native mountain tree canopies by an indigenous women-led agricultural cooperative in Marcala. Exceptionally clean, round, and comforting.',
    details: [
      '100% Certified USDA Organic & Non-GMO',
      'Fair Trade USA Certified',
      'Zero synthetic fertilizers or pesticides used',
      '10% of proceeds fund local clean water filtration projects'
    ],
    formats: ['12 oz (340g)', '2 lb (908g)', '5 lb Eco Sack'],
    brewingRecommendation: 'Chemex or Kalita Wave: 25g coffee to 400g water at 94°C. Highlight the crisp red apple sweetness and golden toffee finish.',
    ingredients: 'USDA Certified Organic Coffee (Catuai & Typica). Certified Organic Harvest.',
    shippingInfo: '100% biodegradable, home-compostable outer pouch packaging with degas valve. Dispatched in recycled cardboard mailers.',
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '12 oz (340g) / Whole Bean',
    availableGrinds: ['Whole Bean', 'Pour Over', 'Espresso', 'French Press', 'Cold Brew']
  },
  {
    id: 'trose-organic-peru-cajamarca',
    name: 'TROSE Organic Cajamarca Golden Peaberry',
    subtitle: 'Rare High-Elevation Peaberry • Rainforest Alliance',
    category: 'organic',
    price: 26.50,
    rating: 4.9,
    reviewsCount: 84,
    isOrganic: true,
    isBestSeller: false,
    isNew: true,
    roastLevel: 'Light',
    roastMeter: 2,
    country: 'Peru',
    origin: 'Cajamarca, Northern Andes, Peru',
    altitude: '1,800m – 2,050m MASL',
    process: 'Hand-Sorted Mountain Washed',
    tastingNotes: ['Salted Caramel', 'Ripe Fig', 'Roasted Macadamia', 'Bergamot'],
    description: 'Only 5% of each coffee cherry develops into a rare, rounded "Peaberry". Concentrating sweetness and vibrant floral notes, this organic Peruvian lot delivers an exquisitely balanced morning ritual.',
    details: [
      'Rainforest Alliance & Organic Certified',
      'Rare Hand-Sorted Peaberry Selection',
      'Ultra high-altitude Andean cultivation',
      'Silky body with sweet dried-fruit lingering finish'
    ],
    formats: ['12 oz (340g)', '2 lb (908g)'],
    brewingRecommendation: 'Filter Pour-Over: 15g coffee / 250g water. 92°C brew water temperature. 2:45 total extraction time.',
    ingredients: '100% USDA Organic & Rainforest Alliance Certified Andean Peaberry Arabica Coffee.',
    shippingInfo: 'Roasted on demand. Guaranteed fresh roast date stamped on base of bag.',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '12 oz (340g) / Whole Bean',
    availableGrinds: ['Whole Bean', 'Pour Over', 'French Press', 'Espresso']
  },
  {
    id: 'trose-organic-sumatra-gayo-dark',
    name: 'TROSE Organic Dark Mountain Gayo',
    subtitle: 'Deep Roast • Gayo Highlands Organic Lot',
    category: 'organic',
    price: 23.50,
    rating: 4.7,
    reviewsCount: 112,
    isOrganic: true,
    isBestSeller: false,
    isNew: false,
    roastLevel: 'Dark',
    roastMeter: 4,
    country: 'Indonesia',
    origin: 'Aceh Gayo, Northern Sumatra',
    altitude: '1,500m MASL',
    process: 'Traditional Organic Giling Basah',
    tastingNotes: ['Smoky Cedar', '72% Dark Cacao', 'Sweet Tobacco', 'Warm Nutmeg'],
    description: 'For lovers of hearty, low-acid, and full-bodied coffee. Certified organic shade grown beans wet-hulled by artisanal generational farmers in the volcanic Gayo highlands.',
    details: [
      'USDA Certified Organic & Fair Trade',
      'Low acidity, extremely heavy velvety body',
      'Roasted deep to caramelize essential oils without bitterness',
      'Incredible with French press or Moka pot'
    ],
    formats: ['12 oz (340g)', '2 lb (908g)', '5 lb Roaster Sack'],
    brewingRecommendation: 'French Press: 1:14 ratio with coarse grind, 4 minutes immersion steep. Plunge slowly.',
    ingredients: '100% USDA Certified Organic Wet-Hulled Indonesian Arabica Coffee.',
    shippingInfo: 'Free shipping on subscription orders. Priority tracking included.',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '12 oz (340g) / Whole Bean',
    availableGrinds: ['Whole Bean', 'French Press', 'Pour Over', 'Espresso', 'Standard Grind']
  },

  // --- MACHINES ---
  {
    id: 'trose-aurora-pro-espresso-machine',
    name: 'TROSE Aurora Dual-Boiler Pro Espresso Machine',
    subtitle: 'PID Thermal Stability • Rotary Pump • Satin Brass & Walnut',
    category: 'machines',
    price: 1850.00,
    originalPrice: 1999.00,
    rating: 5.0,
    reviewsCount: 47,
    isOrganic: false,
    isBestSeller: true,
    isNew: true,
    country: 'Italy',
    origin: 'Milan, Italy',
    description: 'The pinnacle of home espresso mastery. Featuring commercial-grade dual copper boilers, independent PID temperature micro-controllers, whisper-quiet rotary pump with plumb-in option, and handcrafted walnut handles.',
    details: [
      'Dual Stainless Boilers (0.8L Brew / 1.8L Steam)',
      'Dual PID Display with shot timer & pre-infusion profiling',
      'Solid 304 Stainless Steel Chassis with Satin Brass Accents',
      'Includes 58mm Bottomless Portafilter & Precision Baskets',
      '2-Year Full Artisan Warranty & White Glove Support'
    ],
    formats: ['Matte Noir & Walnut', 'Polished Steel & Brass'],
    brewingRecommendation: 'Set brew boiler to 93.5°C with 4-second pre-infusion for medium light roasts; steam wand provides dry 1.4 bar microfoam.',
    ingredients: 'Food-grade 304 Stainless Steel, Lead-Free Copper Boilers, Solid FSC Walnut Wood.',
    shippingInfo: 'Complimentary white-glove palletized freight shipment with signature delivery. 2-Year comprehensive machine warranty.',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '28.5 kg / Dual Boiler 110V-240V'
  },
  {
    id: 'trose-zenith-precision-burr-grinder',
    name: 'Zenith 64mm Flat Burr Precision Grinder',
    subtitle: 'Zero Retention • Stepless Micrometric Adjustment',
    category: 'machines',
    price: 495.00,
    rating: 4.9,
    reviewsCount: 89,
    isOrganic: false,
    isBestSeller: false,
    isNew: false,
    country: 'Germany',
    origin: 'Stuttgart, Germany',
    description: 'Engineered with titanium-coated 64mm flat burrs for unimodal particle size distribution. Transition effortlessly from Turkish powder and 9-bar espresso to coarse cold brew with near-zero grinds retention.',
    details: [
      'DLC Titanium Coated 64mm Flat Burrs',
      'Single-dose silicone bellows hopper (under 0.1g retention)',
      'Ultra-quiet DC brushless motor with auto-shutoff',
      'Matte obsidian finish with CNC milled aluminum dial'
    ],
    formats: ['Matte Obsidian', 'Satin Birch White'],
    brewingRecommendation: 'Use single-dosing technique: weigh whole beans, spritz with RDT water droplet, grind directly into portafilter.',
    ingredients: 'Hardened DLC Diamond-Like Carbon 64mm Burrs, CNC Billet Anodized Aluminum, Food Grade Silicone.',
    shippingInfo: 'Insured express shipping with calibration certificate included.',
    images: [
      'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '4.2 kg / Stepless 0-100 Micrometric'
  },

  // --- ACCESSORIES ---
  {
    id: 'trose-artisan-gooseneck-kettle',
    name: 'TROSE Precision Variable Gooseneck Kettle',
    subtitle: 'PID 1°F Accurate • Strix Core • Matte Charcoal & Gold',
    category: 'accessories',
    price: 135.00,
    originalPrice: 150.00,
    rating: 4.9,
    reviewsCount: 164,
    isOrganic: false,
    isBestSeller: true,
    isNew: false,
    country: 'USA',
    origin: 'Seattle, WA',
    description: 'Achieve flawless laminar water flow for manual pour overs. Features digital 1-degree temperature precision, 60-minute heat hold mode, and an ergonomically counterbalanced natural beechwood handle.',
    details: [
      'Capacity: 0.9 Liters (30 oz)',
      'Rapid 1200W Strix boiling element',
      'Built-in brew stopwatch on LCD base',
      'Food-grade 304 stainless steel interior'
    ],
    formats: ['0.9L Matte Charcoal & Gold', '0.9L Pure Chalk White'],
    brewingRecommendation: 'Set temperature to 93°C for washed light roasts, 90°C for dark honey processed lots. Maintain slow circular pour spirals.',
    ingredients: '304 High-Grade Stainless Steel Body, Solid Natural Beechwood, BPA-free silicone base pads.',
    shippingInfo: 'Ships in 1-2 business days with 3-year warranty.',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '0.9L / 1200W Rapid Boil'
  },
  // --- ACCESSORIES & MUGS/FLASKS ---
  {
    id: 'trose-ceramics-tasting-cup-duo',
    name: 'TROSE Stoneware Cupping Tumblers (Set of 2)',
    subtitle: 'Hand-Thrown Ceramic • Thermal Insulated Rim',
    category: 'mugs-flasks',
    price: 48.00,
    originalPrice: 55.00,
    rating: 4.8,
    reviewsCount: 73,
    isOrganic: false,
    isBestSeller: true,
    isNew: false,
    country: 'Japan',
    origin: 'Kyoto, Japan',
    description: 'Individually hand-thrown by master artisans using speckled stoneware clay. The curved aromatic chimney funnels subtle coffee volatiles directly to your nose for a heightened sensory tasting ritual.',
    details: [
      'Pair of two 240ml (8oz) tumblers',
      'Speckled natural iron stoneware with matte satin glaze',
      'Dishwasher and microwave safe',
      'Ergonomic unglazed tactile grip band'
    ],
    formats: ['Set of 2 Tumblers (240ml)', 'Set of 4 Tasting Set'],
    brewingRecommendation: 'Pre-warm tumbler with hot water before pouring freshly brewed filter coffee for optimal aroma preservation.',
    ingredients: 'Natural Mineral Clay, Iron-rich Speckled Feldspathic Glaze. Lead-free, Cadmium-free.',
    shippingInfo: 'Packed in molded foam and recyclable gift box with gold foil logo.',
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '2 x 8 oz (240ml) Tumblers'
  },
  {
    id: 'trose-thermal-travel-flask',
    name: 'TROSE Vacuum Insulated Nomad Flask',
    subtitle: 'Double-Wall Stainless • Ceramic Coated Interior',
    category: 'mugs-flasks',
    price: 38.00,
    rating: 4.9,
    reviewsCount: 92,
    isOrganic: false,
    isBestSeller: true,
    isNew: true,
    country: 'USA',
    origin: 'Designed in Portland, OR',
    description: 'Engineered for the discerning roaster on the move. Features True Taste ceramic lining to prevent metallic flavor transfer, leak-proof 360 sip lid, and 12-hour thermal retention.',
    details: [
      '16 oz (473ml) Capacity',
      'German engineered ceramic interior layer',
      'Keeps hot for 12 hours / cold for 24 hours',
      'Fits standard automotive and bike cup holders'
    ],
    formats: ['16 oz (473ml)', '20 oz (590ml)'],
    brewingRecommendation: 'Fill directly from your pour-over cone or espresso extraction.',
    ingredients: '18/8 Pro-Grade Stainless Steel, TrueTaste Ceramic Interior Coating, BPA-free Tritan Lid.',
    shippingInfo: 'Ships within 24 hours. Lifetime manufacturer build warranty.',
    images: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '16 oz (473ml) / 18/8 Steel'
  },
  {
    id: 'trose-artisan-matte-ceramic-mug',
    name: 'TROSE Artisan Studio Ceramic Mug',
    subtitle: 'Wheel-Thrown Stoneware • Matte Charcoal & Raw Sand',
    category: 'mugs-flasks',
    price: 34.00,
    rating: 4.9,
    reviewsCount: 81,
    isOrganic: false,
    isBestSeller: true,
    isNew: false,
    country: 'Denmark',
    origin: 'Copenhagen Studio & Portland Workshop',
    description: 'A minimalist Nordic daily coffee vessel designed with an ergonomic cantilever thumb-rest handle. Glazed in velvety matte charcoal with an exposed raw sand textured baseline.',
    details: [
      '12 oz (355ml) Comfortable Capacity',
      'Handcrafted high-fire stoneware clay',
      'Microwave & dishwasher safe lead-free ceramic',
      'Thick thermal heat-retaining walls'
    ],
    formats: ['Matte Charcoal (12oz)', 'Sand Drift Beige (12oz)'],
    brewingRecommendation: 'Perfect vessel for morning pour-overs, flat whites, and slow sips.',
    ingredients: 'Natural Stoneware Clay, Matte Feldspar Mineral Glaze.',
    shippingInfo: 'Packaged in custom gift carton with eco-friendly molded pulp cushion.',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '12 oz (355ml) / Studio Ceramic'
  },

  // --- BEVERAGES ---
  {
    id: 'trose-botanical-cascara-elixir',
    name: 'Single-Estate Cascara & Botanical Elixir',
    subtitle: 'Organic Coffee Cherry Tea • Hibiscus & Wild Rose',
    category: 'beverages',
    price: 18.00,
    originalPrice: 22.00,
    rating: 4.8,
    reviewsCount: 56,
    isOrganic: true,
    isBestSeller: true,
    isNew: true,
    country: 'Honduras',
    origin: 'Marcala, Honduras & Oregon Rose Gardens',
    description: 'Crafted from the sun-dried fruit husks of our organic Geisha coffee cherries. Infused with wild mountain rose and whole hibiscus flowers, delivering refreshing notes of honey, dried apricot, and pomegranate.',
    details: [
      '100% Upcycled Organic Coffee Cherry Cascara',
      'Naturally antioxidant-rich with gentle caffeine',
      'Brew hot or cold-steep over 12 hours',
      'USDA Organic & Regenerative Certified'
    ],
    formats: ['8.8 oz (250g) Loose Tin', '1 kg Bulk Botanical Pack'],
    brewingRecommendation: 'Hot: Steep 15g in 350ml boiling water for 4-5 minutes. Cold brew: 30g steeped in 1L cold filtered water for 12 hours in refrigerator.',
    ingredients: 'Sun-dried Organic Coffee Cherry Cascara (Coffea Arabica), Organic Whole Hibiscus Petals, Wild Dried Rose Petals.',
    shippingInfo: 'Sealed in airtight UV-resistant gold craft tin.',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '8.8 oz (250g) Loose Botanicals'
  },
  {
    id: 'trose-nitro-cold-brew-concentrate',
    name: 'TROSE Reserve Nitro Cold Brew Concentrate',
    subtitle: 'Slow Cold-Drip • 16-Hour Immersion Extract',
    category: 'beverages',
    price: 24.00,
    rating: 4.9,
    reviewsCount: 104,
    isOrganic: false,
    isBestSeller: false,
    isNew: false,
    country: 'USA',
    origin: 'Brewed & Bottled at TROSE Roastery (Seattle, WA)',
    description: 'A 1:4 super-concentrate brewed from our signature Velvet Noir blend. Silky smooth, ultra-low acidity, with rich dark chocolate, toasted hazelnut, and molten caramel notes.',
    details: [
      'Makes 12-16 glasses of iced coffee or espresso tonics',
      'Nitrogen-sealed in amber glass bottle',
      'Zero sugar, preservatives, or artificial flavorings',
      'Refrigerate after opening (keeps 60 days)'
    ],
    formats: ['32 fl oz (946ml) Amber Glass', '2 x 32 fl oz Duo Pack'],
    brewingRecommendation: 'Mix 1 part concentrate with 3 parts cold water, sparkling tonic, or whole oat milk over large ice cubes.',
    ingredients: 'Triple-filtered reverse osmosis water, 100% Specialty Arabica Coffee Extract, Nitrogen charged.',
    shippingInfo: 'Shipped in insulated protective honeycomb glass packaging.',
    images: [
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '32 fl oz (946ml) Amber Glass'
  },

  // --- SNACKS ---
  {
    id: 'trose-single-estate-dark-chocolate',
    name: 'Artisan 74% Chuncho Cacao Pairing Chocolate',
    subtitle: 'Bean-to-Bar • Single-Origin Peruvian Cacao',
    category: 'snacks',
    price: 12.00,
    originalPrice: 15.00,
    rating: 4.9,
    reviewsCount: 68,
    isOrganic: true,
    isBestSeller: true,
    isNew: false,
    country: 'Peru',
    origin: 'Urubamba Valley, Cusco, Peru',
    description: 'Crafted specifically to pair with our high-altitude single-origin coffees. Sourced from ancient Chuncho native cacao trees in Urubamba Valley with notes of roasted macadamia, dried plum, and wild honey.',
    details: [
      '74% Micro-Lot Native Chuncho Cacao',
      'USDA Certified Organic Harvest',
      'Formulated with organic cane sugar and single-estate cacao butter',
      'Net Wt: 2.8 oz (80g) Bar'
    ],
    formats: ['Single Bar (80g)', '3-Bar Tasting Pack'],
    brewingRecommendation: 'Allow a square to slowly melt on your tongue immediately before taking a sip of hot single-origin pour-over.',
    ingredients: 'Organic Peruvian Chuncho Cacao Beans, Organic Raw Cane Sugar, Single-Estate Cacao Butter. Vegan, Gluten-Free.',
    shippingInfo: 'Shipped with cold packs during warm summer months.',
    images: [
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '2.8 oz (80g) Tasting Bar'
  },
  {
    id: 'trose-almond-espresso-biscotti',
    name: 'Handmade Tuscan Almond & Espresso Cantucci',
    subtitle: 'Twice-Baked • Dipped in Dark Cocoa Glaze',
    category: 'snacks',
    price: 14.50,
    rating: 4.7,
    reviewsCount: 42,
    isOrganic: false,
    isBestSeller: false,
    isNew: true,
    country: 'Italy',
    origin: 'Florence, Tuscany, Italy',
    description: 'Traditional Italian cantucci enriched with whole roasted Sicilian almonds and crushed TROSE espresso beans. Crisp, golden, and crafted for dipping into fresh espresso or pour-overs.',
    details: [
      'Authentic Florentine recipe with real butter & cage-free eggs',
      'Includes 12 individually packed artisan biscotti',
      'Sealed in moisture-proof craft tin box',
      'Non-GMO verified ingredients'
    ],
    formats: ['Artisan Tin (250g / 12pc)', 'Gift Box (500g / 24pc)'],
    brewingRecommendation: 'Submerge 1/3 of the cantucci into a double shot of hot Velvet Noir espresso for 3 seconds before biting.',
    ingredients: 'Unbleached Wheat Flour, Sicilian Almonds (25%), Cane Sugar, Fresh Butter, Free-Range Eggs, Ground TROSE Espresso, Sea Salt.',
    shippingInfo: 'Sealed in nitrogen-flushed metal tin.',
    images: [
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '8.8 oz (250g) Artisan Tin'
  },

  // --- COFFEE TABLES ---
  {
    id: 'trose-atelier-walnut-travertine-table',
    name: 'TROSE Atelier Walnut & Travertine Coffee Table',
    subtitle: 'Solid American Walnut • Roman Travertine Centerpiece',
    category: 'tables',
    price: 680.00,
    originalPrice: 750.00,
    rating: 4.9,
    reviewsCount: 29,
    isOrganic: false,
    isBestSeller: true,
    isNew: true,
    country: 'Italy',
    origin: 'Handcrafted in Brescia, Italy & Oregon, USA',
    description: 'An architectural centerpiece engineered for the modern morning coffee salon. Features FSC-certified solid black walnut joinery holding a honed un-filled natural Roman travertine stone slab.',
    details: [
      'Dimensions: 110cm (L) x 65cm (W) x 38cm (H)',
      'Solid American Black Walnut with organic oil finish',
      'Natural Italian Travertine Stone with beveled edges',
      'Flat-packed with solid brass hardware included',
      'White glove delivery available worldwide'
    ],
    formats: ['Standard 110cm', 'Extended Salon 130cm'],
    brewingRecommendation: 'Place your manual pour-over stand, cupping tumblers, and design periodicals at the center.',
    ingredients: 'FSC-Certified Solid American Black Walnut, Honed Unfilled Italian Travertine, Solid Brass Assembly Screws.',
    shippingInfo: 'White-Glove freight shipping with in-room assembly and packaging removal included.',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: false, // SOLD OUT DEMONSTRATION
    weightOrSpecs: '34 kg / Solid Walnut & Travertine'
  },
  {
    id: 'trose-monolith-marble-pedestal-table',
    name: 'TROSE Monolith Honed Calacatta Side Table',
    subtitle: 'Sculpted Fluted Column • Matte Honed Finish',
    category: 'tables',
    price: 490.00,
    rating: 4.8,
    reviewsCount: 18,
    isOrganic: false,
    isBestSeller: false,
    isNew: false,
    country: 'Italy',
    origin: 'Carrara, Italy',
    description: 'Sculpted from solid blocks of Italian Calacatta marble with delicate grey and gold veining. The fluted pedestal base creates an ethereal podium for your pour-over stand and favorite art books.',
    details: [
      'Dimensions: 45cm (Dia) x 52cm (H)',
      'Genuine natural Calacatta marble slab',
      'Sealed with matte anti-stain oleophobic coating',
      'Weight: 22 kg solid core'
    ],
    formats: ['Honed Calacatta Gold (45cm)', 'Nero Marquina Black (45cm)'],
    brewingRecommendation: 'Position beside your reading lounge chair for single-cup pour overs.',
    ingredients: 'Solid Natural Italian Calacatta Marble with matte anti-stain sealant.',
    shippingInfo: 'Custom wooden crate freight delivery with lift-gate service.',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '22 kg / Solid Italian Marble'
  },

  // --- ACCESSORIES ---
  {
    id: 'trose-precision-scale-timer',
    name: 'TROSE Lumina 0.1g Precision Smart Scale',
    subtitle: 'Auto-Tare • Flow Rate Tracker • Water Resistant',
    category: 'accessories',
    price: 78.00,
    rating: 4.9,
    reviewsCount: 119,
    isOrganic: false,
    isBestSeller: false,
    isNew: false,
    country: 'USA',
    origin: 'San Francisco, CA',
    description: 'Compact, lightning-fast 0.1-gram accuracy scale with built-in auto-timer and real-time flow rate indicator for both pour-over drippers and espresso drip trays.',
    details: [
      '0.1g sensitivity up to 2000g',
      'Rechargeable USB-C lithium battery (40+ hours)',
      'Hidden LED matrix display with silicone heat pad',
      'Auto-start timer detection on first liquid drop'
    ],
    formats: ['Compact 105mm (Square)', 'Pro 140mm (Barista Dual)'],
    brewingRecommendation: 'Use the Flow Rate mode to calibrate your kettle pour speed at an ideal 4.0 - 5.5 grams per second.',
    ingredients: 'Matte ABS Polycarbonate, Frosted Tempered Glass, Heat-Resistant Food Grade Silicone Pad.',
    shippingInfo: 'Includes USB-C braided charging cable and silicone drip pad.',
    images: [
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: 'Compact 105 x 105 x 15mm'
  },

  // --- BUNDLES ---
  {
    id: 'trose-connoisseur-gift-flight',
    name: 'The TROSE Roaster’s Reserve Flight (Trio)',
    subtitle: '3 x 6oz Bags • Single-Origin, Organic & Espresso',
    category: 'bundles',
    price: 49.00,
    originalPrice: 58.00,
    rating: 5.0,
    reviewsCount: 205,
    isOrganic: true,
    isBestSeller: true,
    isNew: true,
    country: 'Ethiopia',
    origin: 'Ethiopia, Honduras & Colombia Tri-Origin',
    description: 'The ultimate exploration of the TROSE coffee universe. Includes our Grand Reserve Yirgacheffe, USDA Organic Marcala, and Velvet Noir Espresso presented in a gold-embossed bespoke gift box.',
    details: [
      'Includes 3 x 6oz (170g) freshly roasted whole bean selections',
      'Full sensory cupping notes & brewing recipe cards included',
      'Gold foil luxury keepsake presentation box',
      'Custom gift message available at checkout'
    ],
    formats: ['3 x 6 oz Gift Trio', '3 x 12 oz Grand Flight'],
    brewingRecommendation: 'Follow the 3 included cupping cards to taste side-by-side: floral African notes vs. Honduran toffee vs. velvety espresso crema.',
    ingredients: 'Curated Whole Bean Coffees. Single-origin micro-lots and artisan espresso blend.',
    shippingInfo: 'Packed in gift-ready gold embossed rigid box with satin ribbon.',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1000&q=85'
    ],
    inStock: true,
    weightOrSpecs: '3 x 6 oz (510g Total)',
    availableGrinds: ['Whole Bean', 'Pour Over', 'Espresso', 'French Press']
  }
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => {
  const cl = classifyProduct({
    id: p.id,
    title: p.name,
    productType: p.category,
    description: p.description,
  });
  return {
    ...p,
    department: cl.department,
    departmentLabel: cl.departmentLabel,
    subcategory: cl.subcategory,
    classificationReason: cl.reason,
    isAmbiguous: cl.isAmbiguous,
  };
});

export const REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Julian Sterling',
    location: 'Zurich, Switzerland',
    rating: 5,
    date: 'August 14, 2026',
    title: 'The Yirgacheffe is transcendental.',
    comment: 'I have been ordering specialty beans from roasters across Milan and Tokyo for a decade. TROSE’s Grand Reserve Yirgacheffe delivers the cleanest bergamot and jasmine notes I have ever extracted on my manual lever machine.',
    verified: true,
    productName: 'TROSE Grand Reserve Yirgacheffe'
  },
  {
    id: 'rev-2',
    author: 'Dr. Evelyn Chen',
    location: 'San Francisco, CA',
    rating: 5,
    date: 'August 08, 2026',
    title: 'Pure, organic, and unmatched sweetness.',
    comment: 'Knowing that the Marcala Reserve is 100% organic without any chemical compromise makes every morning brew serene. The caramel toffee finish with a dash of oat milk is heavenly.',
    verified: true,
    productName: 'TROSE Organic Marcala Reserve'
  },
  {
    id: 'rev-3',
    author: 'Marcus Vance',
    location: 'London, UK',
    rating: 5,
    date: 'July 29, 2026',
    title: 'Aurora Espresso Machine exceeded all expectations.',
    comment: 'The craftsmanship of the walnut handles and brass dials paired with instant dual PID heat stability makes commercial-grade espresso at home effortless. Best investment of the year.',
    verified: true,
    productName: 'TROSE Aurora Dual-Boiler Pro'
  }
];
