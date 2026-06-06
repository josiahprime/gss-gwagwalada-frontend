"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

type ThemeMode = "light" | "dark";

interface DashboardHeaderProps {
  title: string;
  description?: string;

  theme?: ThemeMode;

  badgeText?: string;
  BadgeIcon?: LucideIcon;

  actionLabel?: string;
  ActionIcon?: LucideIcon;
  onAction?: () => void;
  actionDisabled?: boolean;

  infoLabel?: string;
  InfoIcon?: LucideIcon;
}


const DashboardHeader = ({
  title,
  description,
  theme = "light",

  badgeText,
  BadgeIcon,

  actionLabel,
  ActionIcon,
  onAction,
  actionDisabled,

  infoLabel,
  InfoIcon,
}: DashboardHeaderProps) => {
  const hasAction = actionLabel && onAction;
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-6">
      {/* LEFT */}
      <div>
        {badgeText && (
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs shadow ${
              isDark
                ? "bg-gray-800 text-gray-200"
                : "bg-white text-gray-700"
            }`}
          >
            {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
            {badgeText}
          </div>
        )}

        <h1
          className={`text-3xl font-semibold mt-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h1>

        {description && (
          <p
            className={`mt-1 max-w-xl ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {/* RIGHT */}
      {hasAction ? (
        <button
            onClick={onAction}
            disabled={actionDisabled}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium shadow-md transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                isDark
                    ? "bg-green-600 hover:bg-green-500 text-white shadow-green-600/30"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-green-500/30"
                }
            `}
            >
            {ActionIcon && <ActionIcon className="w-4 h-4" />}
            {actionLabel}
        </button>

      ) : infoLabel ? (
        <div
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
            isDark
              ? "bg-gray-800 text-gray-200"
              : "bg-green-50 text-green-700"
          }`}
        >
          {InfoIcon && <InfoIcon className="w-4 h-4" />}
          {infoLabel}
        </div>
      ) : null}
    </div>
  );
};


export default DashboardHeader;
