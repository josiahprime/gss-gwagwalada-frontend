import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, LucideIcon } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  Icon?: LucideIcon; // optional icon component
}

const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title = "Check your inbox!",
  message = "We've sent a confirmation link to your email. Please check your inbox or spam folder to verify your account.",
  buttonText = "Got it, thanks!",
  Icon = Mail,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[calc(100%-2rem)] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="p-8 flex flex-col items-center text-center">
              {/* Animated Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-blue-50 p-4 rounded-full text-blue-600"
                  >
                    <Icon size={40} strokeWidth={1.5} />
                  </motion.div>

                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-100 animate-ping opacity-25" />
                </div>
              </motion.div>

              {/* Text */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{message}</p>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
              >
                {buttonText}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;
