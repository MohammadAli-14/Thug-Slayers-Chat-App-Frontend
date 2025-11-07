// frontend/src/components/ChatContainer.jsx - ENHANCED WITH AUTO-SCROLL
import { useEffect, useRef, useState, memo, useCallback, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageReactions from "./MessageReactions";
import MessageTimeDisplay from "./MessageTimeDisplay";
import { ArrowLeftIcon, LoaderIcon } from "lucide-react";

// FIXED MemoizedMessageBubble component with proper sender detection
const MemoizedMessageBubble = memo(({ message, authUser }) => {
  // ✅ FIXED: Proper sender detection that handles both object and string formats
  const getIsOwnMessage = (message, authUser) => {
    if (!message || !authUser) return false;
    
    // Handle both string senderId and populated sender object
    const senderId = message.senderId?._id || message.senderId;
    return senderId === authUser._id;
  };

  const isOwnMessage = getIsOwnMessage(message, authUser);

  console.log("🔍 Message debug:", {
    messageId: message._id,
    senderId: message.senderId,
    authUserId: authUser._id,
    isOwnMessage: isOwnMessage,
    senderType: typeof message.senderId
  });

  return (
    <div
      className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} group`}
    >
      {/* Show avatar only for received messages */}
      {!isOwnMessage && (
        <div className="chat-image avatar">
          <div className="w-8 rounded-full">
            <img 
              src={message.senderId?.profilePic || "/avatar.png"} 
              alt={message.senderId?.fullName || "User"} 
            />
          </div>
        </div>
      )}
      
      <div
        className={`chat-bubble relative max-w-xs md:max-w-md ${
          isOwnMessage
            ? "bg-cyan-600 text-white"
            : "bg-slate-800 text-slate-200"
        }`}
      >
        {message.image && (
          <img 
            src={message.image} 
            alt="Shared" 
            className="rounded-lg max-w-full h-auto max-h-48 object-cover" 
            loading="lazy"
          />
        )}
        {message.text && (
          <p className="mt-2 break-words text-sm md:text-base">{message.text}</p>
        )}
        
        <MessageReactions 
          messageId={message._id}
          messageType="private"
          currentReactions={message.reactions || {}}
        />
        
        <MessageTimeDisplay 
          message={message} 
          isOwnMessage={isOwnMessage} 
        />
      </div>
      
      {/* Show sender name for received messages */}
      {!isOwnMessage && (
        <div className="chat-header text-slate-400 text-xs mt-1">
          {message.senderId?.fullName || 'Unknown User'}
        </div>
      )}
    </div>
  );
});

MemoizedMessageBubble.displayName = 'MemoizedMessageBubble';

// Enhanced ChatContainer with auto-scroll
const ChatContainer = memo(function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    setSelectedUser,
    setSelectedGroup,
    subscribeToReactions,
    unsubscribeFromReactions,
    loadMoreMessages,
    messagePagination,
    typingUsers,
    preloadConversations
  } = useChatStore();
  
  const { authUser, onlineUsers } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesContainerRef = useRef(null);
  const messageEndRef = useRef(null); // ADDED: For auto-scroll

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Auto-scroll to bottom when messages change - ADDED THIS FEATURE
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [messages]);

  // Preload user conversations when user is selected
  useEffect(() => {
    if (selectedUser && authUser) {
      const conversationId = [authUser._id, selectedUser._id].sort().join('_');
      preloadConversations([conversationId]);
    }
  }, [selectedUser, authUser, preloadConversations]);

  // Optimized message fetching and subscription
  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      getMessagesByUserId(selectedUser._id);
      subscribeToMessages();
      subscribeToReactions();
    }

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromReactions();
    };
  }, [
    selectedUser, 
    getMessagesByUserId, 
    subscribeToMessages, 
    unsubscribeFromMessages,
    subscribeToReactions,
    unsubscribeFromReactions
  ]);

  // Handle loading more messages with debouncing
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !messagePagination.hasMore) return;
    
    setIsLoadingMore(true);
    try {
      await loadMoreMessages();
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, messagePagination.hasMore, loadMoreMessages]);

  const handleBackClick = useCallback(() => {
    setSelectedUser(null);
    setSelectedGroup(null);
  }, [setSelectedUser, setSelectedGroup]);

  // Get typing users for current chat
  const currentTypingUsers = useCallback(() => {
    if (!selectedUser) return [];
    const key = `user_${selectedUser._id}`;
    const chatTypingUsers = typingUsers.get(key);
    return chatTypingUsers ? Array.from(chatTypingUsers.values()) : [];
  }, [typingUsers, selectedUser]);

  // Memoize user online status
  const isUserOnline = useMemo(() => 
    onlineUsers.includes(selectedUser?._id), 
    [onlineUsers, selectedUser?._id]
  );

  // Guard clause to prevent rendering when no user is selected
  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Enhanced Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-700/50 chat-safe-area">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button 
                onClick={handleBackClick}
                className="flex-shrink-0 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors touch-manipulation p-2 -ml-2"
                aria-label="Back to chats"
              >
                <ArrowLeftIcon className="size-5" />
              </button>
              
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`avatar ${isUserOnline ? "online" : "offline"}`}>
                  <div className="size-10 rounded-full flex-shrink-0 border-2 border-slate-600">
                    <img 
                      src={selectedUser.profilePic || "/avatar.png"} 
                      alt={selectedUser.fullName}
                      className="object-cover w-full h-full"
                      loading="eager"
                    />
                  </div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <h3 className="text-slate-200 font-medium truncate text-base">
                    {selectedUser.fullName}
                  </h3>
                  <p className="text-slate-400 text-xs truncate">
                    {isUserOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Header */}
      {!isMobile && (
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
          <ChatHeader />
        </div>
      )}
      
      {/* Messages Area with Auto-scroll - ENHANCED */}
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto ${
          isMobile 
            ? 'px-3 py-3 pb-4 messages-container-mobile' 
            : 'px-4 md:px-6 py-4'
        }`}
      >
        {messages.length > 0 && !isMessagesLoading ? (
          <div className={`space-y-3 md:space-y-4 ${!isMobile ? 'max-w-3xl mx-auto' : ''}`}>
            {/* Loading indicator for older messages */}
            {isLoadingMore && (
              <div className="flex justify-center py-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full">
                  <LoaderIcon className="size-4 animate-spin text-cyan-400" />
                  <span className="text-xs text-slate-400">Loading older messages...</span>
                </div>
              </div>
            )}
            
            {/* Messages */}
            {messages.map((message) => (
              <MemoizedMessageBubble
                key={message._id}
                message={message}
                authUser={authUser}
              />
            ))}
            
            {/* Auto-scroll anchor - ADDED THIS */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
        
        {/* Typing indicators */}
        {currentTypingUsers().length > 0 && (
          <div className="sticky bottom-4 left-4">
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-slate-400 text-xs">
                {currentTypingUsers().length === 1 
                  ? `${currentTypingUsers()[0].fullName} is typing...`
                  : `${currentTypingUsers().length} people are typing...`
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className={`sticky bottom-0 z-10 bg-slate-900 border-t border-slate-700/50 ${
        isMobile ? 'pb-[env(safe-area-inset-bottom)]' : ''
      }`}>
        <MessageInput />
      </div>
    </div>
  );
}); 

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;