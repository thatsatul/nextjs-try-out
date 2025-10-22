'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const InfiniteScrollList = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const addMoreNumbers = useCallback(() => {
    setLoading(true);
    const lastNumber = numbers.length > 0 ? numbers[numbers.length - 1] : 0;
    const newNumbers = Array.from(
      { length: 100 },
      (_, i) => lastNumber + i + 1
    );
    setNumbers(prev => [...prev, ...newNumbers]);
    setLoading(false);
  }, [numbers]);

  useEffect(() => {
    // Initial load of first 100 numbers
    addMoreNumbers();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          addMoreNumbers();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, numbers, addMoreNumbers]);

  return (
    <div className="p-4">
      <div className="space-y-2">
        {numbers.map((number) => (
          <div
            key={number}
            className="p-2 bg-gray-100 rounded shadow"
          >
            {number}
          </div>
        ))}
      </div>
      <div ref={observerTarget} className="h-10 flex items-center justify-center">
        {loading ? 'Loading more...' : 'Scroll for more'}
      </div>
    </div>
  );
};
