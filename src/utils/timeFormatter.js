// frontend/src/utils/timeFormatter.js
export const formatMessageTime = (timestamp, isOptimistic = false) => {
  if (!timestamp) return '';
  
  try {
    if (isOptimistic) {
      return 'Just now';
    }
    
    const messageTime = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    // If less than 1 minute ago
    if (diffInMinutes < 1) {
      return 'Just now';
    }
    
    // If today, show time
    if (messageTime.toDateString() === now.toDateString()) {
      return messageTime.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    
    // If yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageTime.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // If within a week, show day name
    const diffInDays = Math.floor((now - messageTime) / (1000 * 60 * 60 * 24));
    if (diffInDays < 7) {
      return messageTime.toLocaleDateString(undefined, { weekday: 'short' });
    }
    
    // Otherwise show date
    return messageTime.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting message time:', error);
    return '';
  }
};

export const formatMessageTimeDetailed = (timestamp, isOptimistic = false) => {
  if (!timestamp) return isOptimistic ? 'Sending...' : '';
  
  if (isOptimistic) {
    return 'Sending...';
  }
  
  try {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return '';
  }
};