"use client";

import { useState, useRef, UIEvent } from "react";
import React from "react";

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number; // height of a single item in px
  height: number; // height of the container in px
  renderItem: (item: T, index: number) => React.ReactNode; // ✅ React.ReactNode instead of JSX.Element
}

function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  renderItem,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;

  // Calculate start & end indices of visible items
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(height / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 2, items.length); // +2 buffer

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height, overflowY: "auto", position: "relative" }}
      className="custom-scroll"
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: "absolute",
              top: (startIndex + index) * itemHeight,
              width: "100%",
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualizedList;
