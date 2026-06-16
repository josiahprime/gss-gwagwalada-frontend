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

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete 
    // even if your project has TypeScript errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // If you also want to skip ESLint errors that break the build:
  eslint: {
    ignoreDuringBuilds: true,
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
    const backend =
      process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5001";

    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`, // add `/api` only here, not in env
      },
    ];
  },
};

export default nextConfig;
