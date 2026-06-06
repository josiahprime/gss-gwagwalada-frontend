// app/components/FloatingButtonWrapper.tsx
"use client";

import { useAuthStore } from "store/auth/useAuthStore";
import FloatingButton from "./BugReport/BugReportButton";

export default function FloatingButtonWrapper() {
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) return null;
  return <FloatingButton />;
}
