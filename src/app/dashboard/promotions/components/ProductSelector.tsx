import { useState, useMemo } from "react";
import type { Product } from "store/product/productTypes";
import { X, Search } from "lucide-react";

interface ProductSelectorProps {
  products: Product[];
  selectedProductIds: string[];
  onSelectionChange: (productIds: string[]) => void;
}

export default function ProductSelector({
  products,
  selectedProductIds,
  onSelectionChange,
}: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const selectedProducts = useMemo(() => {
    return products.filter((p) => selectedProductIds.includes(p.id));
  }, [products, selectedProductIds]);

  const handleToggleProduct = (productId: string) => {
    const updated = selectedProductIds.includes(productId)
      ? selectedProductIds.filter((id) => id !== productId)
      : [...selectedProductIds, productId];
    onSelectionChange(updated);
  };

  const handleRemoveProduct = (productId: string) => {
    onSelectionChange(selectedProductIds.filter((id) => id !== productId));
  };

  // console.log('selected product ids from product selector',selectedProductIds)
  // products.map((product)=>{
  //   console.log(product.productName, product.id)
  // })

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-900">
          Select Products
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Available Products */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h4 className="text-sm font-semibold text-gray-900">
              Available Products ({filteredProducts.length})
            </h4>
          </div>
          <div className="h-96 overflow-y-auto">
            <div className="space-y-2 p-4">
              {filteredProducts.length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  No products found
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <label
                    key={product.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => handleToggleProduct(product.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {product.productName}
                      </p>
                      <p className="text-xs text-gray-600">
                        ${product.priceInKobo.toFixed(2)}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Products */}
        <div className="rounded-lg border border-gray-200 bg-gray-50">
          <div className="border-b border-gray-200 px-4 py-3">
            <h4 className="text-sm font-semibold text-gray-900">
              Selected ({selectedProducts.length})
            </h4>
          </div>
          <div className="h-96 overflow-y-auto">
            <div className="space-y-2 p-4">
              {selectedProducts.length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  No products selected
                </p>
              ) : (
                selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {product.productName}
                      </p>
                      <p className="text-xs text-gray-600">
                        ${product.priceInKobo.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
