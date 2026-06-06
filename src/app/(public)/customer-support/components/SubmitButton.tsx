import { Send } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
}

export function SubmitButton({ loading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
        loading
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow"
      }`}
    >
      <Send className="w-4 h-4" />
      {loading ? "Sending..." : "Send message to support"}
    </button>
  );
}
