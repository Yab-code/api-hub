import React, { useState } from 'react';

interface Review {
  id: string;
  author: string;
  initials: string;
  stars: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

const REVIEWS: Review[] = [
  { id: '1', author: 'Alex Rivero', initials: 'AR', stars: 5, comment: 'Exceptional API design. The documentation is world-class and the endpoint response times are consistently under 200ms even at scale. Our team has integrated this into 3 production services without a single issue.', date: '2 days ago', helpful: 24, verified: true },
  { id: '2', author: 'Sarah Martinez', initials: 'SM', stars: 4, comment: 'Solid API overall. Rate limiting documentation could be clearer — we hit limits unexpectedly in our testing environment. Support team responded within hours which was impressive.', date: '1 week ago', helpful: 18, verified: true },
  { id: '3', author: 'James Kim', initials: 'JK', stars: 5, comment: "Best-in-class for the category. We benchmarked 6 competitors before choosing this. The webhook delivery is rock-solid with automatic retries and dead letter queues.", date: '2 weeks ago', helpful: 31, verified: false },
  { id: '4', author: 'Priya Patel', initials: 'PP', stars: 3, comment: 'Good feature set but the SDK for Python feels a bit behind. REST API directly works great though. Would love to see better TypeScript types in the official SDK.', date: '3 weeks ago', helpful: 9, verified: true },
];

const RATING_DISTRIBUTION = [
  { stars: 5, pct: 82 },
  { stars: 4, pct: 12 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

type ReviewFilter = 'Latest' | 'Highest Rated' | 'Critical';

const ReviewsRatings: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('Latest');
  const [helpfulVoted, setHelpfulVoted] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [newStars, setNewStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [newComment, setNewComment] = useState('');

  const filtered = [...REVIEWS].filter(r => {
    if (activeFilter === 'Highest Rated') return r.stars >= 4;
    if (activeFilter === 'Critical') return r.stars <= 3;
    return true;
  });

  const handleHelpful = (id: string) => {
    setHelpfulVoted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setNewStars(0);
    setNewComment('');
  };

  return (
    <div className="space-y-xl max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-headline-md text-headline-md text-on-surface">Reviews & Ratings</h1>
        <p className="text-on-surface-variant font-body-md mt-xs">Developer community feedback and experience reports.</p>
      </div>

      {/* Summary Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Overall Rating */}
        <div className="lg:col-span-4 glass-panel border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-widest">Overall Rating</h2>
          <div className="flex items-baseline gap-xs">
            <span className="font-headline-lg text-headline-lg text-on-surface">4.8</span>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant">/5</span>
          </div>
          <div className="flex gap-xs my-md text-primary">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: `'FILL' ${i <= 4 ? 1 : 0}` }}>star</span>
            ))}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl">Based on {REVIEWS.length.toLocaleString()}+ verified developer reviews</p>
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-primary text-on-primary py-md rounded-xl font-bold hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-sm"
          >
            <span className="material-symbols-outlined">rate_review</span>
            Write a Review
          </button>
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-8 glass-panel border border-outline-variant/30 rounded-xl p-xl shadow-sm">
          <h2 className="font-headline-sm text-headline-sm mb-xl text-on-surface">Rating Distribution</h2>
          <div className="space-y-md">
            {RATING_DISTRIBUTION.map(({ stars, pct }) => (
              <div key={stars} className="flex items-center gap-md">
                <span className="w-14 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{stars} {stars === 1 ? 'star' : 'stars'}</span>
                <div className="flex-1 h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${pct > 50 ? 'bg-primary' : pct > 10 ? 'bg-primary/70' : pct > 3 ? 'bg-primary/40' : 'bg-error/50'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 font-body-sm text-body-sm text-right text-on-surface">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        <div className="lg:col-span-8 space-y-lg">
          {/* Filter Chips */}
          <div className="flex items-center justify-between pb-md border-b border-outline-variant/30">
            <div className="flex items-center gap-sm overflow-x-auto">
              {(['Latest', 'Highest Rated', 'Critical'] as ReviewFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-md py-sm rounded-full text-body-sm font-bold transition-all whitespace-nowrap ${activeFilter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-outline-variant/20'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">sort</span>
              <span className="font-body-sm text-body-sm">Sorted by Recency</span>
            </div>
          </div>

          {/* Review Cards */}
          <div className="space-y-lg">
            {filtered.length === 0 ? (
              <div className="py-2xl text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] block mb-sm opacity-30">reviews</span>
                No reviews in this category
              </div>
            ) : filtered.map(review => (
              <div key={review.id} className="glass-panel border border-outline-variant/30 rounded-xl p-lg shadow-sm hover:border-primary/20 transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container border border-outline-variant/20">
                      {review.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-sm">
                        <h4 className="font-bold text-on-surface">{review.author}</h4>
                        {review.verified && (
                          <span className="flex items-center gap-xs bg-emerald-500/10 text-emerald-700 px-sm py-0.5 rounded-full text-[10px] font-bold">
                            <span className="material-symbols-outlined text-[12px]">verified</span>
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex gap-xs text-primary mt-xs">
                        {[1,2,3,4,5].map(i => (
                          <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: `'FILL' ${i <= review.stars ? 1 : 0}` }}>star</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-on-surface-variant text-body-sm">{review.date}</span>
                </div>

                <p className="text-on-surface-variant font-body-md leading-relaxed mb-md">{review.comment}</p>

                <div className="flex items-center gap-sm pt-md border-t border-outline-variant/20">
                  <span className="text-on-surface-variant text-body-sm">Helpful?</span>
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={`flex items-center gap-xs text-body-sm px-sm py-1 rounded-lg transition-colors ${helpfulVoted.has(review.id) ? 'text-primary bg-primary/5' : 'text-on-surface-variant hover:bg-surface-container'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: helpfulVoted.has(review.id) ? "'FILL' 1" : "'FILL' 0" }}>thumb_up</span>
                    {review.helpful + (helpfulVoted.has(review.id) ? 1 : 0)}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button className="px-xl py-sm text-primary font-bold hover:bg-primary/5 rounded-lg transition-colors">
              Load more reviews
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-lg">
          <div className="glass-panel border border-outline-variant/30 rounded-xl p-lg shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-md text-[16px]">Review Highlights</h3>
            <div className="space-y-sm">
              {[
                { label: 'Documentation Quality', score: 4.9 },
                { label: 'Ease of Integration', score: 4.7 },
                { label: 'Response Speed', score: 4.8 },
                { label: 'Support Quality', score: 4.6 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-body-sm mb-xs">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className="font-bold text-on-surface">{item.score}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(item.score / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel border border-primary/20 bg-primary/5 rounded-xl p-lg">
            <h3 className="font-bold text-on-surface mb-xs">Share your experience</h3>
            <p className="text-on-surface-variant text-body-sm mb-md">Your feedback helps developers choose the right tools.</p>
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-primary text-on-primary py-sm rounded-lg font-bold hover:brightness-105 active:scale-95 transition-all text-body-sm"
            >
              Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-sm text-on-surface">Write a Review</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-md">
              <div>
                <label className="block font-body-sm font-bold text-on-surface mb-sm">Your Rating</label>
                <div className="flex gap-sm">
                  {[1,2,3,4,5].map(i => (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHoverStar(i)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setNewStars(i)}
                      className="focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[32px] text-primary transition-transform hover:scale-110" style={{ fontVariationSettings: `'FILL' ${i <= (hoverStar || newStars) ? 1 : 0}` }}>star</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-body-sm font-bold text-on-surface mb-xs">Your Review</label>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Share your experience with this API..."
                  rows={5}
                  required
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-md py-sm text-body-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>
              <div className="flex gap-sm pt-md">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-sm border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                <button type="submit" disabled={newStars === 0} className="flex-1 py-sm bg-primary text-on-primary rounded-xl font-bold hover:brightness-105 active:scale-95 transition-all disabled:opacity-50">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsRatings;
