"use client";

import {
  X,
  LogOut,
  Home,
  Info,
  Package,
  Phone,
  User,
  ShoppingCart,
  Headset,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "store/ui/useUiStore";
import { useAuthStore } from "store/auth/useAuthStore";
import { motion, Variants } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: Info },
  { to: "/products", label: "Products", icon: Package },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/customer-support", label: "Support", icon: Headset }, // 👈 Added Customer Support
];

const listVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
  }),
};

const MobileSidebar = () => {
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] w-[80vw] max-w-[320px] bg-white shadow-2xl z-[100] p-6 rounded-tr-3xl rounded-br-3xl border border-green-100 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:hidden`}
    >
      {/* Top Section */}
      <div>
        {/* Close Button */}
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* User Header */}
        {authUser && (
          <div className="flex items-center gap-4 mb-8 mt-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center text-green-700 font-bold text-lg shadow-inner">
              {authUser.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{authUser.username}</p>
              <p className="text-sm text-gray-600 truncate">{authUser.email}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={`space-y-2 ${
            authUser ? "" : "mt-12"
          } flex flex-col justify-start`}
        >
          {navLinks.map(({ to, label, icon: Icon }, i) => {
            const isActive = pathname === to;
            return (
              <motion.div
                key={to}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={listVariants}
              >
                <Link
                  href={to}
                  onClick={closeSidebar}
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-md scale-[1.02]"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-green-600"
                    }`}
                  />
                  {label}
                </Link>
              </motion.div>
            );
          })}

          {/* Auth Links */}
          {authUser ? (
            <>
              <motion.div
                custom={navLinks.length}
                initial="hidden"
                animate="visible"
                variants={listVariants}
              >
                <Link
                  href="/cart"
                  onClick={closeSidebar}
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname === "/cart"
                      ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-md scale-[1.02]"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <ShoppingCart
                    className={`w-5 h-5 ${
                      pathname === "/cart" ? "text-white" : "text-green-600"
                    }`}
                  />
                  Cart
                </Link>
              </motion.div>

              <motion.div
                custom={navLinks.length + 1}
                initial="hidden"
                animate="visible"
                variants={listVariants}
              >
                <Link
                  href="/account"
                  onClick={closeSidebar}
                  className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname === "/account"
                      ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-md scale-[1.02]"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <User
                    className={`w-5 h-5 ${
                      pathname === "/account" ? "text-white" : "text-green-600"
                    }`}
                  />
                  Account
                </Link>
              </motion.div>
            </>
          ) : (
            <motion.div
              custom={navLinks.length + 2}
              initial="hidden"
              animate="visible"
              variants={listVariants}
            >
              <Link
                href="/login"
                onClick={closeSidebar}
                className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === "/login"
                    ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-md scale-[1.02]"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <User
                  className={`w-5 h-5 ${
                    pathname === "/login" ? "text-white" : "text-green-600"
                  }`}
                />
                Login
              </Link>
            </motion.div>
          )}
        </nav>
      </div>

      {/* Logout */}
      {authUser && (
        <div className="mt-4 pt-4 border-t border-green-100">
          <motion.button
            custom={navLinks.length + 3}
            initial="hidden"
            animate="visible"
            variants={listVariants}
            onClick={() => {
              logout();
              closeSidebar();
            }}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      )}
    </aside>
  );
};

export default MobileSidebar;
