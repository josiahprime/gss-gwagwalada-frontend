"use client";

import { FiMinimize } from "react-icons/fi";
import {
  IoLanguageOutline,
  IoNotificationsOutline,
  IoChatbubblesOutline,
} from "react-icons/io5";
import { MdDarkMode, MdFormatListBulleted } from "react-icons/md";
import Link from "next/link";
import { useThemeStore } from "store/theme/themeStore";

const Navbar = () => {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);

  const navbarTheme =
  theme === "dark"
    ? `
      bg-gray-900 text-white
      border-b border-gray-800
      shadow-[0_1px_0_rgba(255,255,255,0.04)]
    `
    : `
      bg-white text-gray-900
      border-b border-gray-200
      shadow-md
    `;


  return (
    <div
      className={`
        fixed top-0 left-0 right-0
        h-[50px]
        ${navbarTheme}
        transition-colors duration-500 ease-in-out
        shadow
        flex items-center
        z-50
      `}
    >
      <div className="w-full px-5 flex items-center justify-between">
        <Link href="/" className="uppercase text-xl font-bold">
          Rich<span className="text-green-500">Field</span>
        </Link>

        <div className="flex items-center">
          <div className="flex items-center mr-5">
            <IoLanguageOutline className="text-lg mr-1" />
            English
          </div>

          <MdDarkMode
            className="text-lg mr-5 cursor-pointer hover:opacity-80"
            onClick={toggleTheme}
          />

          <FiMinimize className="text-lg mr-5 cursor-pointer" />

          <Link href="/dashboard/notifications">
            <div className="relative mr-5 cursor-pointer">
              <IoNotificationsOutline className="text-lg" />
            </div>
          </Link>

          <Link href="/dashboard/messages">
            <div className="relative mr-5 cursor-pointer">
              <IoChatbubblesOutline className="text-lg" />
            </div>
          </Link>

          <MdFormatListBulleted className="text-lg mr-5 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
