import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { UsersIcon } from "lucide-react";

function GroupsList() {
  const { getMyGroups, groups, isGroupsLoading, setSelectedGroup, setSelectedUser } = useChatStore();

  useEffect(() => {
    getMyGroups();
  }, [getMyGroups]);

  const handleGroupClick = (group) => {
    // Clear any selected user and set the selected group
    setSelectedUser(null);
    setSelectedGroup(group);
  };

  if (isGroupsLoading) return <UsersLoadingSkeleton />;
  if (groups.length === 0) return <NoGroupsFound />;

  return (
    <>
      {groups.map((group) => (
        <div
          key={group._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => handleGroupClick(group)}
        >
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="size-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                {group.profilePic ? (
                  <img 
                    src={group.profilePic} 
                    alt={group.name}
                    className="object-cover rounded-full"
                  />
                ) : (
                  <UsersIcon className="size-6 text-cyan-400" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-200 font-medium truncate">{group.name}</h4>
              <p className="text-slate-400 text-sm truncate">
                {group.members.length} members
                {group.description && ` • ${group.description}`}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

const NoGroupsFound = () => {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
        <UsersIcon className="w-8 h-8 text-cyan-400" />
      </div>
      <div>
        <h4 className="text-slate-200 font-medium mb-1">No groups yet</h4>
        <p className="text-slate-400 text-sm px-6">
          Create a new group to start chatting with multiple people
        </p>
      </div>
      <button
        onClick={() => setActiveTab("groups")}
        className="px-4 py-2 text-sm text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors"
      >
        Create your first group
      </button>
    </div>
  );
};

export default GroupsList;