import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { CustomerReview } from '../types';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <section id="loved-by-coffee-drinkers-section" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#12100E]/15">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-[10px] uppercase tracking-[0.26em] font-mono text-[#C5A059]">
            <span className="w-5 h-[1px] bg-[#C5A059]" />
            <span>COMMUNITY DISPATCHES</span>
            <span className="w-5 h-[1px] bg-[#C5A059]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[#12100E] uppercase tracking-tight">
            Loved By Coffee Drinkers
          </h2>

          <p className="text-xs sm:text-sm text-[#12100E]/70 font-normal leading-relaxed">
            Real notes from daily ritualists, home espresso tinkerers, and filter coffee obsessives.
          </p>
        </div>

        {/* Reviews Grid (Bauhaus Hairline Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#FDFBF7] p-6 sm:p-7 border border-[#12100E]/15 hover:border-[#12100E] transition-all duration-300 flex flex-col justify-between space-y-6 relative group"
            >
              <Quote className="w-7 h-7 text-[#12100E]/10 absolute top-5 right-5 pointer-events-none group-hover:text-[#D62828]/25 transition-colors" />

              <div className="space-y-3">
                {/* 5-Star Indicator */}
                <div className="flex items-center space-x-1 text-[#C5A059]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059]" />
                  ))}
                </div>

                {/* Review Title */}
                <h3 className="text-base sm:text-lg font-editorial font-bold text-[#12100E] leading-snug">
                  "{review.title}"
                </h3>

                {/* Review Body */}
                <p className="text-xs text-[#12100E]/75 leading-relaxed font-normal">
                  {review.comment}
                </p>
              </div>

              {/* Author & Product Tag Footer (Zero pills) */}
              <div className="pt-4 border-t border-[#12100E]/15 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold text-[#12100E]">{review.author}</span>
                    {review.verified && (
                      <span className="text-[#C5A059]" title="Verified Drinker">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#69574A]">{review.location}</span>
                </div>

                <span className="text-[9px] font-mono uppercase tracking-wider text-[#12100E] bg-[#FAF7F2] border border-[#12100E]/20 px-2 py-0.5 font-bold">
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
