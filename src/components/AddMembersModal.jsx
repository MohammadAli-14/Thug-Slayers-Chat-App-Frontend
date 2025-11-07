import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { XIcon, SearchIcon, CheckIcon } from "lucide-react";

function AddMembersModal({ group, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { allContacts, addMembersToGroup, getAllContacts } = useChatStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  // Filter out existing group members and already selected members
  const existingMemberIds = group.members.map(member => member.user._id);
  const availableContacts = allContacts.filter(contact =>
    !existingMemberIds.includes(contact._id) &&
    (contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleMemberSelection = (contact) => {
    setSelectedMembers(prev =>
      prev.find(member => member._id === contact._id)
        ? prev.filter(member => member._id !== contact._id)
        : [...prev, contact]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member to add");
      return;
    }

    try {
      const memberIds = selectedMembers.map(member => member._id);
      await addMembersToGroup(group._id, memberIds);
      
      // Reset and close
      setSelectedMembers([]);
      setSearchTerm("");
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-200">Add Members to {group.name}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Selected Members Preview */}
            {selectedMembers.length > 0 && (
              <div>
                <label className="auth-input-label">
                  Selected to Add ({selectedMembers.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map(member => (
                    <div
                      key={member._id}
                      className="flex items-center gap-2 bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{member.fullName}</span>
                      <button
                        type="button"
                        onClick={() => toggleMemberSelection(member)}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Contact Selection */}
            <div>
              <label className="auth-input-label">Select Contacts to Add</label>
              
              {/* Search */}
              <div className="relative mb-3">
                <SearchIcon className="auth-input-icon" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                  placeholder="Search contacts..."
                />
              </div>

              {/* Contacts List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {availableContacts.map(contact => (
                  <div
                    key={contact._id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMembers.find(m => m._id === contact._id)
                        ? "bg-cyan-500/20 border border-cyan-500/30"
                        : "bg-slate-700/30 hover:bg-slate-700/50"
                    }`}
                    onClick={() => toggleMemberSelection(contact)}
                  >
                    <div className="avatar">
                      <div className="size-10 rounded-full">
                        <img 
                          src={contact.profilePic || "/avatar.png"} 
                          alt={contact.fullName}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-200 font-medium text-sm truncate">
                        {contact.fullName}
                      </h4>
                      <p className="text-slate-400 text-xs truncate">
                        {contact.email}
                      </p>
                    </div>

                    {selectedMembers.find(m => m._id === contact._id) && (
                      <CheckIcon className="size-4 text-cyan-400 flex-shrink-0" />
                    )}
                  </div>
                ))}
                
                {availableContacts.length === 0 && (
                  <p className="text-slate-400 text-center py-4 text-sm">
                    {searchTerm ? "No contacts found" : "No available contacts to add"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
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
                disabled={selectedMembers.length === 0}
                className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Members
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMembersModal;