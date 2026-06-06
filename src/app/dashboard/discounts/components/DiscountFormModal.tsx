// components/DiscountFormModal.tsx
import type { Discount, DiscountType } from "store/discount/discountTypes";


interface Props {
  open: boolean;
  editing: Discount | null;
  form: any;
  setForm: (f: any) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function DiscountFormModal({ open, editing, form, setForm, onSave, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{editing ? "Edit Discount" : "Create Discount"}</h3>
        {/* Form grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          {/* Label */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Summer Sale" className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          {/* Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DiscountType })} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed</option>
            </select>
          </div>
          {/* Value */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input type="number" min={0} step={form.type === "PERCENTAGE" ? 1 : 100} value={Number.isNaN(form.value) ? 0 : form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          {/* Active toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Active</label>
              <span className="text-xs text-gray-500">Toggle availability</span>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="sr-only" />
              <span className={`h-5 w-10 rounded-full transition-colors ${form.isActive ? "bg-violet-600" : "bg-gray-200"}`} />
              <span className="ml-3 text-sm text-gray-700">{form.isActive ? "On" : "Off"}</span>
            </label>
          </div>
          {/* Start & End dates */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 rounded bg-violet-600 text-white hover:bg-violet-700">Save</button>
        </div>
      </div>
    </div>
  );
}
