"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import useAccountStore from "store/account/useAccountStore";
import { useAuthStore } from "store/auth/useAuthStore";

export const AccountActions = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Zustand store action
  const deleteUser = useAccountStore((state) => state.deleteUser);
  const userId = useAuthStore((state) => state.authUser?.id); 

  const handleDeleteAccount = async () => {
    if (!userId) return;

    setIsDeleting(true);
    toast.loading("Deleting your account...");

    try {
      // Call deleteUser from store (soft-delete + logout + clear state)
      await deleteUser(userId);

      toast.dismiss(); // remove loading toast
      toast.success("Your account has been deleted.");

      // Dialog close handled automatically because user is logged out and redirected
      setShowDialog(false);
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast.dismiss();
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg shadow-black/20">
      <h2 className="text-2xl font-semibold text-white mb-6">Account Actions</h2>

      <div className="space-y-4">
        {/* Delete Account Button */}
        <button
          onClick={() => setShowDialog(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-red-500/80 to-pink-500/70 hover:from-red-600/90 hover:to-pink-600/80 active:scale-95 transition-all shadow-md shadow-red-500/30"
        >
          <Trash2 className="h-5 w-5" />
          Delete Account
        </button>

        {/* Confirmation Dialog */}
        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 w-[90%] md:w-[400px] shadow-lg shadow-black/30">
              <h3 className="text-lg font-semibold text-white mb-2">
                Are you absolutely sure?
              </h3>
              <p className="text-sm text-gray-200/80 mb-6">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDialog(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-md font-medium text-white/90 bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-red-500/90 to-pink-500/90 hover:from-red-600 hover:to-pink-600 transition-all shadow-md shadow-red-500/40"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
