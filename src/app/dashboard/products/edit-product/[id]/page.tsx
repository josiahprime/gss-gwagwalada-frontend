
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useRef} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AiOutlinePlus, AiOutlineClose, AiOutlineUpload, AiFillTag } from "react-icons/ai";
import { useParams } from "next/navigation";
import Image from "next/image"; // Preserving Next.js Image optimization where possible

// Stores
import { useProductStore } from "store/product/useProductStore";
import { useDiscountStore } from "store/discount/useDiscountStore";
import { Product, ProductFormData } from "store/product/productTypes";
import ProductEditSkeleton from "app/components/ui/ProductEditSkeleton";



// --- TYPES & HELPERS ---

type DisplayLabel = "NONE" | "POPULAR" | "DAILY_DEAL" | "NEW_ARRIVAL" | "FEATURED";


// Helper for Dropdown to keep UI clean
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
        <svg className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="absolute left-0 right-0 z-50 mt-2 max-h-48 overflow-auto rounded-lg border border-gray-100 bg-white py-1 shadow-xl">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`cursor-pointer px-4 py-2 text-sm hover:bg-blue-50 ${opt.value === value ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-700"}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const categories = [
  { name: "Meat & Poultry", slug: "meat-poultry" },
  { name: "Fish & Seafood", slug: "fish-seafood" },
  { name: "Dairy & Eggs", slug: "dairy-eggs" },
  { name: "Fresh Produce", slug: "fresh-produce" },
  { name: "Pantry & Sweeteners", slug: "pantry-sweeteners" },
  { name: "Animal Feeds & Supplements", slug: "animal-feeds-supplements" },
];

// --- MAIN COMPONENT ---

const EditProduct = () => {
  // 1. STATE & STORES
  const { id } = useParams();
  const [newTag, setNewTag] = useState('');

  const router = useRouter();
  
  const { products, fetchProducts, updateProduct, isUpdatingProduct, singleProduct, fetchProductById, isLoading } = useProductStore();
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const { discounts, fetchDiscounts } = useDiscountStore();

  const [formData, setFormData] = useState<ProductFormData>({
    id: "",
    productName: "",
    priceInKobo: 0,
    description: "",
    stock: 0,
    images: [],
    category: "",
    tags: [],
    unitType: "piece",
    isVariableWeight: false,
    minOrderQuantity: 1,
    discountId: "",
    displayLabel: "NONE",
  });

  // 2. EFFECTS
  // useEffect(() => {
  //   fetchProducts();
  //   fetchDiscounts();
  // }, [fetchProducts, fetchDiscounts]);

  useEffect(() => {
    if (!id) return;

    // Ensure it's a string
    const productId = Array.isArray(id) ? id[0] : id;
    fetchProductById(productId);
    fetchDiscounts();
  }, [id, fetchProductById, fetchDiscounts]);



  const parseDisplayLabel = (label?: string) =>
    ["NONE", "POPULAR", "DAILY_DEAL", "NEW_ARRIVAL", "FEATURED"].includes(label || "")
      ? (label as "NONE" | "POPULAR" | "DAILY_DEAL" | "NEW_ARRIVAL" | "FEATURED")
      : "NONE";

  // Hydrate Form
  useEffect(() => {
    if (!singleProduct) return;

    setFormData({
      id: singleProduct.id,
      productName: singleProduct.productName,
      priceInKobo: singleProduct.priceInKobo,
      description: singleProduct.description,
      stock: singleProduct.stock,
      images: singleProduct.images.map(img => ({
        id: img.id,
        url: img.url,
        index: img.index,
      })),
      category: singleProduct.category,
      tags: singleProduct.tags,
      unitType: singleProduct.unitType || "piece",
      isVariableWeight: singleProduct.isVariableWeight ?? false,
      minOrderQuantity: singleProduct.minOrderQuantity ?? 1,
      discountId: singleProduct.discountId || "",
      displayLabel: parseDisplayLabel(singleProduct.displayLabel),
    });
  }, [singleProduct]);


  // 3. HANDLERS

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Checkbox handling inside generic handler
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "priceInKobo" || name === "stock" || name === "minOrderQuantity"
        ? parseFloat(value)
        : value,
    }));
  };

  // Image Logic
  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const newIndex = formData.images.length;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { index: newIndex, file, previewUrl }],
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, indexToReplace: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => {
      const updated = prev.images.map((img) => {
        if (img.index === indexToReplace) {
          return { ...img, file, previewUrl };
        }
        return img;
      });
      return { ...prev, images: updated };
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    // 1. Find the image using the current state variable (formData)
    const imgToRemove = formData.images.find(img => img.index === indexToRemove);

    // 2. Handle the Deleted IDs update separately
    if (imgToRemove && imgToRemove.id) {
      // We assign to a const to ensure TS knows it's a string
      const idToDelete = imgToRemove.id; 
      setDeletedImageIds(prevIds => [...prevIds, idToDelete]);
    }

    // 3. Update the FormData
    setFormData(prev => {
      const remaining = prev.images
        .filter(img => img.index !== indexToRemove)
        .map((img, newIndex) => ({ ...img, index: newIndex }));

      return { ...prev, images: remaining };
    });
  };




  // Tag Logic
  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed || formData.tags.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setNewTag('');
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== indexToRemove),
    }));
  };

  // Submit Logic (Using FormData as per original logic)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("id", formData.id);
    form.append("productName", formData.productName);
    form.append("priceInKobo", String(formData.priceInKobo));
    form.append("description", formData.description);
    form.append("stock", String(formData.stock));
    form.append("category", formData.category);
    form.append("unitType", formData.unitType);
    form.append("isVariableWeight", String(formData.isVariableWeight));
    form.append("minOrderQuantity", String(formData.minOrderQuantity));
    form.append("discountId", formData.discountId || "");
    form.append("displayLabel", formData.displayLabel || "NONE");

    formData.tags.forEach((tag, i) => {
      form.append(`tags[${i}]`, tag);
    });

    deletedImageIds.forEach((id) => {
      form.append("deletedImageIds[]", id);
    });

    formData.images.forEach((img) => {
      if (img.file) {
        form.append("newImages", img.file);
        form.append("newImageIndexes", String(img.index));
        if (img.id) form.append("replacingImageIds", img.id);
      } else if (img.id) {
        form.append("existingImages[]", JSON.stringify({ id: img.id, index: img.index }));
      }
    });

    // Show loading toast
    const toastId = toast.loading("Updating product...");

    try {
      const result = await updateProduct(form);

      if (result.success) {
        toast.success("Product updated successfully!", { id: toastId });
        router.push("/dashboard/products"); // Navigate after success
      } else {
        toast.error(result.message || "Failed to update product", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product", { id: toastId });
    }
  };



  // 4. RENDER
  if (isLoading || !singleProduct) {
    return <ProductEditSkeleton/>
  }




  const previewImage = formData.images[0]?.previewUrl ?? formData.images[0]?.url ?? 
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <div className="mx-auto max-w-[1200px] p-6 font-sans text-gray-800">
      
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Edit Product</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-xl">
            Update the product details below. Changes are saved directly to the database.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* LEFT FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* General Info */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input 
                  name="productName" 
                  value={formData.productName} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={4} 
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Dropdown 
                  options={categories.map(c => ({value:c.slug,label:c.name}))} 
                  value={formData.category} 
                  onChange={(v)=>setFormData(prev=>({...prev,category:v}))} 
                  placeholder="Select Category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input 
                  name="stock" 
                  type="number"
                  value={formData.stock} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                />
              </div>
            </div>
          </section>

          {/* Pricing & Units */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Pricing & Configuration</h3>
            <div className="grid gap-5 md:grid-cols-2">
               <div>
                <label className="block text-sm font-medium mb-1">Price (Kobo)</label>
                <input 
                  name="priceInKobo" 
                  type="number"
                  value={formData.priceInKobo} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Unit Type</label>
                <Dropdown 
                  options={[
                    {value:'piece',label:'Piece'},
                    {value:'kg',label:'Kilogram'},
                    {value:'litre',label:'Litre'},
                    {value:'pack',label:'Pack'},
                    {value:'dozen',label:'Dozen'},
                    {value:'crate',label:'Crate'}
                  ]} 
                  value={formData.unitType} 
                  onChange={(v)=>setFormData(prev=>({...prev,unitType:v}))} 
                />
              </div>

              {/* Variable Weight */}
              <div className="md:col-span-2 mt-2">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isVariableWeight" 
                    checked={formData.isVariableWeight} 
                    onChange={handleChange} 
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                  />
                  <span>Is Variable Weight?</span>
                </label>
                
                {formData.isVariableWeight && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-medium mb-1">Min Order Quantity</label>
                    <input 
                      name="minOrderQuantity" 
                      type="number" 
                      step="0.01" 
                      value={formData.minOrderQuantity} 
                      onChange={handleChange} 
                      className="w-40 rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" 
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Marketing (Discount & Label) */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
             <h3 className="text-lg font-semibold mb-4">Marketing</h3>
             <div className="grid gap-5 md:grid-cols-2">
                <div>
                   <label className="block text-sm font-medium mb-1">Discount</label>
                   <Dropdown 
                     options={[
                       {value:'', label: 'No Discount'},
                       ...discounts.map(d => ({ value: d.id, label: `${d.label} (${d.value}%)` }))
                     ]}
                     value={formData.discountId || ""}
                     onChange={(v)=>setFormData(prev=>({...prev,discountId:v}))}
                     placeholder="Select Discount"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Display Label</label>
                   <Dropdown 
                     options={[
                       {value:'NONE',label:'None'},
                       {value:'NEW_ARRIVAL',label:'New Arrival'},
                       {value:'FEATURED',label:'Featured'},
                       {value:'POPULAR',label:'Popular'},
                       {value:'DAILY_DEAL',label:'Daily Deal'}
                     ]}
                     value={formData.displayLabel || 'NONE'}
                     onChange={(v) =>
                        setFormData(prev => ({
                          ...prev,
                          displayLabel: v as DisplayLabel
                        }))
                      }

                    //  onChange={(v)=>setFormData(prev=>({...prev,displayLabel:v as any}))}
                   />
                </div>
             </div>
          </section>

          {/* Tags */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="block text-sm font-medium mb-3">Tags</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag, i) => (
                <span key={`${tag}-${i}`} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  <AiFillTag className="text-gray-500"/> {tag}
                  <button type="button" onClick={() => handleRemoveTag(i)} className="rounded-full p-0.5 hover:bg-gray-200 text-red-500">
                    <AiOutlineClose size={12}/>
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)} 
                placeholder="Add tag..." 
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" 
              />
              <button 
                type="button" 
                onClick={handleAddTag} 
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <AiOutlinePlus /> Add
              </button>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => window.location.reload()} 
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUpdatingProduct}
              className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdatingProduct ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* RIGHT SIDEBAR (Preview & Image Management) */}
        <aside className="lg:col-span-5">
          <div className="sticky top-8 space-y-6">
            
            {/* Preview Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg overflow-hidden">
              <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-gray-100">
                 <Image 
                    src={previewImage} 
                    alt="preview" 
                    fill 
                    className="object-cover"
                 />
                 {formData.displayLabel !== "NONE" && (
                   <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
                      {formData.displayLabel?.replace("_", " ")}
                   </span>
                 )}
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{formData.productName || "Product Name"}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{formData.description || "Product description will appear here."}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-700">
                     {Number(formData.priceInKobo || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{formData.stock} in stock</div>
                </div>
              </div>
            </div>

            {/* Image Gallery Management */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-800">Image Gallery (Max 5)</h4>
                {formData.images.length < 5 && (
                  <div className="relative">
                     <label htmlFor="fileUploadGallery" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium hover:bg-gray-100 transition">
                       <AiOutlineUpload /> Upload New
                     </label>
                     <input id="fileUploadGallery" type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {formData.images.length === 0 ? (
                  <div className="col-span-3 py-8 text-center text-xs text-gray-400 border border-dashed rounded-lg bg-gray-50">
                     No images yet.
                  </div>
                ) : (
                  formData.images
                    .sort((a, b) => a.index - b.index)
                    .map((img, idx) => (
                    <div key={img.id || idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <Image 
                        src={img.previewUrl ?? img.url!} 
                        alt={`img-${idx}`} 
                        fill 
                        className="object-cover" 
                      />
                      
                      {/* Controls Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         {/* Replace Button */}
                         <label className="cursor-pointer bg-white p-1.5 rounded-full shadow hover:bg-gray-100" title="Replace">
                            <AiOutlineUpload size={14} />
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, img.index)} className="hidden" />
                         </label>
                         {/* Remove Button */}
                         <button 
                            type="button"
                            onClick={() => handleRemoveImage(img.index)}
                            className="bg-white p-1.5 rounded-full shadow hover:bg-red-50 text-red-500"
                            title="Remove"
                         >
                            <AiOutlineClose size={14} />
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditProduct;
