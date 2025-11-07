import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed bg-transparent p-1 md:p-2 m-1 md:m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab tab-sm md:tab-lg ${
          activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab tab-sm md:tab-lg ${
          activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}
      >
        Contacts
      </button>

      {/* Add Groups Tab */}
      <button
        onClick={() => setActiveTab("groups")}
        className={`tab tab-sm md:tab-lg ${
          activeTab === "groups" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
        }`}
      >
        Groups
      </button>
    </div>
  );
}

export default ActiveTabSwitch;