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
    // 1. Check if the environment variable is a valid, non-empty HTTP string
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const isValid = envUrl && envUrl.trim() !== "" && envUrl.startsWith("http");

    // 2. Set the backend based on that strict validation
    const backend = isValid 
      ? envUrl 
      : "https://gss-gwagwalada-backend-production.up.railway.app/api";

    return [
      {
        source: "/api/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;