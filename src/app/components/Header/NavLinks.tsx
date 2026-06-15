"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "store/auth/useAuthStore";
import {
  Home,
  Info,
  Package,
  Phone,
  ShoppingCart,
  Bell,
  User,
  LogIn,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home", icon: <Home className="w-4 h-4 lg:hidden" /> },
  { to: "/about", label: "About", icon: <Info className="w-4 h-4 lg:hidden" /> },
  { to: "/products", label: "Products", icon: <Package className="w-4 h-4 lg:hidden" /> },
  { to: "/contact", label: "Contact", icon: <Phone className="w-4 h-4 lg:hidden" /> },
];

const listVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

export const NavLinks = ({ onClick }: { onClick?: () => void }) => {
  const pathname = usePathname();
  const authUser = useAuthStore((state) => state.authUser);

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 lg:flex-row lg:gap-4"
    >
      {navLinks.map(({ to, label, icon }, i) => (
        <motion.li key={to} custom={i} variants={listVariants}>
          <Link
            href={to}
            onClick={onClick}
            className={`flex items-center text-sm gap-2 px-4 lg:px-2 py-2 rounded-md transition ${
              pathname === to
                ? "text-primary font-semibold bg-gray-100"
                : "text-gray-700 hover:text-primary hover:bg-gray-100"
            }`}
          >
            {icon}
            {label}
          </Link>
        </motion.li>
      ))}

      {/* Mobile-only links */}
      <div className="lg:hidden">
        <motion.li custom={navLinks.length} variants={listVariants}>
          <Link
            href="/cart"
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Cart
          </Link>
        </motion.li>

        {authUser ? (
          <>
            <motion.li custom={navLinks.length + 1} variants={listVariants}>
              <Link
                href="/notifications"
                onClick={onClick}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md"
              >
                <Bell className="w-4 h-4" />
                Notifications
              </Link>
            </motion.li>

            <motion.li custom={navLinks.length + 2} variants={listVariants}>
              <Link
                href="/account"
                onClick={onClick}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md"
              >
                <User className="w-4 h-4" />
                Account
              </Link>
            </motion.li>
          </>
        ) : (
          <motion.li custom={navLinks.length + 3} variants={listVariants}>
            <Link
              href="/login"
              onClick={onClick}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-white hover:bg-primary rounded-md transition"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          </motion.li>
        )}
      </div>
    </motion.ul>
  );
};
