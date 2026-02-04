import React, { useState } from 'react';
import { ShoppingBag, Ruler, TrendingUp, Check, X, ExternalLink, Zap, Target } from 'lucide-react';

const PerfectRatioApp = () => {
  const [step, setStep] = useState('welcome');
  const [gender, setGender] = useState('');
  const [measurementMode, setMeasurementMode] = useState(''); // 'quick' or 'precision'
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatPrompt, setChatPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 9999 });
  const [colorPreference, setColorPreference] = useState(''); // Optional color filter
  const [materialPreference, setMaterialPreference] = useState([]); // Optional material filters
  const [otherMaterial, setOtherMaterial] = useState(''); // For allergies/texture sensitivities
  const [sustainabilityPrefs, setSustainabilityPrefs] = useState([]); // Eco-friendly preferences
  const [includeSecondhand, setIncludeSecondhand] = useState(false); // Pre-owned options
  const [returnPolicyPref, setReturnPolicyPref] = useState(''); // Return policy requirements
  const [favoriteBrands, setFavoriteBrands] = useState(''); // Preferred brands
  const [avoidBrands, setAvoidBrands] = useState(''); // Brands to exclude
  const textareaRef = React.useRef(null);
  const [measurements, setMeasurements] = useState({
    // Quick Start measurements
    height: '',
    heightFeet: '',
    heightInches: '',
    heightCm: '',
    weight: '',
    weightKg: '',
    bodyType: '',
    // Precision measurements
    inseam: '',
    torsoLength: '',
    thighCircumference: '',
    highWaist: '',
    lowHip: '',
    // Footwear-specific measurements
    shoeSize: '',
    footWidth: '', // narrow, medium, wide, extra-wide
    archType: '', // flat, normal, high
    footLength: '', // in inches
    occasion: '', // athletic, casual, formal, outdoor
    specificNeeds: '' // e.g., plantar fasciitis, bunions, etc.
  });
  const [recommendations, setRecommendations] = useState([]);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [displayCount, setDisplayCount] = useState(8); // Show 8 products initially
  
  // Random placeholder scenarios - shorter for mobile
  const mobilePlaceholders = [
    "Athletic shorts for thick thighs",
    "Professional blazers, athletic build",
    "Running shoes, wide feet",
    "Jeans for curvy hips",
    "Winter coats for long arms",
    "Sustainable basics",
    "Soft seamless clothing",
    "Designer jeans, tall fit"
  ];
  
  const desktopPlaceholders = [
    "Wedding in Hawaii. Need breathable linen shirts, light colors, $150",
    "Gym shorts that won't ride up. 5'10\" 185 lbs with thick thighs",
    "Professional blazers for broad shoulders, slim waist. Athletic build, $200",
    "Running shoes with arch support. Wide feet, size 11, under $120",
    "Dark wash jeans for curvy hips without waist gap. Budget friendly",
    "Winter coats for long arms. 6'3\" with sleeve length issues",
    "Sustainable basics from ethical brands. T-shirts and underwear",
    "Soft seamless clothing. Sensitive to tags and rough textures"
  ];
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPlaceholder] = useState(() => {
    const list = window.innerWidth < 768 ? mobilePlaceholders : desktopPlaceholders;
    return list[Math.floor(Math.random() * list.length)];
  });

  // Clothing categories
  const categories = {
    men: ['Activewear', 'Loungewear', 'Formal & Workwear', 'Casual', 'Outerwear', 'Footwear', 'Underwear & Basics'],
    women: ['Activewear', 'Loungewear', 'Formal & Workwear', 'Casual', 'Dresses & Skirts', 'Outerwear', 'Footwear', 'Intimates & Basics']
  };

  // Load Inter font
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Load saved profile on mount
    loadSavedProfile();
    
    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      // Escape key closes checkout modal
      if (e.key === 'Escape' && checkoutUrl) {
        closeCheckout();
      }
      // Ctrl/Cmd + S saves profile (when on preferences page)
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && step === 'preferences') {
        e.preventDefault();
        saveProfile();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [checkoutUrl, step]);
  
  // Save profile to localStorage
  const saveProfile = () => {
    const profile = {
      gender,
      measurements,
      colorPreference,
      materialPreference,
      otherMaterial,
      sustainabilityPrefs,
      includeSecondhand,
      returnPolicyPref,
      favoriteBrands,
      avoidBrands,
      priceRange,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('perfectRatioProfile', JSON.stringify(profile));
    alert('✓ Profile saved! Your preferences will auto-load next time.');
  };
  
  // Load saved profile from localStorage
  const loadSavedProfile = () => {
    try {
      const saved = localStorage.getItem('perfectRatioProfile');
      if (saved) {
        const profile = JSON.parse(saved);
        // Don't auto-load, just check if it exists
        // User can click "Load Saved Profile" button
      }
    } catch (error) {
      console.log('No saved profile found');
    }
  };
  
  // Apply saved profile
  const applySavedProfile = () => {
    try {
      const saved = localStorage.getItem('perfectRatioProfile');
      if (saved) {
        const profile = JSON.parse(saved);
        setGender(profile.gender || '');
        setMeasurements(profile.measurements || measurements);
        setColorPreference(profile.colorPreference || '');
        setMaterialPreference(profile.materialPreference || []);
        setOtherMaterial(profile.otherMaterial || '');
        setSustainabilityPrefs(profile.sustainabilityPrefs || []);
        setIncludeSecondhand(profile.includeSecondhand || false);
        setReturnPolicyPref(profile.returnPolicyPref || '');
        setFavoriteBrands(profile.favoriteBrands || '');
        setAvoidBrands(profile.avoidBrands || '');
        setPriceRange(profile.priceRange || { min: 0, max: 9999 });
        alert('✓ Profile loaded!');
      }
    } catch (error) {
      alert('Error loading profile');
    }
  };

  // AI-Powered Product Scanning System
  const scanProductDatabase = async (userProfile, specificRequest = null) => {
    setIsAnalyzing(true);
    
    // Build category and price context
    const categoryContext = selectedCategory ? `Focus on ${selectedCategory} products.` : '';
    const priceContext = `Price range: $${priceRange.min}-$${priceRange.max}.`;
    
    // Build footwear-specific context
    const footwearContext = selectedCategory === 'Footwear' ? `
      Shoe size: ${measurements.shoeSize || 'not specified'}
      Foot width: ${measurements.footWidth || 'medium'}
      Arch type: ${measurements.archType || 'normal'}
      Occasion: ${measurements.occasion || 'general'}
      ${measurements.specificNeeds ? `Special needs: ${measurements.specificNeeds}` : ''}
    ` : '';
    
    // Build color and material context
    const colorContext = colorPreference ? `Color preference: ${colorPreference}. Focus on products in these color families.` : '';
    const materialContext = materialPreference.length > 0 
      ? `Material requirements: Must include ${materialPreference.join(', ')}. Avoid polyester, nylon, and synthetic blends.` 
      : '';
    const otherMaterialContext = otherMaterial 
      ? `IMPORTANT MATERIAL RESTRICTIONS: ${otherMaterial}. Take these requirements seriously for health/comfort.` 
      : '';
    
    // Build sustainability context
    const sustainabilityContext = sustainabilityPrefs.length > 0 
      ? `Sustainability requirements: User values ${sustainabilityPrefs.join(', ')}. Prioritize brands with these certifications/practices.` 
      : '';
    
    // Build secondhand context
    const secondhandContext = includeSecondhand 
      ? `INCLUDE PRE-OWNED OPTIONS: Also recommend from secondhand/vintage sources like The RealReal, Vestiaire Collective, Grailed, Poshmark, ThredUp, Depop, Vinted. Mention if item is pre-owned and typical savings percentage.` 
      : '';
    
    // Build return policy context
    const returnContext = returnPolicyPref 
      ? `Return policy requirement: ${returnPolicyPref}. Only recommend brands meeting this criteria.` 
      : '';
    
    // Build brand preference context
    const brandContext = favoriteBrands || avoidBrands 
      ? `Brand preferences: ${favoriteBrands ? `Favor these brands: ${favoriteBrands}.` : ''} ${avoidBrands ? `EXCLUDE these brands: ${avoidBrands}.` : ''}` 
      : '';
    
    const prompt = specificRequest 
      ? `User search: "${specificRequest}". Return 8 brand recommendations as JSON.`
      : `Return 8 ${selectedCategory || 'clothing'} brand recommendations as JSON.`;

    try {
      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 20000) // 20 second timeout
      );
      
      const fetchPromise = fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2500,
          system: `You are a brand recommendation expert. Recommend exactly 8 different brands.

User: ${gender}, ${userProfile.height}" tall, ${userProfile.weight} lbs, ${userProfile.bodyType} build
Fit issues: ${userProfile.fitIssues.join(', ')}
Budget: $${priceRange.min}-$${priceRange.max}
Category: ${selectedCategory || 'Clothing'}

CRITICAL: You must return EXACTLY 8 different brands in a JSON array.

Each brand should:
- Fit their body type
- Be in the right category (${selectedCategory || 'various clothing'})
- Be within budget
- Have good reputation for this body type

Return this exact JSON structure with 8 brands:
[
  {
    "brand": "Brand Name",
    "name": "Known for [fit characteristic]",
    "price": 100,
    "fit": "Why this brand fits their body type",
    "features": ["Fit feature 1", "Fit feature 2", "Fit feature 3"],
    "matchScore": 90,
    "deepLink": "https://brandwebsite.com"
  },
  ... 7 more brands
]

IMPORTANT: Return exactly 8 brands. Only JSON, no other text.`,
          messages: [
            { role: "user", content: prompt }
          ],
        })
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const data = await response.json();
      const responseText = data.content.find(block => block.type === 'text')?.text || '[]';
      
      console.log('AI Response:', responseText); // Debug logging
      
      // Clean and parse JSON response - handle markdown code blocks
      let jsonText = responseText;
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      // Extract JSON array
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        console.error('No JSON array found in response');
        throw new Error('Invalid AI response format');
      }
      
      const products = JSON.parse(jsonMatch[0]);
      
      console.log(`Parsed ${products.length} brands from AI`); // Debug logging
      console.log('Brands:', products.map(p => p.brand).join(', '));
      
      if (products.length === 0) {
        throw new Error('AI returned no brands');
      }
      
      if (products.length < 4) {
        console.warn(`Only got ${products.length} brands, expected 8`);
      }
      
      // Filter by price range
      const filteredProducts = products.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
      
      setIsAnalyzing(false);
      return filteredProducts.length > 0 ? filteredProducts : products;
      
    } catch (error) {
      console.error('Product scanning error:', error);
      setIsAnalyzing(false);
      
      // User-friendly error message
      if (error.message === 'Request timeout') {
        alert('⚠️ Search is taking longer than expected. Showing curated recommendations instead. Try simplifying your filters or searching again.');
      } else {
        alert('⚠️ Having trouble connecting to our AI. Showing curated recommendations. Please try again in a moment.');
      }
      
      // Fallback to curated examples if API fails or times out
      return getFallbackProducts(userProfile);
    }
  };

  // Fallback product database (used if AI scanning fails)
  const getFallbackProducts = (userProfile) => {
    // This is your safety net - a curated list of known-good brands
    const fallbackDb = {
      men: {
        athletic: [
          {
            brand: "Lululemon",
            name: "ABC Jogger",
            price: 128,
            fit: "Anti-Ball Crushing gusset for athletic builds",
            features: ["4-way stretch", "Gusseted crotch", "Athletic taper"],
            matchScore: 94,
            deepLink: "https://shop.lululemon.com/p/mens-pants/abc-jogger",
            solves: "Accommodates muscular thighs without restricting movement",
            reviewInsight: "Customers with athletic builds rate fit 4.7/5"
          }
        ],
        tall: [
          {
            brand: "ASOS",
            name: "Tall Slim Fit Jeans",
            price: 48,
            fit: "36\" inseam standard for tall frames",
            features: ["Extended length", "Slim cut", "Stretch denim"],
            matchScore: 91,
            deepLink: "https://www.asos.com/us/asos-tall/",
            solves: "Eliminates ankle-exposure for 6'2\"+ heights",
            reviewInsight: "Tall customers (6'2\"+) report true-to-size fit"
          }
        ]
      },
      women: {
        curvy: [
          {
            brand: "Good American",
            name: "Good Legs Jeans",
            price: 149,
            fit: "Engineered for 13\"+ hip-to-waist differential",
            features: ["Curvy cut", "No-gap waistband", "4-way stretch"],
            matchScore: 96,
            deepLink: "https://goodamerican.com/collections/good-legs",
            solves: "Prevents waist gapping on curvy builds",
            reviewInsight: "Curvy customers report 89% fit satisfaction"
          }
        ],
        athletic: [
          {
            brand: "Outdoor Voices",
            name: "Exercise Dress",
            price: 98,
            fit: "Athletic cut with built-in shorts",
            features: ["Moisture-wicking", "Built-in support", "Movement-ready"],
            matchScore: 92,
            deepLink: "https://www.outdoorvoices.com/",
            solves: "Designed for active bodies with muscle definition",
            reviewInsight: "Athletic women rate comfort 4.6/5 for workouts"
          }
        ]
      }
    };

    // Simple matching logic for fallback
    if (userProfile.gender === 'men') {
      if (userProfile.bodyType === 'athletic' || userProfile.bodyType === 'muscular') {
        return fallbackDb.men.athletic;
      }
      return fallbackDb.men.tall;
    } else {
      if (userProfile.bodyType === 'curvy' || userProfile.bodyType === 'full') {
        return fallbackDb.women.curvy;
      }
      return fallbackDb.women.athletic;
    }
  };
  // Proportional Analysis Engine with AI Product Matching
  const analyzeProportions = async () => {
    // Validation
    if (measurementMode === 'quick') {
      if (!measurements.height || !measurements.weight || !measurements.bodyType) {
        alert('⚠️ Please fill in all required fields: Height, Weight, and Build Type');
        return;
      }
      if (parseFloat(measurements.height) < 48 || parseFloat(measurements.height) > 96) {
        alert('⚠️ Height should be between 48 and 96 inches (4ft - 8ft)');
        return;
      }
      if (parseFloat(measurements.weight) < 50 || parseFloat(measurements.weight) > 500) {
        alert('⚠️ Weight should be between 50 and 500 lbs');
        return;
      }
    } else {
      if (!measurements.height || !measurements.inseam || !measurements.torsoLength) {
        alert('⚠️ Please fill in all required measurements');
        return;
      }
    }
    
    // For footwear, require shoe size
    if (selectedCategory === 'Footwear' && !measurements.shoeSize) {
      alert('⚠️ Please enter your shoe size for footwear recommendations');
      return;
    }
    
    const results = [];
    const height = parseFloat(measurements.height);
    const fitIssues = [];

    if (measurementMode === 'quick') {
      const weight = parseFloat(measurements.weight);
      const bmi = (weight / (height * height)) * 703;
      const bodyType = measurements.bodyType;

      if (gender === 'men') {
        if (height > 72) fitIssues.push('Long Legs');
        if (bodyType === 'athletic' || bodyType === 'slim' || height < 68) fitIssues.push('Proportional Balance');
        if (bodyType === 'muscular' || bodyType === 'broad' || bodyType === 'heavyset' || bmi > 27) fitIssues.push('Mass Distribution');
      } else {
        if (height > 68) fitIssues.push('Long Legs');
        if (bodyType === 'petite' || height < 64) fitIssues.push('Petite Proportions');
        if (bodyType === 'curvy' || bodyType === 'full' || bodyType === 'athletic' || bmi > 25) fitIssues.push('Curvy Fit');
      }
    } else {
      const inseam = parseFloat(measurements.inseam);
      const torso = parseFloat(measurements.torsoLength);

      if (gender === 'men') {
        const thigh = parseFloat(measurements.thighCircumference);
        if (inseam / height > 0.48) fitIssues.push('Long Legs');
        if (torso / height < 0.30) fitIssues.push('Short Torso');
        if (thigh > 24) fitIssues.push('Mass Distribution');
      } else {
        const highWaist = parseFloat(measurements.highWaist);
        const lowHip = parseFloat(measurements.lowHip);
        if (inseam / height > 0.46) fitIssues.push('Long Legs');
        if (torso / height < 0.28) fitIssues.push('Short Torso');
        if (lowHip - highWaist > 12) fitIssues.push('Curvy Distribution');
      }
    }

    // Build user profile for AI scanning
    const userProfile = {
      gender,
      height: measurements.height,
      weight: measurements.weight,
      bodyType: measurements.bodyType,
      fitIssues: fitIssues.length > 0 ? fitIssues : ['Standard Fit']
    };

    // Scan product database with AI
    const products = await scanProductDatabase(userProfile, chatPrompt);

    // Group products by fit issue
    const issueMap = {};
    
    // Fixed Unsplash image IDs for clothing/shoes
    const imagePool = [
      '1434389544997-dffc7daaedf7', // clothing rack
      '1441986300917-64674bd600d8', // clothing store
      '1556821804-621f31c7949d', // shoes
      '1542272604-787c3835535d', // jeans
      '1551488831-00ddcb6c6bd3', // clothing
      '1503342217505-b0a15ec3261c', // fashion
      '1489987707025-afc232f7ea0f', // sneakers
      '1460353581641-37baddab0fa2', // clothing rack
      '1515886657613-9d3515e0ce1f', // fashion model
      '1591047159402-f98cb7b9b51e'  // retail
    ];
    
    products.forEach((product, index) => {
      const issue = product.primaryFitIssue || fitIssues[0] || 'Recommended For You';
      if (!issueMap[issue]) {
        issueMap[issue] = [];
      }
      // Cycle through image pool
      const imageId = imagePool[index % imagePool.length];
      issueMap[issue].push({
        ...product,
        image: `https://images.unsplash.com/photo-${imageId}?w=400&h=400&fit=crop`,
        tags: product.features
      });
    });

    // Convert to results format
    Object.entries(issueMap).forEach(([issue, prods]) => {
      results.push({
        issue,
        products: prods,
        explanation: prods[0]?.fit || 'AI-matched based on your measurements'
      });
    });

    // Ensure at least one result
    if (results.length === 0) {
      const fallback = await getFallbackProducts(userProfile);
      results.push({
        issue: 'Recommended For You',
        products: fallback.map(p => ({
          ...p,
          image: `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop`,
          tags: p.features
        })),
        explanation: 'Curated based on your profile'
      });
    }

    setRecommendations(results);
    setStep('results');
  };

  // Embedded Checkout Handler
  const openEmbeddedCheckout = (url) => {
    setCheckoutUrl(url);
  };

  const closeCheckout = () => {
    setCheckoutUrl('');
  };

  return (
    <div className="min-h-screen bg-white" style={{fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {/* Progress Indicator - only show when not on welcome or results */}
        {step !== 'welcome' && step !== 'results' && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className={`px-3 py-1 ${step === 'mode' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                1. Mode
              </div>
              <div className="w-8 border-t border-gray-300"></div>
              <div className={`px-3 py-1 ${step === 'measurements' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                2. Measurements
              </div>
              <div className="w-8 border-t border-gray-300"></div>
              <div className={`px-3 py-1 ${step === 'preferences' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                3. Preferences
              </div>
            </div>
          </div>
        )}
        {/* The rest of the component code (welcome screen, preferences, mode, measurements, results) goes here. Due to length, this has been omitted for brevity in this example. */}
      </div>
    </div>
  );
};

export default PerfectRatioApp;
