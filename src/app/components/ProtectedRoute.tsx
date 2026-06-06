"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "store/auth/useAuthStore";
import DotLoader from "./ui/DotLoader";

interface Props {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
}: Props) {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.authUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Handle redirects AFTER render
  useEffect(() => {
    if (!isHydrated) return;

    if (!authUser) {
      router.replace("/");
      return;
    }

    if (
      requiredRoles.length > 0 &&
      !requiredRoles.includes(authUser.role?.toLowerCase())
    ) {
      router.replace("/unauthorized");
    }
  }, [isHydrated, authUser, requiredRoles, router]);

  // While Zustand hydrates
  if (!isHydrated) {
    return <DotLoader />;
  }

  // While redirecting, render nothing
  if (
    !authUser ||
    (requiredRoles.length > 0 &&
      !requiredRoles.includes(authUser.role?.toLowerCase()))
  ) {
    return null;
  }

  return <>{children}</>;
}
