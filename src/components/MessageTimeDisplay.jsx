// frontend/src/components/MessageTimeDisplay.jsx
import { formatMessageTimeDetailed } from "../utils/timeFormatter";

const MessageTimeDisplay = ({ message, isOwnMessage = false }) => {
  return (
    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
      {formatMessageTimeDetailed(message.createdAt, message.isOptimistic)}
      {isOwnMessage && !message.isOptimistic && (
        <span className="text-xs opacity-75">✓✓</span>
      )}
      {message.isOptimistic && (
        <span className="text-xs opacity-50">(Sending...)</span>
      )}
    </p>
  );
};

export default MessageTimeDisplay;