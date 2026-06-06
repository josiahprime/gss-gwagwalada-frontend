import { useState, useEffect } from "react";
import { Promotion, PromotionFormData } from "store/promotion/promotionTypes";
import type { Product } from "store/product/productTypes";
import { X } from "lucide-react";
import ProductSelector from "./ProductSelector";
import PromotionPreview from "./PromotionPreview";
import toast from "react-hot-toast";
import { usePromotionStore } from "store/promotion/usePromotionStore";


interface PromotionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion?: Promotion;
  products: Product[];
  onSave: (promotion: Promotion) => Promise<void>; 
  // onSave: (promotion: Promotion) => void;
}



const themeOptions = [
  { value: "CHRISTMAS", label: "Christmas" },
  { value: "BLACK_FRIDAY", label: "Black Friday" },
  { value: "VALENTINES", label: "Valentines" },
  { value: "CUSTOM", label: "Custom" },
];




export default function PromotionFormModal({
  open,
  onOpenChange,
  promotion,
  products,
  onSave,
}: PromotionFormModalProps) {
  const {
    loading,
    updatePromotion,
    createPromotion,
  } = usePromotionStore();

  

  const [formData, setFormData] = useState<PromotionFormData>({
    badgeText: "",
    headline: "",
    description: "",
    theme: "CUSTOM", // must match Promotion["theme"]
    startDate: "",
    endDate: "",
    isActive: false,
    featureOnHomepage: false,
    autoDeactivateOnExpire: true,
    selectedProductIds: [],
  });


  const selectedProducts = products.filter((p) =>
    formData.selectedProductIds?.includes(p.id)
  );

  useEffect(() => {
  if (promotion) {
      setFormData({
        badgeText: promotion.badgeText,
        headline: promotion.headline,
        description: promotion.description,
        theme: promotion.theme,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        isActive: promotion.isActive,
        featureOnHomepage: promotion.featureOnHomepage || false,
        autoDeactivateOnExpire: promotion.autoDeactivateOnExpire || true,
        selectedProductIds: promotion.selectedProductIds || [],
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
      setFormData({
        badgeText: "",
        headline: "",
        description: "",
        theme: "CUSTOM",
        startDate: today,
        endDate: tomorrow,
        isActive: false,
        featureOnHomepage: false,
        autoDeactivateOnExpire: true,
        selectedProductIds: [],
      });
    }
  }, [promotion, open]);


  const getPromotionForPreview = (): Promotion => ({
    id: promotion?.id || "preview-id",
    badgeText: formData.badgeText,
    headline: formData.headline,
    description: formData.description,
    theme: formData.theme,
    startDate: formData.startDate,
    endDate: formData.endDate,
    isActive: formData.isActive,
    featureOnHomepage: formData.featureOnHomepage,
    autoDeactivateOnExpire: formData.autoDeactivateOnExpire,
    selectedProductIds: formData.selectedProductIds,
    createdAt: promotion?.createdAt || new Date().toISOString(),
    updatedAt: promotion?.updatedAt || new Date().toISOString(),
  });



  const handleSave = async () => {
    try {
      if (promotion) {
        // Update existing promotion
        await updatePromotion(promotion.id, formData); // formData is Partial<Promotion>
      } else {
        // Create new promotion
        await createPromotion(formData);
      }
      onOpenChange(false);
    } catch (err) {
      toast.error("Error saving promotion");
    }
  };


  if (!open) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg bg-white shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 pt-6 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {promotion ? "Edit Promotion" : "Create New Promotion"}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {promotion
                    ? "Update promotion details and schedule"
                    : "Set up a new promotion for your storefront"}
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-600">Set the core details of your promotion</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="badge" className="mb-2 block text-sm font-medium text-gray-900">
                      Badge Text *
                    </label>
                    <input
                      id="badge"
                      type="text"
                      placeholder="e.g. Today Only"
                      value={formData.badgeText}
                      onChange={(e) =>
                        setFormData({ ...formData, badgeText: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="theme" className="mb-2 block text-sm font-medium text-gray-900">
                      Theme
                    </label>
                    <select
                      id="theme"
                      value={formData.theme}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          theme: e.target.value as Promotion["theme"],
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {themeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="headline" className="mb-2 block text-sm font-medium text-gray-900">
                    Headline *
                  </label>
                  <input
                    id="headline"
                    type="text"
                    placeholder="e.g. Holiday Discounts Up to 30% Off"
                    value={formData.headline}
                    onChange={(e) =>
                      setFormData({ ...formData, headline: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Tell customers what they should know about this promotion..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Schedule Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Schedule</h3>
                  <p className="text-sm text-gray-600">Set when your promotion runs</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="start-date" className="mb-2 block text-sm font-medium text-gray-900">
                      Start Date
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="end-date" className="mb-2 block text-sm font-medium text-gray-900">
                      End Date
                    </label>
                    <input
                      id="end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Settings Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">Configure promotion behavior</p>
                </div>

                <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="feature-homepage" className="text-sm font-medium text-gray-900">
                      Feature on Homepage
                    </label>
                    <div className="relative inline-block h-6 w-11 bg-gray-300 rounded-full cursor-pointer"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          featureOnHomepage: !formData.featureOnHomepage,
                        })
                      }
                    >
                      <div
                        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          formData.featureOnHomepage ? "translate-x-5 bg-blue-600" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="auto-deactivate" className="text-sm font-medium text-gray-900">
                      Auto-deactivate when expired
                    </label>
                    <div className="relative inline-block h-6 w-11 bg-gray-300 rounded-full cursor-pointer"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          autoDeactivateOnExpire: !formData.autoDeactivateOnExpire,
                        })
                      }
                    >
                      <div
                        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          formData.autoDeactivateOnExpire ? "translate-x-5 bg-blue-600" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <label htmlFor="is-active" className="text-sm font-medium text-gray-900">
                      Active
                    </label>
                    <div className="relative inline-block h-6 w-11 bg-gray-300 rounded-full cursor-pointer"
                      onClick={() =>
                        setFormData({ ...formData, isActive: !formData.isActive })
                      }
                    >
                      <div
                        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          formData.isActive ? "translate-x-5 bg-blue-600" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Products Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Products</h3>
                  <p className="text-sm text-gray-600">Select products to feature in this promotion</p>
                </div>
                <ProductSelector
                  products={products}
                  selectedProductIds={formData.selectedProductIds || []}
                  onSelectionChange={(productIds) =>
                    setFormData({ ...formData, selectedProductIds: productIds })
                  }
                />
              </div>

              <hr className="border-gray-200" />

              {/* Preview Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Preview</h3>
                  <p className="text-sm text-gray-600">See how your promotion appears to customers</p>
                </div>
                <PromotionPreview
                  promotion={getPromotionForPreview()}
                  selectedProducts={selectedProducts}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : promotion ? "Update" : "Create"} Promotion
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
