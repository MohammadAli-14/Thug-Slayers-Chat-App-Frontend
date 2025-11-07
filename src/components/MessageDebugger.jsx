import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { useState } from "react";

function MessageDebugger() {
  const { messages, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  const analyzeMessages = () => {
    return messages.map(msg => {
      const senderId = msg.senderId?._id || msg.senderId;
      const isOwnMessage = senderId === authUser._id;
      
      return {
        id: msg._id,
        text: msg.text?.substring(0, 30) + '...',
        sender: senderId,
        isOwnMessage,
        senderType: typeof msg.senderId,
        alignment: isOwnMessage ? 'RIGHT' : 'LEFT'
      };
    });
  };

  const analysis = analyzeMessages();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 bg-slate-800/90 p-3 rounded-lg border border-cyan-500/30 z-50"
      >
        <MessageCircleIcon className="w-4 h-4 text-cyan-400" />
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 bg-slate-900 border border-cyan-500/30 rounded-lg p-4 z-50 max-w-md max-h-96 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-cyan-400 font-bold">Message Debug</h3>
            <button onClick={() => setIsOpen(false)}>
              <XIcon className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="text-slate-400">
              Current User: {authUser._id?.substring(0, 8)}...
            </div>
            <div className="text-slate-400">
              Chat With: {selectedUser?._id?.substring(0, 8)}...
            </div>
            <div className="text-slate-400">
              Total Messages: {messages.length}
            </div>
            
            <div className="border-t border-slate-700 pt-2">
              <h4 className="text-slate-300 font-medium mb-2">Message Analysis:</h4>
              {analysis.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`p-2 rounded text-xs ${
                    msg.isOwnMessage ? 'bg-cyan-500/20' : 'bg-slate-800/50'
                  }`}
                >
                  <div className="font-mono">
                    #{index}: {msg.alignment} - "{msg.text}"
                  </div>
                  <div className="text-slate-400">
                    Sender: {msg.sender?.substring(0, 8)}... ({msg.senderType})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageDebugger;