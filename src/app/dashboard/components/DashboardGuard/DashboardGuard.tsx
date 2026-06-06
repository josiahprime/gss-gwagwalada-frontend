"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "store/auth/useAuthStore";

interface Props {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function DashboardGuard({
  children,
  requiredRoles = ["admin"],
}: Props) {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.authUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    if (!authUser) {
      router.replace("/login");
      return;
    }

    if (!requiredRoles.includes(authUser.role?.toLowerCase())) {
      router.replace("/unauthorized");
    }
  }, [isHydrated, authUser, requiredRoles, router]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg animate-pulse">
          No user found. Redirecting to login...
        </p>
      </div>
    );
  }

  if (!requiredRoles.includes(authUser.role?.toLowerCase())) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">
          Unauthorized role. Redirecting...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
