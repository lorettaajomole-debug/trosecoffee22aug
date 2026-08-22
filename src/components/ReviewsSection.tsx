import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { CustomerReview } from '../types';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <section id="loved-by-coffee-drinkers-section" className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#D63426] font-bold">
            Community Stories
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-[#241712] uppercase tracking-tight">
            Loved By Coffee Drinkers
          </h2>

          <p className="text-xs sm:text-sm text-[#7A6C63] font-normal leading-relaxed">
            Real notes from daily ritualists, home espresso tinkerers, and filter coffee obsessives.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E8DFD5] shadow-xs hover:shadow-xl hover:border-[#D63426]/40 transition-all duration-300 flex flex-col justify-between space-y-6 relative group"
            >
              <Quote className="w-8 h-8 text-[#E8DFD5] absolute top-6 right-6 pointer-events-none group-hover:text-[#D63426]/20 transition-colors" />

              <div className="space-y-3">
                {/* 5-Star Indicator */}
                <div className="flex items-center space-x-1 text-[#E65F38]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E65F38]" />
                  ))}
                </div>

                {/* Review Title */}
                <h3 className="text-base sm:text-lg font-bold text-[#241712] leading-snug">
                  "{review.title}"
                </h3>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-[#7A6C63] leading-relaxed font-normal">
                  {review.comment}
                </p>
              </div>

              {/* Author & Product Tag Footer */}
              <div className="pt-4 border-t border-[#E8DFD5] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-[#241712]">{review.author}</span>
                    {review.verified && (
                      <span className="inline-flex items-center text-[#657953]" title="Verified Coffee Drinker">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#7A6C63]">{review.location}</span>
                </div>

                <span className="text-[10px] uppercase font-mono text-[#241712] bg-[#FAF6F0] border border-[#E8DFD5] px-2.5 py-1 rounded-full font-bold">
                  {review.productName}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

