import { motion, AnimatePresence } from "framer-motion";
import { LogOutIcon, XIcon, AlertTriangleIcon } from "lucide-react";

function LogoutConfirmationDialog({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-area"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700/50 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <AlertTriangleIcon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200">
                  Confirm Logout
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-700/50"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-slate-300 text-center leading-relaxed">
                Are you sure you want to logout from Thug Slayers Messenger?
              </p>
              <p className="text-slate-400 text-sm text-center mt-2">
                You'll need to login again to access your chats.
              </p>
            </div>

            {/* Footer - Actions */}
            <div className="flex gap-3 p-6 border-t border-slate-700/50">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-slate-300 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all duration-200 font-medium border border-slate-600/50 hover:border-slate-500/50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 group"
              >
                <LogOutIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LogoutConfirmationDialog;