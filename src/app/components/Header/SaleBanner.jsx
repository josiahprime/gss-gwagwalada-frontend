// src/components/SaleBanner.jsx
const SaleBanner = () => {
  return (
    <section className="py-3 bg-gradient-to-r from-blue-900 to-blue-500 text-white text-center px-10">
      <p className="text-sm p-2">
        Summer Sale: Save up to 40% on select items.{" "}
        <span className="font-bold shimmer">Limited-time offer!</span>
      </p>

      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.2) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </section>
  );
};

export default SaleBanner;