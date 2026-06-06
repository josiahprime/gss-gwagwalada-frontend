"use client";
import { ReactNode, useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { FaUser, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { formatCurrency } from "utils/FormatCurrency";
import { useThemeStore } from "store/theme/themeStore";

interface WidgetProps {
  type: "user" | "order" | "earning" | "completed";
  value: number;
  diff?: number;
}

const Widget = ({ type, value, diff = 0 }: WidgetProps) => {
  const theme = useThemeStore((s) => s.theme);
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, latest => Math.floor(latest));

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.8, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  let data: { title: string; isMoney: boolean; link: string; icon: ReactNode } = {
    title: "N/A",
    isMoney: false,
    link: "",
    icon: <></>,
  };

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        icon: (
          <FaUser
            className="text-[18px] p-2 rounded-md self-end"
            style={{ color: "crimson", backgroundColor: "rgba(255, 0, 0, 0.2)" }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        isMoney: false,
        link: "View all orders",
        icon: (
          <FaShoppingCart
            className="text-[18px] p-2 rounded-md self-end"
            style={{ color: "goldenrod", backgroundColor: "rgba(218, 165, 32, 0.2)" }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <FaDollarSign
            className="text-[18px] p-2 rounded-md self-end"
            style={{ color: "green", backgroundColor: "rgba(0, 128, 0, 0.2)" }}
          />
        ),
      };
      break;
    case "completed":
      data = {
        title: "COMPLETED ORDERS",
        isMoney: false,
        link: "View completed orders",
        icon: (
          <FaShoppingCart
            className="text-[18px] p-2 rounded-md self-end"
            style={{ color: "blue", backgroundColor: "rgba(0, 0, 255, 0.2)" }}
          />
        ),
      };
      break;
  }

  const widgetTheme =
    theme === "dark"
      ? "bg-gray-800 text-gray-100"
      : "bg-white text-gray-800";

  const linkColor = theme === "dark" ? "text-blue-400" : "text-blue-500";
  const diffColor = theme === "dark" ? "text-green-400" : "text-green-600";

  return (
    <div className={`flex justify-between flex-1 p-4 h-[100px] rounded-lg shadow-md ${widgetTheme} transition-colors duration-500`}>
      <div className="flex flex-col justify-between">
        <span className={`text-sm font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{data.title}</span>

        <span className="text-2xl font-light">
          <motion.span>
            {data.isMoney ? formatCurrency(displayValue) : displayValue}
          </motion.span>
          <span className={`${diffColor} ml-1`}>+</span>
        </span>

        <span className={`text-xs cursor-pointer hover:underline w-max ${linkColor}`}>
          {data.link}
        </span>
      </div>

      <div className="flex flex-col justify-between items-end">
        <div className={`${diffColor} flex items-center text-sm font-medium`}>
          <MdKeyboardArrowUp />
          {diff}%
        </div>

        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
