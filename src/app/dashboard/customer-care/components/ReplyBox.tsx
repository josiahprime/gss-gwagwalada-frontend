import { useState } from "react";
import { Send } from "lucide-react";

export default function ReplyBox({
  onSendReply,
  disabled,
  onType, // 👈 1. Add the prop
}: {
  onSendReply: (content: string) => void;
  disabled?: boolean;
  onType: () => void; // 👈 2. Update the type
}) {
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (!content.trim() || disabled) return;
    onSendReply(content.trim());
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          onType(); // 👈 3. Trigger the typing event upstairs
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type your reply..."
        rows={4}
        disabled={disabled}
        className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Press Ctrl / Cmd + Enter to send
        </p>

        <button
          onClick={handleSend}
          disabled={!content.trim() || disabled}
          className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          Send Reply
        </button>
      </div>
    </div>
  );
}