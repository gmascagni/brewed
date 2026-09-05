import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Plus, Sparkles, Coffee, Leaf, Tag, Shield, Send, X, ExternalLink, CornerDownRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function BrewMasterCommunity({ currentUser, onOpenAuth }) {
  const [activeForumTab, setActiveForumTab] = useState('coffee'); // 'coffee' | 'tea'
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // 'all' | 'gear' | 'beans' | 'teas' | 'experiences'
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState(null); // Post object for comments modal
  const [commentInput, setCommentInput] = useState('');

  // Mock Forum Posts State with Nested Comments
  const [posts, setPosts] = useState([
    {
      id: 'post_1',
      forum: 'coffee',
      category: 'gear',
      categoryLabel: 'Gear & Instruments',
      title: 'Fellow Stagg EKG Gooseneck vs Hario Buono: Flow-Rate Control Review',
      author: '@barista_clara',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      timeAgo: '2 hours ago',
      content: 'After 6 months of daily V60 pour-overs, the degree-by-degree PID accuracy on the Fellow Stagg EKG made a night-and-day difference for 96°C light roast Ethiopian washed beans compared to standard stove kettles.',
      upvotes: 42,
      isUpvoted: false,
      tags: ['FellowStagg', 'V60', 'GooseneckKettle'],
      comments: [
        {
          id: 'c1_1',
          author: '@roast_master_sam',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          text: 'Completely agree! The counterbalanced handle makes slow 5g/sec spiral pours practically effortless.',
          timeAgo: '1 hour ago'
        },
        {
          id: 'c1_2',
          author: '@tea_master_lin',
          authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          text: 'It is fantastic for delicate green tea and Gongfu Gaiwans at 80°C too.',
          timeAgo: '45 mins ago'
        }
      ]
    },
    {
      id: 'post_2',
      forum: 'coffee',
      category: 'beans',
      categoryLabel: 'Beans & Roasters',
      title: 'Onyx Coffee Lab Tropical Weather (Washed Ethiopia + Anaerobic Colombia)',
      author: '@roast_master_sam',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      timeAgo: '5 hours ago',
      content: 'Mindblowing jasmine aroma with candy-like peach acidity. Highly recommend 1:16.6 ratio at 94°C with a 45-second bloom for maximum extraction clarity.',
      upvotes: 28,
      isUpvoted: false,
      tags: ['OnyxCoffee', 'EthiopiaYirgacheffe', 'SingleOrigin'],
      comments: [
        {
          id: 'c2_1',
          author: '@barista_clara',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          text: 'Tried this batch yesterday! The anaerobic fermentation brings out incredible mango and tropical acidity.',
          timeAgo: '2 hours ago'
        }
      ]
    },
    {
      id: 'post_3',
      forum: 'tea',
      category: 'teas',
      categoryLabel: 'Tea Varietals',
      title: 'Gongfu Steeping High Mountain Alishan Oolong in Porcelain Gaiwan',
      author: '@tea_master_lin',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      timeAgo: '1 day ago',
      content: 'Rolled tea pearls uncurling across 7 steeps. 1st steep flash rinse at 92°C yields buttery cream notes, 3rd steep opens up intense orchid honey floral aromatics.',
      upvotes: 35,
      isUpvoted: false,
      tags: ['AlishanOolong', 'Gaiwan', 'GongfuTea'],
      comments: []
    }
  ]);

  // Create Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('gear');
  const [newContent, setNewContent] = useState('');

  const handleUpvote = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, upvotes: p.isUpvoted ? p.upvotes - 1 : p.upvotes + 1, isUpvoted: !p.isUpvoted }
          : p
      )
    );
    trackEvent('upvote_forum_post', { post_id: postId });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in or create an account to post comments.');
      onOpenAuth();
      return;
    }
    if (!commentInput.trim() || !activeCommentPost) return;

    const newCommentObj = {
      id: `comm_${Date.now()}`,
      author: currentUser.username,
      authorAvatar: currentUser.avatar || '/',
      text: commentInput.trim(),
      timeAgo: 'Just now'
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === activeCommentPost.id
          ? { ...p, comments: [...p.comments, newCommentObj] }
          : p
      )
    );

    setActiveCommentPost((prev) =>
      prev ? { ...prev, comments: [...prev.comments, newCommentObj] } : null
    );

    trackEvent('add_post_comment', { post_id: activeCommentPost.id, author: currentUser.username });
    setCommentInput('');
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in or create an account to publish posts.');
      onOpenAuth();
      return;
    }
    if (!newTitle || !newContent) return;

    const newPostObj = {
      id: `post_${Date.now()}`,
      forum: activeForumTab,
      category: newCategory,
      categoryLabel: newCategory === 'gear' ? 'Gear & Instruments' : newCategory === 'beans' ? 'Beans & Roasters' : newCategory === 'teas' ? 'Tea Varietals' : 'Experiences & Tips',
      title: newTitle,
      author: currentUser.username,
      authorAvatar: currentUser.avatar || '/',
      timeAgo: 'Just now',
      content: newContent,
      upvotes: 1,
      isUpvoted: true,
      tags: [activeForumTab === 'coffee' ? 'CoffeeMaster' : 'TeaMaster'],
      comments: []
    };

    setPosts([newPostObj, ...posts]);
    trackEvent('create_forum_post', { forum: activeForumTab, category: newCategory, author: currentUser.username });
    setNewTitle('');
    setNewContent('');
    setIsCreatePostOpen(false);
  };

  const filteredPosts = posts.filter((p) => {
    if (p.forum !== activeForumTab) return false;
    if (activeCategoryFilter !== 'all' && p.category !== activeCategoryFilter) return false;
    return true;
  });

  return (
    <section id="brew-master-community" className="mt-14 p-7 md:p-10 rounded-3xl glass-panel-amber shadow-2xl transition-all duration-500 relative overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-gold mb-2">
            <Sparkles className="w-4 h-4 animate-pulse text-amber-gold" />
            <span>Exclusive User Group Forum • Brew Master Community</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-cream-light drop-shadow-md">
            The Brew Master Community
          </h2>
          <p className="text-xs md:text-sm text-stone-300 mt-1 max-w-2xl font-normal">
            Share experiences, equipment reviews, bean & tea ratings, and extraction techniques with fellow brew masters worldwide.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                setIsCreatePostOpen(true);
              }
            }}
            className="px-6 py-3.5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Community Post</span>
          </button>
        </div>
      </div>

      {/* Forum Track Switcher: Coffee Lab vs Tea Room */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-black/60 border border-white/10 mb-8 max-w-md mx-auto">
        <button
          onClick={() => setActiveForumTab('coffee')}
          className={`py-3 px-5 rounded-xl font-serif text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeForumTab === 'coffee'
              ? 'bg-amber-gold text-espresso-950 shadow-xl scale-102'
              : 'text-stone-400 hover:text-cream-light'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>The Coffee Lab Forum</span>
        </button>

        <button
          onClick={() => setActiveForumTab('tea')}
          className={`py-3 px-5 rounded-xl font-serif text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeForumTab === 'tea'
              ? 'bg-sage-400 text-espresso-950 shadow-xl scale-102'
              : 'text-stone-400 hover:text-cream-light'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>The Tea Room Forum</span>
        </button>
      </div>

      {/* Forum Category Pills Filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 text-xs font-mono font-bold">
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-4 py-2 rounded-xl border transition-all ${
            activeCategoryFilter === 'all' ? 'bg-amber-gold/20 text-amber-gold border-amber-gold/50' : 'bg-black/40 border-white/10 text-stone-400 hover:text-cream-light'
          }`}
        >
          All Topics
        </button>
        <button
          onClick={() => setActiveCategoryFilter('gear')}
          className={`px-4 py-2 rounded-xl border transition-all ${
            activeCategoryFilter === 'gear' ? 'bg-amber-gold/20 text-amber-gold border-amber-gold/50' : 'bg-black/40 border-white/10 text-stone-400 hover:text-cream-light'
          }`}
        >
          📦 Gear & Instruments
        </button>
        <button
          onClick={() => setActiveCategoryFilter('beans')}
          className={`px-4 py-2 rounded-xl border transition-all ${
            activeCategoryFilter === 'beans' ? 'bg-amber-gold/20 text-amber-gold border-amber-gold/50' : 'bg-black/40 border-white/10 text-stone-400 hover:text-cream-light'
          }`}
        >
          ☕ Beans & Roasters
        </button>
        <button
          onClick={() => setActiveCategoryFilter('teas')}
          className={`px-4 py-2 rounded-xl border transition-all ${
            activeCategoryFilter === 'teas' ? 'bg-amber-gold/20 text-amber-gold border-amber-gold/50' : 'bg-black/40 border-white/10 text-stone-400 hover:text-cream-light'
          }`}
        >
          🍃 Tea Varietals
        </button>
      </div>

      {/* Forum Feed Grid */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-[#14110E]/90 border border-white/10 hover:border-amber-gold/50 shadow-xl transition-all duration-300"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img src={post.authorAvatar} alt={post.author} className="w-9 h-9 rounded-full object-cover border border-amber-gold/40" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-cream-light text-xs">{post.author}</span>
                    <Shield className="w-3.5 h-3.5 text-amber-gold fill-current" />
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{post.timeAgo}</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-gold border border-amber-400/30 text-[10px] font-mono font-bold uppercase">
                {post.categoryLabel}
              </span>
            </div>

            {/* Post Title & Content */}
            <h3 className="font-serif text-lg font-bold text-cream-light mb-2 leading-snug">
              {post.title}
            </h3>

            <p className="text-xs text-stone-300 leading-relaxed mb-4 font-normal">
              {post.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((t) => (
                <span key={t} className="text-[10px] font-mono text-stone-400 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                  #{t}
                </span>
              ))}
            </div>

            {/* Footer Upvote & Comments Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={() => handleUpvote(post.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border transition-all ${
                  post.isUpvoted
                    ? 'bg-amber-gold text-espresso-950 border-amber-gold font-bold'
                    : 'bg-white/5 border-white/10 text-stone-300 hover:text-cream-light'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5 fill-current" />
                <span>{post.upvotes} Upvotes</span>
              </button>

              {/* Interactive Comment Trigger Button */}
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                  } else {
                    setActiveCommentPost(post);
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-gold border border-amber-gold/40 hover:bg-amber-500/30 transition-all font-mono text-xs font-bold shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments.length} Comments • Reply 💬</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Interactive Comments & Discussion Modal */}
      {activeCommentPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative max-w-2xl w-full rounded-3xl bg-[#14110E] border-2 border-amber-gold/50 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-cream-light flex flex-col">
            
            <button
              onClick={() => setActiveCommentPost(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-gold mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Discussion Thread • Brew Master Community</span>
            </div>

            {/* Original Post Header Summary */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 mb-6">
              <h4 className="font-serif text-lg font-bold text-cream-light mb-1">
                {activeCommentPost.title}
              </h4>
              <span className="text-[10px] text-stone-400 font-mono">By {activeCommentPost.author} • {activeCommentPost.timeAgo}</span>
              <p className="text-xs text-stone-300 mt-2 font-normal leading-relaxed">{activeCommentPost.content}</p>
            </div>

            {/* List of Existing Comments */}
            <div className="space-y-3 mb-6 overflow-y-auto max-h-[350px] pr-2">
              <span className="font-mono text-xs text-amber-gold uppercase tracking-wider font-bold block mb-2">
                Discussion Comments ({activeCommentPost.comments.length})
              </span>

              {activeCommentPost.comments.length === 0 ? (
                <div className="p-6 text-center text-stone-500 font-mono text-xs rounded-2xl bg-black/30 border border-white/5">
                  No comments yet. Be the first Brew Master to share your thoughts!
                </div>
              ) : (
                activeCommentPost.comments.map((comm) => (
                  <div key={comm.id} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <img src={comm.authorAvatar} alt={comm.author} className="w-6 h-6 rounded-full object-cover border border-amber-gold/40" />
                      <span className="font-bold text-cream-light text-xs">{comm.author}</span>
                      <span className="text-[9px] text-stone-400 font-mono">• {comm.timeAgo}</span>
                    </div>
                    <p className="text-xs text-stone-300 pl-8 leading-relaxed font-normal">{comm.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input Form */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-4 border-t border-white/10">
              <input
                type="text"
                required
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={`Comment as ${currentUser?.username || 'Guest Barista'}...`}
                className="flex-1 p-3 rounded-xl bg-black/60 border border-white/15 text-cream-light text-xs focus:outline-none focus:border-amber-gold"
              />
              <button
                type="submit"
                className="py-3 px-5 rounded-xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <span>Post</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative max-w-xl w-full rounded-3xl bg-[#14110E] border-2 border-amber-gold/50 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-cream-light">
            
            <button
              onClick={() => setIsCreatePostOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-gold mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Brew Master Community Forum</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-cream-light mb-6">
              Create Community Forum Post
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Topic Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
                >
                  <option value="gear">📦 Gear & Instruments (V60, Kettles, Grinders, Gaiwans)</option>
                  <option value="beans">☕ Coffee Beans & Single-Origin Roasters</option>
                  <option value="teas">🍃 Tea Varietals & High Mountain Teas</option>
                  <option value="experiences">💡 Brewing Tips & Extraction Experiences</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Post Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., Review of Timemore Chestnut C2 Grinder for V60"
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase tracking-wider mb-1.5">Experience & Review Content</label>
                <textarea
                  rows="4"
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share your experience, grind settings, water temp, and flavor notes..."
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-cream-light focus:outline-none focus:border-amber-gold"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all"
              >
                Post to Brew Master Community
              </button>

            </form>

          </div>
        </div>
      )}

    </section>
  );
}
