import { Dialog } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import SelectMembersModal from "./select-member-modal";
import { ChevronRight, Plus } from "lucide-react";
import axiosInstance from "../../../../api/axios-instance";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreatedRefresh: () => void;
}

const colors = [
  "#FF5722",
  "#4CAF50",
  "#2196F3",
  "#9C27B0",
  "#FFC107",
  "#000000",
];

const CreateGroupModal = ({
  isOpen,
  onClose,
  // onGroupCreatedRefresh,
}: CreateGroupModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#000000");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupImage, setGroupImage] = useState<File | null>(null);
  // const [groupImageUrl, setGroupImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance("/buddies/getAllBuddies");
      setMembers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const handleOpenMemberModal = async () => {
    await fetchMembers();
    setMemberModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGroupImage(file);

    try {
      const formData = new FormData();
      formData.append("media", file);

      const res = await axiosInstance.post("/user/uploadMedia", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = res?.data?.data?.urls?.[0];
      if (!uploadedUrl) throw new Error("No URL returned from upload");

      // setGroupImageUrl(uploadedUrl);
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image");
    }
  };

  const handleSubmit = async () => {
    if (!groupName || selectedMembers.length === 0) {
      alert("Group name and at least one member are required.");
      return;
    }

    setLoading(true);

    // try {
    //   let avatarUrl =
    //     groupImageUrl ||
    //     "https://bio-poka.s3.eu-north-1.amazonaws.com/default/group-placeholder.png";

    //   const payload = {
    //     name: groupName,
    //     description,
    //     avatar: avatarUrl,
    //     isPrivate,
    //     color,
    //     members: selectedMembers,
    //   };

    //   const res = await axiosInstance.post("/groups/createGroup", payload);

    //   // ✅ Refresh parent/group list
    //   onGroupCreatedRefresh();

    //   // ✅ Reset fields
    //   setGroupName("");
    //   setDescription("");
    //   setColor("#000000");
    //   setIsPrivate(false);
    //   setSelectedMembers([]);
    //   setGroupImage(null);
    //   setGroupImageUrl(null);

    //   onClose();
    // }
    //  catch (err) {
    //   console.error("Create group failed", err);
    //   alert("Failed to create group");
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    if (isOpen) {
      setGroupName("");
      setDescription("");
      setColor("#000000");
      setIsPrivate(false);
      setSelectedMembers([]);
      setGroupImage(null);
      // setGroupImageUrl(null);
    }
  }, [isOpen]);

  return (
    <Fragment>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Create Group</h2>

            {/* Image Upload */}
            <div className="relative w-28 h-28 mx-auto border rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
              >
                {groupImage ? (
                  <img
                    src={URL.createObjectURL(groupImage)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold">+</span>
                )}
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Group Name */}
            <input
              type="text"
              placeholder="Group Name"
              className="w-full p-3 rounded-md bg-gray-100"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            {/* Description */}
            <textarea
              placeholder="Group Description"
              className="w-full p-3 rounded-md bg-gray-100"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Color Picker */}
            <div>
              <p className="text-sm font-medium">Group Color</p>
              <div className="flex space-x-2 mt-2">
                {colors.map((c) => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer ${color === c ? "border-black" : "border-white"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="text-sm mt-2 font-mono">Selected: {color}</p>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between">
              <p className="text-sm">Private Group</p>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isPrivate ? "bg-black" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isPrivate ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            {/* Member Selection */}
            <div
              className="w-full border-t border-black pt-3"
              onClick={handleOpenMemberModal}
            >
              <button className="flex w-full items-center justify-between text-black">
                <span>Select Members ({selectedMembers.length})</span>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center space-x-2 mt-4 text-black"
            >
              <Plus size={18} />
              <span className="border-b border-black pb-0.5">
                {loading ? "Creating..." : "Create"}
              </span>
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Member Picker Modal */}
      <SelectMembersModal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        selected={selectedMembers}
        onChange={setSelectedMembers}
        members={members}
      />
    </Fragment>
  );
};

export default CreateGroupModal;
