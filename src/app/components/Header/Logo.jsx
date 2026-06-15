'use client'; // 💡 Required to read the current route path in Next.js

import Link from "next/link";
import { usePathname } from "next/navigation";

const Logo = () => {
  const pathname = usePathname();
  
  // 🔍 Check if the current URL path is the products page
  // (Using .includes handles nested paths like /products/[id] too)
  const isProductsPage = pathname?.includes("/products");

  // Determine what text to render
  const desktopText = isProductsPage ? "GSS GWAGWA..." : "GSS GWAGWALADA";
  const showConnect = !isProductsPage; // Hide "CONNECT" on products page if desired

  return (
    <>
      {/* Desktop View */}
      <Link href="/" className="max-sm:hidden flex items-center gap-2">
        <img src="/images/gss-logo.png" alt="logo" className="w-6" />
        <p className="text-xl font-extrabold text-gray-800">
          {desktopText}
          {showConnect && (
            <span className="text-[#0070f3] font-medium ml-1">CONNECT</span>
          )}
        </p>
      </Link>

      {/* Mobile View */}
      <Link href="/" className="hidden max-sm:block">
        <p className="text-2xl font-extrabold text-gray-800">
          {desktopText}
          {showConnect && (
            <span className="text-[#0070f3] font-medium ml-1">CONNECT</span>
          )}
        </p>
      </Link>
    </>
  );
};

export default Logo;