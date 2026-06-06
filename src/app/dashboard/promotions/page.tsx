'use client'

import { useState, useEffect, useMemo } from "react";
import { useProductStore } from "store/product/useProductStore";
import { Plus, Tag } from "lucide-react";
import ActivePromotionCard from "./components/ActivePromotionCard";
import PromotionFormModal from "./components/PromotionFormModal";
import PromotionsTable from "./components/PromotionsTable";
import { toast } from "react-hot-toast";
import { usePromotionStore } from "store/promotion/usePromotionStore";
import type { Promotion } from "store/promotion/promotionTypes";
import { useThemeStore } from "store/theme/themeStore";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";



type PromotionTab = "all" | "active" | "scheduled" | "expired";



export default function PromotionsPage() {

  // const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PromotionTab>("all");
  const products = useProductStore((state)=>state.products)
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const theme = useThemeStore((s) => s.theme);
  



  const {
    promotions,
    fetchPromotions,
    deletePromotion,
    updatePromotion,
    createPromotion,
    loading,
  } = usePromotionStore();

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, [fetchPromotions, fetchProducts]);

  const now = new Date();

  const activePromotions = promotions.filter(
    p => p.isActive && new Date(p.startDate) <= now && new Date(p.endDate) >= now
  );

  const activePromotion = useMemo(
    () => activePromotions[0],
    [activePromotions]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading promotions…
      </div>
    );
  }



  console.log('promotion from promotion form modal',promotions)
   




  



  const handleCreateNew = () => {
    setEditingPromotion(undefined);
    setIsFormOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsFormOpen(true);
  };


  const handleSavePromotion = async (promotion: Promotion) => {
    const { id, createdAt, updatedAt, ...payload } = promotion as any;

    if (editingPromotion) {
      await updatePromotion(id, payload);
      toast.success("Promotion updated successfully");
    } else {
      await createPromotion(payload);
      toast.success("Promotion created successfully");
    }

    setIsFormOpen(false);
    setEditingPromotion(undefined);
  };



  const handleDeletePromotion = async (id: string) => {
    await deletePromotion(id);
    toast.success("Promotion deleted");
  };


  const handleDeactivatePromotion = async () => {
    if (!activePromotion) return;

    await updatePromotion(activePromotion.id, { isActive: false });
    toast.success("Promotion deactivated");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }





  return (
    <div
      className={`shadow-md p-5 m-5 rounded-lg transition-colors duration-500
        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
    >
      {/* Promotions Header Section */}
      <DashboardHeader
        title="Promotions"
        description="Manage your e-commerce promotions and seasonal campaigns"
        badgeText="Marketing"
        BadgeIcon={Tag}
        theme={theme}
        actionLabel="New Promotion"
        ActionIcon={Plus}
        onAction={handleCreateNew}
        actionDisabled={loading}
      />


      {/* Active Promotion Section */}
      {activePromotion && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Currently Active
            </h2>
            <p className="text-sm text-gray-600">
              This promotion is live on your storefront
            </p>
          </div>
          <ActivePromotionCard
            promotion={activePromotion}
            onEdit={() => handleEditPromotion(activePromotion)}
            onDeactivate={handleDeactivatePromotion}
          />
        </div>
      )}

      {/* Tabs Section */}
      <div className="space-y-4">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-700 gap-1 mt-4">
          <button 
          className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-sm transition-all
            ${activeTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}
          `}
          onClick={() => setActiveTab("all")}
          >
            All Promotions
          </button>
          <button 
          className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-sm transition-all
            ${activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}
          `}

          onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button 
          className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-sm transition-all
            ${activeTab === "scheduled" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}
          `}

          onClick={() => setActiveTab("scheduled")}
          >
            Scheduled
          </button>
          <button 
          className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-sm transition-all
            ${activeTab === "expired" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}
          `}
          onClick={() => setActiveTab("expired")}
          >
            Expired
          </button>
        </div>


        {/* TabsContent replacement for "all" */}
        {activeTab === "all" && (
          <div
            className="mt-2"
            tabIndex={0} 
          >
            {/* Card container */}
            <div className="rounded-lg bg-white text-black">
              {/* CardHeader */}
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  All Promotions
                </h3>
                <p className="text-sm text-gray-500">
                  View and manage all your promotions
                </p>
              </div>

              {/* CardContent */}
              <div className="p-6 pt-0">
                <PromotionsTable
                  promotions={promotions}
                  products={products}
                  onEdit={handleEditPromotion}
                  onDelete={handleDeletePromotion}
                />
              </div>
            </div>
          </div>
        )}



        {/* TabsContent replacement for "active" */}
        {activeTab === "active" && (
          <div
            className="mt-2 "
            tabIndex={0} 
          >
            {/* Card container */}
            <div className="rounded-lg border bg-white text-black shadow-sm">
              {/* CardHeader */}
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Active Promotions
                </h3>
                <p className="text-sm text-gray-500">
                  Promotions currently running on your storefront
                </p>
              </div>

              {/* CardContent */}
              <div className="p-6 pt-0">
                <PromotionsTable
                  promotions={promotions.filter((p) => p.isActive)}
                  products={products}
                  onEdit={handleEditPromotion}
                  onDelete={handleDeletePromotion}
                />
              </div>
            </div>
          </div>
        )}



        {/* TabsContent replacement for "scheduled" */}
        {activeTab === "scheduled" && (
          <div
            className="mt-2"
            tabIndex={0} 
          >
            {/* Card container */}
            <div className="rounded-lg border bg-white text-black shadow-sm">
              {/* CardHeader */}
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Scheduled Promotions
                </h3>
                <p className="text-sm text-gray-500">
                  Promotions waiting to go live
                </p>
              </div>

              {/* CardContent */}
              <div className="p-6 pt-0">
                <PromotionsTable
                  promotions={promotions.filter(
                    (p) => new Date(p.startDate) > new Date()
                  )}
                  products={products}
                  onEdit={handleEditPromotion}
                  onDelete={handleDeletePromotion}
                />
              </div>
            </div>
          </div>
        )}



        {/* TabsContent replacement for "archived" */}
        {activeTab === "expired" && (
          <div
            className="mt-2"
            tabIndex={0} 
          >
            {/* Card container */}
            <div className="rounded-lg border bg-white text-black shadow-sm">
              {/* CardHeader */}
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Expired Promotions
                </h3>
                <p className="text-sm text-gray-500">
                  Promotions that have ended
                </p>
              </div>

              {/* CardContent */}
              <div className="p-6 pt-0">
                <PromotionsTable
                  promotions={promotions.filter(
                    (p) => new Date(p.endDate) < new Date()
                  )}
                  products={products}
                  onEdit={handleEditPromotion}
                  onDelete={handleDeletePromotion}
                />
              </div>
            </div>
          </div>
        )}
    </div>


      {/* Form Modal */}
      <PromotionFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        promotion={editingPromotion}
        products={products}
        onSave={handleSavePromotion}
      />
    </div>
  );
}
