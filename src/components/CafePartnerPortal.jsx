import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Store, 
  Clock, 
  Wrench, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  MapPin, 
  Wifi, 
  Users, 
  ArrowLeft,
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import OnBarSwitcher from './OnBarSwitcher';
import StatWidget from './StatWidget';

const STORAGE_KEY = 'thebrewapp_cafe_portal_v1';

const DEFAULT_CAFE_DATA = {
  cafeName: "Lumen Coffee Roastery & Bar",
  tagline: "Precision Multi-Roaster Espresso & Single-Origin Pour-Over Bar",
  address: "108 N Higgins Ave, Missoula, MT 59802",
  hours: "7:00 AM – 4:00 PM (Daily)",
  equipment: ["Synesso MVP Hydra", "Mahlkönig EK43S", "Mazzer Kony S", "Kalita Wave 185"],
  amenities: {
    wifi: true,
    outdoorSeating: true,
    multiRoaster: true,
    oatMilkFree: true,
    batchBrew: true
  },
  onBarToday: [
    {
      id: 'bar_bean_1',
      beanName: 'Worka Sakaro Natural',
      roaster: 'Methodical Coffee',
      origin: 'Gedeb, Yirgacheffe, Ethiopia',
      category: 'pour_over',
      isOnBar: true
    },
    {
      id: 'bar_bean_2',
      beanName: 'Southern Weather Blend',
      roaster: 'Onyx Coffee Lab',
      origin: 'Colombia & Ethiopia',
      category: 'espresso',
      isOnBar: true
    },
    {
      id: 'bar_bean_3',
      beanName: 'The Future: Anaerobic Cinnamon',
      roaster: 'Black & White Coffee Roasters',
      origin: 'Huila, Colombia',
      category: 'pour_over',
      isOnBar: true
    },
    {
      id: 'bar_bean_4',
      beanName: 'El Paraiso Lychee Gesha',
      roaster: 'Manhattan Coffee Roasters',
      origin: 'Cauca, Colombia',
      category: 'pour_over',
      isOnBar: false
    }
  ],
  events: [
    {
      id: 'event_1',
      title: 'Monthly Public Cupping: African Micro-Lots',
      date: 'Saturday, Oct 14 • 10:00 AM',
      description: 'Blind sensory scoring of 6 washed and natural Ethiopian lots with our head roaster.',
      spotsLeft: 8
    }
  ]
};

export default function CafePartnerPortal({
  isOpen,
  onClose,
  onNavigateToConsumer
}) {
  const [activeTab, setActiveTab] = useState('onbar'); // 'onbar' | 'profile' | 'events'
  const [cafeData, setCafeData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CAFE_DATA;
    } catch {
      return DEFAULT_CAFE_DATA;
    }
  });

  const [saveNotification, setSaveNotification] = useState(false);

  // New bean form state
  const [newBeanName, setNewBeanName] = useState('');
  const [newBeanRoaster, setNewBeanRoaster] = useState('');
  const [newBeanOrigin, setNewBeanOrigin] = useState('');
  const [newBeanCategory, setNewBeanCategory] = useState('pour_over');

  // Save changes to localStorage
  const handleSaveAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cafeData));
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 3000);
    } catch (e) {
      console.error('Error saving cafe portal data:', e);
    }
  };

  const handleToggleOnBar = (id) => {
    setCafeData(prev => ({
      ...prev,
      onBarToday: prev.onBarToday.map(b => 
        b.id === id ? { ...b, isOnBar: !b.isOnBar } : b
      )
    }));
  };

  const handleAddBean = (e) => {
    e.preventDefault();
    if (!newBeanName || !newBeanRoaster) return;

    const newEntry = {
      id: `bar_bean_${Date.now()}`,
      beanName: newBeanName,
      roaster: newBeanRoaster,
      origin: newBeanOrigin || 'Single-Origin',
      category: newBeanCategory,
      isOnBar: true
    };

    setCafeData(prev => ({
      ...prev,
      onBarToday: [newEntry, ...prev.onBarToday]
    }));

    setNewBeanName('');
    setNewBeanRoaster('');
    setNewBeanOrigin('');
  };

  const handleDeleteBean = (id) => {
    setCafeData(prev => ({
      ...prev,
      onBarToday: prev.onBarToday.filter(b => b.id !== id)
    }));
  };

  const activeOnBarCount = cafeData.onBarToday.filter(b => b.isOnBar).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#14110F] pb-20">
      {/* Top B2B Portal Banner */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECE6DC] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose || onNavigateToConsumer}
              className="p-2 rounded-xl text-[#766A62] hover:text-[#14110F] hover:bg-[#FAF7F2] border border-[#ECE6DC] transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit to App</span>
            </button>
            <div className="h-4 w-px bg-[#ECE6DC]" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2F663C] animate-pulse" />
              <h1 className="font-editorial text-lg font-bold text-[#14110F] tracking-tight">
                {cafeData.cafeName}
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F663C] border border-[#C8E0CD] font-bold">
                Cafe Partner Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveNotification && (
              <span className="text-xs font-mono font-bold text-[#2F663C] flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Live Menu Updated!
              </span>
            )}
            <button
              onClick={handleSaveAll}
              className="py-2 px-4 rounded-xl bg-[#14110F] hover:bg-[#2A2421] text-[#FAF7F2] font-sans font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5 text-[#E8AF72]" />
              <span>Save & Publish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Metric Overview Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatWidget
            label="On Bar Today"
            value={`${activeOnBarCount} Lots`}
            subtext="Live on consumer cafe radar"
            icon={Coffee}
          />
          <StatWidget
            label="Current Partner Roasters"
            value="3 Brands"
            subtext="Methodical, Onyx, Black & White"
            icon={Store}
          />
          <StatWidget
            label="Bar Equipment Setup"
            value="4 Machines"
            subtext="Synesso MVP Hydra & EK43S"
            icon={Wrench}
          />
          <StatWidget
            label="Upcoming Cupping"
            value="Oct 14"
            subtext="8 guest seats remaining"
            icon={Calendar}
          />
        </section>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-4">
          <button
            onClick={() => setActiveTab('onbar')}
            className={`py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all ${
              activeTab === 'onbar'
                ? 'bg-[#14110F] text-[#FAF7F2] shadow-sm'
                : 'text-[#766A62] hover:text-[#14110F] hover:bg-white border border-transparent hover:border-[#ECE6DC]'
            }`}
          >
            ☕ "On Bar Today" Menu Switcher
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#14110F] text-[#FAF7F2] shadow-sm'
                : 'text-[#766A62] hover:text-[#14110F] hover:bg-white border border-transparent hover:border-[#ECE6DC]'
            }`}
          >
            ⚙️ Cafe Profile & Gear Configurator
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-2 px-4 rounded-xl font-sans text-xs font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-[#14110F] text-[#FAF7F2] shadow-sm'
                : 'text-[#766A62] hover:text-[#14110F] hover:bg-white border border-transparent hover:border-[#ECE6DC]'
            }`}
          >
            🗓️ Cuppings & Events ({cafeData.events.length})
          </button>
        </div>

        {/* TAB 1: ON BAR TODAY */}
        {activeTab === 'onbar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Live Barista Switcher */}
            <div className="lg:col-span-2 space-y-6">
              <div className="editorial-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#ECE6DC]">
                  <div>
                    <h2 className="font-editorial text-xl font-bold text-[#14110F]">
                      Active Bar Offerings
                    </h2>
                    <p className="text-xs text-[#766A62] font-sans">
                      Toggle beans On/Off as bags run out. Changes instantly appear on the public Cafe Radar.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#2F663C] bg-[#EBF3ED] px-3 py-1 rounded-full border border-[#C8E0CD]">
                    {activeOnBarCount} Active on Menu
                  </span>
                </div>

                <div className="space-y-3">
                  {cafeData.onBarToday.map((bean) => (
                    <div key={bean.id} className="relative group">
                      <OnBarSwitcher
                        beanName={bean.beanName}
                        roaster={bean.roaster}
                        origin={bean.origin}
                        category={bean.category}
                        isOnBar={bean.isOnBar}
                        onToggle={() => handleToggleOnBar(bean.id)}
                      />
                      <button
                        onClick={() => handleDeleteBean(bean.id)}
                        className="absolute right-14 top-1/2 -translate-y-1/2 p-1.5 text-[#8C8178] hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from cafe catalog"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Quick-Add New Lot */}
            <div className="editorial-card p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[#ECE6DC]">
                <Plus className="w-4 h-4 text-[#C88A4B]" />
                <h3 className="font-editorial text-lg font-bold text-[#14110F]">
                  Add Bean to Menu
                </h3>
              </div>

              <form onSubmit={handleAddBean} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5C524B] mb-1">
                    Bean / Micro-Lot Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Worka Sakaro Natural"
                    value={newBeanName}
                    onChange={(e) => setNewBeanName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#14110F] focus:outline-none focus:border-[#C88A4B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5C524B] mb-1">
                    Roaster Partner *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Methodical Coffee"
                    value={newBeanRoaster}
                    onChange={(e) => setNewBeanRoaster(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#14110F] focus:outline-none focus:border-[#C88A4B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5C524B] mb-1">
                    Origin & Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Yirgacheffe, Ethiopia"
                    value={newBeanOrigin}
                    onChange={(e) => setNewBeanOrigin(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#14110F] focus:outline-none focus:border-[#C88A4B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5C524B] mb-1">
                    Station Category
                  </label>
                  <select
                    value={newBeanCategory}
                    onChange={(e) => setNewBeanCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#14110F] focus:outline-none focus:border-[#C88A4B]"
                  >
                    <option value="pour_over">Pour-Over Bar (Filter)</option>
                    <option value="espresso">Espresso Bar</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#14110F] hover:bg-[#2A2421] text-[#FAF7F2] font-sans font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all mt-2"
                >
                  <Plus className="w-4 h-4 text-[#E8AF72]" />
                  <span>Add to Live Roster</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & AMENITIES */}
        {activeTab === 'profile' && (
          <div className="editorial-card p-6 max-w-3xl space-y-6">
            <h2 className="font-editorial text-xl font-bold text-[#14110F] pb-3 border-b border-[#ECE6DC]">
              Cafe Information & Equipment Setup
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C524B] mb-1">
                  Cafe / Shop Name
                </label>
                <input
                  type="text"
                  value={cafeData.cafeName}
                  onChange={(e) => setCafeData({ ...cafeData, cafeName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#14110F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5C524B] mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={cafeData.hours}
                  onChange={(e) => setCafeData({ ...cafeData, hours: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#14110F]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#5C524B] mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={cafeData.address}
                  onChange={(e) => setCafeData({ ...cafeData, address: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#14110F]"
                />
              </div>
            </div>

            {/* Equipment Setup */}
            <div>
              <h3 className="text-xs font-bold text-[#14110F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#C88A4B]" />
                Barista Gear & Machinery Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {cafeData.equipment.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#ECE6DC] text-[#2A2421] font-medium"
                  >
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <h3 className="text-xs font-bold text-[#14110F] uppercase tracking-wider mb-3">
                Cafe Amenities (Consumer Filter Badges)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(cafeData.amenities).map(([key, val]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-xs font-medium cursor-pointer hover:border-[#C88A4B] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) =>
                        setCafeData({
                          ...cafeData,
                          amenities: { ...cafeData.amenities, [key]: e.target.checked }
                        })
                      }
                      className="rounded text-[#C88A4B] focus:ring-[#C88A4B]"
                    />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUPPINGS & EVENTS */}
        {activeTab === 'events' && (
          <div className="editorial-card p-6 max-w-3xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DC]">
              <div>
                <h2 className="font-editorial text-xl font-bold text-[#14110F]">
                  Public Cuppings & Community Events
                </h2>
                <p className="text-xs text-[#766A62]">
                  Publish upcoming cupping tables, sensory labs, and latte art throwdowns to the community calendar.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {cafeData.events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-[#A8622D] bg-[#F5E8D4]/60 px-2 py-0.5 rounded-md border border-[#EBCFA9]">
                      {evt.date}
                    </span>
                    <h4 className="font-editorial text-base font-bold text-[#14110F]">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-[#766A62]">
                      {evt.description}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#2F663C] bg-[#EBF3ED] px-2.5 py-1 rounded-lg border border-[#C8E0CD]">
                      {evt.spotsLeft} spots
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
