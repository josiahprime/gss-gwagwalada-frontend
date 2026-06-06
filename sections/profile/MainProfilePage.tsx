"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileContent } from "./ProfileContent";
import {
} from "lucide-react";
import ProfileMobile from "./ProfileMobile";

export type ProfileSection =
  | "account"
  | "orders"
  | "notifications"
  | "wishlist"
  | "management"
  | "reviews"
  | "voucher"
  | "sellers"
  | "recent"
  | "payment"
  | "address"
  | "newsletter";

const DEFAULT_SECTION: ProfileSection = "account";

const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get("section") as ProfileSection | null;

  const [activeSection, setActiveSection] =
    useState<ProfileSection>(DEFAULT_SECTION);

  useEffect(() => {
    if (sectionFromUrl) {
      setActiveSection((prev) =>
        prev !== sectionFromUrl ? sectionFromUrl : prev
      );
    }
  }, [sectionFromUrl]);

  const handleSectionChange = (section: ProfileSection) => {
    setActiveSection(section);
    router.push(`/account?section=${section}`);
  };


  return (
    <div className="container mx-auto md:px-4 md:py-8">
      {/* ===== MAIN LAYOUT ===== */}
      <div className="hidden md:flex gap-6">

        {/* Sidebar (Desktop only) */}
        <div className="w-80 shrink-0">
          <ProfileSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </div>

        {/* Content */}
        <div className="flex-1 max-h-[calc(100vh+170px)] overflow-y-auto pr-2 custom-scroll">
          <ProfileContent activeSection={activeSection} />
        </div>
      </div>

      {/* Mobile version */}
      <div className="md:hidden block">
        <ProfileMobile />
      </div>
    </div>
  );

}


export default Profile;

