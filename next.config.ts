// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", pathname: "/**" },
//       { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
//       { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
//       { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
//       { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
//     ],
//   },


//   async rewrites() {
//     const backend =
//       process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5001";

//     return [
//       {
//         source: "/api/:path*",
//         destination: `${backend}/api/:path*`, // add `/api` only here, not in env
//       },
//     ];
//   },
// };

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
  },

  async rewrites() {
    let lala = ''
    let envUrl = process.env.NEXT_PUBLIC_SERVER_API_URL || "";
    
    // Clean up any stray quotes, spaces, or duplicate slashes
    envUrl = envUrl.trim().replace(/['"]/g, "");

    // Force the backend URL to use a solid fallback if it's missing or broken
    const backend = (envUrl.startsWith("http://") || envUrl.startsWith("https://"))
      ? envUrl
      : "https://gss-gwagwalada-backend-production.up.railway.app"; 

    return [
      {
        source: "/api/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;