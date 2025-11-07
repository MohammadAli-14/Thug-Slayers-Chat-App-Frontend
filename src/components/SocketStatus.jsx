import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { WifiIcon, WifiOffIcon, MessageSquareIcon } from 'lucide-react';

function SocketStatus() {
  const { socket, onlineUsers, authUser } = useAuthStore();
  const { selectedUser, messages } = useChatStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show status for 5 seconds when connection changes
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [socket?.connected, onlineUsers]);

  if (!isVisible && socket?.connected) return null;

  return (
    <div className="fixed top-4 right-4 bg-slate-800/90 p-4 rounded-lg border border-slate-700/50 backdrop-blur-sm z-50 min-w-64">
      <div className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {socket?.connected ? (
              <>
                <WifiIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">Connected</span>
              </>
            ) : (
              <>
                <WifiOffIcon className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">Disconnected</span>
              </>
            )}
          </div>
          <div className="text-slate-400 text-xs">
            {onlineUsers.length} online
          </div>
        </div>

        {/* User Info */}
        <div className="text-xs space-y-1">
          <div className="text-slate-400">Your ID: {authUser?._id?.substring(0, 8)}...</div>
          {selectedUser && (
            <div className="text-slate-400">
              Chat with: {selectedUser.fullName}
            </div>
          )}
          <div className="text-slate-400">
            Messages: {messages.length}
          </div>
        </div>

        {/* Debug Info */}
        <div className="text-xs text-slate-500">
          Socket: {socket?.id?.substring(0, 10)}...
        </div>
      </div>
    </div>
  );
}

export default SocketStatus;