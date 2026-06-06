// src/components/SaleBanner.jsx (or wherever you store your components)
const SaleBanner = () => {
  return (
    <section className="py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-center px-10">
      <p className="text-sm p-2">
        Summer Sale: Save up to 40% on select items.{" "}
        <span className="text-red-500 font-bold shimmer">Limited-time offer!</span>
      </p>

      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0.2) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
};

  
export default SaleBanner;
  