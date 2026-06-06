'use client';

import { ChangeEvent, FormEvent } from "react";
import { Bug, Upload, X } from "lucide-react";
import { CustomSelect } from "./CustomSelect";
import { motion, AnimatePresence } from "framer-motion";

import { useBugReportStore } from "store/bugReport/useBugReportStore";

interface BugReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BugReportModal = ({ open, onOpenChange }: BugReportModalProps) => {
  const {
    title,
    description,
    steps,
    severity,
    contact,
    file,
    loading,

    setTitle,
    setDescription,
    setSteps,
    setSeverity,
    setContact,
    setFile,

    submitBugReport,
    resetForm
  } = useBugReportStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const success = await submitBugReport();

    if (success) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 px-4 pt-12 sm:pt-0"
        >
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl w-full sm:w-[500px] max-h-[80vh] overflow-y-auto p-6 relative no-scrollbar"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => onOpenChange(false)}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Bug className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Report a Bug</h2>
                <p className="text-gray-600 text-sm">
                  Help us improve by letting us know what went wrong
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pr-2 no-scrollbar">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Bug Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  placeholder="What happened?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Steps to Reproduce <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <textarea
                  placeholder="1. Go to... 2. Click... 3. See error"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <CustomSelect
                value={severity}
                onChange={setSeverity}
                placeholder="Select severity level"
                options={[
                  { value: "low", label: "🟢 Low" },
                  { value: "medium", label: "🟡 Medium" },
                  { value: "high", label: "🟠 High" },
                  { value: "critical", label: "🔴 Critical" },
                ]}
              />

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Attach Screenshot <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="screenshot"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="screenshot"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-600 hover:bg-gray-50 transition"
                  >
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </span>
                  </label>

                  {file && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 transition"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Contact Info <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-br from-purple-600 to-pink-500 text-white font-medium p-2 rounded-md shadow"
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-md p-2 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
