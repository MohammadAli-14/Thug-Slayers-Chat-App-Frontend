import { memo, useEffect, useRef, useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import MessageReactions from './MessageReactions';
import { useAuthStore } from '../store/useAuthStore';

// Memoized message item for better performance
const MessageItem = memo(({ data, index, style }) => {
  const { messages, authUser } = data;
  const message = messages[index];
  
  if (!message) return null;

  const isOwnMessage = message.senderId === authUser._id;
  const messageTime = new Date(message.createdAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={style} className={`px-4 ${isOwnMessage ? 'pr-6' : 'pl-6'}`}>
      <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
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
          
          <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
            {messageTime}
          </p>
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

const VirtualizedMessageList = memo(({ messages, onLoadMore, hasMore, isLoadingMore }) => {
  const { authUser } = useAuthStore();
  const listRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevMessagesLengthRef = useRef(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAtBottom && messages.length > prevMessagesLengthRef.current) {
      listRef.current?.scrollToItem(messages.length - 1, 'end');
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, isAtBottom]);

  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }) => {
    if (scrollUpdateWasRequested) return;

    // Check if user is at bottom
    const list = listRef.current;
    if (list) {
      const { scrollHeight, clientHeight } = list.innerRef || {};
      const isScrolledToBottom = scrollHeight - scrollOffset - clientHeight < 100;
      setIsAtBottom(isScrolledToBottom);
    }

    // Load more messages when near top
    if (scrollOffset < 200 && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  const itemData = {
    messages,
    authUser
  };

  // Estimate message height for virtual scrolling
  const getItemSize = (index) => {
    const message = messages[index];
    let height = 80; // Base height
    
    if (message?.image) height += 200;
    if (message?.text?.length > 100) height += 40;
    if (Object.keys(message?.reactions || {}).length > 0) height += 30;
    
    return Math.min(height, 400); // Cap maximum height
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">No messages yet</p>
      </div>
    );
  }

  return (
    <List
      ref={listRef}
      height={window.innerHeight - 200} // Adjust based on your layout
      itemCount={messages.length}
      itemSize={getItemSize}
      itemData={itemData}
      onScroll={handleScroll}
      overscanCount={5} // Render 5 items outside visible area
    >
      {MessageItem}
    </List>
  );
});

VirtualizedMessageList.displayName = 'VirtualizedMessageList';

export default VirtualizedMessageList;