// Enhanced GroupInfoModal.jsx for mobile
import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  XIcon,
  UsersIcon,
  UserPlusIcon,
  LogOutIcon,
  CrownIcon,
  TrashIcon,
  CameraIcon,
  LoaderIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import AddMembersModal from "./AddMembersModal";
import toast from "react-hot-toast";

function GroupInfoModal({ group, onClose }) {
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const { leaveGroup, setSelectedGroup, updateGroupProfile } = useChatStore();
  const { authUser } = useAuthStore();
  const fileInputRef = useRef(null);

  const isUserAdmin = group.admin._id === authUser._id;
  const isMobile = window.innerWidth < 768;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleLeaveGroup = async () => {
    if (window.confirm(`Are you sure you want to leave "${group.name}"?`)) {
      try {
        await leaveGroup(group._id);
        onClose();
      } catch (error) {
        // Error handled in store
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64Image = reader.result;
        await updateGroupProfile(group._id, { profilePic: base64Image });
        setIsUploading(false);
      };

      reader.onerror = () => {
        toast.error("Failed to read image file");
        setIsUploading(false);
      };
    } catch (error) {
      toast.error("Failed to upload image");
      setIsUploading(false);
    }
  };

  const removeGroupPicture = async () => {
    if (window.confirm("Remove group profile picture?")) {
      try {
        await updateGroupProfile(group._id, { profilePic: "" });
      } catch (error) {
        // Error handled in store
      }
    }
  };

  // Mobile-optimized modal structure
  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-700/50 bg-slate-900 chat-safe-area">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-2"
            >
              <XIcon className="size-6" />
            </button>
            <h3 className="text-lg font-semibold text-slate-200">Group Info</h3>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Group Profile */}
            <div className="p-6 text-center border-b border-slate-700/50">
              <div className="relative inline-block mx-auto mb-4">
                <div className="avatar">
                  <div className="size-24 rounded-full bg-cyan-500/20 flex items-center justify-center overflow-hidden border-2 border-cyan-500/30">
                    {group.profilePic ? (
                      <img
                        src={group.profilePic}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UsersIcon className="w-10 h-10 text-cyan-400" />
                    )}
                  </div>
                </div>

                {isUserAdmin && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 border-2 border-slate-900"
                      title="Change group picture"
                    >
                      {isUploading ? (
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <CameraIcon className="w-4 h-4" />
                      )}
                    </button>

                    {group.profilePic && (
                      <button
                        onClick={removeGroupPicture}
                        className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors text-sm border-2 border-slate-900"
                        title="Remove picture"
                      >
                        ×
                      </button>
                    )}
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <h2 className="text-slate-200 font-semibold text-xl mb-2">{group.name}</h2>
              {group.description && (
                <p className="text-slate-400 text-sm mb-3 px-4">{group.description}</p>
              )}
              <p className="text-slate-400 text-sm">
                Created by {group.admin._id === authUser._id ? "you" : group.admin.fullName}
              </p>
            </div>

            {/* Expandable Members Section */}
            <div className="border-b border-slate-700/50">
              <button
                onClick={() => toggleSection('members')}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UsersIcon className="size-5 text-cyan-400" />
                  <div>
                    <h4 className="text-slate-200 font-medium">Members</h4>
                    <p className="text-slate-400 text-sm">{group.members.length} members</p>
                  </div>
                </div>
                {expandedSection === 'members' ? 
                  <ChevronUpIcon className="size-5 text-slate-400" /> : 
                  <ChevronDownIcon className="size-5 text-slate-400" />
                }
              </button>

              {expandedSection === 'members' && (
                <div className="px-4 pb-4 max-h-60 overflow-y-auto">
                  <div className="space-y-3">
                    {group.members.map((member) => (
                      <div
                        key={member.user._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="size-10 rounded-full overflow-hidden">
                              <img
                                src={member.user.profilePic || "/avatar.png"}
                                alt={member.user.fullName}
                                className="object-cover w-10 h-10"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-200 font-medium text-sm">
                                {member.user.fullName}
                                {member.user._id === authUser._id && " (You)"}
                              </span>
                              {member.role === "admin" && <CrownIcon className="w-4 h-4 text-amber-400" />}
                            </div>
                            <p className="text-slate-400 text-xs">{member.user.email}</p>
                          </div>
                        </div>

                        {isUserAdmin && member.role !== "admin" && member.user._id !== authUser._id && (
                          <RemoveMemberButton
                            groupId={group._id}
                            memberId={member.user._id}
                            memberName={member.user.fullName}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {isUserAdmin && (
                    <button
                      onClick={() => setShowAddMembers(true)}
                      className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                    >
                      <UserPlusIcon className="size-5" />
                      Add Members
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Admin Controls Section */}
            {isUserAdmin && (
              <div className="border-b border-slate-700/50">
                <button
                  onClick={() => toggleSection('admin')}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CrownIcon className="size-5 text-amber-400" />
                    <div>
                      <h4 className="text-slate-200 font-medium">Admin Controls</h4>
                      <p className="text-slate-400 text-sm">Manage group settings</p>
                    </div>
                  </div>
                  {expandedSection === 'admin' ? 
                    <ChevronUpIcon className="size-5 text-slate-400" /> : 
                    <ChevronDownIcon className="size-5 text-slate-400" />
                  }
                </button>

                {expandedSection === 'admin' && (
                  <div className="px-4 pb-4 space-y-3">
                    <AdminTransferSection group={group} onClose={onClose} />
                  </div>
                )}
              </div>
            )}

            {/* Leave Group Section */}
            <div className="p-4">
              {!isUserAdmin ? (
                <button
                  onClick={handleLeaveGroup}
                  className="w-full flex items-center justify-center gap-2 p-4 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/30"
                >
                  <LogOutIcon className="size-5" />
                  Leave Group
                </button>
              ) : (
                <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                  <p className="text-slate-400 text-sm">
                    As admin, you can't leave the group. Transfer admin role first.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Members Modal */}
        {showAddMembers && (
          <div className="fixed inset-0 z-50">
            <AddMembersModal group={group} onClose={() => setShowAddMembers(false)} />
          </div>
        )}
      </>
    );
  }

  // Desktop version (original with minor improvements)
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-200">Group Info</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Group Profile */}
            <div className="p-6 text-center border-b border-slate-700/50">
              <div className="relative inline-block mx-auto mb-4">
                <div className="avatar">
                  <div className="size-20 rounded-full bg-cyan-500/20 flex items-center justify-center overflow-hidden">
                    {group.profilePic ? (
                      <img
                        src={group.profilePic}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UsersIcon className="w-8 h-8 text-cyan-400" />
                    )}
                  </div>
                </div>

                {isUserAdmin && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white hover:bg-cyan-600 transition-colors disabled:opacity-50"
                      title="Change group picture"
                    >
                      {isUploading ? (
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <CameraIcon className="w-4 h-4" />
                      )}
                    </button>

                    {group.profilePic && (
                      <button
                        onClick={removeGroupPicture}
                        className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors text-xs"
                        title="Remove picture"
                      >
                        ×
                      </button>
                    )}
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <h2 className="text-slate-200 font-semibold text-xl mb-2">{group.name}</h2>
              {group.description && (
                <p className="text-slate-400 text-sm mb-3">{group.description}</p>
              )}
              <p className="text-slate-400 text-sm">
                Created by {group.admin._id === authUser._id ? "you" : group.admin.fullName}
              </p>
            </div>

            {/* Members Section */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-slate-200 font-medium">Members ({group.members.length})</h4>
                {isUserAdmin && (
                  <button
                    onClick={() => setShowAddMembers(true)}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <UserPlusIcon className="w-4 h-4" />
                    Add Members
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {group.members.map((member) => (
                  <div
                    key={member.user._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="size-10 rounded-full overflow-hidden">
                          <img
                            src={member.user.profilePic || "/avatar.png"}
                            alt={member.user.fullName}
                            className="object-cover w-10 h-10"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-200 font-medium text-sm">
                            {member.user.fullName}
                            {member.user._id === authUser._id && " (You)"}
                          </span>
                          {member.role === "admin" && <CrownIcon className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="text-slate-400 text-xs">{member.user.email}</p>
                      </div>
                    </div>

                    {isUserAdmin && member.role !== "admin" && member.user._id !== authUser._id && (
                      <RemoveMemberButton
                        groupId={group._id}
                        memberId={member.user._id}
                        memberName={member.user.fullName}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Transfer Section */}
            {isUserAdmin && <AdminTransferSection group={group} onClose={onClose} />}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-700/50">
            {!isUserAdmin ? (
              <button
                onClick={handleLeaveGroup}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                Leave Group
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-400 text-sm text-center">
                  As admin, you can manage group members and profile
                </p>
                <button
                  onClick={handleLeaveGroup}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                  disabled
                  title="Admin cannot leave group"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Leave Group (Not available for admin)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Members Modal */}
      {showAddMembers && <AddMembersModal group={group} onClose={() => setShowAddMembers(false)} />}
    </>
  );
}

/**
 * AdminTransferSection inside the same file
 */
const AdminTransferSection = ({ group, onClose }) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const { transferGroupAdmin } = useChatStore();

  const handleTransferAdmin = async () => {
    if (!selectedMember) return;

    if (
      window.confirm(
        `Are you sure you want to transfer admin role to ${selectedMember.fullName}? You will become a regular member.`
      )
    ) {
      setIsTransferring(true);
      try {
        await transferGroupAdmin(group._id, selectedMember._id);
        setShowTransferModal(false);
        onClose(); // Close the group info modal
      } catch (error) {
        // Error handled in store
      } finally {
        setIsTransferring(false);
      }
    }
  };

  // Filter out current admin from the list
  const availableMembers = group.members.filter(
    (member) => member.user._id !== group.admin._id && member.role !== "admin"
  );

  return (
    <>
      <div className="p-4 border-t border-slate-700/50">
        <h4 className="text-slate-200 font-medium mb-3">Admin Controls</h4>
        <button
          onClick={() => setShowTransferModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-amber-400 bg-amber-500/10 rounded-lg hover:bg-amber-500/20 transition-colors"
        >
          <CrownIcon className="w-4 h-4" />
          Transfer Admin Role
        </button>
      </div>

      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-200">Transfer Admin Role</h3>
              <p className="text-slate-400 text-sm mt-1">Select a member to transfer admin role to</p>
            </div>

            <div className="max-h-64 overflow-y-auto p-4">
              {availableMembers.length > 0 ? (
                availableMembers.map((member) => (
                  <div
                    key={member.user._id}
                    role="button"
                    tabIndex={0}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMember?._id === member.user._id
                        ? "bg-cyan-500/20 border border-cyan-500/30"
                        : "bg-slate-700/30 hover:bg-slate-700/50"
                    }`}
                    onClick={() => setSelectedMember(member.user)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedMember(member.user);
                      }
                    }}
                  >
                    <div className="avatar">
                      <div className="size-10 rounded-full overflow-hidden">
                        <img 
                          src={member.user.profilePic || "/avatar.png"} 
                          alt={member.user.fullName} 
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-200 font-medium text-sm">{member.user.fullName}</h4>
                      <p className="text-slate-400 text-xs">{member.user.email}</p>
                    </div>
                    {selectedMember?._id === member.user._id && (
                      <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">No members available to transfer admin role</p>
              )}
            </div>

            <div className="p-4 border-t border-slate-700/50 flex gap-3">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 px-4 py-2 text-slate-400 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                disabled={isTransferring}
              >
                Cancel
              </button>
              <button
                onClick={handleTransferAdmin}
                disabled={!selectedMember || isTransferring}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isTransferring ? (
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <CrownIcon className="w-4 h-4" />
                )}
                Transfer Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const RemoveMemberButton = ({ groupId, memberId, memberName }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const { removeMemberFromGroup } = useChatStore();

  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the group?`)) {
      setIsRemoving(true);
      try {
        await removeMemberFromGroup(groupId, memberId);
      } catch (error) {
        // Error handled in store
      } finally {
        setIsRemoving(false);
      }
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isRemoving}
      className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
      title={`Remove ${memberName}`}
    >
      {isRemoving ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4" />}
    </button>
  );
};

export default GroupInfoModal;