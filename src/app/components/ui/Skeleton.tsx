// components/ui/Skeleton.tsx
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-shimmer bg-gray-200 rounded ${className}`} />
);

export default Skeleton;
