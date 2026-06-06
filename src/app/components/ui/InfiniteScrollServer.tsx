"use client";

import { useEffect, useRef } from "react";

interface InfiniteScrollProps<T> {
  items: T[];
  fetchMore?: () => Promise<void>;
  hasMore: boolean;
  isFetching: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  threshold?: number;
  loader?: React.ReactNode;
  className?: string;      // optional grid / wrapper
  rootMargin?: string;     // optional prefetch distance
}

export function InfiniteScrollServer<T>({
  items,
  fetchMore,
  hasMore,
  renderItem,
  threshold = 0.1, // Lower threshold is usually better for sentinels
  loader,
  isFetching,
  className,
  rootMargin = "200px",
}: InfiniteScrollProps<T>) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  
  // ✅ Use Refs to hold the latest state values. 
  // This allows the observer to check the state without being recreated.
  const stateRef = useRef({ isFetching, hasMore, fetchMore });

  useEffect(() => {
    stateRef.current = { isFetching, hasMore, fetchMore };
  }, [isFetching, hasMore, fetchMore]);

  useEffect(() => {
    // Create the observer ONCE
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        const { isFetching: currentFetching, hasMore: currentHasMore, fetchMore: currentFetchMore } = stateRef.current;

        if (target.isIntersecting && currentHasMore && !currentFetching && currentFetchMore) {
          console.log("🟢 STABLE TRIGGER: Fetching more...");
          currentFetchMore();
        }
      },
      { root: null, rootMargin, threshold }
    );

    const currentSentinel = bottomRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
      observer.disconnect();
    };
    // ✅ Empty dependency array (or only rootMargin/threshold) 
    // This keeps the observer from disconnecting/reconnecting every time data loads.
  }, [rootMargin, threshold]);

  const content = (
    <>
      {items.map(renderItem)}
    </>
  );

  return (
    <>
      {className ? <div className={className}>{content}</div> : content}
      
      {/* ✅ 2. Sentinel is the anchor point */}
      <div
        ref={bottomRef}
        className="h-1 w-full pointer-events-none" 
        aria-hidden="true"
      />

      {/* ✅ 3. Loader stays at the very bottom, after the sentinel */}
      {isFetching && loader}
    </>
  );
}
