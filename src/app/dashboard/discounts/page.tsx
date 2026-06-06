"use client";

import { useEffect, useState } from "react";
import { useDiscountStore } from "store/discount/useDiscountStore";
import DiscountHero from "./components/DiscountHero";
import DiscountTable from "./components/DiscountTable";
import DiscountFormModal from "./components/DiscountFormModal";
import { Discount, DiscountFormState, initialForm } from "store/discount/discountTypes";
import { useThemeStore } from "store/theme/themeStore";
import toast from "react-hot-toast";

export default function Index() {
  const theme = useThemeStore((s) => s.theme);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [form, setForm] = useState<DiscountFormState>(initialForm);

  const {
    discounts,
    fetchDiscounts,
    addDiscount,
    updateDiscount,
    deleteDiscount,
  } = useDiscountStore();

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setOpen(true);
  };

  const openEdit = (d: Discount) => {
    setEditing(d);
    setForm({
      label: d.label,
      type: d.type,
      value: d.value,
      startDate: d.startDate || "",
      endDate: d.endDate || "",
      isActive: d.isActive,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.label.trim()) {
      toast.error("Label required");
      return;
    }

    if (form.value <= 0) {
      toast.error("Invalid value");
      return;
    }

    if (editing) {
      updateDiscount(editing.id, form);
    } else {
      addDiscount(form);
    }

    setOpen(false);
    setEditing(null);
  };


  const remove = (id: string) => {
    if (!confirm("Delete this discount?")) return;
    deleteDiscount(id);
  };

  const active = discounts.filter((d) => d.isActive).length;
  const upcoming = discounts.filter(
    (d) => d.startDate && new Date(d.startDate) > new Date()
  ).length;

  return (
    <div
      className={`shadow-md p-5 m-5 rounded-lg transition-colors duration-500
        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
    >
      <DiscountHero
        total={discounts.length}
        active={active}
        upcoming={upcoming}
        onCreate={openCreate}
      />

      <DiscountTable
        discounts={discounts}
        onEdit={openEdit}
        onDelete={remove}
        theme={theme}
      />

      <DiscountFormModal
        open={open}
        editing={editing}
        form={form}
        setForm={setForm}
        onSave={save}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
