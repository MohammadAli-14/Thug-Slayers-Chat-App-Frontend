  import { useState, useRef } from "react";
  import { VolumeOffIcon, Volume2Icon } from "lucide-react";
  import { useAuthStore } from "../store/useAuthStore";
  import { useChatStore } from "../store/useChatStore";

  const mouseClickSound = new Audio("/sound/mouse-click.mp3");

  function ProfileHeader() {
    const { authUser, updateProfile } = useAuthStore();
    const { isSoundEnabled, toggleSound } = useChatStore();
    const [selectedImg, setSelectedImg] = useState(null);

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
      };
    };

    const handleSoundToggle = () => {
      // Play click sound before toggling
      mouseClickSound.currentTime = 0; // reset to start
      mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
      toggleSound();
    };

    return (
      <div className="w-full">
        <div className="flex items-center justify-between">
          {/* User Info and Avatar */}
          <div className="flex items-center gap-3">
            {/* AVATAR */}
            <div className="avatar online">
              <button
                className="size-14 rounded-full overflow-hidden relative group"
                onClick={() => fileInputRef.current.click()}
              >
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="User image"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </div>
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* USERNAME & ONLINE TEXT */}
            <div>
              <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
                {authUser.fullName}
              </h3>
              <p className="text-slate-400 text-xs">Online</p>
            </div>
          </div>

          {/* SOUND TOGGLE BUTTON ONLY */}
          <button
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all duration-200 group relative"
            onClick={handleSoundToggle}
            title={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
            {/* Hover border effect */}
            <div className="absolute inset-0 border border-amber-400/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>
      </div>
    );
  }

  export default ProfileHeader;