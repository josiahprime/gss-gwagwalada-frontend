'use client'
import { useProductStore } from "store/product/useProductStore";
import DealCard from "app/dashboard/components/DealCard/DealCard";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {ArrowRight, Tractor } from "lucide-react";
import Link from "next/link";
import Button from "../../src/app/components/Button/Button";
import PopularProductsCarousel from "app/components/PopularProductsCarousel";
import HomeSkeleton from "app/components/ui/HomeSkeleton";
import { useAuthStore } from "store/auth/useAuthStore";
import MobileProductSlider from "app/components/PopularProducts/PopularProductsSlider";


function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}


const HomePage = () => {
  const router = useRouter()
  const hasFetchedRef = useRef(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  // const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const fetchDailyDeals = useProductStore((state)=>(state.fetchDailyDeals))
  const fetchHolidayDeals = useProductStore((state)=>state.fetchHolidayDeals)
  const fetchPopularProducts = useProductStore((state)=>(state.fetchPopularProducts))
  const DailyDeals = useProductStore((state)=>(state.dailyDeals))
  const popularProducts = useProductStore((state)=>(state.popularProducts))
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const authUser = useAuthStore((state)=>state.authUser)
  const fetchFavoriteIds = useProductStore((state)=>state.fetchFavoriteIds);
  const setFavoritesFor = useProductStore(state => state.setFavoritesFor);
  const HolidayDeals = useProductStore((state)=>state.HolidayDeals);




  
  
  useEffect(()=>{
    fetchPopularProducts()
  }, [])

  useEffect(()=>{
    fetchHolidayDeals()
  }, [])

  
  useEffect(() => {
    const fetchData = async () => {
      await fetchDailyDeals();

      if (authUser?.id) {
        await fetchFavoriteIds(authUser.id);

        // Merge favorites into daily deals AFTER fetching IDs
        const ids = useProductStore.getState().favoriteIds; // get latest ids
        setFavoritesFor("dailyDeals", ids);
        setFavoritesFor("popularProducts", ids);
      setFavoritesFor("HolidayDeals", ids);
        console.log("Merged daily deals with favorites:", ids);
      } else {
        console.log("No auth user yet");
      }
    };

    // Only run if auth check is done
    if (!isCheckingAuth) {
      fetchData();
    }
  }, [authUser, isCheckingAuth]);



  useEffect(() => {
    if (!DailyDeals || DailyDeals.length === 0) return;

    const first = DailyDeals[0];
    if (!first.discount) return;

    const end = new Date(first.discount.endDate).getTime();

    const interval = setInterval(() => {
      const diff = end - Date.now();
      setCountdown(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [DailyDeals]);


  if (isCheckingAuth) {
    return <HomeSkeleton />;
  }


  const bannerDeals = [
    {
      title: "Fresh Harvest",
      subtitle: "Up to 50% OFF",
      description: "Organic vegetables & fruits",
      image: "https://res.cloudinary.com/djmnjen6v/image/upload/v1760550956/photo-1542838132-92c53300491e_wzy3c2.jpg",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Farm Fresh",
      subtitle: "Daily Delivery",
      description: "Straight from our farm",
      image: "https://res.cloudinary.com/djmnjen6v/image/upload/v1760550955/photo-1500595046743-cd271d694d30_ffcvyk.jpg",
      color: "from-orange-500 to-yellow-600"
    }
  ];

  


  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Banner */}
            <div className="lg:col-span-2">
              <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-center text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Tractor className="w-8 h-8" />
                    <span className="text-sm font-medium">RichField Farms</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">Fresh from Farm to Table</h1>
                  <p className="text-l mb-6 opacity-90">Premium organic produce delivered fresh daily</p>
                  <Button onClick={() => router.push('/products')} className="bg-gradient-to-r from-green-600 to-emerald-700 shadow text-white hover:bg-gray-100 w-fit">
                    Shop Fresh Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                <img 
                  src="https://res.cloudinary.com/djmnjen6v/image/upload/v1760550956/photo-1542838132-92c53300491e_wzy3c2.jpg"
                  alt="Fresh vegetables"
                  className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80"
                />
              </div>
            </div>

            {/* Side Banners */}
            <div className="space-y-6">
              {bannerDeals.map((deal, index) => (
                <div key={index} className={`relative h-36 rounded-xl overflow-hidden bg-gradient-to-r ${deal.color} relative`}>
                  <img className="absolute w-full h-full" src={deal.image} alt="" />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 p-4 h-full flex flex-col justify-center text-white">
                    <h3 className="text-lg font-bold">{deal.title}</h3>
                    <p className="text-sm opacity-90 font-medium">{deal.subtitle}</p>
                    <p className="text-xs opacity-75">{deal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Flash Deals Section */}
      {DailyDeals && DailyDeals.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">

            {/* Header Row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">

              {/* Left Side Info */}
              <div>
                <span className="inline-block px-3 py-1 bg-green-200/60 text-green-900 text-xs font-semibold rounded-full mb-2">
                  Today only
                </span>

                <h2 className="text-3xl font-extrabold text-green-900">
                  Farm Fresh Daily Deals
                </h2>

                <p className="text-sm text-green-900/80 mt-1 max-w-md">
                  Hand-picked produce and pantry staples from local farms.
                  Prices drop for 24 hours. Stock up while they last.
                </p>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-2">
                {countdown !== null  ? (
                  formatCountdown(countdown)
                    .split(":")
                    .map((value, index) => (
                      <div
                        key={index}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg text-center min-w-[60px]"
                      >
                        <p className="text-lg font-bold leading-none">{value}</p>
                        <p className="text-[10px] uppercase tracking-wide opacity-80">
                          {index === 0 ? "hours" : index === 1 ? "mins" : "secs"}
                        </p>
                      </div>
                    ))
                ) : (
                  <span className="text-green-900">Loading...</span>
                )}
              </div>

              {/* View All Button */}
              <Button
                variant="ghost"
                className="text-green-800 hover:bg-green-100 flex items-center gap-2 font-semibold"
              >
                View All Deals
                <ArrowRight className="w-4 h-4" />
              </Button>

            </div>


            <div className="w-full">
              {/* Deals Grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4 ">
                {DailyDeals.slice(0, 5).map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>


              {/* Mobile slider */}
              <div className="md:hidden">
                <MobileProductSlider products={DailyDeals} />
              </div>
            </div>


          </div>
        </section>
      )}


      {/* Holiday Discounts Section */}
      {HolidayDeals && HolidayDeals.length > 0 && (
        <section className="py-10 bg-white/90">
          <div className="max-w-7xl mx-auto px-4">

            {/* Header Row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">

              {/* Left Side Info */}
              <div>
                <span className="inline-block px-3 py-1 bg-red-200/60 text-red-900 text-xs font-semibold rounded-full mb-2">
                  Limited Time
                </span>

                <h2 className="text-3xl font-extrabold text-red-900">
                  Holiday Discounts Up to 30% Off
                </h2>

                <p className="text-sm text-red-900/80 mt-1 max-w-md">
                  Celebrate the season with massive discounts on your favorite products.
                  Grab them before the holiday season ends!
                </p>

                <span className="inline-block mt-2 text-red-700 font-medium text-sm">
                  Ends December 31st
                </span>
              </div>

              {/* View All Button */}
              <Button
                variant="ghost"
                className="text-red-800 hover:bg-red-100 flex items-center gap-2 font-semibold mt-4 lg:mt-0"
              >
                View All Holiday Deals
                <ArrowRight className="w-4 h-4" />
              </Button>

            </div>


          <div className="w-full">
            {/* Deals Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4 ">
              {HolidayDeals.slice(0, 5).map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>


            {/* Mobile slider */}
            <div className="md:hidden">
              <MobileProductSlider products={HolidayDeals} />
            </div>
          </div>

            

          </div>
        </section>
      )}

      {/* Popular Products */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

            <div>
              <span className="inline-block px-3 py-1 bg-green-200/60 text-green-900 text-xs font-semibold rounded-full mb-2">
                Customer Favorites
              </span>

              <h2 className="text-3xl font-extrabold text-green-900">
                Popular Farm Products
              </h2>

              <p className="text-sm text-green-900/80 mt-1">
                Fresh picks loved by shoppers across the farm marketplace.
              </p>
            </div>

            <Link href="/products">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-green-800 hover:bg-green-100 font-semibold"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

          </div>

        </div>

        {/* Sliders */}
        <div className="w-full">
          {/* Desktop slider */}
          <div className="hidden md:block">
            <PopularProductsCarousel products={popularProducts} />
          </div>

          {/* Mobile slider */}
          <div className="md:hidden">
            <MobileProductSlider products={popularProducts} />
          </div>
        </div>
      </section>



      {/* Newsletter */}
      <section className="bg-blue-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tractor className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-bold text-white">Stay Updated with Farm Fresh Deals</h2>
          </div>
          <p className="text-green-100 mb-8">Get the freshest produce delivered to your doorstep</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <Button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;





