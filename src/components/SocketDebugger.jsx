import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

function SocketDebugger() {
  const { socket, onlineUsers, authUser } = useAuthStore();

  useEffect(() => {
    if (!socket) return;

    const logEvent = (eventName, data) => {
      console.log(`🔍 Socket Event: ${eventName}`, data);
    };

    // Log all socket events for debugging
    const events = ['connect', 'disconnect', 'connect_error', 'newPrivateMessage', 'newGroupMessage'];
    events.forEach(event => {
      socket.on(event, (data) => {
        logEvent(event, data);
      });
    });

    return () => {
      events.forEach(event => {
        socket.off(event);
      });
    };
  }, [socket]);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800/90 p-3 rounded-lg text-xs border border-cyan-500/30 z-50">
      <div className="space-y-1">
        <div className={`flex items-center gap-2 ${socket?.connected ? 'text-green-400' : 'text-red-400'}`}>
          <div className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          Socket: {socket?.connected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="text-slate-400">Online: {onlineUsers.length} users</div>
        <div className="text-slate-400">User ID: {authUser?._id}</div>
        <div className="text-slate-400">Socket ID: {socket?.id}</div>
      </div>
    </div>
  );
}

export default SocketDebugger;