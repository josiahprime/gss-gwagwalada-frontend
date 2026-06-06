"use client";

import React, { useState, useEffect, useMemo, ChangeEvent, DragEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineUpload,
  AiOutlineMinus,
  AiFillTag,
} from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import Image from "next/image";

// Store Imports
import { useProductStore } from "store/product/useProductStore";
import { useDiscountStore } from "store/discount/useDiscountStore";
import { ProductState } from "store/product/productTypes";

// --- TYPES ---
export type UploadedImage = {
  url: string;
  file: File;
};

export type FormData = {
  id?: string;
  priceInKobo: string;
  productName: string;
  description: string;
  category: string;
  subCategory: string;
  selectedImages: UploadedImage[];
  stock: number;
  unitType: string;
  isVariableWeight: boolean;
  minOrderQuantity?: number;
  displayLabel?: "NONE" | "POPULAR" | "DAILY_DEAL" | "NEW_ARRIVAL" | "FEATURED";
  discountId?: string;
};

type DisplayLabel = "NONE" | "POPULAR" | "DAILY_DEAL" | "NEW_ARRIVAL" | "FEATURED";

// --- DATA ---
const categories = [
  { name: "Meat & Poultry", slug: "meat-poultry" },
  { name: "Fish & Seafood", slug: "fish-seafood" },
  { name: "Dairy & Eggs", slug: "dairy-eggs" },
  { name: "Fresh Produce", slug: "fresh-produce" },
  { name: "Animal Feeds & Supplements", slug: "animal-feeds-supplements" },
  { name: "Pantry & Sweeteners", slug: "pantry-sweeteners" },
];

// --- COMPONENTS ---

// Reusable Modern Dropdown
const Dropdown: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ options, value, onChange, placeholder = "Select" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm shadow-sm flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
      >
        <span className={`${selected ? "text-gray-900" : "text-gray-400"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="absolute left-0 right-0 z-50 mt-2 max-h-48 overflow-auto rounded-lg border border-gray-100 bg-white py-1 shadow-xl">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 text-sm hover:bg-blue-50 ${
                opt.value === value ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-700"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
const ProductsForm: React.FC = () => {
  // 1. State Management (From Original Code)
  const [tags, setTags] = useState<string[]>(["Meat", "Organic", "Fresh"]);
  const [newTag, setNewTag] = useState<string>("");
  const [stock, setStock] = useState<number>(1);
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);

  // Stores
  const createProduct = useProductStore((state: ProductState) => state.createProduct);
  const isLoading = useProductStore((state: ProductState) => state.isLoading);
  const fetchDiscounts = useDiscountStore((state) => state.fetchDiscounts);
  const discounts = useDiscountStore((state) => state.discounts);

  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    description: "",
    category: "",
    subCategory: "",
    priceInKobo: "",
    selectedImages: [],
    stock: stock,
    unitType: "piece",
    isVariableWeight: false,
    minOrderQuantity: undefined,
    discountId: "",
    displayLabel: "NONE",
  });

  // 2. Effects
  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  // 3. Handlers
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Tag Handlers
  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setTags((prev) => [...new Set([...prev, newTag.trim()])]);
      setNewTag("");
    }
  };
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Image Handlers
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 3);
    const imageUrls: UploadedImage[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setSelectedImages((prev) => [...prev, ...imageUrls].slice(0, 3));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).slice(0, 3);
    const imageUrls: UploadedImage[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setSelectedImages(imageUrls);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async () => {

    const formattedImages = selectedImages.map((img, index) => ({
      ...img,
      index,
    }));

    const productPayload = {
      productName: formData.productName,
      description: formData.description,
      category: formData.category,
      subCategory: formData.subCategory,
      stock,
      priceInKobo: Number(formData.priceInKobo),
      unitType: formData.unitType,
      isVariableWeight: formData.isVariableWeight,
      minOrderQuantity: formData.minOrderQuantity,
      tags,
      images: formattedImages,
      discountId: formData.discountId || null,
      displayLabel: formData.displayLabel,
    };

    // Show loading toast
    const toastId = toast.loading('Creating product...');

    try {
      await createProduct(productPayload);
      toast.success('Product created successfully!', { id: toastId });
      router.push("/dashboard/products"); // Navigate after success
    } catch (error) {
      console.error(error);
      toast.error('Failed to create product', { id: toastId });
    }
  };

  // 4. Visual Helpers for Preview
  const labelColor = useMemo(() => {
    switch (formData.displayLabel) {
      case "FEATURED": return "bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900";
      case "DAILY_DEAL": return "bg-gradient-to-r from-red-400 to-rose-500 text-white";
      case "POPULAR": return "bg-gradient-to-r from-indigo-500 to-violet-500 text-white";
      case "NEW_ARRIVAL": return "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white";
      default: return "hidden";
    }
  }, [formData.displayLabel]);

  const previewImage = selectedImages[0]?.url ?? 
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='24'%3ENo Image Selected%3C/text%3E%3C/svg%3E";

  const formatPrice = (amount: string) => {
    const num = Number(amount);
    return isNaN(num) ? "₦0.00" : `₦${num.toLocaleString("en-NG")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-800">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold flex items-center gap-3 text-gray-900">
               <div className="p-2 bg-blue-600 rounded-lg text-white"><BsBoxSeam size={24} /></div>
               Add New Product
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-xl">
              Fill in the details below to create a new product listing. The preview on the right shows how it will appear to customers.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm font-medium"
             >
                Reset
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* General Info Card */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">General Information</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g. Premium Free-range Chicken"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your product..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Dropdown
                    options={categories.map((c) => ({ value: c.slug, label: c.name }))}
                    value={formData.category}
                    onChange={(v) => setFormData((prev) => ({ ...prev, category: v }))}
                    placeholder="Select Category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                  <input
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    placeholder="e.g. Poultry"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>
            </section>

             {/* Images Card */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
               <h3 className="text-lg font-semibold mb-4 text-gray-800">Product Images</h3>
               <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="fileUpload"
                    multiple
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-3">
                        <AiOutlineUpload size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 3 images)</p>
                  </label>
                </div>

                {/* Thumbnails */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <Image
                            src={image.url}
                            alt={`Preview ${index}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-white text-red-500 shadow-md p-1.5 rounded-full border border-gray-200 hover:bg-red-50 transition-colors"
                        >
                          <AiOutlineClose size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </section>

            {/* Pricing & Inventory Card */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Pricing & Inventory</h3>
              <div className="grid gap-5 md:grid-cols-2">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Naira)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                    <input
                        name="priceInKobo"
                        type="number"
                        value={formData.priceInKobo}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                  <Dropdown
                    options={[
                        {value:'piece',label:'Piece'},
                        {value:'kg',label:'Kilogram (kg)'},
                        {value:'litre',label:'Litre (L)'},
                        {value:'pack',label:'Pack'},
                        {value:'dozen',label:'Dozen'},
                        {value:'crate',label:'Crate'}
                    ]}
                    value={formData.unitType}
                    onChange={(v) => setFormData((prev) => ({ ...prev, unitType: v }))}
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
                   <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setStock(stock > 0 ? stock - 1 : 0)}
                        className="p-2.5 rounded-lg border hover:bg-gray-100 transition"
                      >
                         <AiOutlineMinus />
                      </button>
                      <input 
                         type="number"
                         value={stock}
                         onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                         className="w-full text-center rounded-lg border border-gray-300 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                      <button 
                        onClick={() => setStock(stock + 1)}
                        className="p-2.5 rounded-lg border hover:bg-gray-100 transition"
                      >
                         <AiOutlinePlus />
                      </button>
                   </div>
                </div>

                {/* Variable Weight Logic */}
                <div className="md:col-span-2 pt-2">
                   <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                        <input
                            type="checkbox"
                            id="isVariableWeight"
                            name="isVariableWeight"
                            checked={formData.isVariableWeight}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="isVariableWeight" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer select-none">
                            Allow Variable Weight <span className="text-gray-400 font-normal">(e.g. for items sold by actual weight like Meat)</span>
                        </label>
                   </div>
                   
                   {formData.isVariableWeight && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Quantity</label>
                        <input
                            type="number"
                            step="0.01"
                            name="minOrderQuantity"
                            value={formData.minOrderQuantity || ""}
                            onChange={handleChange}
                            placeholder="e.g. 0.5"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        />
                    </div>
                   )}
                </div>

              </div>
            </section>

             {/* Marketing Card */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active Discount</label>
                    <Dropdown
                        options={[
                            { value: "", label: "No Discount" },
                            ...discounts?.map((d) => ({
                                value: d.id,
                                label: `${d.label} (${d.type === "PERCENTAGE" ? d.value + "%" : "₦" + d.value})`,
                            })) || []
                        ]}
                        value={formData.discountId || ""}
                        onChange={(v) => setFormData((prev) => ({ ...prev, discountId: v }))}
                        placeholder="Select Discount"
                    />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Label</label>
                    <Dropdown
                        options={[
                            {value:'NONE',label:'None'},
                            {value:'DAILY_DEAL',label:'Daily Deal'},
                            {value:'FEATURED',label:'Featured'},
                            {value:'POPULAR',label:'Popular'},
                            {value:'NEW_ARRIVAL',label:'New Arrival'}
                        ]}
                        value={formData.displayLabel || 'NONE'}
                        onChange={(v: string) =>
                          setFormData(prev => ({
                            ...prev,
                            displayLabel: v as DisplayLabel
                          }))
                        }

                        // onChange={(v) => setFormData((prev) => ({ ...prev, displayLabel: v as any }))}
                    />
                </div>
            </section>

            {/* Tags Card */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-3">Product Tags</label>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 font-medium">
                            <AiFillTag size={12} /> {tag}
                            <button onClick={() => handleRemoveTag(i)} className="hover:text-red-500 ml-1">
                                <AiOutlineClose size={12} />
                            </button>
                        </span>
                    ))}
                    {tags.length === 0 && <span className="text-gray-400 text-sm italic">No tags added yet.</span>}
                </div>
                <div className="flex gap-2">
                    <input 
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <button 
                        onClick={handleAddTag}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Add
                    </button>
                </div>
            </section>
            
            {/* Submit Button Area */}
            <div className="flex items-center justify-end pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full md:w-auto rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                  {isLoading ? "Saving Product..." : "Save Product"}
                </button>
            </div>

          </div>

          {/* RIGHT COLUMN: PREVIEW */}
          <aside className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-8 space-y-6">
              
              <div className="flex items-center justify-between text-gray-500 mb-2">
                 <span className="text-xs uppercase font-bold tracking-wider">Live Preview</span>
              </div>

              {/* Preview Card */}
              <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-100 overflow-hidden">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={previewImage}
                    alt="preview"
                    fill
                    className="object-cover"
                  />

                  {/* Label Badge */}
                  <div
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm ${labelColor}`}
                  >
                    {formData.displayLabel !== "NONE" ? formData.displayLabel?.replace("_", " ") : ""}
                  </div>
                </div>

                <div className="mt-5 px-1 pb-2">
                   <div className="flex justify-between items-start">
                        <div>
                             <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                                {categories.find(c => c.slug === formData.category)?.name || "Category"}
                             </p>
                             <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                {formData.productName || "Product Name"}
                             </h3>
                        </div>
                        <div className="text-right">
                             <p className="text-lg font-bold text-gray-900">{formatPrice(formData.priceInKobo)}</p>
                             <p className="text-xs text-gray-500 font-medium">per {formData.unitType}</p>
                        </div>
                   </div>

                   <p className="mt-3 text-sm text-gray-500 line-clamp-3 leading-relaxed">
                      {formData.description || "Product description will appear here..."}
                   </p>

                   {/* Tags in Preview */}
                   <div className="mt-4 flex flex-wrap gap-1">
                      {tags.map((tag, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                            #{tag}
                          </span>
                      ))}
                   </div>
                   
                   {/* Mock Add to Cart */}
                   <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                             {stock > 0 ? (
                                <span className="text-green-600 flex items-center gap-1">● In Stock ({stock})</span>
                             ) : (
                                <span className="text-red-500 flex items-center gap-1">● Out of Stock</span>
                             )}
                        </div>
                        <button className="bg-gray-900 text-white rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide">
                            Add to Cart
                        </button>
                   </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                 <h4 className="text-blue-800 font-semibold text-sm mb-1">Pro Tip</h4>
                 <p className="text-blue-600 text-xs leading-relaxed">
                    High-quality images significantly increase conversion rates. Ensure your product description highlights key benefits.
                 </p>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default ProductsForm;
