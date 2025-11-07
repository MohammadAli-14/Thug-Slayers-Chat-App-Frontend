import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageReactions from "./MessageReactions";
import MessageTimeDisplay from "./MessageTimeDisplay";
import { ArrowLeftIcon, UsersIcon, MoreVerticalIcon } from "lucide-react";
import GroupInfoModal from "./GroupInfoModal";

function GroupChatContainer() {
  const {
    selectedGroup,
    getGroupMessages,
    groupMessages,
    isGroupMessagesLoading,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
    setSelectedGroup,
    subscribeToReactions,
    unsubscribeFromReactions,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

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

  // ✅ FIXED: Enhanced group message management
  useEffect(() => {
    if (selectedGroup) {
      console.log('🔍 Initializing group chat for:', selectedGroup._id);
      getGroupMessages(selectedGroup._id);
      subscribeToGroupMessages();
      subscribeToReactions();
      
      // Join group room
      if (socket && selectedGroup._id) {
        socket.emit("joinGroup", selectedGroup._id);
        console.log('✅ Joined group room:', selectedGroup._id);
      }
    }

    return () => {
      unsubscribeFromGroupMessages();
      unsubscribeFromReactions();
      
      // Leave group room
      if (socket && selectedGroup?._id) {
        socket.emit("leaveGroup", selectedGroup._id);
        console.log('✅ Left group room:', selectedGroup._id);
      }
    };
  }, [selectedGroup, getGroupMessages, subscribeToGroupMessages, unsubscribeFromGroupMessages, subscribeToReactions, unsubscribeFromReactions, socket]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messageEndRef.current && groupMessages.length > 0) {
      messageEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [groupMessages]);

  const handleBackClick = () => {
    setSelectedGroup(null);
  };

  const handleGroupInfoClick = () => {
    setShowGroupInfo(true);
  };

  if (!selectedGroup) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">No group selected</p>
        </div>
      </div>
    );
  }

  const isUserAdmin = selectedGroup?.admin._id === authUser._id;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      {isMobile && (
        <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-700/50 chat-safe-area">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button 
                onClick={handleBackClick}
                className="flex-shrink-0 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors touch-manipulation p-2 -ml-2"
                aria-label="Back to groups"
              >
                <ArrowLeftIcon className="size-5" />
              </button>
              
              <div 
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer touch-manipulation"
                onClick={handleGroupInfoClick}
              >
                <div className="avatar">
                  <div className="size-10 rounded-full flex-shrink-0 bg-cyan-500/20 flex items-center justify-center overflow-hidden border-2 border-slate-600">
                    {selectedGroup.profilePic ? (
                      <img 
                        src={selectedGroup.profilePic} 
                        alt={selectedGroup.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UsersIcon className="size-5 text-cyan-400" />
                    )}
                  </div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <h3 className="text-slate-200 font-medium truncate text-base">
                    {selectedGroup.name}
                  </h3>
                  <p className="text-slate-400 text-xs truncate">
                    {selectedGroup.members?.length || 0} members
                    {isUserAdmin && " • Admin"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleGroupInfoClick}
                className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors touch-manipulation p-2 -mr-2"
                aria-label="Group info"
              >
                <MoreVerticalIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Header */}
      {!isMobile && (
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
          <div className="hidden md:flex justify-between items-center bg-slate-800/50 px-6 py-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleGroupInfoClick}
            >
              <div className="avatar">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center overflow-hidden">
                  {selectedGroup.profilePic ? (
                    <img 
                      src={selectedGroup.profilePic} 
                      alt={selectedGroup.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UsersIcon className="size-6 text-cyan-400" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-slate-200 font-medium">{selectedGroup.name}</h3>
                <p className="text-slate-400 text-sm">
                  {selectedGroup.members?.length || 0} members
                  {isUserAdmin && " • You are admin"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleGroupInfoClick}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <MoreVerticalIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={handleBackClick}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto mobile-scroll scrollbar-thin ${
          isMobile 
            ? 'px-3 py-3 pb-4 messages-container-mobile' 
            : 'px-4 md:px-6 py-4'
        }`}
      >
        {groupMessages.length > 0 && !isGroupMessagesLoading ? (
          <div className={`space-y-3 md:space-y-4 ${!isMobile ? 'max-w-3xl mx-auto' : ''}`}>
            {groupMessages.map((msg) => (
              <GroupMessageBubble 
                key={msg._id} 
                message={msg} 
                authUser={authUser}
                isSystem={msg.messageType === "system"}
                isMobile={isMobile}
              />
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isGroupMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedGroup.name} isGroup={true} />
        )}
      </div>

      {/* Message Input */}
      <div className={`sticky bottom-0 z-10 bg-slate-900 border-t border-slate-700/50 ${
        isMobile ? 'pb-[env(safe-area-inset-bottom)]' : ''
      }`}>
        <MessageInput isGroup={true} />
      </div>

      {/* Group Info Modal */}
      {showGroupInfo && (
        <GroupInfoModal 
          group={selectedGroup}
          onClose={() => setShowGroupInfo(false)}
        />
      )}
    </div>
  );
}

// ✅ FIXED: Enhanced GroupMessageBubble with better reaction handling
const GroupMessageBubble = ({ message, authUser, isSystem, isMobile }) => {
  if (isSystem) {
    return (
      <div className="text-center px-2">
        <span className="inline-block bg-slate-800/50 text-slate-400 text-xs md:text-sm px-3 py-2 rounded-full max-w-xs">
          {message.systemMessage}
        </span>
      </div>
    );
  }

  // Handle both string senderId and populated sender object
  const senderId = message.senderId?._id || message.senderId;
  const isOwnMessage = senderId === authUser._id;
  const senderName = message.senderId?.fullName || 'Unknown User';

  // File download handler
  const handleFileDownload = () => {
    if (message.file) {
      const link = document.createElement('a');
      link.href = message.file;
      link.download = message.fileName || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} group px-1`}>
      {!isOwnMessage && (
        <div className="chat-header text-slate-400 text-xs md:text-sm mb-1 px-2">
          {senderName}
        </div>
      )}
      <div
        className={`chat-bubble relative max-w-xs md:max-w-md ${
          isOwnMessage
            ? "bg-cyan-600 text-white"
            : "bg-slate-800 text-slate-200"
        }`}
      >
        {/* Image display */}
        {message.image && (
          <img 
            src={message.image} 
            alt="Shared" 
            className="rounded-lg max-w-full h-auto max-h-48 object-cover mb-2" 
          />
        )}
        
        {/* File display */}
        {message.file && !message.image && (
          <div 
            className="bg-slate-700/50 rounded-lg p-3 mb-2 cursor-pointer hover:bg-slate-700/70 transition-colors touch-manipulation"
            onClick={handleFileDownload}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {message.fileType === 'video' ? '🎬' : 
                 message.fileType === 'raw' ? '📄' : '📎'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 font-medium text-sm truncate">
                  {message.fileName || 'Download file'}
                </p>
                <p className="text-slate-400 text-xs">
                  {message.fileType === 'video' ? 'Video' : 
                   message.fileType === 'raw' ? 'Document' : 'File'} • 
                  Click to download
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Video display */}
        {message.fileType === 'video' && message.file && (
          <div className="mb-2">
            <video 
              controls 
              className="rounded-lg max-w-full max-h-48"
              poster={message.image}
            >
              <source src={message.file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        {message.text && <p className="break-words text-sm md:text-base">{message.text}</p>}
        
        {/* ✅ FIXED: Message Reactions with real-time updates */}
        <MessageReactions 
          messageId={message._id}
          messageType="group"
          currentReactions={message.reactions || {}}
          groupId={message.groupId}
        />
        
        <MessageTimeDisplay 
          message={message} 
          isOwnMessage={isOwnMessage} 
        />
      </div>
    </div>
  );
};

export default GroupChatContainer;