import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

export const useGroupMessages = (groupId) => {
  const [localMessages, setLocalMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    groupMessages, 
    getGroupMessages, 
    subscribeToGroupMessages, 
    unsubscribeFromGroupMessages,
    subscribeToReactions,
    unsubscribeFromReactions
  } = useChatStore();
  
  const { socket } = useAuthStore();

  // Load messages for specific group
  const loadMessages = useCallback(async () => {
    if (!groupId) return;
    
    setIsLoading(true);
    try {
      await getGroupMessages(groupId);
    } catch (error) {
      console.error('Failed to load group messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, getGroupMessages]);

  // Join group room
  const joinGroupRoom = useCallback(() => {
    if (socket && groupId) {
      socket.emit('joinGroup', groupId);
    }
  }, [socket, groupId]);

  // Leave group room
  const leaveGroupRoom = useCallback(() => {
    if (socket && groupId) {
      socket.emit('leaveGroup', groupId);
    }
  }, [socket, groupId]);

  useEffect(() => {
    if (groupId) {
      loadMessages();
      subscribeToGroupMessages();
      subscribeToReactions();
      joinGroupRoom();
    }

    return () => {
      unsubscribeFromGroupMessages();
      unsubscribeFromReactions();
      leaveGroupRoom();
    };
  }, [
    groupId, 
    loadMessages, 
    subscribeToGroupMessages, 
    unsubscribeFromGroupMessages,
    subscribeToReactions,
    unsubscribeFromReactions,
    joinGroupRoom,
    leaveGroupRoom
  ]);

  // Filter messages for current group
  useEffect(() => {
    if (groupId) {
      const filteredMessages = groupMessages.filter(msg => msg.groupId === groupId);
      setLocalMessages(filteredMessages);
    }
  }, [groupMessages, groupId]);

  return {
    messages: localMessages,
    isLoading,
    reloadMessages: loadMessages
  };
};