// frontend/src/store/useChatStore.js - OPTIMIZED VERSION WITH DUPLICATE PREVENTION
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

// ADD THIS HELPER FUNCTION at the top of useChatStore.js
const normalizeMessage = (message, authUser) => {
  if (!message) return message;
  
  // Ensure consistent senderId structure
  let normalizedMessage = { ...message };
  
  // If senderId is a string, convert to object format for consistency
  if (typeof normalizedMessage.senderId === 'string') {
    normalizedMessage.senderId = {
      _id: normalizedMessage.senderId,
      fullName: authUser?.fullName || 'You',
      profilePic: authUser?.profilePic || '/avatar.png',
      email: authUser?.email || ''
    };
  }
  
  return normalizedMessage;
};

// Message cache with LRU (Least Recently Used) strategy
class MessageCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessCount = 0;
    this.hitCount = 0;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove least recently used item
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 0
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (item) {
      item.accessCount++;
      item.timestamp = Date.now();
      this.hitCount++;
      this.accessCount++;
      return item.value;
    }
    this.accessCount++;
    return null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    this.accessCount = 0;
    this.hitCount = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
      accessCount: this.accessCount,
      hitCount: this.hitCount
    };
  }

  calculateHitRate() {
    return this.accessCount > 0 ? (this.hitCount / this.accessCount) * 100 : 0;
  }

  clearExpired(maxAge) {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

// Create cache instances
const messageCache = new MessageCache(50); // Cache 50 conversations
const userCache = new MessageCache(100); // Cache 100 users
const groupCache = new MessageCache(30); // Cache 30 groups

// Optimized debounce utility
const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Batch reaction updates
const createBatchProcessor = () => {
  let batch = new Map();
  let timeoutId = null;
  
  return {
    add: (messageId, updateFn) => {
      batch.set(messageId, updateFn);
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          batch.forEach(updateFn => updateFn());
          batch.clear();
          timeoutId = null;
        }, 50);
      }
    }
  };
};

const reactionBatchProcessor = createBatchProcessor();

export const useChatStore = create((set, get) => ({
  // Users & chats with caching
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  selectedGroup: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Group chat state
  groups: [],
  groupMessages: [],
  isGroupsLoading: false,
  isGroupMessagesLoading: false,

  // Loading states for group operations
  isCreatingGroup: false,
  isUpdatingGroup: false,
  isAddingMembers: false,
  isRemovingMember: false,
  isLeavingGroup: false,
  isSendingGroupMessage: false,

  // Pagination states
  messagePagination: {
    hasMore: true,
    page: 1,
    limit: 50
  },

  groupMessagePagination: {
    hasMore: true,
    page: 1,
    limit: 50
  },

  // Sound setting with localStorage
  isSoundEnabled: typeof window !== "undefined" ? 
    JSON.parse(localStorage.getItem("isSoundEnabled") || "true") : true,

  // Typing indicators
  typingUsers: new Map(),

  // Cache instances
  messageCache,
  userCache,
  groupCache,
  isInitialLoad: true,

  // Socket handlers
  _private_messageHandler: null,
  _private_groupHandlers: null,
  _debouncedPrivateMessageHandler: null,
  _debouncedGroupMessageHandler: null,
  _globalReactionHandler: null,
  _globalReactionRemovedHandler: null,

  // Batch reaction updates
  batchReactionUpdate: (messageId, updateFn) => {
    reactionBatchProcessor.add(messageId, updateFn);
  },

  toggleSound: () => {
    const current = get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", JSON.stringify(!current));
    set({ isSoundEnabled: !current });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setSelectedUser: (user) => {
    if (user) {
      const cacheKey = `user_${user._id}_page_1`;
      const cached = messageCache.get(cacheKey);
      
      set({ 
        selectedUser: user,
        selectedGroup: null,
        messages: cached?.messages || [],
        messagePagination: cached?.pagination || {
          hasMore: true,
          page: 1,
          limit: 50
        }
      });

      if (!cached) {
        get().getMessagesByUserId(user._id);
      }
    } else {
      set({ selectedUser: null });
    }
  },

  setSelectedGroup: (group) => {
    if (group) {
      const cacheKey = `group_${group._id}_page_1`;
      const cached = messageCache.get(cacheKey);
      
      set({ 
        selectedGroup: group,
        selectedUser: null,
        groupMessages: cached?.messages || [],
        groupMessagePagination: cached?.pagination || {
          hasMore: true,
          page: 1,
          limit: 50
        }
      });

      if (!cached) {
        get().getGroupMessages(group._id);
      }
    } else {
      set({ selectedGroup: null });
    }
  },

  // --- Contacts & 1:1 Chats ---
  getAllContacts: async () => {
    const cachedContacts = userCache.get('allContacts');
    if (cachedContacts) {
      set({ allContacts: cachedContacts });
      return;
    }

    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      const contacts = res.data;
      userCache.set('allContacts', contacts);
      set({ allContacts: contacts });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ✅ FIXED: Enhanced message fetching with normalization
  getMessagesByUserId: async (userId, page = 1, loadMore = false) => {
    const cacheKey = `user_${userId}_page_${page}`;
    const { authUser } = useAuthStore.getState();
    
    // Check cache first
    if (!loadMore && page === 1) {
      const cached = messageCache.get(cacheKey);
      if (cached) {
        // Normalize cached messages
        const normalizedMessages = cached.messages.map(msg => normalizeMessage(msg, authUser));
        set({ 
          messages: normalizedMessages,
          messagePagination: cached.pagination,
          isMessagesLoading: false 
        });
        return;
      }
    }

    if (!loadMore) {
      set({ isMessagesLoading: true });
    }

    try {
      const res = await axiosInstance.get(`/messages/${userId}?page=${page}&limit=50`);
      let messages = res.data.messages || res.data;
      const hasMore = res.data.hasMore || (messages.length === 50);

      // ✅ FIXED: Normalize all fetched messages
      const normalizedMessages = messages.map(msg => normalizeMessage(msg, authUser));

      // Fetch reactions for messages in bulk
      const messageIds = normalizedMessages
        .filter(msg => !msg._id.startsWith('temp-'))
        .map(msg => msg._id);
      
      if (messageIds.length > 0) {
        try {
          const reactionsRes = await axiosInstance.post('/reactions/bulk', {
            messageIds,
            messageType: 'private'
          });
          
          normalizedMessages.forEach(msg => {
            msg.reactions = reactionsRes.data.reactions?.[msg._id] || {};
          });
        } catch (reactionError) {
          console.error('Failed to load reactions:', reactionError);
          normalizedMessages.forEach(msg => {
            msg.reactions = msg.reactions || {};
          });
        }
      }

      const result = {
        messages: normalizedMessages,
        hasMore: hasMore,
        totalCount: res.data.totalCount
      };

      set(state => {
        const newMessages = loadMore ? [...result.messages, ...state.messages] : result.messages;
        
        // Cache the normalized result
        if (page === 1) {
          messageCache.set(cacheKey, {
            messages: newMessages,
            pagination: {
              hasMore: result.hasMore,
              page: page + 1,
              limit: 50
            }
          });
        }

        return {
          messages: newMessages,
          messagePagination: {
            hasMore: result.hasMore,
            page: page + 1,
            limit: 50
          },
          isMessagesLoading: false
        };
      });

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      set({ isMessagesLoading: false });
    }
  },

// In useChatStore.js - Enhance the sendMessage function
sendMessage: async (messageData) => {
  const { selectedUser } = get();
  const { authUser } = useAuthStore.getState();

  if (!selectedUser) {
    toast.error("No recipient selected");
    return;
  }

  const tempId = `temp-${Date.now()}`;
  
  const optimisticMessage = {
    _id: tempId,
    senderId: {
      _id: authUser._id,
      fullName: authUser.fullName,
      profilePic: authUser.profilePic,
      email: authUser.email
    },
    receiverId: selectedUser._id,
    text: messageData.text,
    image: messageData.image,
    createdAt: new Date().toISOString(),
    isOptimistic: true, // This flag is crucial
    reactions: {},
    // Add client-side timestamp for consistent ordering
    clientTimestamp: Date.now()
  };

  console.log("🚀 Sending message - Optimistic:", optimisticMessage);

  // Immediate optimistic update
  set(state => ({ 
    messages: [...state.messages, optimisticMessage] 
  }));

  try {
    const res = await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      messageData
    );

    console.log("✅ HTTP response received:", res.data);

    const normalizedMessage = normalizeMessage(res.data, authUser);
    
    // Replace optimistic message with normalized server response
    set(state => ({
      messages: state.messages.map(msg => 
        msg._id === tempId ? { 
          ...normalizedMessage, 
          reactions: {},
          // Ensure we keep the original optimistic timestamp for UI consistency
          originalCreatedAt: msg.createdAt 
        } : msg
      )
    }));

    // Invalidate cache
    const cacheKey = `user_${selectedUser._id}_page_1`;
    get().messageCache.delete(cacheKey);

  } catch (error) {
    // Remove optimistic message on failure
    set(state => ({
      messages: state.messages.filter(msg => msg._id !== tempId)
    }));
    toast.error(error?.response?.data?.message || "Message sending failed");
    throw error;
  }
},

  // ✅ FIXED: Enhanced socket message handler with normalization
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();
    
    if (!socket) {
      console.error("Socket not available for message subscription");
      return;
    }

    console.log("🔔 Subscribing to private messages for user:", selectedUser._id);

    const messageHandler = (newMessage) => {
      console.log("📨 Socket message received:", newMessage);
      
      // ✅ FIXED: Normalize incoming socket message
      const normalizedMessage = normalizeMessage(newMessage, authUser);
      
      const isMessageFromSelectedUser = normalizedMessage.senderId._id === selectedUser._id;
      const isOwnMessage = normalizedMessage.senderId._id === authUser._id;
      
      console.log("🔍 Normalized message check:", {
        fromSelected: isMessageFromSelectedUser,
        isOwn: isOwnMessage,
        sender: normalizedMessage.senderId._id,
        selectedUser: selectedUser._id,
        authUser: authUser._id
      });
      
      // Only handle messages from the selected user (receiver side)
      if (isMessageFromSelectedUser && !isOwnMessage) {
        const currentMessages = get().messages;
        const messageExists = currentMessages.find((m) => m._id === normalizedMessage._id);
        
        if (!messageExists) {
          console.log("✅ Adding new received message from socket");
          set({ 
            messages: [...currentMessages, { ...normalizedMessage, reactions: {} }] 
          });

          // Invalidate cache
          const cacheKey = `user_${selectedUser._id}_page_1`;
          get().messageCache.delete(cacheKey);

          // Play sound for received messages
          if (isSoundEnabled) {
            const notificationSound = new Audio("/sound/notification.mp3");
            notificationSound.currentTime = 0;
            notificationSound.play().catch((e) => console.log("Audio play failed:", e));
          }
        }
      } else {
        console.log("🚫 Ignoring message - not from selected user or is own message");
      }
    };

    // Remove any existing listener first
    socket.off("newPrivateMessage", messageHandler);
    
    // Add new listener
    socket.on("newPrivateMessage", messageHandler);

    set({ 
      _private_messageHandler: messageHandler
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { _private_messageHandler } = get();
    
    if (!socket) return;
    
    if (_private_messageHandler) {
      socket.off("newMessage", _private_messageHandler);
    }
    
    if (!_private_messageHandler) {
      socket.off("newMessage");
    }
    
    set({ 
      _private_messageHandler: null,
      _debouncedPrivateMessageHandler: null
    });
  },

  // --- Group Chat Functions ---
  autoJoinGroupRooms: async () => {
    const socket = useAuthStore.getState().socket;
    const { groups } = get();
    
    if (socket && groups.length > 0) {
      const groupIds = groups.map(group => group._id);
      socket.emit("joinUserGroups", groupIds);
    }
  },

  createGroup: async (groupData) => {
    set({ isCreatingGroup: true });
    try {
      const res = await axiosInstance.post("/groups", groupData);
      set((state) => ({
        groups: [res.data.group, ...state.groups],
        isCreatingGroup: false,
      }));

      setTimeout(() => {
        get().autoJoinGroupRooms();
      }, 100);

      toast.success("Group created successfully");
      return { success: true, group: res.data.group };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create group";
      toast.error(errorMessage);
      set({ isCreatingGroup: false });
      throw new Error(errorMessage);
    }
  },

  updateGroupProfile: async (groupId, updateData) => {
    set({ isUpdatingGroup: true });
    try {
      const res = await axiosInstance.put(`/groups/${groupId}/profile`, updateData);

      const { groups, selectedGroup } = get();
      const updatedGroups = groups.map((group) =>
        group._id === groupId ? res.data.group : group
      );
      set({
        groups: updatedGroups,
        isUpdatingGroup: false,
      });

      if (selectedGroup && selectedGroup._id === groupId) {
        set({ selectedGroup: res.data.group });
      }

      toast.success("Group profile updated successfully");
      return { success: true, group: res.data.group };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update group profile";
      toast.error(errorMessage);
      set({ isUpdatingGroup: false });
      throw new Error(errorMessage);
    }
  },

  getMyGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data.groups });
      
      setTimeout(() => {
        get().autoJoinGroupRooms();
      }, 100);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

// ✅ FIXED: Enhanced getGroupMessages with better error handling
getGroupMessages: async (groupId, page = 1, loadMore = false) => {
  const cacheKey = `group_${groupId}_page_${page}`;
  const { authUser } = useAuthStore.getState();
  
  console.log('🔍 Fetching group messages:', { groupId, page, loadMore });

  // Check cache first
  if (!loadMore && page === 1) {
    const cached = get().groupCache.get(cacheKey);
    if (cached) {
      console.log('✅ Using cached group messages');
      set({ 
        groupMessages: cached.messages,
        groupMessagePagination: cached.pagination,
        isGroupMessagesLoading: false 
      });
      return;
    }
  }

  if (!loadMore) {
    set({ isGroupMessagesLoading: true });
  }

  try {
    const res = await axiosInstance.get(`/group-messages/${groupId}?page=${page}&limit=50`);
    
    console.log('✅ Group messages API response:', {
      messageCount: res.data.messages?.length,
      hasMore: res.data.hasMore,
      totalCount: res.data.totalCount
    });

    let messages = res.data.messages || [];
    const hasMore = res.data.hasMore || (messages.length === 50);

    // ✅ FIXED: Enhanced message normalization
    const normalizedMessages = messages.map(msg => {
      // Ensure consistent message structure
      const normalized = {
        ...msg,
        text: msg.text || "", // Ensure text is never undefined
        reactions: msg.reactions || {},
        // Ensure senderId is always an object
        senderId: typeof msg.senderId === 'string' ? {
          _id: msg.senderId,
          fullName: 'Unknown User',
          profilePic: '/avatar.png',
          email: ''
        } : msg.senderId
      };
      
      return normalized;
    });

    // Fetch reactions for messages in bulk
    const messageIds = normalizedMessages
      .filter(msg => !msg._id.startsWith('temp-'))
      .map(msg => msg._id);
    
    if (messageIds.length > 0) {
      try {
        const reactionsRes = await axiosInstance.post('/reactions/bulk', {
          messageIds,
          messageType: 'group'
        });
        
        console.log('✅ Loaded reactions for', Object.keys(reactionsRes.data.reactions || {}).length, 'messages');
        
        normalizedMessages.forEach(msg => {
          msg.reactions = reactionsRes.data.reactions?.[msg._id] || {};
        });
      } catch (reactionError) {
        console.error('Failed to load group reactions:', reactionError);
        normalizedMessages.forEach(msg => {
          msg.reactions = msg.reactions || {};
        });
      }
    }

    const result = {
      messages: normalizedMessages,
      hasMore: hasMore,
      totalCount: res.data.totalCount
    };

    set(state => {
      const newMessages = loadMore ? [...result.messages, ...state.groupMessages] : result.messages;
      
      console.log('✅ Setting group messages:', newMessages.length, 'total messages');

      // Cache the result
      if (page === 1) {
        get().groupCache.set(cacheKey, {
          messages: newMessages,
          pagination: {
            hasMore: result.hasMore,
            page: page + 1,
            limit: 50
          }
        });
      }

      return {
        groupMessages: newMessages,
        groupMessagePagination: {
          hasMore: result.hasMore,
          page: page + 1,
          limit: 50
        },
        isGroupMessagesLoading: false
      };
    });

  } catch (error) {
    console.error('❌ Failed to load group messages:', error);
    toast.error(error?.response?.data?.message || "Failed to load group messages");
    set({ 
      isGroupMessagesLoading: false,
      groupMessages: [] // Clear messages on error to prevent stale data
    });
  }
},

// ✅ FIXED: Enhanced sendGroupMessage with duplicate prevention
sendGroupMessage: async (messageData) => {
  const { selectedGroup } = get();
  const { authUser } = useAuthStore.getState();

  if (!selectedGroup) {
    toast.error("No group selected");
    return;
  }

  set({ isSendingGroupMessage: true });

  // Generate client ID for duplicate prevention
  const clientMessageId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const tempId = `temp-${Date.now()}`;

  // Enhanced optimistic message
  const optimisticMessage = {
    _id: tempId,
    clientMessageId,
    senderId: {
      _id: authUser._id,
      fullName: authUser.fullName,
      profilePic: authUser.profilePic,
      email: authUser.email
    },
    groupId: selectedGroup._id,
    text: messageData.text || "",
    image: messageData.image,
    file: messageData.file,
    fileName: messageData.fileName,
    fileSize: messageData.fileSize,
    fileType: messageData.fileType,
    messageType: messageData.image ? "image" : messageData.file ? "file" : "text",
    createdAt: new Date().toISOString(),
    isOptimistic: true,
    reactions: {}
  };

  console.log('🚀 Sending group message - Optimistic:', optimisticMessage);

  // Immediate optimistic update
  set(state => ({ 
    groupMessages: [...state.groupMessages, optimisticMessage] 
  }));

  try {
    const res = await axiosInstance.post(
      `/group-messages/send/${selectedGroup._id}`,
      { ...messageData, clientMessageId }
    );

    console.log('✅ Group message HTTP response:', res.data);

    // ✅ FIXED: Replace optimistic message with server response
    set(state => ({
      groupMessages: state.groupMessages.map(msg => 
        msg._id === tempId ? { ...res.data, reactions: {} } : msg
      ),
      isSendingGroupMessage: false,
    }));

    // Invalidate cache
    const cacheKey = `group_${selectedGroup._id}_page_1`;
    get().groupCache.delete(cacheKey);

  } catch (error) {
    console.error('❌ Failed to send group message:', error);
    
    // Remove optimistic message on failure
    set(state => ({
      groupMessages: state.groupMessages.filter((m) => m._id !== tempId),
      isSendingGroupMessage: false,
    }));
    
    const errorMessage = error.response?.data?.message || "Failed to send message";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
},

// ✅ FIXED: Enhanced socket handler for group messages with duplicate prevention
subscribeToGroupMessages: () => {
  const { selectedGroup, isSoundEnabled } = get();
  const { authUser } = useAuthStore.getState();

  if (!selectedGroup) return;

  const socket = useAuthStore.getState().socket;
  if (!socket) {
    console.error("Socket not available for group message subscription");
    return;
  }

  console.log("🔔 Subscribing to group messages for:", selectedGroup._id);

  const groupHandler = (newMessage) => {
    console.log("📨 Group socket message received:", newMessage);
    
    // ✅ FIXED: Duplicate prevention - check multiple conditions
    const currentMessages = get().groupMessages;
    
    // Check by message ID
    const messageExistsById = currentMessages.find((m) => m._id === newMessage._id);
    
    // Check by client message ID (for optimistic updates)
    const messageExistsByClientId = currentMessages.find(
      (m) => m.clientMessageId === newMessage.clientMessageId && newMessage.clientMessageId
    );
    
    // Check if this is our own message via socket (shouldn't happen with backend fix)
    const isOwnMessage = newMessage.senderId?._id === authUser._id;
    
    if (messageExistsById || messageExistsByClientId) {
      console.log('🚫 Ignoring duplicate group message');
      return;
    }
    
    // Additional safeguard: ignore our own messages via socket
    if (isOwnMessage && !newMessage.clientMessageId) {
      console.log('🚫 Ignoring own message via socket (should be handled by HTTP response)');
      return;
    }

    console.log('✅ Adding new group message from socket');
    
    // Ensure proper message structure
    const normalizedMessage = {
      ...newMessage,
      text: newMessage.text || "",
      reactions: newMessage.reactions || {}
    };

    set({ 
      groupMessages: [...currentMessages, normalizedMessage] 
    });

    // Invalidate cache
    const cacheKey = `group_${selectedGroup._id}_page_1`;
    get().groupCache.delete(cacheKey);

    // Play sound for received messages (not our own)
    if (isSoundEnabled && !isOwnMessage) {
      const notificationSound = new Audio("/sound/notification.mp3");
      notificationSound.currentTime = 0;
      notificationSound.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  // Remove any existing listener first
  socket.off("newGroupMessage", groupHandler);
  
  // Add new listener
  socket.on("newGroupMessage", groupHandler);

  console.log("✅ Successfully subscribed to group messages");
},

  unsubscribeFromGroupMessages: () => {
    const { selectedGroup, _private_groupHandlers } = get();
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    if (selectedGroup) {
      socket.emit("leaveGroup", selectedGroup._id);
    }

    if (_private_groupHandlers) {
      const { groupHandler, groupUpdatedHandler, removedFromGroupHandler } =
        _private_groupHandlers;
      socket.off("newGroupMessage", groupHandler);
      socket.off("groupUpdated", groupUpdatedHandler);
      socket.off("removedFromGroup", removedFromGroupHandler);
      set({ _private_groupHandlers: null });
    } else {
      socket.off("newGroupMessage");
      socket.off("groupUpdated");
      socket.off("removedFromGroup");
    }
  },

  addMembersToGroup: async (groupId, memberIds) => {
    set({ isAddingMembers: true });
    try {
      const res = await axiosInstance.put(`/groups/${groupId}/members`, {
        memberIds,
      });

      const { groups, selectedGroup } = get();
      const updatedGroups = groups.map((group) =>
        group._id === groupId ? res.data.group : group
      );
      set({
        groups: updatedGroups,
        isAddingMembers: false,
      });

      if (selectedGroup && selectedGroup._id === groupId) {
        set({ selectedGroup: res.data.group });
      }

      toast.success("Members added successfully");
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add members";
      toast.error(errorMessage);
      set({ isAddingMembers: false });
      throw new Error(errorMessage);
    }
  },

  removeMemberFromGroup: async (groupId, memberId) => {
    set({ isRemovingMember: true });
    try {
      const res = await axiosInstance.delete(`/groups/${groupId}/members/${memberId}`);

      const { groups, selectedGroup } = get();
      const updatedGroups = groups.map((group) =>
        group._id === groupId ? res.data.group : group
      );
      set({
        groups: updatedGroups,
        isRemovingMember: false,
      });

      if (selectedGroup && selectedGroup._id === groupId) {
        set({ selectedGroup: res.data.group });
      }

      toast.success("Member removed successfully");
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to remove member";
      toast.error(errorMessage);
      set({ isRemovingMember: false });
      throw new Error(errorMessage);
    }
  },

  leaveGroup: async (groupId) => {
    set({ isLeavingGroup: true });
    try {
      await axiosInstance.post(`/groups/${groupId}/leave`);

      const { groups, selectedGroup } = get();
      const updatedGroups = groups.filter((group) => group._id !== groupId);
      set({
        groups: updatedGroups,
        isLeavingGroup: false,
      });

      if (selectedGroup && selectedGroup._id === groupId) {
        set({ selectedGroup: null });
      }

      toast.success("You have left the group");
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to leave group";
      toast.error(errorMessage);
      set({ isLeavingGroup: false });
      throw new Error(errorMessage);
    }
  },

  transferGroupAdmin: async (groupId, newAdminId) => {
    set({ isUpdatingGroup: true });
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/transfer-admin`, {
        newAdminId,
      });

      const { groups, selectedGroup } = get();
      const updatedGroups = groups.map((group) =>
        group._id === groupId ? res.data.group : group
      );
      set({
        groups: updatedGroups,
        isUpdatingGroup: false,
      });

      if (selectedGroup && selectedGroup._id === groupId) {
        set({ selectedGroup: res.data.group });
      }

      toast.success("Admin role transferred successfully");
      return { success: true, group: res.data.group };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to transfer admin role";
      toast.error(errorMessage);
      set({ isUpdatingGroup: false });
      throw new Error(errorMessage);
    }
  },

  // --- Reaction Functions ---
  addReaction: async (messageId, emoji, messageType) => {
    try {
      const res = await axiosInstance.post("/reactions", {
        messageId,
        emoji,
        messageType,
      });
      return { success: true, reaction: res.data.reaction };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add reaction";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  removeReaction: async (reactionId) => {
    try {
      await axiosInstance.delete(`/reactions/${reactionId}`);
      toast.success("Reaction removed");
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to remove reaction";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getMessageReactions: async (messageId, messageType) => {
    if (messageId.startsWith('temp-')) {
      return { success: true, reactions: {} };
    }

    try {
      const res = await axiosInstance.get(`/reactions/${messageId}/${messageType}`);
      return { success: true, reactions: res.data.reactions };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to get reactions";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  removeReactionByMessageAndEmoji: async (messageId, emoji, messageType) => {
    try {
      await axiosInstance.delete('/reactions', {
        data: { messageId, emoji, messageType }
      });
      toast.success("Reaction removed");
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to remove reaction";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Optimized socket reaction handlers
  subscribeToReactions: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const globalReactionHandler = (data) => {
      const { messages, groupMessages } = get();
      
      get().batchReactionUpdate(data.messageId, () => {
        if (data.messageType === "private") {
          const updatedMessages = messages.map(msg => {
            if (msg._id === data.messageId) {
              const updatedReactions = { ...msg.reactions };
              if (!updatedReactions[data.reaction.emoji]) {
                updatedReactions[data.reaction.emoji] = [];
              }
              
              const userExists = updatedReactions[data.reaction.emoji].some(
                user => user._id === data.reaction.userId._id
              );
              
              if (!userExists) {
                updatedReactions[data.reaction.emoji].push(data.reaction.userId);
              }
              
              return { ...msg, reactions: updatedReactions };
            }
            return msg;
          });
          set({ messages: updatedMessages });
        } else {
          const updatedGroupMessages = groupMessages.map(msg => {
            if (msg._id === data.messageId) {
              const updatedReactions = { ...msg.reactions };
              if (!updatedReactions[data.reaction.emoji]) {
                updatedReactions[data.reaction.emoji] = [];
              }
              
              const userExists = updatedReactions[data.reaction.emoji].some(
                user => user._id === data.reaction.userId._id
              );
              
              if (!userExists) {
                updatedReactions[data.reaction.emoji].push(data.reaction.userId);
              }
              
              return { ...msg, reactions: updatedReactions };
            }
            return msg;
          });
          set({ groupMessages: updatedGroupMessages });
        }
      });
    };

    const globalReactionRemovedHandler = (data) => {
      const { messages, groupMessages } = get();
      
      get().batchReactionUpdate(data.messageId, () => {
        if (data.messageType === "private") {
          const updatedMessages = messages.map(msg => {
            if (msg._id === data.messageId) {
              const updatedReactions = { ...msg.reactions };
              
              if (updatedReactions[data.emoji]) {
                updatedReactions[data.emoji] = updatedReactions[data.emoji].filter(
                  user => user._id !== data.userId
                );
                
                if (updatedReactions[data.emoji].length === 0) {
                  delete updatedReactions[data.emoji];
                }
              }
              
              return { ...msg, reactions: updatedReactions };
            }
            return msg;
          });
          set({ messages: updatedMessages });
        } else {
          const updatedGroupMessages = groupMessages.map(msg => {
            if (msg._id === data.messageId) {
              const updatedReactions = { ...msg.reactions };
              
              if (updatedReactions[data.emoji]) {
                updatedReactions[data.emoji] = updatedReactions[data.emoji].filter(
                  user => user._id !== data.userId
                );
                
                if (updatedReactions[data.emoji].length === 0) {
                  delete updatedReactions[data.emoji];
                }
              }
              
              return { ...msg, reactions: updatedReactions };
            }
            return msg;
          });
          set({ groupMessages: updatedGroupMessages });
        }
      });
    };

    socket.on("messageReactionAdded", globalReactionHandler);
    socket.on("messageReactionRemoved", globalReactionRemovedHandler);

    set({ 
      _globalReactionHandler: globalReactionHandler,
      _globalReactionRemovedHandler: globalReactionRemovedHandler
    });
  },

  unsubscribeFromReactions: () => {
    const socket = useAuthStore.getState().socket;
    const { _globalReactionHandler, _globalReactionRemovedHandler } = get();
    
    if (!socket) return;
    
    if (_globalReactionHandler) {
      socket.off("messageReactionAdded", _globalReactionHandler);
    }
    
    if (_globalReactionRemovedHandler) {
      socket.off("messageReactionRemoved", _globalReactionRemovedHandler);
    }
  },

  // --- Pagination & Infinite Scroll ---
  loadMoreMessages: async () => {
    const { selectedUser, messagePagination } = get();
    if (!selectedUser || !messagePagination.hasMore) return;

    await get().getMessagesByUserId(selectedUser._id, messagePagination.page, true);
  },

  loadMoreGroupMessages: async () => {
    const { selectedGroup, groupMessagePagination } = get();
    if (!selectedGroup || !groupMessagePagination.hasMore) return;

    await get().getGroupMessages(selectedGroup._id, groupMessagePagination.page, true);
  },

  // --- Typing Indicators ---
  startTyping: (chatId, isGroup = false) => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.emit("typing", { chatId, isGroup });
    }
  },

  stopTyping: (chatId, isGroup = false) => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.emit("stopTyping", { chatId, isGroup });
    }
  },

  setTypingUser: (data) => {
    const { userId, fullName, chatId, isGroup } = data;
    set(state => {
      const newTypingUsers = new Map(state.typingUsers);
      const key = `${isGroup ? 'group_' : 'user_'}${chatId}`;
      
      if (!newTypingUsers.has(key)) {
        newTypingUsers.set(key, new Map());
      }
      
      const chatTypingUsers = newTypingUsers.get(key);
      chatTypingUsers.set(userId, { fullName, timestamp: Date.now() });
      
      return { typingUsers: newTypingUsers };
    });

    setTimeout(() => {
      get().removeTypingUser(userId, chatId, isGroup);
    }, 2000);
  },

  removeTypingUser: (userId, chatId, isGroup = false) => {
    set(state => {
      const newTypingUsers = new Map(state.typingUsers);
      const key = `${isGroup ? 'group_' : 'user_'}${chatId}`;
      
      if (newTypingUsers.has(key)) {
        const chatTypingUsers = newTypingUsers.get(key);
        chatTypingUsers.delete(userId);
        
        if (chatTypingUsers.size === 0) {
          newTypingUsers.delete(key);
        }
      }
      
      return { typingUsers: newTypingUsers };
    });
  },

  // --- New Performance Methods ---

  // Bulk load conversations for faster switching
  preloadConversations: async (conversationIds) => {
    try {
      const res = await axiosInstance.post('/messages/bulk', { conversationIds });
      const { conversations } = res.data;

      // Cache all conversations
      Object.entries(conversations).forEach(([conversationId, messages]) => {
        const cacheKey = `user_${conversationId}_page_1`;
        messageCache.set(cacheKey, {
          messages,
          pagination: {
            hasMore: messages.length === 50,
            page: 2,
            limit: 50
          }
        });
      });

      return conversations;
    } catch (error) {
      console.error('Preload conversations error:', error);
      return {};
    }
  },

  // Memory management
  clearUnusedCache: () => {
    const { selectedUser, selectedGroup } = get();
    
    // Keep only active conversation in cache, clear others after some time
    const now = Date.now();
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    
    messageCache.clearExpired(now - CACHE_TTL);
    userCache.clearExpired(now - CACHE_TTL);
    groupCache.clearExpired(now - CACHE_TTL);
  },

  // Cache statistics for debugging
  getCacheStats: () => {
    return {
      messageCache: messageCache.getStats(),
      userCache: userCache.getStats(),
      groupCache: groupCache.getStats()
    };
  },

  // --- Cache Management ---
  clearCache: () => {
    messageCache.clear();
    userCache.clear();
    groupCache.clear();
  }
}));