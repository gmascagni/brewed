import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Search, Coffee, Compass, ExternalLink, X, Sliders, CheckCircle2, ShieldCheck, Sparkles, Phone, Clock } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

// Sample Specialty Coffee Shops Database with Real World Top Rated Shops
const SAMPLE_SHOPS_DB = [
  {
    id: 'shop_onyx_bentonville',
    name: 'Onyx Coffee Lab HQ',
    city: 'Bentonville',
    state: 'AR',
    zip: '72712',
    address: '101 E Central Ave, Bentonville, AR',
    lat: 36.3729,
    lng: -94.2088,
    rating: 4.9,
    reviewsCount: 380,
    distanceMiles: 1.2,
    isOpen: true,
    hours: '7:00 AM - 6:00 PM',
    phone: '(479) 715-6448',
    specialtyGrade: 'SCA 90+ Micro-Lots',
    equipment: 'Modbar Steam, Fellow Ode, Hario V60 Bar',
    photo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80',
    description: 'World-renowned specialty roaster featuring single-origin espresso flights, precision pour-over bar, and artisan pastries.'
  },
  {
    id: 'shop_stumptown_pdx',
    name: 'Stumptown Coffee Roasters',
    city: 'Portland',
    state: 'OR',
    zip: '97214',
    address: '1026 SE Division St, Portland, OR',
    lat: 45.5048,
    lng: -122.6552,
    rating: 4.8,
    reviewsCount: 520,
    distanceMiles: 2.4,
    isOpen: true,
    hours: '6:30 AM - 7:00 PM',
    phone: '(503) 230-7797',
    specialtyGrade: 'Direct Trade Origin Roasters',
    equipment: 'La Marzocco Strada, Mazzer Robur S',
    photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop&q=80',
    description: 'Pioneer of specialty third-wave coffee featuring Hair Bender espresso, cold brew on draft, and single-origin tastings.'
  },
  {
    id: 'shop_sey_brooklyn',
    name: 'Sey Coffee Roasters',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11237',
    address: '18 Grattan St, Brooklyn, NY',
    lat: 40.7051,
    lng: -73.9332,
    rating: 4.9,
    reviewsCount: 410,
    distanceMiles: 3.1,
    isOpen: true,
    hours: '7:00 AM - 5:00 PM',
    phone: '(347) 889-7390',
    specialtyGrade: 'Scandinavian Ultra-Light Nordic Roasts',
    equipment: 'Synesso MVP Hydra, Mahlkönig EK43',
    photo: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&auto=format&fit=crop&q=80',
    description: 'Light-filled greenhouse cafe dedicated to delicate, high-elevation washed Nordic roasts and crystal-clear pour-overs.'
  },
  {
    id: 'shop_sightglass_sf',
    name: 'Sightglass Coffee flagship',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    address: '270 7th St, San Francisco, CA',
    lat: 37.7771,
    lng: -122.4086,
    rating: 4.8,
    reviewsCount: 610,
    distanceMiles: 4.0,
    isOpen: true,
    hours: '7:00 AM - 6:00 PM',
    phone: '(415) 861-1313',
    specialtyGrade: 'Probat Vintage Roaster & Slow Bar',
    equipment: 'La Marzocco Linea PB, Chemex Bar',
    photo: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&auto=format&fit=crop&q=80',
    description: 'Massive open-concept roastery with an upstairs slow pour-over bar, affogato station, and fresh seasonal microlots.'
  },
  {
    id: 'shop_verve_santa_cruz',
    name: 'Verve Coffee Roasters',
    city: 'Santa Cruz',
    state: 'CA',
    zip: '95062',
    address: '1540 Pacific Ave, Santa Cruz, CA',
    lat: 36.9741,
    lng: -122.0263,
    rating: 4.7,
    reviewsCount: 290,
    distanceMiles: 5.5,
    isOpen: true,
    hours: '6:00 AM - 6:00 PM',
    phone: '(831) 600-7784',
    specialtyGrade: 'Farmlevel Direct Trade',
    equipment: 'Kees van der Westen Spirit, Slayer Espresso',
    photo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop&q=80',
    description: 'Coastal California third-wave craft coffee featuring Streetlevel espresso, craft matcha, and seasonal pour-overs.'
  },
  {
    id: 'shop_monmouth_london',
    name: 'Monmouth Coffee Company',
    city: 'London',
    state: 'UK',
    zip: 'WC2H 9EU',
    address: '27 Monmouth St, Covent Garden, London',
    lat: 51.5135,
    lng: -0.1265,
    rating: 4.9,
    reviewsCount: 890,
    distanceMiles: 7.2,
    isOpen: true,
    hours: '8:00 AM - 6:00 PM',
    phone: '+44 20 7232 3010',
    specialtyGrade: 'Single Estate Artisan Filter & Espresso',
    equipment: 'Custom Drip Bar, Vintage Burr Mills',
    photo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    description: 'Historic London specialty coffee destination offering daily bean tastings, filter brews, and fresh whole bean sacks.'
  }
];

export default function LocalCoffeeFinderModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusMiles, setRadiusMiles] = useState(10);
  const [selectedShopId, setSelectedShopId] = useState(SAMPLE_SHOPS_DB[0].id);

  // Request Browser Geolocation
  const handleGetLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: 'Your Current Location 📍'
          });
          setIsLocating(false);
          trackEvent('find_local_coffee_geo_success', { lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.warn('Geolocation access denied or timed out:', error);
          setIsLocating(false);
          setUserLocation({
            lat: 36.3729,
            lng: -94.2088,
            label: 'Bentonville Specialty Hub (Default)'
          });
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      setUserLocation({
        lat: 36.3729,
        lng: -94.2088,
        label: 'Specialty Coffee Hub'
      });
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  // Filter shops by search query & radius
  const filteredShops = SAMPLE_SHOPS_DB.filter((shop) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return shop.distanceMiles <= radiusMiles;
    return (
      shop.name.toLowerCase().includes(q) ||
      shop.city.toLowerCase().includes(q) ||
      shop.address.toLowerCase().includes(q) ||
      shop.specialtyGrade.toLowerCase().includes(q)
    );
  });

  const activeShop = SAMPLE_SHOPS_DB.find((s) => s.id === selectedShopId) || SAMPLE_SHOPS_DB[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#120F0D] border-2 border-amber-gold/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-amber-950/60 via-[#1A1613] to-espresso-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-gold text-espresso-950 shadow-lg shadow-amber-gold/20 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Brew GPS • Specialty Coffee Finder</span>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, zip, or shop name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light focus:outline-none focus:border-amber-gold"
            />
          </div>

          {/* Location Trigger & Radius Controls */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end text-xs">
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-gold/40 text-amber-gold font-bold hover:bg-amber-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Detect GPS'}</span>
            </button>

            {/* Radius Selector */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-bold">
              {[5, 10, 20, 50].map((miles) => (
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

        {/* Modal Main Workspace: Left List + Right Interactive Map Container */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Specialty Coffee Shops Cards List */}
          <div className="lg:col-span-5 p-4 overflow-y-auto space-y-3 max-h-[50vh] lg:max-h-none border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-2">
              <span>Found {filteredShops.length} Coffee Shops ({radiusMiles} mi radius)</span>
              {userLocation && <span className="text-amber-gold truncate max-w-[180px]">{userLocation.label}</span>}
            </div>

            {filteredShops.length === 0 ? (
              <div className="p-8 text-center bg-black/30 rounded-2xl border border-white/10 text-xs text-stone-400">
                No specialty coffee shops found matching your radius search. Try expanding your radius miles above!
              </div>
            ) : (
              filteredShops.map((shop) => {
                const isSelected = shop.id === selectedShopId;
                return (
                  <div
                    key={shop.id}
                    onClick={() => setSelectedShopId(shop.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-gold ring-1 ring-amber-gold/40 shadow-xl'
                        : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-black/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-serif font-bold text-base text-cream-light flex items-center gap-1.5">
                          <span>{shop.name}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {shop.distanceMiles} mi
                          </span>
                        </h4>
                        <p className="text-xs text-stone-400">{shop.address}</p>
                      </div>

                      <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-gold/20 text-amber-gold border border-amber-gold/40 text-xs font-mono font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-gold text-amber-gold" />
                        <span>{shop.rating}</span>
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
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Interactive Map Display & Details Overlay */}
          <div className="lg:col-span-7 relative bg-[#0A0807] flex flex-col min-h-[350px]">
            
            {/* Visual Vector Map Container */}
            <div className="relative flex-1 bg-espresso-950 p-6 flex flex-col justify-between overflow-hidden">
              
              {/* Map Radial Backdrop Grid Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(#d48c46_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Map Center Location Status Header */}
              <div className="relative z-10 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-amber-gold animate-bounce" />
                  <span className="font-mono font-bold text-cream-light">
                    Viewing Map Radar: <strong className="text-amber-gold">{activeShop.name}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30">
                  {radiusMiles} Mile Radar Active
                </span>
              </div>

              {/* Interactive Coffee Pin Markers Grid Simulation */}
              <div className="relative z-10 my-8 py-10 flex flex-wrap items-center justify-center gap-6">
                {SAMPLE_SHOPS_DB.map((shop) => {
                  const isSelected = shop.id === activeShop.id;
                  return (
                    <button
                      key={shop.id}
                      onClick={() => setSelectedShopId(shop.id)}
                      className={`p-3 rounded-2xl border transition-all flex items-center space-x-2 ${
                        isSelected
                          ? 'bg-amber-gold text-espresso-950 border-amber-gold ring-4 ring-amber-gold/40 scale-110 shadow-2xl font-extrabold'
                          : 'bg-black/80 border-white/20 text-cream-light hover:border-amber-gold/60 hover:scale-105'
                      }`}
                    >
                      <Coffee className="w-4 h-4" />
                      <span className="text-xs font-bold whitespace-nowrap">{shop.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-gold border border-amber-gold/30">
                        {shop.rating} ★
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Shop Full Details Card Banner */}
              <div className="relative z-10 p-5 rounded-2xl bg-black/85 backdrop-blur-xl border-2 border-amber-gold/50 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40">
                        {activeShop?.specialtyGrade || 'Specialty Coffee Bar'}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">{activeShop?.phone || ''}</span>
                    </div>

                    <h3 className="font-serif text-xl font-extrabold text-cream-light">
                      {activeShop?.name || 'Local Specialty Coffee Shop'}
                    </h3>
                    <p className="text-xs text-stone-300">{activeShop?.address || ''}</p>
                    <p className="text-xs text-amber-gold/90 font-mono mt-1">
                      Gear & Bar Setup: {activeShop?.equipment || 'Espresso Bar'}
                    </p>
                  </div>

                  {activeShop && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeShop.name + ' ' + activeShop.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3 px-6 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-extrabold flex items-center justify-center space-x-2 shadow-xl whitespace-nowrap active:scale-95"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Get Directions in Maps 🗺️</span>
                    </a>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
