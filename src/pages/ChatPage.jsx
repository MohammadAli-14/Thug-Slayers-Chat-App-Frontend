import { useChatStore } from "../store/useChatStore";
import { useState, useEffect } from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import GroupsList from "../components/GroupsList";
import ChatContainer from "../components/ChatContainer";
import GroupChatContainer from "../components/GroupChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import CreateGroupModal from "../components/CreateGroupModal";
import LogoutConfirmationDialog from "../components/LogoutConfirmationDialog"; // ← ADD IMPORT
import { UsersIcon, SwordIcon, LogOutIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function ChatPage() {
  const { activeTab, selectedUser, selectedGroup, setSelectedUser, setSelectedGroup } = useChatStore();
  const { logout } = useAuthStore();
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false); // ← ADD STATE
  const [isMobile, setIsMobile] = useState(false);

  // ✅ IMPROVED MOBILE DETECTION
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileView && isTouchDevice);
    };
    
    checkMobile();
    
    const handleResize = () => {
      requestAnimationFrame(checkMobile);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ← ADD LOGOUT HANDLERS
  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
  };

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false);
  };

  // Determine what to show based on device and selection
  const showChatArea = selectedUser || selectedGroup;
  const showSidebar = !showChatArea || !isMobile;

  return (
    <div className={`w-full ${isMobile ? 'min-h-dynamic-screen safe-area' : 'h-screen'} bg-gradient-to-br from-slate-900 via-slate-800/30 to-slate-900`}>
      <div className={`relative w-full ${isMobile ? 'h-full' : 'h-full'} max-w-6xl mx-auto`}>
        <BorderAnimatedContainer>
          <div className="w-full h-full flex flex-col md:flex-row">
            {/* LEFT SIDE - Contacts/Chats/Groups List */}
            <div className={`
              w-full md:w-80 flex-col
              bg-slate-800/50 backdrop-blur-sm
              ${isMobile ? 'chat-safe-area' : ''}
              ${showChatArea && isMobile ? 'hidden' : 'flex'}
            `}>
              {/* Enhanced Header with Guild Branding */}
              <div className="p-4 sm:p-6 border-b border-amber-500/20 bg-slate-900/90 backdrop-blur-xl">
                
                {/* Top Row: Guild Branding and Action Buttons */}
                <div className="flex items-center justify-between mb-6">
                  {/* Guild Branding */}
                  <div className="flex items-center gap-3">
                    {/* Guild Logo */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-amber-300/50 shadow-lg shadow-amber-500/20">
                        <img 
                          src="/thug-slayers-badge.png" 
                          alt="Thug Slayers Badge"
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <SwordIcon className="w-6 h-6 text-white hidden" />
                      </div>
                      {/* Animated glow effect */}
                      <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-0"></div>
                    </div>
                    
                    <div className="flex-1">
                      <h1 className="text-lg font-bold text-white bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent leading-tight">
                        THUG SLAYERS
                      </h1>
                      <p className="text-amber-400 text-xs font-mono tracking-wider">MESSENGER</p>
                    </div>
                  </div>

                  {/* Action Buttons - Right Side (Only Logout) */}
                  <div className="flex items-center gap-2">
                    {/* Logout Button - UPDATED */}
                    <button
                      onClick={handleLogoutClick} // ← UPDATED
                      className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all duration-200 group touch-target"
                      title="Logout"
                    >
                      <LogOutIcon className="w-5 h-5" />
                      <div className="absolute inset-0 border border-amber-400/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </button>
                  </div>
                </div>
                
                {/* Profile Header - Centered below branding */}
                <div className="flex justify-center">
                  <ProfileHeader />
                </div>
              </div>
              
              {/* Active Tab Switch */}
              <div className="px-4 pt-4">
                <ActiveTabSwitch />
              </div>

              {/* CREATE GROUP BUTTON FOR GROUPS TAB */}
              {activeTab === "groups" && (
                <div className="px-4 py-3 border-b border-amber-500/20">
                  <button
                    onClick={() => setIsCreateGroupModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 rounded-lg hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-200 border border-amber-500/30 hover:border-amber-500/50 group touch-target"
                  >
                    <div className="relative">
                      <UsersIcon className="size-5" />
                      <div className="absolute -inset-1 bg-amber-400/20 rounded-full blur-sm group-hover:bg-amber-400/30 transition-all duration-200"></div>
                    </div>
                    <span className="font-semibold text-sm">Create New Squad</span>
                  </button>
                </div>
              )}

              {/* Lists Container */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 mobile-scroll scrollbar-thin">
                {activeTab === "chats" && <ChatsList />}
                {activeTab === "contacts" && <ContactList />}
                {activeTab === "groups" && <GroupsList />}
              </div>
            </div>

            {/* RIGHT SIDE - Chat Area */}
            <div className={`
              flex-1 flex-col bg-slate-900/50 backdrop-blur-sm
              ${showChatArea ? 'flex' : 'hidden md:flex'}
              ${isMobile ? 'chat-container-mobile' : ''}
            `}>
              {selectedUser ? (
                <ChatContainer />
              ) : selectedGroup ? (
                <GroupChatContainer />
              ) : (
                <NoConversationPlaceholder />
              )}
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>

      {/* CREATE GROUP MODAL */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />

      {/* ← ADD LOGOUT CONFIRMATION DIALOG */}
      <LogoutConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

export default ChatPage;