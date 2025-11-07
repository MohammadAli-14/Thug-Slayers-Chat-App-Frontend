  // CreateGroupModal.jsx
  import { useState, useEffect } from "react";
  import { useChatStore } from "../store/useChatStore";
  import { XIcon, SearchIcon, CheckIcon } from "lucide-react";
  import toast from "react-hot-toast";

  function CreateGroupModal({ isOpen, onClose }) {
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const { allContacts, createGroup, getAllContacts } = useChatStore();

    useEffect(() => {
      if (isOpen) {
        getAllContacts();
      }
    }, [isOpen, getAllContacts]);

    const filteredContacts = allContacts.filter(
      (contact) =>
        contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleMemberSelection = (contact) => {
      setSelectedMembers((prev) =>
        prev.find((member) => member._id === contact._id)
          ? prev.filter((member) => member._id !== contact._id)
          : [...prev, contact]
      );
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!groupName.trim()) {
        toast.error("Group name is required");
        return;
      }

      try {
        const memberIds = selectedMembers.map((member) => member._id);
        await createGroup({
          name: groupName,
          description,
          memberIds,
        });

        // Reset form
        setGroupName("");
        setDescription("");
        setSelectedMembers([]);
        setSearchTerm("");
        onClose();
      } catch (error) {
        // Error handled in store
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        {/* Modal container: flex column so header/footer stay fixed and center section scrolls */}
        <div className="bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-200">Create New Group</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              type="button"
              aria-label="Close modal"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Form: flex-1 to fill available height */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              {/* Group Name */}
              <div>
                <label className="auth-input-label">Group Name *</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="input"
                  placeholder="Enter group name"
                  required
                  maxLength={50}
                />
              </div>

              {/* Description */}
              <div>
                <label className="auth-input-label">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input resize-none"
                  placeholder="Enter group description"
                  rows="2"
                  maxLength={200}
                />
              </div>

              {/* Selected Members Preview */}
              {selectedMembers.length > 0 && (
                <div>
                  <label className="auth-input-label">
                    Selected Members ({selectedMembers.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-2 bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{member.fullName}</span>
                        <button
                          type="button"
                          onClick={() => toggleMemberSelection(member)}
                          className="text-cyan-400 hover:text-cyan-300"
                          aria-label={`Remove ${member.fullName}`}
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search and Member Selection */}
              <div>
                <label className="auth-input-label">Add Members</label>

                {/* Search */}
                <div className="relative mb-3">
                  <SearchIcon className="auth-input-icon" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input"
                    placeholder="Search contacts..."
                    aria-label="Search contacts"
                  />
                </div>

                {/* Contacts List — allow it to grow but keep a max height so overall page still scrolls */}
                <div className="max-h-56 overflow-y-auto space-y-2">
                  {filteredContacts.map((contact) => {
                    const isSelected = selectedMembers.find((m) => m._id === contact._id);
                    return (
                      <div
                        key={contact._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleMemberSelection(contact)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleMemberSelection(contact);
                          }
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-cyan-500/20 border border-cyan-500/30"
                            : "bg-slate-700/30 hover:bg-slate-700/50"
                        }`}
                      >
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700">
                            <img
                              src={contact.profilePic || "/avatar.png"}
                              alt={contact.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-slate-200 font-medium text-sm truncate">
                            {contact.fullName}
                          </h4>
                          <p className="text-slate-400 text-xs truncate">{contact.email}</p>
                        </div>

                        {isSelected && <CheckIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                      </div>
                    );
                  })}

                  {filteredContacts.length === 0 && (
                    <p className="text-slate-400 text-center py-4 text-sm">No contacts found</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer (fixed at bottom of modal) */}
            <div className="p-6 border-t border-slate-700/50">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-slate-400 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!groupName.trim()}
                  className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Group
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default CreateGroupModal;
