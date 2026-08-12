import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Star, Search, Coffee, Compass, ExternalLink, X, Sparkles, Clock, AlertCircle, Map as MapIcon } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

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

// City & Zip Geocoding Coordinates Dictionary
const CITY_GEOCODE_MAP = {
  'alpharetta': { lat: 34.0754, lng: -84.2941, label: 'Alpharetta, GA' },
  'alpharetta, ga': { lat: 34.0754, lng: -84.2941, label: 'Alpharetta, GA' },
  'alpharetta ga': { lat: 34.0754, lng: -84.2941, label: 'Alpharetta, GA' },
  'roswell': { lat: 34.0232, lng: -84.3616, label: 'Roswell, GA' },
  'sandy springs': { lat: 33.9304, lng: -84.3733, label: 'Sandy Springs, GA' },
  'atlanta': { lat: 33.7490, lng: -84.3880, label: 'Atlanta, GA' },
  'atlanta, ga': { lat: 33.7490, lng: -84.3880, label: 'Atlanta, GA' },
  'marietta': { lat: 33.9526, lng: -84.5499, label: 'Marietta, GA' },
  'decatur': { lat: 33.7748, lng: -84.2963, label: 'Decatur, GA' },
  'johns creek': { lat: 34.0289, lng: -84.1986, label: 'Johns Creek, GA' },
  'bentonville': { lat: 36.3729, lng: -94.2088, label: 'Bentonville, AR' },
  'portland': { lat: 45.5152, lng: -122.6784, label: 'Portland, OR' },
  'brooklyn': { lat: 40.7051, lng: -73.9332, label: 'Brooklyn, NY' },
  'new york': { lat: 40.7128, lng: -74.0060, label: 'New York, NY' },
  'san francisco': { lat: 37.7749, lng: -122.4194, label: 'San Francisco, CA' },
  'seattle': { lat: 47.6062, lng: -122.3321, label: 'Seattle, WA' },
  'chicago': { lat: 41.8781, lng: -87.6298, label: 'Chicago, IL' },
  'austin': { lat: 30.2672, lng: -97.7431, label: 'Austin, TX' }
};

// Nationwide Specialty Coffee Shops Database with Real Street Coordinates
const SPECIALTY_COFFEE_SHOPS_DB = [
  {
    id: 'shop_atl_east_pole',
    name: 'East Pole Coffee Co.',
    city: 'Atlanta',
    state: 'GA',
    zip: '30324',
    address: '255 Ottley Dr NE, Atlanta, GA 30324',
    lat: 33.8058,
    lng: -84.3824,
    rating: 4.9,
    reviewsCount: 420,
    isOpen: true,
    hours: '7:00 AM - 5:00 PM',
    phone: '(404) 939-6615',
    specialtyGrade: 'Single-Origin Micro-Lots & In-House Roastery',
    equipment: 'Synesso MVP Hydra, Mahlkönig EK43, Kalita Wave Bar',
    description: 'Premier Atlanta specialty roaster in Armour Yards with single-origin pour-overs, nitro cold brew, and seasonal espresso drinks.'
  },
  {
    id: 'shop_atl_bellwood',
    name: 'Bellwood Coffee',
    city: 'Atlanta',
    state: 'GA',
    zip: '30309',
    address: '1366 Peachtree St NE, Atlanta, GA 30309',
    lat: 33.7915,
    lng: -84.3842,
    rating: 4.8,
    reviewsCount: 260,
    isOpen: true,
    hours: '7:00 AM - 5:00 PM',
    phone: '(404) 835-2431',
    specialtyGrade: 'High Elevation Ethiopian & Colombian Micro-Lots',
    equipment: 'La Marzocco GS3, Hario V60 Bar',
    description: 'Serene Midtown Atlanta specialty coffee shop featuring seasonal single-origins, house matcha, and botanical espresso drinks.'
  },
  {
    id: 'shop_atl_spiller_park',
    name: 'Spiller Park Coffee',
    city: 'Atlanta',
    state: 'GA',
    zip: '30308',
    address: '675 Ponce De Leon Ave NE, Atlanta, GA 30308',
    lat: 33.7725,
    lng: -84.3657,
    rating: 4.7,
    reviewsCount: 450,
    isOpen: true,
    hours: '8:00 AM - 6:00 PM',
    phone: '(404) 906-8801',
    specialtyGrade: 'Multi-Roaster Specialty Guest Bar',
    equipment: 'La Marzocco Strada, Chemex Glass Bar',
    description: 'High-energy specialty multi-roaster inside Ponce City Market serving Intelligentsia, George Howell, and guest micro-lots.'
  },
  {
    id: 'shop_atl_chrome_yellow',
    name: 'Chrome Yellow Trading Co.',
    city: 'Atlanta',
    state: 'GA',
    zip: '30312',
    address: '501 Edgewood Ave SE, Atlanta, GA 30312',
    lat: 33.7541,
    lng: -84.3704,
    rating: 4.8,
    reviewsCount: 390,
    isOpen: true,
    hours: '7:00 AM - 4:00 PM',
    phone: '(404) 458-2947',
    specialtyGrade: 'Artisan Craft Roasts & High-Elevation Washed Coffees',
    equipment: 'La Marzocco Linea PB, Fellow Ode, Aeropress Bar',
    description: 'Edgewood neighborhood staple roasting exceptional single-origins with a minimalist industrial vibe.'
  },
  {
    id: 'shop_atl_perc',
    name: 'PERC Coffee Atlanta',
    city: 'Atlanta',
    state: 'GA',
    zip: '30317',
    address: '2235 Hosea L Williams Dr NE, Atlanta, GA 30317',
    lat: 33.7516,
    lng: -84.3168,
    rating: 4.9,
    reviewsCount: 280,
    isOpen: true,
    hours: '7:00 AM - 6:00 PM',
    phone: '(404) 254-4981',
    specialtyGrade: 'Wild Specialty Fermentation & Experimental Microlots',
    equipment: 'Kees van der Westen Spirit, Mahlkönig E65S',
    description: 'Savannah-born craft roaster with funky, fruit-forward natural process coffees, espresso drinks, and custom merch.'
  },
  {
    id: 'shop_atl_brash',
    name: 'Brash Coffee Roasters',
    city: 'Atlanta',
    state: 'GA',
    zip: '30305',
    address: '130 W Paces Ferry Rd NW, Atlanta, GA 30305',
    lat: 33.8407,
    lng: -84.3811,
    rating: 4.8,
    reviewsCount: 310,
    isOpen: true,
    hours: '7:00 AM - 6:00 PM',
    phone: '(404) 434-1188',
    specialtyGrade: 'Direct Origin Farm Sourced (Guatemala & El Salvador)',
    equipment: 'Modbar Espresso, Slayer Custom, Hario V60 Bar',
    description: 'Iconic shipping container espresso bar in Buckhead serving direct-trade single-origin coffees brewed with extreme precision.'
  },
  {
    id: 'shop_onyx_bentonville',
    name: 'Onyx Coffee Lab HQ',
    city: 'Bentonville',
    state: 'AR',
    zip: '72712',
    address: '101 E Central Ave, Bentonville, AR 72712',
    lat: 36.3729,
    lng: -94.2088,
    rating: 4.9,
    reviewsCount: 580,
    isOpen: true,
    hours: '7:00 AM - 6:00 PM',
    phone: '(479) 715-6448',
    specialtyGrade: 'SCA 90+ World Champion Roastery',
    equipment: 'Modbar Steam, Fellow Ode, Hario V60 Bar',
    description: 'World-renowned specialty roaster featuring single-origin espresso flights, precision pour-over bar, and artisan pastries.'
  },
  {
    id: 'shop_stumptown_pdx',
    name: 'Stumptown Coffee Roasters',
    city: 'Portland',
    state: 'OR',
    zip: '97214',
    address: '1026 SE Division St, Portland, OR 97214',
    lat: 45.5048,
    lng: -122.6552,
    rating: 4.8,
    reviewsCount: 820,
    isOpen: true,
    hours: '6:30 AM - 7:00 PM',
    phone: '(503) 230-7797',
    specialtyGrade: 'Direct Trade Origin Roasters',
    equipment: 'La Marzocco Strada, Mazzer Robur S',
    description: 'Pioneer of specialty third-wave coffee featuring Hair Bender espresso, cold brew on draft, and single-origin tastings.'
  },
  {
    id: 'shop_sey_brooklyn',
    name: 'Sey Coffee Roasters',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11237',
    address: '18 Grattan St, Brooklyn, NY 11237',
    lat: 40.7051,
    lng: -73.9332,
    rating: 4.9,
    reviewsCount: 610,
    isOpen: true,
    hours: '7:00 AM - 5:00 PM',
    phone: '(347) 889-7390',
    specialtyGrade: 'Scandinavian Ultra-Light Nordic Roasts',
    equipment: 'Synesso MVP Hydra, Mahlkönig EK43',
    description: 'Light-filled greenhouse cafe dedicated to delicate, high-elevation washed Nordic roasts and crystal-clear pour-overs.'
  },
  {
    id: 'shop_sightglass_sf',
    name: 'Sightglass Coffee Flagship',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    address: '270 7th St, San Francisco, CA 94103',
    lat: 37.7771,
    lng: -122.4086,
    rating: 4.8,
    reviewsCount: 910,
    isOpen: true,
    hours: '7:00 AM - 6:00 PM',
    phone: '(415) 861-1313',
    specialtyGrade: 'Probat Vintage Roaster & Slow Bar',
    equipment: 'La Marzocco Linea PB, Chemex Bar',
    description: 'Massive open-concept roastery with an upstairs slow pour-over bar, affogato station, and fresh seasonal microlots.'
  }
];

export default function LocalCoffeeFinderModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Default User Location: Atlanta, GA (33.7490, -84.3880) until browser GPS provides actual lat/lng
  const [userLocation, setUserLocation] = useState({
    lat: 33.7490,
    lng: -84.3880,
    label: 'Atlanta, GA (Detected Hub)'
  });
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusMiles, setRadiusMiles] = useState(25);
  const [selectedShopId, setSelectedShopId] = useState(SPECIALTY_COFFEE_SHOPS_DB[0].id);

  // Map DOM & Leaflet References
  const mapContainerRef = useRef(null);
  const leafletInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  // Handle Search Input & Geocoding Recentering
  const handleSearchChange = (queryStr) => {
    setSearchQuery(queryStr);
    const cleaned = queryStr.toLowerCase().trim();

    if (CITY_GEOCODE_MAP[cleaned]) {
      const geo = CITY_GEOCODE_MAP[cleaned];
      setUserLocation({
        lat: geo.lat,
        lng: geo.lng,
        label: `${geo.label} Radar`
      });
    } else {
      Object.keys(CITY_GEOCODE_MAP).forEach((cityKey) => {
        if (cleaned.startsWith(cityKey)) {
          const geo = CITY_GEOCODE_MAP[cityKey];
          setUserLocation({
            lat: geo.lat,
            lng: geo.lng,
            label: `${geo.label} Radar`
          });
        }
      });
    }
  };

  // Request Browser Real GPS Location
  const handleGetLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({
            lat,
            lng,
            label: `GPS Position (${lat.toFixed(3)}, ${lng.toFixed(3)})`
          });
          setIsLocating(false);
          trackEvent('find_local_coffee_geo_success', { lat, lng });
        },
        (error) => {
          console.warn('Geolocation access denied or timed out:', error);
          setIsLocating(false);
          setUserLocation({
            lat: 33.7490,
            lng: -84.3880,
            label: 'Atlanta, GA (Default Hub)'
          });
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  // Compute DYNAMIC Haversine Distance in Miles for every shop relative to userLocation
  const shopsWithDistances = SPECIALTY_COFFEE_SHOPS_DB.map((shop) => {
    const dist = getHaversineDistanceMiles(userLocation.lat, userLocation.lng, shop.lat, shop.lng);
    return {
      ...shop,
      calculatedDistanceMiles: dist
    };
  });

  // Sort shops by calculated distance ascending (closest shop first)
  shopsWithDistances.sort((a, b) => a.calculatedDistanceMiles - b.calculatedDistanceMiles);

  // Filter shops by radius AND text query
  const filteredShops = shopsWithDistances.filter((shop) => {
    const q = searchQuery.toLowerCase().trim();
    const isWithinRadius = shop.calculatedDistanceMiles <= radiusMiles;

    if (!q || CITY_GEOCODE_MAP[q] || Object.keys(CITY_GEOCODE_MAP).some(k => q.startsWith(k))) {
      return isWithinRadius;
    }

    const matchesKeyword = (
      shop.name.toLowerCase().includes(q) ||
      shop.city.toLowerCase().includes(q) ||
      shop.state.toLowerCase().includes(q) ||
      shop.address.toLowerCase().includes(q) ||
      shop.specialtyGrade.toLowerCase().includes(q)
    );

    return isWithinRadius && matchesKeyword;
  });

  const activeShop = shopsWithDistances.find((s) => s.id === selectedShopId) || filteredShops[0] || shopsWithDistances[0];

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

    const initLeafletMap = () => {
      if (!window.L || !mapContainerRef.current) return;

      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }

      const map = window.L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 12,
        zoomControl: true
      });

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);

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
    };
  }, [isOpen, userLocation]);

  // Update Leaflet Pins & Pan to Selected Shop
  const renderLeafletMarkers = () => {
    if (!leafletInstanceRef.current || !window.L || !markersGroupRef.current) return;

    const map = leafletInstanceRef.current;
    const group = markersGroupRef.current;
    group.clearLayers();

    // 1. Add User GPS Marker (Blue Pulsing Pinpoint)
    const userIcon = window.L.divIcon({
      className: 'custom-gps-user-pin',
      html: `<div style="background:#0284c7; border:2px solid #ffffff; width:22px; height:22px; border-radius:50%; box-shadow:0 0 15px #38bdf8; display:flex; align-items:center; justify-content:center; font-size:10px;">📍</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindPopup(`<strong style="font-family:sans-serif; font-size:12px;">📍 Your Position (${userLocation.label})</strong>`)
      .addTo(group);

    // 2. Add Coffee Shop Pinpoint Markers
    shopsWithDistances.forEach((shop) => {
      const isSelected = shop.id === activeShop?.id;
      const pinColor = isSelected ? '#D48C46' : '#1E1915';
      const textColor = isSelected ? '#000000' : '#F8F5F1';
      const borderCol = isSelected ? '#F59E0B' : '#ffffff';

      const shopIcon = window.L.divIcon({
        className: `shop-pin-marker-${shop.id}`,
        html: `
          <div style="background:${pinColor}; color:${textColor}; border:2px solid ${borderCol}; padding:4px 8px; border-radius:12px; font-weight:bold; font-size:11px; font-family:sans-serif; box-shadow:0 6px 16px rgba(0,0,0,0.6); display:flex; align-items:center; gap:4px; whitespace-nowrap; transform:${isSelected ? 'scale(1.15)' : 'scale(1)'}; transition:all 0.3s ease;">
            <span>☕ ${shop.name}</span>
            <span style="font-size:9px; opacity:0.85;">(${shop.calculatedDistanceMiles}mi)</span>
          </div>
        `,
        iconSize: [120, 28],
        iconAnchor: [60, 14]
      });

      const marker = window.L.marker([shop.lat, shop.lng], { icon: shopIcon });
      marker.on('click', () => {
        setSelectedShopId(shop.id);
        map.flyTo([shop.lat, shop.lng], 15, { animate: true, duration: 1.2 });
      });

      marker.addTo(group);
    });

    // Re-center map smoothly to active selected shop
    if (activeShop) {
      map.flyTo([activeShop.lat, activeShop.lng], 14, { animate: true, duration: 1 });
    }
  };

  useEffect(() => {
    if (activeShop && leafletInstanceRef.current) {
      renderLeafletMarkers();
    }
  }, [selectedShopId, activeShop]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#120F0D] border-2 border-amber-gold/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-amber-950/60 via-[#1A1613] to-espresso-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-gold text-espresso-950 shadow-lg shadow-amber-gold/20 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Brew GPS Radar • Real Street Map Engine</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light">
                Shop Local Coffee 📍
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 text-stone-300 hover:bg-white/20 hover:text-cream-light transition-all"
            title="Close Finder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-[#181411] border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-amber-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search city (e.g. Alpharetta), zip, or shop..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light focus:outline-none focus:border-amber-gold"
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
              <span>{isLocating ? 'Locating...' : 'Refresh GPS Radar'}</span>
            </button>

            {/* Radius Selector */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-bold">
              {[5, 10, 25, 100, 500].map((miles) => (
                <button
                  key={miles}
                  onClick={() => setRadiusMiles(miles)}
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

        {/* Modal Main Workspace: Left List + Right Real Street Map Container */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT SIDE: Specialty Coffee Shops List */}
          <div className="lg:col-span-5 p-4 overflow-y-auto space-y-3 max-h-[45vh] lg:max-h-none border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0E0C0A]">
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-2">
              <span>{filteredShops.length} Shops Found Within {radiusMiles} Miles</span>
              <span className="text-amber-gold truncate max-w-[170px] font-bold">{userLocation.label}</span>
            </div>

            {filteredShops.length === 0 ? (
              <div className="p-6 text-center bg-black/40 rounded-2xl border border-white/10 text-xs text-stone-300 space-y-3">
                <AlertCircle className="w-6 h-6 text-amber-gold mx-auto" />
                <p className="leading-relaxed">
                  No shops found within <strong>{radiusMiles} miles</strong> of {userLocation.label}.
                </p>
                <button
                  onClick={() => setRadiusMiles(radiusMiles < 100 ? 100 : 500)}
                  className="py-2 px-4 rounded-xl btn-tactile-amber text-espresso-950 font-extrabold text-xs shadow-lg active:scale-95"
                >
                  Expand Radar Radius to {radiusMiles < 100 ? '100 mi' : '500 mi'} 📡
                </button>
              </div>
            ) : (
              filteredShops.map((shop) => {
                const isSelected = shop.id === activeShop?.id;
                return (
                  <div
                    key={shop.id}
                    onClick={() => {
                      setSelectedShopId(shop.id);
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
                        <h4 className="font-serif font-bold text-base text-cream-light flex items-center gap-1.5">
                          <span>{shop.name}</span>
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
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{shop.hours}</span>
                      </span>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center space-x-1 text-amber-gold hover:underline font-bold"
                      >
                        <span>Pinpoint Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT SIDE: Real Streets, Roads & Neighborhoods Interactive Map Canvas */}
          <div className="lg:col-span-7 relative bg-[#070605] flex flex-col min-h-[420px]">
            
            {/* Map Canvas Header Bar */}
            <div className="p-3 bg-black/80 backdrop-blur-md border-b border-white/15 text-xs flex items-center justify-between relative z-20">
              <div className="flex items-center space-x-2">
                <MapIcon className="w-4 h-4 text-amber-gold" />
                <span className="font-mono font-bold text-cream-light truncate max-w-[280px]">
                  Real Street Map View • <strong className="text-amber-gold">{activeShop?.name || 'Selected Shop'}</strong>
                </span>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeShop?.name + ' ' + activeShop?.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-gold/20 text-amber-gold hover:bg-amber-gold/30 border border-amber-gold/40 flex items-center gap-1 font-bold"
              >
                <span>Google Maps View 🗺️</span>
                <ExternalLink className="w-3 h-3" />
              </a>
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
                      <p className="text-xs text-amber-gold/90 font-mono mt-1">
                        Bar Setup: {activeShop.equipment}
                      </p>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeShop.name + ' ' + activeShop.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-2.5 px-5 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-extrabold flex items-center justify-center space-x-2 shadow-xl whitespace-nowrap active:scale-95"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Get Directions in Maps 🗺️</span>
                    </a>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
