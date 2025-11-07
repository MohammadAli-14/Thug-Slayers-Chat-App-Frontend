import { useState, useEffect, memo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { SmileIcon, LoaderIcon } from "lucide-react";
import Logger from "../utils/logger";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "👏"];

const MessageReactions = memo(({ messageId, messageType, currentReactions = {} }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [reactions, setReactions] = useState(currentReactions);
  const [isLoading, setIsLoading] = useState(false);
  const { addReaction, removeReactionByMessageAndEmoji, getMessageReactions } = useChatStore();
  const { authUser } = useAuthStore();

  // Load reactions when component mounts or messageId changes
  useEffect(() => {
    const loadReactions = async () => {
      if (!messageId || messageId.startsWith('temp-')) return;
      
      try {
        const result = await getMessageReactions(messageId, messageType);
        if (result.success && result.reactions) {
          setReactions(result.reactions);
        }
      } catch (error) {
        Logger.error("Failed to load reactions:", error);
      }
    };

    loadReactions();
  }, [messageId, messageType, getMessageReactions]);

  // Update when currentReactions prop changes (from socket events)
  useEffect(() => {
    setReactions(currentReactions);
  }, [currentReactions]);

  const handleReactionClick = async (emoji) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const userReaction = reactions[emoji]?.some(user => user._id === authUser._id);

      if (userReaction) {
        await removeReactionByMessageAndEmoji(messageId, emoji, messageType);
        // Socket event will update the reactions
      } else {
        await addReaction(messageId, emoji, messageType);
        // Socket event will update the reactions
      }
      
      setShowPicker(false);
    } catch (error) {
      Logger.error("Failed to handle reaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasUserReacted = (emoji) => {
    return reactions[emoji]?.some(user => user._id === authUser._id);
  };

  return (
    <div className="relative mt-2">
      {/* Reaction Display */}
      {Object.keys(reactions).length > 0 && (
        <div className="flex items-center gap-1 mb-2 flex-wrap">
          {Object.entries(reactions).map(([emoji, users]) => (
            <button
              key={emoji}
              onClick={() => handleReactionClick(emoji)}
              disabled={isLoading}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                hasUserReacted(emoji)
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                  : "bg-slate-700/50 border-slate-600/50 text-slate-400 hover:bg-slate-600/50"
              } disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation`}
            >
              <span>{emoji}</span>
              <span className="min-w-[8px] text-center">{users.length}</span>
            </button>
          ))}
        </div>
      )}

      {/* Reaction Picker */}
      <div className="relative inline-block">
        <button
          onClick={() => setShowPicker(!showPicker)}
          disabled={isLoading}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-200 rounded disabled:opacity-50 touch-manipulation"
        >
          {isLoading ? (
            <LoaderIcon className="w-4 h-4 animate-spin" />
          ) : (
            <SmileIcon className="w-4 h-4" />
          )}
        </button>

        {showPicker && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowPicker(false)}
            />
            
            <div className="absolute bottom-full left-0 mb-2 bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-lg z-50">
              <div className="flex gap-1 flex-wrap" style={{ width: '180px' }}>
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReactionClick(emoji)}
                    disabled={isLoading}
                    className="p-2 hover:bg-slate-700 rounded transition-colors text-lg disabled:opacity-50 touch-manipulation"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

MessageReactions.displayName = 'MessageReactions';

export default MessageReactions;