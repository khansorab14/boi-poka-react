import { useState } from "react";

import CreateGroupModal from "../bottom-tab-navigation/inner-circle/group/create-group-modal";

interface AddMoreButtonProps {
  activeTab: string;
  onOpenDefaultModal: () => void;
  onGroupCreated: () => void;
}

const AddMoreButton = ({
  activeTab,
  onOpenDefaultModal,
  onGroupCreated,
}: AddMoreButtonProps) => {
  const [showGroupModal, setShowGroupModal] = useState(false);

  const handleClick = () => {
    if (activeTab === "groups") {
      setShowGroupModal(true);
    } else {
      onOpenDefaultModal();
    }
  };

  // const handleGroupCreated = () => {
  //   onGroupCreated(); // 📌 notify parent
  //   setShowGroupModal(false); // 📌 close modal
  // };

  return (
    <>
      <div className="absolute bottom-16 left-0 w-full bg-white px-4 py-4 shadow-inner z-10">
        <button
          className="flex items-center space-x-2 text-black"
          onClick={handleClick}
        >
          <span className="text-2xl">+</span>
          <span className="border-b border-black pb-0.5">
            {activeTab === "groups" ? "add group" : "add more"}
          </span>
        </button>
      </div>

      <CreateGroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        onGroupCreatedRefresh={() => {
          onGroupCreated(); // ✅ trigger refresh
          setShowGroupModal(false); // ✅ close modal
        }}
      />
    </>
  );
};

export default AddMoreButton;
