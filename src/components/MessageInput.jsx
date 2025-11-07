import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, PaperclipIcon, LoaderIcon } from "lucide-react";

function MessageInput({ isGroup = false }) {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const { sendMessage, sendGroupMessage, isSoundEnabled, isSendingGroupMessage } = useChatStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    console.log('=== DEBUG SEND MESSAGE ===');
    console.log('Is Group:', isGroup);
    console.log('Text:', text);
    console.log('Image preview exists:', !!imagePreview);
    console.log('File preview exists:', !!filePreview);
    
    // Different validation for group vs private messages
    if (isGroup) {
      // For groups: allow text, image, or file
      if ((!text.trim() && !imagePreview && !filePreview?.fileData) || isUploading) {
        toast.error("Please add a message, image, or file");
        return;
      }
    } else {
      // For private messages: only allow text or image (no files)
      if ((!text.trim() && !imagePreview) || isUploading) {
        toast.error("Text or image is required");
        return;
      }
      // If user tries to send file in private chat, show error
      if (filePreview) {
        toast.error("File sharing is only available in group chats");
        return;
      }
    }
    
    if (isSoundEnabled) playRandomKeyStrokeSound();

    setIsUploading(true);

    try {
      const messageData = {
        text: text.trim(),
        image: imagePreview,
      };

      // Only add file data for group messages
      if (isGroup && filePreview) {
        messageData.file = filePreview.fileData;
        messageData.fileName = filePreview.name;
        messageData.fileType = filePreview.type;
      }

      console.log('=== FINAL MESSAGE DATA TO SEND ===');
      console.log('Is Group:', isGroup);
      console.log('Message data:', {
        text: messageData.text,
        hasImage: !!messageData.image,
        hasFile: !!messageData.file,
        fileName: messageData.fileName,
        fileType: messageData.fileType
      });

      if (isGroup) {
        await sendGroupMessage(messageData);
      } else {
        await sendMessage(messageData);
      }
      
      // Reset form
      setText("");
      setImagePreview(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
    } catch (error) {
      console.error('Send message error:', error);
      console.error('Error response:', error.response?.data);
      // Don't show duplicate toast - error is handled in store
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max for images)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFilePreview(null); // Clear file preview if image is selected
    };
    reader.onload = () => {
      // Additional validation for actual image dimensions
      const img = new Image();
      img.onload = function() {
        if (this.width > 5000 || this.height > 5000) {
          toast.error("Image dimensions too large. Please use a smaller image.");
          setImagePreview(null);
          return;
        }
      };
      img.src = reader.result;
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    // If not in group, show error
    if (!isGroup) {
      toast.error("File sharing is only available in group chats");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    console.log('=== FILE SELECTED FOR GROUP ===');
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    // Validate file size (10MB max for files)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      'image/', 'video/', 'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
      'application/vnd.rar'
    ];
    
    if (!allowedTypes.some(type => file.type.startsWith(type)) && 
        !file.name.match(/\.(pdf|doc|docx|txt|zip|rar|mp4|mov|avi|mkv)$/i)) {
      toast.error("File type not supported. Please use images, videos, PDFs, or documents.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = reader.result;
      console.log('File data length:', fileData.length);
      
      setFilePreview({
        name: file.name,
        type: file.type,
        size: file.size,
        fileData: fileData,
      });
      setImagePreview(null); // Clear image preview if file is selected
    };
    reader.onerror = () => {
      console.error('FileReader error:', reader.error);
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeFile = () => {
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("sheet") || fileType.includes("excel")) return "📊";
    if (fileType.includes("zip") || fileType.includes("rar")) return "📦";
    if (fileType.includes("video")) return "🎬";
    if (fileType.includes("audio")) return "🎵";
    return "📎";
  };

  return (
    <div className="p-3 md:p-4 border-t border-slate-700/50 bg-slate-900/50">
      {/* Image Preview */}
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 text-xs"
              type="button"
              disabled={isUploading}
            >
              <XIcon className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* File Preview - Only show in groups */}
      {isGroup && filePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getFileIcon(filePreview.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm font-medium truncate">
                  {filePreview.name}
                </p>
                <p className="text-slate-400 text-xs">
                  {formatFileSize(filePreview.size)} • {filePreview.type}
                </p>
              </div>
              <button
                onClick={removeFile}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                type="button"
                disabled={isUploading}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-2 md:gap-4 items-center px-3 md:px-0 py-3">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 input input-bordered bg-slate-800/50 border-slate-700/50 text-sm md:text-base py-3 md:py-3 touch-manipulation"
          placeholder={
            isGroup ? "Type your message to group..." : "Type your message..."
          }
          disabled={isUploading}
        />

        {/* Hidden file inputs */}
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          className="hidden"
          disabled={isUploading}
        />

        {/* File input - Only show attachment button in groups */}
        {isGroup && (
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/zip,application/vnd.rar"
            disabled={isUploading}
          />
        )}

        {/* Action buttons */}
        <div className="flex gap-1">
          {/* File attachment button - Only show in groups */}
          {isGroup && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`btn btn-ghost btn-sm md:btn-md ${
                filePreview ? "text-cyan-500" : "text-slate-400"
              } disabled:opacity-50`}
              title="Upload file (doc, pdf, video, zip)"
            >
              <PaperclipIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
          
          {/* Image upload button - Show in both private and group chats */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={isUploading}
            className={`btn btn-ghost btn-sm md:btn-md ${
              imagePreview ? "text-cyan-500" : "text-slate-400"
            } disabled:opacity-50`}
            title="Upload image"
          >
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={
            isGroup 
              ? (!text.trim() && !imagePreview && !filePreview?.fileData) || isUploading || isSendingGroupMessage
              : (!text.trim() && !imagePreview) || isUploading
          }
          className="btn btn-primary btn-sm md:btn-md bg-gradient-to-r from-cyan-500 to-cyan-600 border-none text-white hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isUploading ? (
            <LoaderIcon className="w-4 h-4 animate-spin" />
          ) : (
            <SendIcon className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;