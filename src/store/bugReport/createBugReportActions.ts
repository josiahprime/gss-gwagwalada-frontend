import { BugReportState, BugReportActions, Severity, BugStatus } from "./bugReportTypes";
import axiosInstance from "lib/axios";
import toast from "react-hot-toast";

export const createBugReportActions = (
  set: (partial: Partial<BugReportState> | ((state: BugReportState) => Partial<BugReportState>)) => void,
  get: () => BugReportState
): BugReportActions => ({
  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  setSteps: (steps: string) => set({ steps }),
  setSeverity: (severity: Severity) => set({ severity }),
  setContact: (contact: string) => set({ contact }),
  setFile: (file: File | null) => set({ file }),
  setLoading: (loading: boolean) => set({ loading }),

  resetForm: () =>
    set({
      title: "",
      description: "",
      steps: "",
      severity: "",
      contact: "",
      file: null,
      loading: false,
    }),

    submitBugReport: async () => {
        const { title, description, steps, severity, contact, file } = get();

        const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Required fields
        if (!title.trim() || !description.trim() || !severity) {
            toast.error("Please fill all required fields");
            return false;
        }

        // Email validation
        if (contact && !isValidEmail(contact)) {
            toast.error("Invalid email address");
            return false;
        }

        // Length checks
        if (title.length > 200) {
            toast.error("Title is too long");
            return false;
        }
        if (description.length > 2000) {
            toast.error("Description is too long");
            return false;
        }

        const toastId = toast.loading("Submitting bug report...");

        try {
            set({ loading: true });

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("steps", steps);
            formData.append("severity", severity);
            formData.append("contact", contact);
            if (file) formData.append("file", file);

            await axiosInstance.post("/bug-report", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("🎉 Thanks! We received your report.", { id: toastId });
            return true;
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit bug report", { id: toastId });
            return false;
        } finally {
            set({ loading: false });
        }
    },


  setBugStatus: async (id: number, status: BugStatus) => {
    const toastId = toast.loading("Updating bug status..."); // show loading toast
    try {
      // Call backend
      await axiosInstance.patch(`/bug-report/${id}`, { status });

      // Update local store
      set((state) => ({
        bugReports: state.bugReports.map((b) =>
          b.id === id ? { ...b, status } : b
        ),
      }));

      toast.success("Bug status updated", { id: toastId }); // replace loading with success
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bug status", { id: toastId }); // replace loading with error
    }
  },

   fetchBugs: async () => {
    const toastId = toast.loading("Fetching bug reports...");
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/bug-report");
      set({ bugReports: response.data });
      toast.success("Bug reports loaded", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bug reports", { id: toastId });
    } finally {
      set({ loading: false });
    }
  },
});
