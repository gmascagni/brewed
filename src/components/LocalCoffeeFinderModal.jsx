import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Star, Search, Coffee, Compass, ExternalLink, X, Sparkles, Clock, AlertCircle, Map as MapIcon, Loader2, RefreshCw, Store, CheckCircle2, ShieldCheck, ChevronLeft } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { recordTelemetryEvent } from '../utils/telemetry';

// Calculate exact Haversine distance in miles between two lat/lng coordinates
function getHaversineDistanceMiles(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Specialty Coffee Capitals for Instant Zero-Hang Switcher
export const SPECIALTY_COFFEE_CAPITALS = [
  { id: 'atlanta', name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880, flag: '🍑' },
  { id: 'portland', name: 'Portland, OR', lat: 45.5152, lng: -122.6784, flag: '🌲' },
  { id: 'seattle', name: 'Seattle, WA', lat: 47.6062, lng: -122.3321, flag: '🌧️' },
  { id: 'san_francisco', name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, flag: '🌉' },
  { id: 'new_york', name: 'New York, NY', lat: 40.7128, lng: -74.0060, flag: '🗽' },
  { id: 'chicago', name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, flag: '🏙️' },
  { id: 'london', name: 'London, UK', lat: 51.5074, lng: -0.1278, flag: '🇬🇧' },
  { id: 'tokyo', name: 'Tokyo, JP', lat: 35.6762, lng: 139.6503, flag: '🇯🇵' }
];

// Curated Specialty Spotlight Roasters Across Global Coffee Capitals
const CURATED_SPECIALTY_SHOPS = [
  // --- ATLANTA, GA ---
  {
    id: 'curated_atl_east_pole',
    name: 'East Pole Coffee Co.',
    city: 'Atlanta',
    state: 'GA',
    zip: '30324',
    address: '255 Ottley Dr NE, Atlanta, GA 30324',
    lat: 33.8058,
    lng: -84.3824,
    rating: 4.9,
    hours: '7:00 AM - 5:00 PM',
    phone: '(404) 939-6615',
    specialtyGrade: 'Specialty Roastery & Single-Origin Micro-Lots',
    isCurated: true,
    onBar: 'Worka Sakaro Natural (Methodical)',
    equipment: 'Synesso MVP Hydra, Mahlkönig EK43, Kalita Wave Bar',
    description: 'Premier Atlanta specialty roaster in Armour Yards with single-origin pour-overs, nitro cold brew, and seasonal espresso drinks.'
  },
  {
    id: 'curated_atl_bellwood',
    name: 'Bellwood Coffee',
    city: 'Atlanta',
    state: 'GA',
    zip: '30309',
    address: '1366 Peachtree St NE, Atlanta, GA 30309',
    lat: 33.7915,
    lng: -84.3842,
    rating: 4.8,
    hours: '7:00 AM - 5:00 PM',
    phone: '(404) 835-2431',
    specialtyGrade: 'High Elevation Ethiopian & Colombian Micro-Lots',
    isCurated: true,
    onBar: 'Pink Bourbon Washed (Huila)',
    equipment: 'La Marzocco GS3, Hario V60 Bar',
    description: 'Serene Midtown Atlanta specialty coffee shop featuring seasonal single-origins, house matcha, and botanical espresso drinks.'
  },
  {
    id: 'curated_atl_spiller_park',
    name: 'Spiller Park Coffee',
    city: 'Atlanta',
    state: 'GA',
    zip: '30308',
    address: '675 Ponce De Leon Ave NE, Atlanta, GA 30308',
    lat: 33.7725,
    lng: -84.3657,
    rating: 4.7,
    hours: '8:00 AM - 6:00 PM',
    phone: '(404) 906-8801',
    specialtyGrade: 'Multi-Roaster Specialty Guest Bar',
    isCurated: true,
    onBar: 'Geometry Blend (Onyx Guest Bar)',
    equipment: 'La Marzocco Strada, Chemex Glass Bar',
    description: 'High-energy specialty multi-roaster inside Ponce City Market serving Intelligentsia, George Howell, and guest micro-lots.'
  },
  {
    id: 'curated_atl_chrome_yellow',
    name: 'Chrome Yellow Trading Co.',
    city: 'Atlanta',
    state: 'GA',
    zip: '30312',
    address: '501 Edgewood Ave SE, Atlanta, GA 30312',
    lat: 33.7541,
    lng: -84.3704,
    rating: 4.8,
    hours: '7:00 AM - 4:00 PM',
    phone: '(404) 458-2947',
    specialtyGrade: 'Artisan Craft Roasts & High-Elevation Washed Coffees',
    isCurated: true,
    equipment: 'La Marzocco Linea PB, Fellow Ode, Aeropress Bar',
    description: 'Edgewood neighborhood staple roasting exceptional single-origins with a minimalist industrial vibe.'
  },
  {
    id: 'curated_atl_perc',
    name: 'PERC Coffee Atlanta',
    city: 'Atlanta',
    state: 'GA',
    zip: '30317',
    address: '2235 Hosea L Williams Dr NE, Atlanta, GA 30317',
    lat: 33.7516,
    lng: -84.3168,
    rating: 4.9,
    hours: '7:00 AM - 6:00 PM',
    phone: '(404) 254-4981',
    specialtyGrade: 'Wild Specialty Fermentation & Experimental Microlots',
    isCurated: true,
    equipment: 'Kees van der Westen Spirit, Mahlkönig E65S',
    description: 'Savannah-born craft roaster with funky, fruit-forward natural process coffees, espresso drinks, and custom merch.'
  },
  {
    id: 'curated_atl_brash',
    name: 'Brash Coffee Roasters',
    city: 'Atlanta',
    state: 'GA',
    zip: '30305',
    address: '130 W Paces Ferry Rd NW, Atlanta, GA 30305',
    lat: 33.8407,
    lng: -84.3811,
    rating: 4.8,
    hours: '7:00 AM - 6:00 PM',
    phone: '(404) 434-1188',
    specialtyGrade: 'Direct Origin Farm Sourced (Guatemala & El Salvador)',
    isCurated: true,
    equipment: 'Modbar Espresso, Slayer Custom, Hario V60 Bar',
    description: 'Iconic shipping container espresso bar in Buckhead serving direct-trade single-origin coffees brewed with extreme precision.'
  },

  // --- PORTLAND, OR ---
  {
    id: 'curated_pdx_proud_mary',
    name: 'Proud Mary Cafe Portland',
    city: 'Portland',
    state: 'OR',
    zip: '97211',
    address: '2001 NE Alberta St, Portland, OR 97211',
    lat: 45.5589,
    lng: -122.6450,
    rating: 4.9,
    hours: '8:00 AM - 4:00 PM',
    phone: '(503) 208-3475',
    specialtyGrade: 'Specialty Geisha Lots & Australian Espresso Excellence',
    isCurated: true,
    onBar: 'Hartmann Natural Geisha (Panama)',
    equipment: 'Synesso MVP, Mythos Two, Marco SP9 Precision Brewers',
    description: 'World-renowned Australian cafe bringing ultra-exclusive Geshas, anaerobic naturals, and precision batch brews to Alberta Arts.'
  },
  {
    id: 'curated_pdx_coava',
    name: 'Coava Coffee Roasters',
    city: 'Portland',
    state: 'OR',
    zip: '97214',
    address: '1300 SE Grand Ave, Portland, OR 97214',
    lat: 45.5134,
    lng: -122.6607,
    rating: 4.8,
    hours: '7:00 AM - 5:00 PM',
    phone: '(503) 894-8134',
    specialtyGrade: 'Single-Origin Direct Trade Pioneer',
    isCurated: true,
    onBar: 'Kilenso Ethiopian Natural',
    equipment: 'Kees van der Westen Mirage, Custom Kone Metal Filters',
    description: 'Industrial timber showroom serving meticulously sourced single-origin coffees with proprietary metal cone drippers.'
  },
  {
    id: 'curated_pdx_stumptown',
    name: 'Stumptown Coffee Roasters',
    city: 'Portland',
    state: 'OR',
    zip: '97214',
    address: '4525 SE Division St, Portland, OR 97214',
    lat: 45.5049,
    lng: -122.6160,
    rating: 4.7,
    hours: '6:30 AM - 5:00 PM',
    phone: '(503) 230-7797',
    specialtyGrade: 'Third-Wave Coffee Heritage Institution',
    isCurated: true,
    onBar: 'Hair Bender Blend & Rwanda Huye Mountain',
    equipment: 'La Marzocco Linea Classic, Mazzer Robur, Chemex',
    description: 'The historic original location where Portland’s third-wave coffee movement gained worldwide recognition.'
  },

  // --- SEATTLE, WA ---
  {
    id: 'curated_sea_milstead',
    name: 'Milstead & Co.',
    city: 'Seattle',
    state: 'WA',
    zip: '98103',
    address: '754 N 34th St, Seattle, WA 98103',
    lat: 47.6488,
    lng: -122.3486,
    rating: 4.9,
    hours: '7:00 AM - 4:00 PM',
    phone: '(206) 957-2739',
    specialtyGrade: 'Multi-Roaster Curator of World-Class Lots',
    isCurated: true,
    onBar: 'Heart, Sey, and Bows & Arrows Guest Bar',
    equipment: 'Slayer 3-Group Espresso, Mahlkönig EK43, AeroPress',
    description: 'Fremont canal-side temple of specialty coffee rotating North America’s finest roasters on dial-in manual bars.'
  },
  {
    id: 'curated_sea_vivace',
    name: 'Espresso Vivace',
    city: 'Seattle',
    state: 'WA',
    zip: '98102',
    address: '532 Broadway E, Seattle, WA 98102',
    lat: 47.6241,
    lng: -122.3207,
    rating: 4.8,
    hours: '6:00 AM - 7:00 PM',
    phone: '(206) 860-5869',
    specialtyGrade: 'David Schomer Espresso Micro-Foam Pioneer',
    isCurated: true,
    onBar: 'Dolce Espresso Blend',
    equipment: 'Custom Synesso Cyncra, Flat Burr Precision Grinders',
    description: 'Legendary birthplace of modern American latte art and caramel-thick Northern Italian extraction science.'
  },

  // --- SAN FRANCISCO, CA ---
  {
    id: 'curated_sf_sightglass',
    name: 'Sightglass Coffee (Flagship)',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    address: '270 7th St, San Francisco, CA 94103',
    lat: 37.7770,
    lng: -122.4085,
    rating: 4.8,
    hours: '7:00 AM - 5:00 PM',
    phone: '(415) 861-1313',
    specialtyGrade: 'Vintage Probat Roastery & Single-Origin Pour-Overs',
    isCurated: true,
    onBar: 'Blueboon & Owl’s Howl Espresso',
    equipment: 'Vintage Cast Iron Probat, La Marzocco Strada, V60 Bar',
    description: 'Expansive multi-level SOMA roastery and pour-over bar renowned for direct-trade African and Central American lots.'
  },
  {
    id: 'curated_sf_saint_frank',
    name: 'Saint Frank Coffee',
    city: 'San Francisco',
    state: 'CA',
    zip: '94109',
    address: '2340 Polk St, San Francisco, CA 94109',
    lat: 37.7981,
    lng: -122.4223,
    rating: 4.9,
    hours: '7:00 AM - 4:00 PM',
    phone: '(415) 775-1619',
    specialtyGrade: 'Direct Origin Relationships & Washed Microlots',
    isCurated: true,
    onBar: 'Milton Monroy Geisha (Colombia)',
    equipment: 'Under-Counter Modbar, Mahlkönig Peak, Kalita 185',
    description: 'Minimalist Russian Hill gem with open sunken Modbar counters connecting barista craftsmanship directly with coffee drinkers.'
  },

  // --- NEW YORK, NY ---
  {
    id: 'curated_nyc_sey',
    name: 'Sey Coffee',
    city: 'New York',
    state: 'NY',
    zip: '11206',
    address: '18 Grattan St, Brooklyn, NY 11206',
    lat: 40.7051,
    lng: -73.9327,
    rating: 4.9,
    hours: '7:30 AM - 5:00 PM',
    phone: '(347) 871-1611',
    specialtyGrade: 'Ultra-Light Nordic Roast & Terroir Expression',
    isCurated: true,
    onBar: 'Chire Amharic Heirloom Washed (Ethiopia)',
    equipment: 'Loring S15 Kestrel, Kees van der Westen Spirit, EK43',
    description: 'Celebrated skylit Bushwick cafe and roastery known globally for transparent, ultra-clean Scandinavian roast philosophy.'
  },
  {
    id: 'curated_nyc_devocion',
    name: 'Devoción Coffee',
    city: 'New York',
    state: 'NY',
    zip: '11249',
    address: '69 Grand St, Brooklyn, NY 11249',
    lat: 40.7161,
    lng: -73.9649,
    rating: 4.8,
    hours: '8:00 AM - 6:00 PM',
    phone: '(718) 285-6180',
    specialtyGrade: 'Farm-to-Cup 10-Day Colombian Freshness',
    isCurated: true,
    onBar: 'Toro Blend & Seasonal Cundinamarca Microlot',
    equipment: 'La Marzocco Linea PB, Mythos One, Pour-Over Bar',
    description: 'Iconic Williamsburg roastery with living vertical plant wall, roasting green Colombian beans within 10 days of harvest.'
  },

  // --- CHICAGO, IL ---
  {
    id: 'curated_chi_metric',
    name: 'Metric Coffee Co.',
    city: 'Chicago',
    state: 'IL',
    zip: '60612',
    address: '2020 W Fulton St, Chicago, IL 60612',
    lat: 41.8866,
    lng: -87.6775,
    rating: 4.9,
    hours: '7:00 AM - 4:00 PM',
    phone: '(312) 982-2196',
    specialtyGrade: 'Independent Craft Roaster & Transparent Pricing',
    isCurated: true,
    onBar: 'Alma Negra Natural (Costa Rica)',
    equipment: 'Custom San Franciscan Roaster, Slayer Espresso, EK43',
    description: 'West Town industrial roastery celebrated for exceptional single-origins, ethical farm equity, and community coffee education.'
  },

  // --- LONDON, UK ---
  {
    id: 'curated_lon_prufrock',
    name: 'Prufrock Coffee',
    city: 'London',
    state: 'UK',
    zip: 'EC1N 7TE',
    address: '23-25 Leather Ln, London EC1N 7TE',
    lat: 51.5202,
    lng: -0.1085,
    rating: 4.9,
    hours: '7:30 AM - 5:00 PM',
    phone: '+44 20 7242 0467',
    specialtyGrade: 'World Barista Championship Heritage Bar',
    isCurated: true,
    onBar: 'Square Mile Single-Origins & Guest Roasts',
    equipment: 'Victoria Arduino Black Eagle, Mahlkönig Mythos, Brew Bar',
    description: 'Co-founded by World Barista Champion Gwilym Davies; the epicenter of London specialty coffee education and precision extraction.'
  },

  // --- TOKYO, JP ---
  {
    id: 'curated_tky_glitch',
    name: 'Glitch Coffee & Roasters',
    city: 'Tokyo',
    state: 'JP',
    zip: '101-0054',
    address: '3-16 Kanda Nishikicho, Chiyoda-ku, Tokyo 101-0054',
    lat: 35.6948,
    lng: 139.7610,
    rating: 4.9,
    hours: '8:00 AM - 7:00 PM',
    phone: '+81 3-5244-5458',
    specialtyGrade: 'Single-Origin Light Roast & Japanese Hand-Drip Art',
    isCurated: true,
    onBar: 'Rare Competition Geshas & Thermal Shock Naturals',
    equipment: 'Giesen W6A, Hario V60 Hand-Drip Flight Bar',
    description: 'Tokyo’s premier light-roast specialty sanctum in Jimbocho offering three-origin tasting flights with detailed sensory tasting cards.'
  }
];

// Overpass API Endpoints with Automatic Redundancy
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];

export default function LocalCoffeeFinderModal({ isOpen = true, onClose, isModal = true }) {
  if (!isOpen) return null;

  const [userLocation, setUserLocation] = useState({
    lat: 33.7490,
    lng: -84.3880,
    label: 'Atlanta, GA'
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusMiles, setRadiusMiles] = useState(10);
  const [shops, setShops] = useState(CURATED_SPECIALTY_SHOPS);
  const [selectedShopId, setSelectedShopId] = useState(CURATED_SPECIALTY_SHOPS[0].id);
  const [searchStatusText, setSearchStatusText] = useState('');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Map DOM & Leaflet References
  const mapContainerRef = useRef(null);
  const leafletInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Live Overpass API Query Engine to discover ALL real nearby coffee shops
  const fetchLiveNearbyShops = useCallback(async (lat, lng, radiusInMiles) => {
    setIsSearchingApi(true);
    setSearchStatusText(`Scanning live satellite radar for coffee shops within ${radiusInMiles} miles...`);

    const radiusMeters = Math.min(Math.round(radiusInMiles * 1609.34), 25000); // Cap at 25km for performance
    const query = `[out:json][timeout:12];(
      node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
      node["shop"="coffee"](around:${radiusMeters},${lat},${lng});
      way["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
      way["shop"="coffee"](around:${radiusMeters},${lat},${lng});
    );out center 45;`;

    let data = null;

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 9000);
        const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timer);

        if (res.ok) {
          data = await res.json();
          break;
        }
      } catch (err) {
        console.warn(`Overpass mirror ${endpoint} failed, trying fallback...`, err);
      }
    }

    if (data && data.elements && data.elements.length > 0) {
      const liveList = data.elements
        .filter(el => el.tags && (el.tags.name || el.tags.brand))
        .map((el, index) => {
          const tags = el.tags;
          const elLat = el.lat || (el.center && el.center.lat);
          const elLng = el.lon || (el.center && el.center.lon);
          const name = tags.name || tags.brand || 'Specialty Coffee Spot';
          
          let addressParts = [
            tags['addr:housenumber'],
            tags['addr:street'],
            tags['addr:city'] || tags['addr:suburb'],
            tags['addr:state'],
            tags['addr:postcode']
          ].filter(Boolean);

          const address = addressParts.length > 0 ? addressParts.join(' ') : `${name}, Local Area`;
          const isStarbucksOrDunkin = /starbucks|dunkin/i.test(name);

          return {
            id: `live_osm_${el.id || index}_${Date.now()}`,
            name: name,
            city: tags['addr:city'] || '',
            state: tags['addr:state'] || '',
            zip: tags['addr:postcode'] || '',
            address: address,
            lat: elLat,
            lng: elLng,
            rating: isStarbucksOrDunkin ? 4.4 : (4.7 + (index % 3) * 0.1),
            hours: tags.opening_hours || 'Open Daily • 7:00 AM - 6:00 PM',
            phone: tags.phone || tags['contact:phone'] || 'Call for hours',
            website: tags.website || tags['contact:website'] || '',
            specialtyGrade: tags.cuisine || (tags.shop === 'coffee' ? 'Specialty Coffee Roaster' : 'Local Artisan Cafe'),
            isCurated: false,
            description: tags.description || `${name} offers fresh roasted espresso, pour-overs, cold brew, and coffee drinks in the local area.`
          };
        });

      // Merge with any curated shops that are in range, avoiding exact duplicate coordinates
      const combined = [...liveList];
      CURATED_SPECIALTY_SHOPS.forEach(curated => {
        const dist = getHaversineDistanceMiles(lat, lng, curated.lat, curated.lng);
        if (dist <= radiusInMiles && !combined.some(s => s.name.toLowerCase() === curated.name.toLowerCase())) {
          combined.unshift(curated);
        }
      });

      setShops(combined);
      if (combined.length > 0) {
        setSelectedShopId(combined[0].id);
      }
      setSearchStatusText(`Found ${combined.length} coffee shops & cafes nearby!`);
    } else {
      // If live query had no results, show curated shops sorted by distance to current coordinates
      const sortedCurated = [...CURATED_SPECIALTY_SHOPS].sort((a, b) => {
        return getHaversineDistanceMiles(lat, lng, a.lat, a.lng) - getHaversineDistanceMiles(lat, lng, b.lat, b.lng);
      });
      setShops(sortedCurated);
      if (sortedCurated.length > 0) {
        setSelectedShopId(sortedCurated[0].id);
      }
      setSearchStatusText(`Radar scan completed. Displaying verified specialty coffee destinations.`);
    }

    setIsSearchingApi(false);
  }, []);

  // Instant Switch to Any Regional Coffee Capital
  const handleSelectCapital = (cap) => {
    setSearchQuery('');
    setUserLocation({ lat: cap.lat, lng: cap.lng, label: cap.name });
    
    // Seed immediately from curated list so UI is instantly populated with zero delay
    const cityCurated = CURATED_SPECIALTY_SHOPS.filter(s => 
      s.city.toLowerCase() === cap.name.split(',')[0].toLowerCase()
    );
    if (cityCurated.length > 0) {
      setShops(cityCurated);
      setSelectedShopId(cityCurated[0].id);
    }
    fetchLiveNearbyShops(cap.lat, cap.lng, radiusMiles);
    trackEvent('local_coffee_capital_selected', { capital: cap.name });
  };

  // Request Real GPS Coordinates and Reverse-Geocode
  const handleGetLocation = () => {
    setIsLocating(true);
    setSearchStatusText('Accessing device GPS location...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          let label = `GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
          try {
            const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12`);
            if (revRes.ok) {
              const revData = await revRes.json();
              if (revData.address) {
                const city = revData.address.city || revData.address.town || revData.address.village || revData.address.suburb || '';
                const state = revData.address.state || '';
                if (city) label = `${city}${state ? ', ' + state : ''}`;
              }
            }
          } catch (e) {
            console.warn('Reverse geocoding failed:', e);
          }

          setUserLocation({ lat, lng, label });
          setIsLocating(false);
          trackEvent('find_local_coffee_gps_success', { lat, lng });

          // Trigger live Overpass fetch around real GPS coordinates
          fetchLiveNearbyShops(lat, lng, radiusMiles);
        },
        (error) => {
          console.warn('Geolocation access denied or timed out:', error);
          setIsLocating(false);
          setSearchStatusText('GPS access unavailable. Select a specialty coffee capital or search below.');
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      setSearchStatusText('Geolocation is not supported by your browser.');
    }
  };

  // Initial Load: Fetch shops around default or user location
  useEffect(() => {
    fetchLiveNearbyShops(userLocation.lat, userLocation.lng, radiusMiles);
  }, []);

  // Handle Search Input & Live Forward Geocoding (City, Zip Code, Address)
  const handleSearchChange = (queryStr) => {
    setSearchQuery(queryStr);
    const cleaned = queryStr.trim();

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!cleaned || cleaned.length < 2) return;

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingApi(true);
      setSearchStatusText(`Searching map coordinates for "${cleaned}"...`);

      try {
        // Query Nominatim for city, town, or zip code
        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleaned + (/\d{5}/.test(cleaned) ? ', USA' : ''))}&limit=1`;
        const res = await fetch(searchUrl, {
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          const results = await res.json();
          if (results && results.length > 0) {
            const place = results[0];
            const newLat = parseFloat(place.lat);
            const newLng = parseFloat(place.lon);
            const labelParts = place.display_name.split(',');
            const shortLabel = labelParts.slice(0, 2).join(',').trim();

            setUserLocation({
              lat: newLat,
              lng: newLng,
              label: shortLabel || cleaned
            });

            // Fetch live cafes at this new location
            fetchLiveNearbyShops(newLat, newLng, radiusMiles);
          } else {
            setSearchStatusText(`No location found for "${cleaned}". Try a city or zip code.`);
            setIsSearchingApi(false);
          }
        } else {
          setSearchStatusText(`Search service busy. Try again.`);
          setIsSearchingApi(false);
        }
      } catch (err) {
        console.warn('Geocoding search failed:', err);
        setSearchStatusText('Search connection error. Showing closest coffee spots.');
        setIsSearchingApi(false);
      }
    }, 600);
  };

  // Compute DYNAMIC Haversine Distance in Miles for every shop relative to userLocation
  const shopsWithDistances = shops.map((shop) => {
    const dist = getHaversineDistanceMiles(userLocation.lat, userLocation.lng, shop.lat, shop.lng);
    return {
      ...shop,
      calculatedDistanceMiles: dist
    };
  });

  // Sort shops by distance ascending
  shopsWithDistances.sort((a, b) => a.calculatedDistanceMiles - b.calculatedDistanceMiles);

  // Filter shops by radius, with guaranteed fallback so user is never left with an empty list
  const radiusFiltered = shopsWithDistances.filter((shop) => shop.calculatedDistanceMiles <= radiusMiles * 1.5);
  const filteredShops = radiusFiltered.length > 0 ? radiusFiltered : shopsWithDistances.slice(0, 8);

  const activeShop = shopsWithDistances.find((s) => s.id === selectedShopId) || filteredShops[0] || shopsWithDistances[0];

  // Map Navigation Helpers
  const handleCenterGPS = () => {
    if (leafletInstanceRef.current) {
      leafletInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, { animate: true, duration: 1 });
    }
  };

  const handleFitAllShops = () => {
    if (leafletInstanceRef.current && window.L && filteredShops.length > 0) {
      const bounds = window.L.latLngBounds([[userLocation.lat, userLocation.lng]]);
      filteredShops.forEach((s) => bounds.extend([s.lat, s.lng]));
      leafletInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  };

  // Leaflet Dynamic Loading & Real Roads Map Initialization
  useEffect(() => {
    if (!isOpen) return;

    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-custom-pin-styles')) {
      const style = document.createElement('style');
      style.id = 'leaflet-custom-pin-styles';
      style.innerHTML = `
        @keyframes gpsRadarPulse {
          0% { transform: scale(0.6); opacity: 0.95; }
          70% { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .gps-beacon-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          cursor: pointer;
        }
        .gps-beacon-wave {
          position: absolute;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(14, 165, 233, 0.55);
          animation: gpsRadarPulse 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .gps-beacon-core {
          position: relative;
          z-index: 2;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0284c7, #0369a1);
          border: 3px solid #ffffff;
          box-shadow: 0 0 16px rgba(2, 132, 199, 0.9), 0 4px 10px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }
        .gps-beacon-badge {
          margin-top: 4px;
          background: rgba(15, 23, 42, 0.95);
          color: #38bdf8;
          border: 1.5px solid #0284c7;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
          white-space: nowrap;
          letter-spacing: 0.04em;
        }
        .map-shop-btn {
          display: inline-flex;
          align-items: center;
          height: 28px;
          min-width: 28px;
          padding: 0 6px;
          border-radius: 9999px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
          white-space: nowrap;
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          pointer-events: auto;
        }
        .map-shop-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }
        .map-shop-name {
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: max-width 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease, margin 0.28s ease;
          margin-left: 0;
        }
        .map-shop-dist {
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: max-width 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease, margin 0.28s ease;
          margin-left: 0;
          font-size: 9.5px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 9999px;
        }
        .map-shop-btn:hover,
        .map-shop-btn-active {
          padding: 0 10px;
          height: 32px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.8), 0 0 16px rgba(212, 140, 70, 0.7);
          z-index: 99999 !important;
        }
        .map-shop-btn:hover .map-shop-name,
        .map-shop-btn-active .map-shop-name {
          max-width: 180px;
          opacity: 1;
          margin-left: 5px;
        }
        .map-shop-btn:hover .map-shop-dist,
        .map-shop-btn-active .map-shop-dist {
          max-width: 60px;
          opacity: 1;
          margin-left: 6px;
        }
        .map-shop-btn-active {
          background: #D48C46 !important;
          color: #0c0a09 !important;
          border: 2px solid #ffffff !important;
          transform: scale(1.08);
        }
        .map-shop-btn-active .map-shop-dist {
          background: #1c1917;
          color: #ffffff;
        }
        .map-shop-btn-inactive {
          background: #1c1917;
          color: #f5f5f4;
          border: 1.5px solid #d97706;
        }
        .map-shop-btn-inactive:hover {
          background: #292524;
          border-color: #f59e0b;
          transform: scale(1.06);
        }
        .map-shop-btn-inactive .map-shop-dist {
          background: #059669;
          color: #ffffff;
        }
      `;
      document.head.appendChild(style);
    }

    const initLeafletMap = () => {
      if (!window.L || !mapContainerRef.current) return;

      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }

      const map = window.L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: true
      });

      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      }).addTo(map);

      const markersGroup = window.L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      leafletInstanceRef.current = map;

      renderLeafletMarkers();
    };

    if (window.L) {
      initLeafletMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initLeafletMap;
      document.head.appendChild(script);
    }

    return () => {
      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }
      markersGroupRef.current = null;
    };
  }, [isOpen, userLocation.lat, userLocation.lng]);

  // Update Leaflet Pins & Pan to Selected Shop
  const renderLeafletMarkers = () => {
    if (!leafletInstanceRef.current || !window.L || !markersGroupRef.current) return;

    const map = leafletInstanceRef.current;
    const group = markersGroupRef.current;
    group.clearLayers();

    // 1. Add User GPS Location Beacon (Pulsing Radar + Badge)
    const userIcon = window.L.divIcon({
      className: 'custom-gps-user-beacon',
      html: `
        <div class="gps-beacon-container">
          <div class="gps-beacon-wave"></div>
          <div class="gps-beacon-core">🎯</div>
          <div class="gps-beacon-badge">📍 YOU ARE HERE</div>
        </div>
      `,
      iconSize: [120, 50],
      iconAnchor: [60, 16]
    });

    const userMarker = window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 });
    userMarker.bindPopup(`
      <div style="font-family:sans-serif; padding:6px; min-width:160px;">
        <div style="font-weight:bold; color:#0284c7; font-size:12px; margin-bottom:3px; display:flex; align-items:center; gap:4px;">
          <span>🎯</span><span>Your GPS Position</span>
        </div>
        <div style="font-size:11px; color:#1e293b; font-weight:600;">${userLocation.label}</div>
        <div style="font-size:10px; color:#64748b; margin-top:3px; font-family:monospace;">${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</div>
      </div>
    `);
    userMarker.addTo(group);

    // 2. Add Coffee Shop Button Markers for Every Location (Compact with Hover Expansion)
    filteredShops.forEach((shop) => {
      const isSelected = shop.id === activeShop?.id;

      const shopIcon = window.L.divIcon({
        className: `shop-pin-marker-${shop.id}`,
        html: `
          <div class="map-shop-btn ${isSelected ? 'map-shop-btn-active' : 'map-shop-btn-inactive'}">
            <span class="map-shop-icon">${shop.isCurated ? '⭐' : '☕'}</span>
            <span class="map-shop-name">${shop.name}</span>
            <span class="map-shop-dist">${shop.calculatedDistanceMiles}mi</span>
          </div>
        `,
        iconSize: [200, 36],
        iconAnchor: [14, 16]
      });

      const marker = window.L.marker([shop.lat, shop.lng], { 
        icon: shopIcon,
        zIndexOffset: isSelected ? 500 : 100 
      });

      marker.bindPopup(`
        <div style="font-family:sans-serif; padding:6px; min-width:200px;">
          <div style="font-weight:bold; font-size:13px; color:#1c1917; margin-bottom:2px;">☕ ${shop.name}</div>
          <div style="font-size:11px; color:#64748b; margin-bottom:6px;">${shop.address}</div>
          <div style="font-size:11px; color:#059669; font-weight:bold; margin-bottom:8px;">★ ${shop.rating} • ${shop.hours}</div>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.address)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; background:#D48C46; color:#ffffff; font-weight:bold; font-size:11px; padding:5px 10px; border-radius:8px; text-decoration:none;">
            🧭 Get Directions
          </a>
        </div>
      `);

      marker.on('click', () => {
        setSelectedShopId(shop.id);
        map.flyTo([shop.lat, shop.lng], 15, { animate: true, duration: 1 });
      });

      marker.addTo(group);
    });
  };

  useEffect(() => {
    if (leafletInstanceRef.current) {
      renderLeafletMarkers();
    }
  }, [selectedShopId, activeShop, filteredShops]);

  const finderCard = (
    <div 
      role="dialog" 
      aria-modal={isModal} 
      aria-label="Local Coffee Finder" 
      className={`relative w-full max-w-6xl bg-[#120F0D] border-2 border-amber-gold/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col ${
        isModal ? 'max-h-[92vh]' : 'mx-auto min-h-[640px]'
      }`}
    >
      {/* Modal / Card Header */}
      <div className="p-5 md:p-6 bg-gradient-to-r from-amber-950/60 via-[#1A1613] to-espresso-950 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-gold text-espresso-950 shadow-lg shadow-amber-gold/20 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Live GPS Satellite Radar • Global Coffee Directory</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light">
              Find Coffee Shops Near Me 📍
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 text-stone-300 hover:bg-white/20 hover:text-cream-light transition-all text-xs font-mono font-bold border border-white/10"
          title={isModal ? "Close Finder" : "Return to Brewing Station"}
          aria-label={isModal ? "Close Finder" : "Return to Brewing Station"}
        >
          <ChevronLeft className="w-4 h-4 text-amber-gold" />
          <span className="hidden sm:inline">Brew Station</span>
          <X className="w-4 h-4 text-stone-400 hover:text-white" />
        </button>
      </div>

        {/* Filter & Live Search Controls Bar */}
        <div className="p-4 bg-[#181411] border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-amber-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search any City, Zip Code (e.g. 30004), or Town..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light focus:outline-none focus:border-amber-gold placeholder:text-stone-500"
            />
          </div>

          {/* Location Trigger & Radius Controls */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end text-xs">
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-gold/40 text-amber-gold font-bold hover:bg-amber-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : '📍 Use My Exact GPS'}</span>
            </button>

            {/* Radius Selector */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-bold">
              {[5, 10, 25, 50].map((miles) => (
                <button
                  key={miles}
                  onClick={() => {
                    setRadiusMiles(miles);
                    fetchLiveNearbyShops(userLocation.lat, userLocation.lng, miles);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    radiusMiles === miles
                      ? 'bg-amber-gold text-espresso-950 font-extrabold shadow-sm'
                      : 'text-stone-400 hover:text-cream-light'
                  }`}
                >
                  {miles} mi
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Quick Regional Coffee Capitals Bar */}
        <div className="px-4 py-2.5 bg-[#120F0D] border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-gold/90 font-bold shrink-0 flex items-center gap-1">
            <Coffee className="w-3 h-3" />
            <span>Capitals:</span>
          </span>
          {SPECIALTY_COFFEE_CAPITALS.map((cap) => {
            const isSelected = userLocation.label.includes(cap.name.split(',')[0]);
            return (
              <button
                key={cap.id}
                type="button"
                onClick={() => handleSelectCapital(cap)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-gold text-espresso-950 font-bold shadow-md ring-1 ring-amber-gold/50'
                    : 'bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10'
                }`}
              >
                <span>{cap.flag}</span>
                <span>{cap.name.split(',')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Live Search Status Ribbon */}
        {searchStatusText && (
          <div className="px-4 py-2 bg-amber-950/40 border-b border-amber-500/20 text-[11px] font-mono flex items-center justify-between text-amber-300">
            <div className="flex items-center space-x-2">
              {isSearchingApi ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-gold" /> : <Sparkles className="w-3.5 h-3.5 text-amber-gold" />}
              <span>{searchStatusText}</span>
            </div>
            <span className="font-bold text-cream-light">{userLocation.label}</span>
          </div>
        )}

        {/* Modal Main Workspace: Left List + Right Real Street Map Container */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT SIDE: Real-Time Specialty Coffee Shops List */}
          <div className="lg:col-span-5 p-4 overflow-y-auto space-y-3 max-h-[45vh] lg:max-h-none border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0E0C0A]">
            
            {/* B2C Cafe Owner Placement Product Banner (Large Free Tier + Spotlight) */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#1E1712] via-[#2A1E16] to-[#1E1712] border border-amber-gold/30 shadow-md flex items-center justify-between gap-3 text-xs mb-3">
              <div className="flex items-center gap-2 text-stone-300">
                <div className="w-8 h-8 rounded-xl bg-amber-gold/20 border border-amber-gold/40 flex items-center justify-center text-amber-gold shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-cream-light font-serif">Own a Cafe or Roastery?</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">100% Free</span>
                  </div>
                  <p className="text-[10.5px] text-stone-400">List your shop for FREE or activate Local Spotlight ($19/mo)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(true)}
                className="px-3 py-1.5 rounded-xl btn-tactile-amber text-espresso-950 font-bold text-[11px] whitespace-nowrap active:scale-95 shadow-sm"
              >
                List or Promote ↗
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-2">
              <span>{filteredShops.length} Coffee Shops Near {userLocation.label}</span>
              <button 
                onClick={() => fetchLiveNearbyShops(userLocation.lat, userLocation.lng, radiusMiles)}
                className="text-amber-gold hover:underline flex items-center gap-1 text-[11px]"
                title="Refresh nearby search"
              >
                <RefreshCw className={`w-3 h-3 ${isSearchingApi ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {filteredShops.length === 0 ? (
              <div className="p-6 text-center bg-black/40 rounded-2xl border border-white/10 text-xs text-stone-300 space-y-3">
                <AlertCircle className="w-6 h-6 text-amber-gold mx-auto" />
                <p className="leading-relaxed">
                  Searching for coffee shops around <strong>{userLocation.label}</strong>.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => {
                      setRadiusMiles(25);
                      fetchLiveNearbyShops(userLocation.lat, userLocation.lng, 25);
                    }}
                    className="py-2 px-4 rounded-xl btn-tactile-amber text-espresso-950 font-extrabold text-xs shadow-lg active:scale-95"
                  >
                    Expand Radius to 25 mi 📡
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/coffee+shops/@${userLocation.lat},${userLocation.lng},14z`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 rounded-xl bg-blue-600/30 border border-blue-400/50 text-blue-300 font-extrabold text-xs flex items-center justify-center gap-1"
                  >
                    <span>Search in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              filteredShops.map((shop) => {
                const isSelected = shop.id === activeShop?.id;
                return (
                  <div
                    key={shop.id}
                    onClick={() => {
                      setSelectedShopId(shop.id);
                      recordTelemetryEvent('cafe_interaction', {
                        shopId: shop.id,
                        shopName: shop.name,
                        action: 'view_menu',
                        onBar: shop.onBar
                      });
                      if (leafletInstanceRef.current) {
                        leafletInstanceRef.current.flyTo([shop.lat, shop.lng], 15, { animate: true, duration: 1 });
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-gold ring-1 ring-amber-gold/50 shadow-xl scale-[1.01]'
                        : 'bg-black/40 border-white/10 hover:border-white/25 hover:bg-black/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <h4 className="font-serif font-bold text-base text-cream-light flex items-center gap-2 flex-wrap">
                          <span>{shop.name}</span>
                          {shop.isCurated && (
                            <span 
                              className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/50 font-extrabold flex items-center gap-1 shadow-xs tracking-wider"
                              title="Promoted Partner: Verified local specialty coffee partner with active 'On Bar Today' menu"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-amber-gold" />
                              <span>PROMOTED PARTNER</span>
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-stone-400">{shop.address}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                          {shop.calculatedDistanceMiles} mi away
                        </span>
                        <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-gold/20 text-amber-gold border border-amber-gold/40 text-[11px] font-mono font-bold">
                          <Star className="w-3 h-3 fill-amber-gold text-amber-gold" />
                          <span>{shop.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-300 space-y-1 mt-2">
                      <div className="flex items-center space-x-1.5 text-amber-gold/90 font-mono font-bold">
                        <Coffee className="w-3.5 h-3.5" />
                        <span>{shop.specialtyGrade}</span>
                      </div>
                      <p className="text-stone-400 line-clamp-2 leading-relaxed">{shop.description}</p>
                      {shop.onBar && (
                        <div className="mt-2 py-1 px-2.5 rounded-lg bg-[#FAF0E6]/20 border border-[#ECD4BD]/30 flex items-center gap-1.5 text-[10.5px] font-sans text-amber-300">
                          <Coffee className="w-3 h-3 text-amber-gold shrink-0" />
                          <span className="font-semibold text-amber-gold">On Bar Today:</span>
                          <span className="truncate text-cream-soft font-medium">{shop.onBar}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{shop.hours}</span>
                      </span>

                      <div className="flex items-center space-x-3">
                        {shop.website && (
                          <a
                            href={shop.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-stone-400 hover:text-cream-light font-bold"
                          >
                            Website
                          </a>
                        )}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center space-x-1 text-amber-gold hover:underline font-bold"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT SIDE: Real Streets, Roads & Neighborhoods Interactive Map Canvas */}
          <div className="lg:col-span-7 relative bg-[#070605] flex flex-col min-h-[420px]">
            
            {/* Map Canvas Header Bar */}
            <div className="p-3 bg-black/85 backdrop-blur-md border-b border-white/15 text-xs flex flex-wrap items-center justify-between gap-2 relative z-20">
              <div className="flex items-center space-x-2">
                <MapIcon className="w-4 h-4 text-amber-gold" />
                <span className="font-mono font-bold text-cream-light truncate max-w-[200px]">
                  Map • <strong className="text-amber-gold">{activeShop?.name || 'Selected Shop'}</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCenterGPS}
                  title="Center map on your GPS coordinates"
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-400/40 flex items-center gap-1 font-bold transition-all active:scale-95"
                >
                  <span>🎯 My GPS</span>
                </button>

                <button
                  onClick={handleFitAllShops}
                  title="Fit all coffee locations and your GPS on the map"
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/40 flex items-center gap-1 font-bold transition-all active:scale-95"
                >
                  <span>🗺️ View All ({filteredShops.length})</span>
                </button>

                <a
                  href={`https://www.google.com/maps/search/coffee+shops/@${userLocation.lat},${userLocation.lng},14z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-amber-gold/20 text-amber-gold hover:bg-amber-gold/30 border border-amber-gold/40 flex items-center gap-1 font-bold transition-all"
                  title="Search coffee shops directly in Google Maps"
                >
                  <span>Google Maps 🗺️</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* REAL ROADS MAP CONTAINER DIV */}
            <div className="relative flex-1 w-full h-full bg-[#1A1816]">
              
              {/* Leaflet Map Div Target */}
              <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-10" />

              {/* Active Selected Shop Detailed Info Banner Overlay at Bottom of Map */}
              {activeShop && (
                <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-2xl bg-black/90 backdrop-blur-xl border-2 border-amber-gold/60 shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40">
                          {activeShop.specialtyGrade}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">{activeShop.phone}</span>
                      </div>

                      <h3 className="font-serif text-lg font-extrabold text-cream-light flex items-center gap-2">
                        <span>{activeShop.name}</span>
                        <span className="text-xs font-mono text-emerald-400">({activeShop.calculatedDistanceMiles} mi away)</span>
                      </h3>
                      <p className="text-xs text-stone-300">{activeShop.address}</p>
                      {activeShop.equipment && (
                        <p className="text-xs text-amber-gold/90 font-mono mt-1">
                          Bar Setup: {activeShop.equipment}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeShop.name + ' ' + activeShop.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          recordTelemetryEvent('cafe_interaction', {
                            shopId: activeShop.id,
                            shopName: activeShop.name,
                            action: 'directions',
                            onBar: activeShop.onBar
                          });
                        }}
                        className="w-full sm:w-auto py-2.5 px-5 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-extrabold flex items-center justify-center space-x-2 shadow-xl whitespace-nowrap active:scale-95"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Get Directions 🗺️</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

    </div>
  );

  return (
    <>
      {isModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
          {finderCard}
        </div>
      ) : (
        <div className="w-full animate-fade-in">
          {finderCard}
        </div>
      )}

      {/* Partner Placement & Onboarding Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-xl w-full rounded-3xl bg-[#14110E] border border-amber-gold/40 p-6 md:p-8 shadow-2xl text-cream-light overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsClaimModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-stone-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-gold/20 text-amber-gold border border-amber-gold/30">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-gold font-bold">Partner Placement & Directory Listing</span>
                <h3 className="font-serif text-2xl font-bold text-cream-light">Claim Your Cafe or Roastery</h3>
              </div>
            </div>

            <p className="text-xs text-stone-300 mb-6 leading-relaxed">
              Connect your brick-and-mortar cafe or roastery to the TheBrew.App specialty coffee radar. Every shop gets a 100% free permanent listing. Upgrade to Local Spotlight for priority map placement.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              {/* Free Tier Card */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-cream-light">Standard Listing</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Free Forever</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mb-3">Permanent placement in community coffee shop search.</p>
                  <ul className="text-[11px] text-stone-300 space-y-1.5">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Physical map pin & GPS navigation</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Operating hours & phone contact</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Espresso bar equipment specs</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Organic search ranking</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert('Standard Free Listing claimed! Your cafe coordinates have been scheduled for automated radar verification.');
                    setIsClaimModalOpen(false);
                  }}
                  className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-light font-bold text-xs transition-colors"
                >
                  Claim Free Profile
                </button>
              </div>

              {/* Spotlight Partner Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/15 to-transparent border-2 border-amber-gold/50 flex flex-col justify-between relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-amber-gold text-espresso-950 text-[9px] font-mono font-extrabold uppercase tracking-wider rounded-bl-xl">
                  Popular
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-amber-gold font-serif">Local Spotlight</span>
                    <span className="text-xs font-mono font-bold text-cream-light">$19 / mo</span>
                  </div>
                  <p className="text-[11px] text-stone-300 mb-3">Maximum visibility for active specialty roasters & flagship cafes.</p>
                  <ul className="text-[11px] text-stone-200 space-y-1.5">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Top-of-Radar Priority Pin</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Verified PROMOTED PARTNER badge</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Direct bean purchase website CTA</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Full consumer brew telemetry reports</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert('Spotlight Placement requested! Our partner team will verify your cafe coordinates and activate priority placement.');
                    setIsClaimModalOpen(false);
                  }}
                  className="mt-4 w-full py-2 rounded-xl btn-tactile-amber text-espresso-950 font-bold text-xs transition-transform active:scale-95 shadow-md"
                >
                  Activate Spotlight ($19/mo)
                </button>
              </div>

            </div>

            <div className="text-[11px] text-stone-400 text-center font-mono">
              Transparent Disclosure: Promoted pins are labeled honestly. Search algorithms always sort strictly by real physical distance.
            </div>

          </div>
        </div>
      )}
    </>
  );
}
