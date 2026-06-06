import React, { useState, useEffect } from "react";
import Button from "app/components/Button/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatCurrency } from "utils/FormatCurrency";
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore } from "store/cart/useCartStore";
import { useProductStore } from "store/product/useProductStore";
import { useAuthStore } from "store/auth/useAuthStore";
import Badge from "app/components/Badge/Badge";
import type { Product } from "store/product/productTypes";
import Image from "next/image";


interface ProductInfoProps {
  productInfo: Product;
}

  const ProductInfo: React.FC<ProductInfoProps> = ({ productInfo }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [index, setIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);


  const [selectedImage, setSelectedImage] = useState<string>("");
  const [wishlistLoading, setWishlistLoading] = useState(false);


  

  const userId = useAuthStore((state)=>state.authUser?.id)
  const addToCart = useCartStore((state) => state.addToCart);

  const router = useRouter();


  const favoriteIds = useProductStore((state) => state.favoriteIds);
  // const fetchFavoriteIds = useProductStore((state) => state.fetchFavoriteIds);
  // const setFavoritesFor = useProductStore((state) => state.setFavoritesFor);
  const toggleFavorites = useProductStore((state)=>state.toggleFavorite)
  const fetchCart = useCartStore((state)=>state.getCart)

  const isOutOfStock = productInfo.stock === 0; // or whatever field represents stock


  useEffect(() => {
    if (productInfo.images[0]?.url) {
      setSelectedImage(productInfo.images[0].url);
    }
  }, [productInfo.images]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % productInfo.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [productInfo.images.length]);

  useEffect(() => {
    setSelectedImage(productInfo.images[index]?.url || "");
  }, [index, productInfo.images]);


  useEffect(() => {
    // Check if this product is in the user's favorites
    setIsFavorite(favoriteIds.includes(productInfo.id));
  }, [favoriteIds, productInfo.id]);


  

  // ✅ FIXED FUNCTION
  const handleAddToCart = () => {
    addToCart({
      id: productInfo.id,           // satisfies CartItem.id
      productId: productInfo.id,    // backend-friendly field
      productName: productInfo.productName,
      image: productInfo.images?.[0]?.url || "", // avoid empty src errors
      priceInKobo: productInfo.priceInKobo,
      quantity,
      unitType: productInfo.unitType,
    });

    toast.success(`${productInfo.productName} added to cart!`);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;

    try {
      await addToCart({
        id: productInfo.id,
        productId: productInfo.id,
        productName: productInfo.productName,
        image: productInfo.images[0]?.url || "",
        priceInKobo: productInfo.priceInKobo,
        quantity,
        unitType: productInfo.unitType,
      });
      await fetchCart()

      router.push("/cart/checkout");
    } catch {
      toast.error("Failed to add item to cart");
    }
  };






  const handleWishlist = async () => {
    if (!userId) {
      toast.error("You must be logged in to add to wishlist");
      return;
    }

    setWishlistLoading(true); // start loading

    try {
      await toggleFavorites(userId, productInfo.id);
      setIsFavorite(!isFavorite);
      toast.success(
        !isFavorite
          ? `${productInfo.productName} added to your wishlist ❤️`
          : `${productInfo.productName} removed from wishlist 💔`
      );
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      toast.error("Something went wrong while updating your wishlist.");
    } finally {
      setWishlistLoading(false); // stop loading
    }
  };

  const handleShare = async () => {
    const productUrl = window.location.href; // current page URL

    if (navigator.share) {
      // Use native share dialog if available
      try {
        await navigator.share({
          title: productInfo.productName,
          text: `Check out this product: ${productInfo.productName}`,
          url: productUrl,
        });
        toast.success("Product shared successfully!");
      } catch (err) {
        console.error("Share canceled or failed", err);
        toast.error("Could not share the product.");
      }
    } else if (navigator.clipboard) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(productUrl);
        toast.success("Product link copied to clipboard!");
      } catch (err) {
        console.error("Copy failed", err);
        toast.error("Could not copy the link.");
      }
    } else {
      toast.error("Sharing is not supported in this browser.");
    }
  };





  

  const nextImage = () => setIndex((index + 1) % productInfo.images.length);
  const prevImage = () => setIndex(index === 0 ? productInfo.images.length - 1 : index - 1);

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      <div className="max-w-screen-xl mx-auto rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200/30 shadow-xl lg:h-[600px] flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 flex-1">
          
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="relative group rounded-2xl shadow-neumorphic overflow-hidden">
              {selectedImage ? (             
                <Image
                  src={selectedImage || "/placeholder.png"} // fallback if no image
                  alt={productInfo.productName}
                  width={700} // set width
                  height={350} // set height
                  className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={true} // optional: if above-the-fold
                />
              ) : null}


              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <ArrowLeft className="w-3 h-3 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <ArrowRight className="w-3 h-3 text-gray-700" />
              </button>

              {/* Discount Badge */}
              {productInfo.discount?.value && (
                <div className="absolute top-3 left-3">
                  <div className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow">
                    {productInfo.discount.value}% OFF
                  </div>
                </div>
              )}

            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 justify-center mt-2">
              {productInfo.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(img.url || "");
                    setIndex(i);
                  }}

                  className={`rounded-lg transition-all duration-300 hover:scale-105 ${
                    selectedImage === img.url ? "ring-2 ring-green-500 shadow-lg" : "ring-1 ring-gray-200 hover:ring-gray-300"
                  }`}
                >
                  <div className="relative w-12 h-12">
                    <Image
                      src={img.url || "/placeholder.png"}
                      alt="Thumbnail"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Image indicators */}
            <div className="flex justify-center gap-1 mt-2">
              {productInfo.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === i ? "bg-green-500 w-4" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-2.5">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {productInfo.productName}
            </h1>

              <div className="flex items-center gap-2">
                {renderStars(productInfo.rating ?? 0)}
                <span className="text-xs font-medium text-gray-600">
                  {productInfo.rating ?? 0}
                </span>
              </div>


            <div className="flex items-baseline gap-2">
              {/* Final price (after discount if any) */}
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {formatCurrency(
                  productInfo.discount?.isActive
                    ? productInfo.discount.type === "PERCENTAGE"
                      ? Math.round(
                          productInfo.priceInKobo -
                          productInfo.priceInKobo * (productInfo.discount.value / 100)
                        )
                      : Math.max(
                          0,
                          productInfo.priceInKobo - productInfo.discount.value
                        )
                    : productInfo.priceInKobo
                )}
              </span>

              {/* Old price */}
              {productInfo.discount?.isActive && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(productInfo.priceInKobo)}
                </span>
              )}

              {/* Savings badge */}
              {productInfo.discount?.isActive && (
                <div className="bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 rounded text-xs font-semibold">
                  Save{" "}
                  {formatCurrency(
                    productInfo.discount.type === "PERCENTAGE"
                      ? Math.round(
                          productInfo.priceInKobo *
                          (productInfo.discount.value / 100)
                        )
                      : productInfo.discount.value
                  )}
                </div>
              )}
            </div>


            <p className="text-gray-600 leading-relaxed text-xs">{productInfo.description}</p>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl shadow-neumorphic border border-gray-200/50 bg-white/80">
              {/* <div>
                <span className="text-xs font-semibold text-gray-700">Brand:</span>
                <p className="text-gray-600 text-xs">{productInfo.brand}</p>
              </div> */}
              <div>
                <span className="text-xs font-semibold text-gray-700">Category:</span>
                <p className="text-gray-600 text-xs">{productInfo.category}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-700">Stock:</span>
                <p
                  className={`font-medium text-xs ${
                    productInfo.stock === 0
                      ? "text-red-600"         // Out of stock
                      : productInfo.stock <= 10
                      ? "text-yellow-600"      // Low stock warning
                      : "text-green-600"       // Plenty in stock
                  }`}
                >
                  {productInfo.stock === 0 ? "Out of Stock" : productInfo.stock}
                </p>
              </div>

            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-200 transition-all text-gray-700 text-sm font-semibold active:scale-95"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-200 transition-all text-gray-700 text-sm font-semibold active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    isOutOfStock
                      ? "bg-red-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>


                <Button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  variant="outline"
                  className={`flex-1 py-2 rounded-xl border-2 transition-all duration-300 text-xs flex items-center justify-center ${
                    isFavorite ? "bg-red-50 border-red-200 text-red-600" : "hover:bg-gray-50 border-gray-300"
                  } ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Heart className={`w-3 h-3 mr-1 ${isFavorite ? "fill-current text-red-500" : ""}`} />
                  {wishlistLoading ? "Updating..." : isFavorite ? "In Wishlist" : "Add to Wishlist"}
                </Button>


                <Button
                  variant="outline"
                  className="px-2 py-2 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all"
                  onClick={handleShare}
                >
                  <Share2 className="w-3 h-3" />
                </Button>

              </div>
              <Button
                className={`w-full py-2 rounded-xl shadow-md transition-all text-xs text-white 
                  ${isOutOfStock 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                  }`}
                onClick={handleBuyNow}
                disabled={isOutOfStock} // prevents click
              >
                {isOutOfStock ? "Out of Stock" : "Buy Now"}
              </Button>

              <div className="flex items-center gap-4 pt-2 border-t border-gray-200 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-green-600" /> Free Shipping
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-600" /> Secure Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
