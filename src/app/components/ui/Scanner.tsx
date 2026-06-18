"use client";

import { QRCodeSVG } from "qrcode.react";

export default function WebsiteQrCode() {
  // Replace with your actual ecommerce URL
  const websiteUrl = "https://gssgwagwaladaconnect.netlify.app/"; 

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm max-w-xs mx-auto text-center border">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Scan to Shop</h2>
      <p className="text-sm text-gray-500 mb-4">Open your phone camera to visit our store</p>
      
      {/* This renders a clean, crisp SVG QR code */}
      <div className="bg-white p-3 rounded-xl border border-gray-100">
        <QRCodeSVG 
          value={websiteUrl} 
          size={120} // Size in pixels
          bgColor={"#ffffff"}
          fgColor={"#000000"} // You can change this to match your brand color
          level={"M"} // Error correction level
        />
      </div>
    </div>
  );
}