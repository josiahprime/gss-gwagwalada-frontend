import { useState } from 'react';
import { Send } from 'lucide-react';

interface CustomerReplyBoxProps {
  disabled: boolean;
  onSend: (message: string) => void;
  onType: () => void; // 👈 Add this
}

const CustomerReplyBox = ({ disabled, onSend, onType }: CustomerReplyBoxProps) => {
  const [reply, setReply] = useState('');

  const handleSend = () => {
    if (reply.trim() && !disabled) {
      onSend(reply);
      setReply('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-white">
      <div className="flex gap-3">
        <textarea
          value={reply}
          onChange={(e) => {setReply(e.target.value); onType();}}
          
          onKeyDown={handleKeyDown}
          placeholder="Type your reply..."
          rows={2}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
        />
        <button
          onClick={handleSend}
          disabled={!reply.trim()}
          className={`self-end px-4 py-3 rounded-xl transition-all ${
            reply.trim()
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CustomerReplyBox;
