'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecommendationStore } from 'store/recommendation/useRecommendationStore';
import { ProductCard } from 'app/components/ProductCard/ProductCard';
import Button from 'app/components/Button/Button';

const RecommendedProducts = () => {
  const recommendations = useRecommendationStore(state => state.recommendations);
  const loading = useRecommendationStore(state => state.loading);
  const error = useRecommendationStore(state => state.error);
  const fetchRecommendations = useRecommendationStore(state => state.fetchRecommendations);

  // Track how many products to display
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (!recommendations?.length) fetchRecommendations();
  }, [recommendations, fetchRecommendations]);

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading recommendations...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!recommendations?.length) return <div className="text-center mt-10 text-gray-600">No recommendations available.</div>;

  const displayedRecommendations = recommendations.slice(0, visibleCount);

  const handleToggle = () => {
    if (visibleCount >= recommendations.length) {
      setVisibleCount(5); // Collapse
    } else {
      setVisibleCount(prev => Math.min(prev + 5, recommendations.length)); // Show next batch
    }
  };

  const buttonLabel = visibleCount >= recommendations.length ? 'Show Less' : 'Show More';

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Recommended for You
        </h3>
        <span className="px-2 py-1 text-xs rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          Personalized Picks
        </span>
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5"
      >
        <AnimatePresence>
          {displayedRecommendations.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard
                id={item.id}
                productName={item.productName}
                description={item.description}
                image={item.images?.[0]?.url || "/placeholder.png"}
                priceInKobo={item.priceInKobo}
                rating={item.rating}
                unitType={item.unitType || 'each'}
                isFavorite={item.isFavorite || false}
                discount={item.discount}
                stock={item.stock}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {recommendations.length > 5 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="px-6 py-2 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
            onClick={handleToggle}
          >
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendedProducts;
