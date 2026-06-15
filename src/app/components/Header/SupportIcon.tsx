"use client";

import React from 'react';
import Link from 'next/link';
import { Headset } from 'lucide-react'; // Clean customer care headset icon

export default function SupportIcon() {
  return (
    <Link 
      href="/support" 
      className="relative text-2xl text-gray-700 block"
      aria-label="Contact Customer Support"
    >
      <div className="group flex items-center mr-5 relative cursor-pointer">
        
        {/* Icon Wrapper Layer matching your cart style */}
        <div className="p-2 rounded-md transition-all duration-300 group-hover:bg-gray-200">
          <Headset className="w-[22px] h-[22px] text-gray-700" />
        </div>

      </div>
    </Link>
  );
}