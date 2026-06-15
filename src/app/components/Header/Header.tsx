"use client";

import { Menu } from "lucide-react";
import { useUiStore } from "store/ui/useUiStore";
import { NavLinks } from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import CartIcon from "./CartIcon";
import SupportIcon from "./SupportIcon";
import SaleBanner from "./SaleBanner";
import Logo from "./Logo";
import MobileSidebar from "./MobileSidebar";
import UserIcon from "./ProfileSwitcher";
import LoginButton from "./LoginButton";
import Notifications from "./Notifications";
import SearchBar from "./SearchBar";
import { useAuthStore } from "store/auth/useAuthStore";
import { usePathname } from "next/navigation";
import NavbarSkeleton from "../ui/NavbarSkeleton";
import SaleBannerSkeleton from "../ui/SalesBannerSkeleton";
import useScrollDirection from "app/hooks/useScrollDirection"; 
// Ensure you have created the useScrollDirection hook in this location.

const Header = () => {
    const pathname = usePathname();
    const isProfilePage = pathname === "/account";

    const isProductsPage = pathname === '/products'

    // Use the scroll hook with a low threshold for responsiveness
    const scrollDirection = useScrollDirection(undefined, 10); 
    
    // --- SCROLL LOGIC FOR MOBILE SEARCH BAR ---
    // Safely using translation on the SEPARATE sticky element
    const searchBarTranslateClass = 
        scrollDirection === 'down' 
        ? '-translate-y-full' // Hide it by sliding it up
        : 'translate-y-0'; // Show it

    const authUser = useAuthStore((state) => state.authUser);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
    const { toggleSidebar } = useUiStore();


    const hideOnProfilePage = isProfilePage ? "hidden md:block" : "";
    const hideSearchBar = !isProductsPage ? "hidden" : "md:block";

    // -----------------------------------------------------------
    // 👉 SKELETON RENDER (Now mimics the two-part sticky structure)
    // -----------------------------------------------------------
    if (isCheckingAuth) {
        // Find the height of the main header content (SaleBanner + h-20 nav)
        // If SaleBanner is 40px (h-10) and h-20 is 80px, total is 120px.
        // We set top-20 on the skeleton search bar to match the real header's height (h-20)
        
        return (
            <>
                {/* 1. MAIN SKELETON HEADER (Always Visible) */}
                <header className={`sticky top-0 z-50 bg-white w-full shadow-md ${hideOnProfilePage}`}>
                    <div className="hidden lg:block">
                        <SaleBannerSkeleton />
                        <NavbarSkeleton />
                    </div>
                    <div className="lg:hidden">
                      {/* Sale Banner Skeleton should go first and take full width */}
                      <SaleBannerSkeleton/> 
                      
                      {/* Mobile main nav skeleton content */}
                      <div className="shadow-md">
                          <div className="flex items-center justify-between px-4 h-20"> 
                              {/* 1. Menu Button Skeleton */}
                              <div className="bg-gray-200 w-10 h-10 rounded-md animate-pulse"></div>
                              
                              {/* 2. Logo Skeleton */}
                              <div className="h-6 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                              
                              {/* 3. Cart Icon Skeleton */}
                              <div className="bg-gray-200 w-8 h-8 rounded-full animate-pulse"></div>
                          </div>
                      </div>
                  </div>
                </header>


                {/* 2. MOBILE SEARCH BAR SKELETON CONTAINER */}
                <div 
                    // This must match the sticky top-position of the real search bar (80px for h-20)
                    className={`sticky top-[80px] z-40 w-full md:hidden bg-white shadow-sm 
                                transition-transform duration-300 ease-in-out ${searchBarTranslateClass}`}
                >
                    {/* Skeleton version of the search bar content */}
                    <div className="w-full border-t border-gray-200"></div>
                    <div className="px-2 pt-2 pb-4 flex items-center justify-center">
                        <div className="w-full max-w-[400px]">
                            {/* Simple gray block for search bar skeleton */}
                            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }


    // -----------------------------------------------------------
    // 👇 NORMAL NAVBAR RENDER (The working fix)
    // -----------------------------------------------------------
    return (
        <>
            {/* 1. MAIN STICKY HEADER (Fixed Height, Always Visible) */}
            <header className={`sticky top-0 z-50 bg-white w-full shadow-md`}>
                
                {/* Sale Banner */}
                <div>
                    <SaleBanner />
                </div>
                
                {/* Main Navigation Row (Fixed height container) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 h-20 flex items-center justify-between">
                    
                    {/* Mobile toggle & Logo */}
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden text-gray-800 bg-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Logo />
                    </div>

                    {/* Desktop nav, search, and icons */}
                    <div className="hidden lg:flex">
                        <NavLinks />
                    </div>
                    <MobileSidebar />

                    <div className={`${hideSearchBar}`}>
                        <div className="hidden lg:flex">
                            <SearchBar />
                        </div>
                    </div>
                    

                    <div className="items-center gap-4 hidden lg:flex">
                        {authUser && <Notifications />}
                        <ThemeToggle />
                        {authUser ? <CartIcon /> : <LoginButton />}
                        {authUser && <SupportIcon/> }
                        {!isCheckingAuth && authUser && <UserIcon />}
                        
                    </div>

                    <div className="md:hidden block">
                        <CartIcon />
                    </div>

                </div>
            </header>

            {/* 2. MOBILE SEARCH BAR CONTAINER (New Sticky Element with Scroll Logic) */}
            <div 
                // Set the sticky position relative to the main header's height (80px for h-20)
                className={`sticky top-[80px] z-40 w-full md:hidden bg-white shadow-sm 
                            transition-transform duration-300 ease-in-out ${searchBarTranslateClass}`}
            >
                {/* Gray line full width */}
                <div className="w-full border-t border-gray-200"></div>

                <div className={`px-2 pt-2 pb-4 flex items-center justify-center ${hideOnProfilePage}`}>
                    <div className="w-full max-w-[400px]">
                        <SearchBar/>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;