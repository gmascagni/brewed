import React from 'react';
import { ExternalLink, Star, ShoppingBag, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function ProductCard({ product, activeMethod }) {
  const isMethodMatched = product.methodIds && activeMethod && product.methodIds.includes(activeMethod.id);
  const isTopRated = product.topRated || product.rating >= 4.9;

  const handleAmazonClick = () => {
    trackEvent('amazon_click', {
      product_id: product.id,
      product_name: product.name,
      method: activeMethod?.name
    });
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between group shadow-xl hover:-translate-y-1.5 ${
      isMethodMatched
        ? 'bg-amber-500/10 border-amber-400/50 text-cream-light ring-1 ring-amber-400/30 shadow-[0_15px_40px_-10px_rgba(212,140,70,0.2)] backdrop-blur-xl'
        : isTopRated
        ? 'bg-[#181411]/90 border-amber-500/30 text-stone-300 hover:border-amber-400/60 shadow-[0_10px_30px_-10px_rgba(212,140,70,0.15)]'
        : 'bg-[#14110E]/90 border-white/[0.08] text-stone-300 hover:bg-[#1A1613] hover:border-white/20'
    }`}>
      
      <div>
        {/* Card Thumbnail Image & Badges Overlay */}
        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/[0.08] mb-5 relative group/img bg-black/40 flex items-center justify-center">
          {product.image && product.image !== '/' ? (
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 filter brightness-95"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-espresso-950/60 text-amber-gold/60">
              <ShoppingBag className="w-8 h-8 mb-2" />
              <span className="text-[10px] font-mono uppercase tracking-wider">Specialty Gear</span>
            </div>
          )}

          {/* Badge Top Left */}
          {product.badge && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold border border-amber-gold/30 shadow">
              {product.badge}
            </div>
          )}

          {/* Method Match or Top Rated Badge Top Right */}
          {isMethodMatched ? (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-gold text-espresso-950 text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <CheckCircle2 className="w-3 h-3" />
              <span>{activeMethod?.name} Kit</span>
            </div>
          ) : isTopRated ? (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-gold border border-amber-400/40 text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-current text-amber-gold" />
              <span>Top Rated 4.9+</span>
            </div>
          ) : null}
        </div>

        {/* Rating & Price */}
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center space-x-1 text-amber-gold font-mono font-bold">
            <Star className="w-3.5 h-3.5 fill-current text-amber-gold" />
            <span>{product.rating}</span>
            <span className="text-stone-400 font-normal text-[10px]">({product.reviewsCount.toLocaleString()} Amazon ratings)</span>
          </div>

          <span className="font-mono font-bold text-cream-light text-xs bg-white/[0.06] px-2.5 py-0.5 rounded-md border border-white/[0.1]">
            {product.priceRange}
          </span>
        </div>

        {/* Title & Description */}
        <h4 className="font-serif text-lg font-bold text-cream-light mb-2 leading-snug drop-shadow">
          {product.name}
        </h4>

        <p className="text-xs text-stone-400 leading-relaxed mb-4 font-normal">
          {product.description}
        </p>

        {/* Why We Recommend This Contextual Rationale Badge */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[11px] leading-relaxed mb-5">
          <span className="font-extrabold text-amber-gold uppercase tracking-wider block mb-0.5">Why We Recommend This:</span>
          <span className="text-stone-300 font-medium">
            {product.whyWeRecommend || 'Tested for precise thermal retention, extraction clarity, and barista-grade durability.'}
          </span>
        </div>
      </div>

      {/* Button & Amazon Disclosure Tag */}
      <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
        <a
          href={product.amazonUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
          data-product-name={product.name}
          data-link-id={product.id}
          data-context="product_card"
          onClick={handleAmazonClick}
          className="w-full py-3.5 px-5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-102 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Check Price on Amazon</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="text-[9px] font-mono text-center text-stone-500 uppercase tracking-wider">
          As an Amazon Associate, The Brew App earns from qualifying purchases
        </div>
      </div>

    </div>
  );
}
