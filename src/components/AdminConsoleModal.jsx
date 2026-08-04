import React, { useState } from 'react';
import { X, ShieldCheck, UserX, Trash2, Ban, Sparkles, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function AdminConsoleModal({ isOpen, onClose, users, onDeleteUser, posts, onDeletePost }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'posts'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = (users || []).filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = (posts || []).filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative max-w-4xl w-full rounded-3xl bg-[#14110E] border-2 border-rose-500/50 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] text-cream-light">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-stone-300 hover:text-cream-light hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2 text-xs font-mono font-extrabold uppercase tracking-widest text-rose-400 mb-2">
          <ShieldCheck className="w-4 h-4 animate-pulse text-rose-400" />
          <span>Platform Administrator Control Console</span>
        </div>

        <h3 className="font-serif text-2xl md:text-3xl font-bold text-cream-light mb-6 flex items-center gap-3">
          <span>Site Admin Profile & Content Moderation</span>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Admin Mode Active
          </span>
        </h3>

        {/* Search & Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/50 border border-white/10 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2 rounded-xl transition-all ${
                activeTab === 'users' ? 'bg-rose-500 text-cream-light shadow-md' : 'text-stone-400 hover:text-cream-light'
              }`}
            >
              User Profiles ({filteredUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-5 py-2 rounded-xl transition-all ${
                activeTab === 'posts' ? 'bg-rose-500 text-cream-light shadow-md' : 'text-stone-400 hover:text-cream-light'
              }`}
            >
              Community Posts ({filteredPosts.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user or post..."
              className="w-full p-2.5 pl-9 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light focus:outline-none focus:border-rose-400"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Admin Content Area */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
              Registered Platform Profiles
            </div>

            <div className="divide-y divide-white/10 rounded-2xl bg-black/40 border border-white/10 overflow-hidden text-xs">
              {filteredUsers.map((usr) => (
                <div key={usr.username} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img src={usr.avatar} alt={usr.displayName} className="w-10 h-10 rounded-full object-cover border border-amber-gold" />
                    <div>
                      <div className="font-bold text-cream-light text-sm flex items-center gap-2">
                        <span>{usr.displayName}</span>
                        {usr.role === 'admin' && (
                          <span className="text-[9px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400 font-mono">{usr.username} • {usr.email}</div>
                    </div>
                  </div>

                  {usr.role !== 'admin' ? (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete profile ${usr.username}? This action is irreversible.`)) {
                          onDeleteUser(usr.username);
                          trackEvent('admin_delete_user', { username: usr.username });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all font-mono font-bold text-xs flex items-center gap-1.5"
                    >
                      <UserX className="w-4 h-4" />
                      <span>Delete Profile</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-stone-500 italic">Protected Super Admin</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
              Community Forum Posts Moderation
            </div>

            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-serif font-bold text-cream-light text-sm">{post.title}</h4>
                    <span className="text-[10px] font-mono text-stone-400">By {post.author} • {post.categoryLabel}</span>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-1 font-normal">{post.content}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Delete community post "${post.title}"?`)) {
                        onDeletePost(post.id);
                        trackEvent('admin_delete_post', { post_id: post.id });
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all font-mono font-bold text-xs flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Post</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
