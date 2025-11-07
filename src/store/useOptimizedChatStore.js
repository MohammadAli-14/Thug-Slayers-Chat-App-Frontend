// frontend/src/store/useOptimizedChatStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

// Message cache with LRU strategy
class MessageCache {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const index = this.accessOrder.indexOf(key);
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(key);
      return this.cache.get(key);
    }
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove least recently used
      const lruKey = this.accessOrder.shift();
      this.cache.delete(lruKey);
    }

    this.cache.set(key, value);
    this.accessOrder.push(key);
  }

  delete(key) {
    this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }
}

export const useOptimizedChatStore = create((set, get) => ({
  // Enhanced state with caching
  messages: [],
  groupMessages: [],
  messageCache: new MessageCache(500),
  groupCache: new MessageCache(500),
  
  // Performance flags
  isFetching: false,
  lastFetchTime: 0,

  // Optimized message fetching with request deduplication
  getMessagesByUserId: async (userId, page = 1) => {
    const state = get();
    const cacheKey = `messages_${userId}_${page}`;
    
    // Check cache first
    const cached = state.messageCache.get(cacheKey);
    if (cached) {
      set({ messages: cached });
      return;
    }

    // Prevent duplicate requests
    if (state.isFetching && (Date.now() - state.lastFetchTime < 1000)) {
      return;
    }

    set({ isFetching: true, lastFetchTime: Date.now() });

    try {
      const res = await axiosInstance.get(`/messages/${userId}?page=${page}&limit=30`);
      const messages = res.data.messages || res.data;

      // Cache the result
      state.messageCache.set(cacheKey, messages);
      
      set({ 
        messages,
        isFetching: false 
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ isFetching: false });
    }
  },

  // Optimized message sending with immediate UI update
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser) return;

    const tempId = `temp_${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser?._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Immediate UI update
    set(state => ({
      messages: [...state.messages, optimisticMessage]
    }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // Replace optimistic message
      set(state => ({
        messages: state.messages.map(msg => 
          msg._id === tempId ? res.data : msg
        )
      }));

      // Invalidate cache for this conversation
      get().invalidateCache(`messages_${selectedUser._id}`);
    } catch (error) {
      // Remove optimistic message on failure
      set(state => ({
        messages: state.messages.filter(msg => msg._id !== tempId)
      }));
      throw error;
    }
  },

  // Cache management
  invalidateCache: (pattern) => {
    const state = get();
    const cacheKeys = Array.from(state.messageCache.cache.keys());
    
    cacheKeys.forEach(key => {
      if (key.includes(pattern)) {
        state.messageCache.delete(key);
      }
    });
  },

  // Prefetch next page
  prefetchNextPage: (userId, currentPage) => {
    const nextPage = currentPage + 1;
    const cacheKey = `messages_${userId}_${nextPage}`;
    
    if (!get().messageCache.get(cacheKey)) {
      // Prefetch in background
      setTimeout(() => {
        get().getMessagesByUserId(userId, nextPage);
      }, 1000);
    }
  }
}));