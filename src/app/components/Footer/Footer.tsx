"use client";
import { useEffect, useState } from "react";
import WebsiteQrCode from "../ui/Scanner";
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const [usefulLink, setUsefulLink] = useState<string[]>([]);
  const [information, setInformation] = useState<string[]>([]);

  const desktopText = "GSS GWAGWALADA";

  useEffect(() => {
    setUsefulLink(['Featured', 'Weekly Deals', 'Seasonal Specials', 'Customer Favorite']);
    setInformation(['About Us', 'Terms & Conditions', 'Privacy Policy', 'Refund Policy', 'Delivery Information']);
  }, []);

  return (
    <>
      <footer className="bg-gradient-to-r from-blue-900 to-blue-500 pt-12 pb-6 px-6 md:px-12 font-[sans-serif] tracking-wide text-white">
        <div className="max-w-screen-xl mx-auto">
          {/* Main Grid Layout - Balanced with 3 Columns on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* COLUMN 1: Brand, QR Placement, & Socials */}
            <div className="flex flex-col space-y-5">
              <Link href="/" className="max-sm:hidden flex items-center gap-2">
                <img src="/images/gss-logo.png" alt="logo" className="w-6" />
                <p className="text-lg font-extrabold text-white">
                  {desktopText}
                  <span className="text-blue-300 font-medium ml-1">CONNECT</span>
                </p>
              </Link>

              {/* Downsized QR Code wrapper - Nested cleanly inside Column 1 */}
              <div className="hidden md:flex flex-col items-start bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10 max-w-[150px]">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-blue-200 mb-1.5">Shop on Mobile</p>
                <div className="p-1.5 bg-white rounded-lg inline-block transform scale-90 origin-top-left">
                  <WebsiteQrCode />
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-200 mb-3 font-medium">Connect with us</p>
                <ul className="flex space-x-6">
                  <li>
                    <a href="javascript:void(0)">
                      <svg xmlns="http://www.w3.org/2000/svg" className="fill-gray-300 hover:fill-white w-7 h-7" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7v-7h-2v-3h2V8.5A3.5 3.5 0 0 1 15.5 5H18v3h-2a1 1 0 0 0-1 1v2h3v3h-3v7h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">
                      <svg xmlns="http://www.w3.org/2000/svg" className="fill-gray-300 hover:fill-white w-7 h-7" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zm-2.5 8.2v5.3h-2.79v-4.93a1.4 1.4 0 0 0-1.4-1.4c-.77 0-1.39.63-1.39 1.4v4.93h-2.79v-8.37h2.79v1.11c.48-.78 1.47-1.3 2.32-1.3 1.8 0 3.26 1.46 3.26 3.26zM6.88 8.56a1.686 1.686 0 0 0 0-3.37 1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 1.57v8.37H5.5v-8.37h2.77z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="fill-gray-300 hover:fill-white w-7 h-7" viewBox="0 0 24 24">
                        <path d="M22.92 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.83 4.5 17.72 4 16.46 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.9 20.29 6.16 21 8.58 21c7.88 0 12.21-6.54 12.21-12.21 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* COLUMN 2: Useful Links */}
            <div>
              <h4 className="text-lg mb-6 text-white font-medium">Useful links</h4>
              <ul className="space-y-4 pl-2">
                {usefulLink.map((value, index) => (
                  <li key={index} className="text-gray-300 text-sm hover:underline hover:text-white cursor-pointer">
                    {value}
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: Information */}
            <div>
              <h4 className="text-lg mb-6 text-white font-medium">Information</h4>
              <ul className="space-y-4 pl-2">
                {information.map((value, index) => (
                  <li key={index} className="text-gray-300 text-sm hover:underline hover:text-white cursor-pointer">
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="border-white/10 mt-10 my-4" />

          <p className='text-gray-300 text-sm'>
            © {new Date().getFullYear()} Gss Gwagwalada Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;