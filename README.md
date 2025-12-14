# Thug Slayers Chat App - Frontend

<div align="center">

**A real-time gaming chat application with immersive UI, group management, and Socket.IO integration**

[![Live Demo](https://img.shields.io/badge/🎮_Live_Demo-Available-green?style=for-the-badge)](https://thug-slayers-chat-app-frontend.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-593D88?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

## 🎯 Overview

Thug Slayers Chat App is a feature-rich, real-time chat application designed for gaming communities. Built with modern React and Vite, it provides seamless one-on-one and group messaging with an immersive gaming-themed interface. The app leverages Socket.IO for real-time communication, Zustand for state management, and features a fully responsive design with audio feedback for an engaging user experience.

**Experience it live:** [https://thug-slayers-chat-app-frontend.vercel.app/](https://thug-slayers-chat-app-frontend.vercel.app/)

## ✨ Features

### **Real-time Communication**
- **Instant Messaging**: Real-time one-on-one and group chats using Socket.IO
- **Message Reactions**: Express emotions with emoji reactions on messages
- **Typing Indicators**: See when other users are typing
- **Online Status**: Real-time user presence detection
- **Read Receipts**: Track message delivery and reading status

### **Group Management**
- **Create Groups**: Easily create group chats with custom names and avatars
- **Add/Remove Members**: Dynamically manage group participants
- **Group Information**: View detailed group info and member lists
- **Admin Controls**: Special permissions for group administrators

### **User Experience**
- **Gaming-Themed UI**: Immersive interface with custom styling and animations
- **Audio Feedback**: Sound effects for typing, notifications, and interactions
- **Virtualized Lists**: Optimized performance with virtual scrolling for messages
- **Responsive Design**: Fully responsive layout for all device sizes
- **Dark Mode**: Eye-friendly dark theme optimized for gaming sessions

### **Advanced Features**
- **Performance Monitoring**: Built-in performance tracking and optimization
- **Socket Debugger**: Real-time WebSocket connection monitoring
- **Message Search**: Quick message history navigation
- **File Sharing**: Support for image and file attachments
- **Custom Emojis**: Gaming-themed emoji reactions

## 🏗️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.x |
| **Vite** | Build Tool & Dev Server | 4.x |
| **Tailwind CSS** | Styling Framework | 3.x |
| **Socket.IO Client** | Real-time Communication | 4.x |
| **Zustand** | State Management | 4.x |
| **Axios** | HTTP Client | 1.x |
| **React Router** | Client-side Routing | 6.x |

## 📁 Project Structure

```
├── public/                    # Static assets
│   ├── sound/                # Audio feedback files
│   │   ├── keystroke1.mp3    # Typing sound effects
│   │   ├── mouse-click.mp3   # UI interaction sounds
│   │   └── notification.mp3  # Message notifications
│   └── *.png                 # Application images and icons
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ActiveTabSwitch.jsx           # Tab navigation component
│   │   ├── AddMembersModal.jsx           # Add members to group modal
│   │   ├── BorderAnimatedContainer.jsx   # Animated border container
│   │   ├── ChatContainer.jsx             # Main chat interface
│   │   ├── ChatHeader.jsx                # Chat header with controls
│   │   ├── ChatsList.jsx                 # List of active chats
│   │   ├── ContactList.jsx               # User contact list
│   │   ├── CreateGroupModal.jsx          # Group creation modal
│   │   ├── GroupChatContainer.jsx        # Group chat interface
│   │   ├── GroupInfoModal.jsx            # Group information modal
│   │   ├── GroupsList.jsx                # List of groups
│   │   ├── LandingPage.jsx               # Welcome/landing page
│   │   ├── LogoutConfirmationDialog.jsx  # Logout confirmation
│   │   ├── MessageDebugger.jsx           # Debug message component
│   │   ├── MessageInput.jsx              # Message input with emoji
│   │   ├── MessageReactions.jsx          # Message reaction system
│   │   ├── MessageTimeDisplay.jsx        # Timestamp formatting
│   │   ├── MessagesLoadingSkeleton.jsx   # Loading skeleton for messages
│   │   ├── NoChatHistoryPlaceholder.jsx  # Empty state for no chats
│   │   ├── NoChatsFound.jsx              # No results placeholder
│   │   ├── NoConversationPlaceholder.jsx # Empty conversation state
│   │   ├── PageLoader.jsx                # Full-page loader
│   │   ├── ProfileHeader.jsx             # User profile header
│   │   ├── SocketDebugger.jsx            # Socket.IO connection debugger
│   │   ├── SocketStatus.jsx              # Connection status indicator
│   │   ├── UsersLoadingSkeleton.jsx      # Loading skeleton for users
│   │   └── VirtualizedMessageList.jsx    # Optimized message list
│   ├── hooks/                # Custom React hooks
│   │   ├── useGroupMessages.js   # Group message management
│   │   ├── useKeyboardSound.js   # Keyboard sound effects
│   │   └── useMobile.js          # Mobile device detection
│   ├── pages/                # Page components
│   │   ├── ChatPage.jsx             # Main chat page
│   │   ├── ForgotPasswordPage.jsx   # Password recovery
│   │   ├── LoginPage.jsx            # User login
│   │   ├── OTPVerificationPage.jsx  # OTP verification
│   │   └── SignUpPage.jsx           # User registration
│   ├── store/                # Zustand state stores
│   │   ├── useAuthStore.js           # Authentication state
│   │   ├── useChatStore.js           # Chat state management
│   │   └── useOptimizedChatStore.js  # Optimized chat state
│   ├── utils/                # Utility functions
│   │   ├── logger.js              # Application logging
│   │   ├── performance.js         # Performance utilities
│   │   ├── performanceMonitor.js  # Performance monitoring
│   │   └── timeFormatter.js       # Time formatting utilities
│   ├── lib/                  # Library configurations
│   │   └── axios.js          # Axios HTTP client configuration
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
└── configuration files       # Build and styling configs
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v16 or higher)
- Backend server running (Socket.IO server required)
- npm or yarn package manager

### **1. Clone the Repository**
```bash
git clone https://github.com/MohammadAli-14/Thug-Slayers-Chat-App-Frontend.git
cd Thug-Slayers-Chat-App-Frontend
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3. Configure Environment**
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your backend configuration
```

### **4. Start Development Server**
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Feature Flags
VITE_ENABLE_SOUND=true
VITE_ENABLE_ANIMATIONS=true
VITE_ENABLE_PERFORMANCE_MONITORING=false

# Application Settings
VITE_APP_NAME="Thug Slayers Chat"
VITE_DEFAULT_THEME=dark
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build locally

# Code Quality
npm run lint       # Run ESLint for code quality
npm run format     # Format code with Prettier

# Performance
npm run analyze    # Analyze bundle size (if configured)
```

## 🔌 Socket.IO Integration

### **Connection Setup**
```javascript
// Socket.IO connection setup in components
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
```

### **Socket Events Handled**
| Event | Direction | Purpose |
|-------|-----------|---------|
| `connect` | Server → Client | Connection established |
| `disconnect` | Server → Client | Connection lost |
| `message` | Bidirectional | Send/receive messages |
| `typing` | Bidirectional | Typing indicators |
| `user_online` | Server → Client | User online status |
| `user_offline` | Server → Client | User offline status |
| `group_created` | Server → Client | New group created |
| `group_updated` | Server → Client | Group information updated |
| `member_added` | Server → Client | New member added to group |
| `member_removed` | Server → Client | Member removed from group |

### **State Management with Zustand**
```javascript
// Example from useChatStore.js
const useChatStore = create((set, get) => ({
  messages: [],
  activeChat: null,
  onlineUsers: [],
  
  addMessage: (message) => {
    set((state) => ({ 
      messages: [...state.messages, message] 
    }));
  },
  
  setActiveChat: (chat) => set({ activeChat: chat }),
  
  updateOnlineUsers: (users) => set({ onlineUsers: users }),
}));
```

## 🎨 Key Components

### **ChatContainer.jsx**
Main chat interface component that handles message display, input, and real-time updates.

### **VirtualizedMessageList.jsx**
Performance-optimized message list using virtualization for handling large message histories.

### **SocketDebugger.jsx**
Real-time WebSocket connection monitoring and debugging tool.

### **MessageInput.jsx**
Advanced message input with emoji support, file attachment, and typing indicators.

### **CreateGroupModal.jsx**
Interactive modal for creating new group chats with member selection.

## 📱 Responsive Design

The application is fully responsive across all device sizes:

- **Desktop (>1024px)**: Full sidebar + chat panel layout
- **Tablet (768px-1024px)**: Optimized layout with collapsible sidebar
- **Mobile (<768px)**: Single-column layout with bottom navigation

## 🔐 Authentication Flow

1. **Registration**: User signs up with email/password
2. **Email Verification**: OTP verification via email
3. **Login**: JWT-based authentication
4. **Session Management**: Persistent login with token refresh
5. **Password Recovery**: Secure password reset flow

## 🎮 Gaming Features

### **Audio Feedback**
- Keyboard typing sounds
- Message notification sounds
- UI interaction feedback
- Configurable audio preferences

### **Visual Elements**
- Gaming-themed UI components
- Animated borders and effects
- Custom emoji reactions
- Immersive dark theme

### **Performance Optimizations**
- Virtualized message lists
- Message pagination
- Image lazy loading
- Connection status monitoring

## 🚀 Deployment

The application is deployed and live at: [https://thug-slayers-chat-app-frontend.vercel.app/](https://thug-slayers-chat-app-frontend.vercel.app/)

### **Deploy to Vercel (Recommended)**
1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy with automatic CI/CD

### **Build for Production**
```bash
npm run build
# Output will be in the 'dist' directory
```

### **Docker Deployment**
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔗 Backend Integration

This frontend requires a compatible backend with Socket.IO support:

- **Socket.IO Server**: Required for real-time communication
- **REST API Endpoints**: For user authentication and data management
- **WebSocket Support**: For bidirectional communication

### **Required Backend Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/forgot-password` - Password recovery
- `GET /api/users` - Get user list
- `POST /api/groups` - Create group
- `GET /api/groups` - Get user groups

## 🧪 Testing & Debugging

### **Socket.IO Debugging**
```bash
# Enable Socket.IO debugging in browser console
localStorage.debug = 'socket.io-client:*';
```

### **Performance Monitoring**
```javascript
// Performance monitoring utilities in utils/performanceMonitor.js
import { monitorPerformance } from './utils/performanceMonitor';

// Monitor component performance
monitorPerformance('ChatContainer', () => {
  // Component logic here
});
```

### **Logging System**
```javascript
// Structured logging with utils/logger.js
import logger from './utils/logger';

logger.info('User connected', { userId, timestamp });
logger.error('Socket connection failed', { error });
```

## 🤝 Contributing

We welcome contributions to the Thug Slayers Chat App! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### **Development Guidelines**
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Test changes thoroughly
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Mohammad Ali** - *Full Stack Developer* - [MohammadAli-14](https://github.com/MohammadAli-14)

## 🙏 Acknowledgments

- **Socket.IO Team** for the excellent real-time communication library
- **Vite Team** for the fast build tool and development experience
- **Tailwind CSS** for the utility-first CSS framework
- **React Community** for the amazing ecosystem and tools

## 🔗 Important Links

- **Live Demo**: [https://thug-slayers-chat-app-frontend.vercel.app/](https://thug-slayers-chat-app-frontend.vercel.app/)
- **Frontend Repository**: [Thug-Slayers-Chat-App-Frontend](https://github.com/MohammadAli-14/Thug-Slayers-Chat-App-Frontend)
- **Backend Repository**: [Check main repository for backend link]

---
<div align="center">

**Built with ❤️ by [Mohammad Ali](https://github.com/MohammadAli-14)**

⭐ **Star this repo if you found it useful!** ⭐

</div>

**Note**: This frontend requires a backend server with Socket.IO support for full functionality. Make sure to configure the backend URL in the environment variables before running the application. For production deployment, ensure proper CORS configuration and use HTTPS for secure communication.
