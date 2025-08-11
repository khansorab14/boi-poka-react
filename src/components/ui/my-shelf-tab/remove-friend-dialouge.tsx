import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios-instance";

// interface Friend {
//   id: string;

//   userId: string;
//   fullName: string;
//   phoneNumber: string;
//   type: "member" | "follower";
//   profileImage?: any;
//   status?: any;
// }
interface FriendAccess {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  profileImage?: any;
  type?: any;
  status?: any;
}

interface RemoveFriendsDialogProps {
  isOpen: boolean;
  shelfName: string;
  friends?: FriendAccess[];
  libraryId: string;
  shelves: any;
  setShelves: any;
  onClose: () => void;
  setShowRemoveFriendsDialog: (val: boolean) => void;
  onSuccess: () => void;
  onRemove: (selectedIds: string[]) => void;
  fetchFriendsWithAccess?: () => void;
}

const RemoveFriendsDialog: React.FC<RemoveFriendsDialogProps> = ({
  isOpen,
  shelfName,
  friends,
  libraryId,
  shelves,
  setShelves,
  onClose,
  onRemove,
  onSuccess,
  setShowRemoveFriendsDialog,
  fetchFriendsWithAccess,
}) => {
  console.log(libraryId, "libraryId -->");
  console.log(friends, "friends -->");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // const handleRemove = async () => {
  //   const apiCalls = selected
  //     .map((userId) => {
  //       const friend = friends.find((f) => f.id === userId);
  //       if (!friend) return null;
  //       console.log(libraryId, friend.userId, "library id & member id");

  //       if (friend) {
  //         return axiosInstance.put("/user/removeLibFromFollower", {
  //           followerId: friend.userId,
  //           libraryId,
  //         });
  //       } else {
  //         console.error("failed");
  //       }
  //     })
  //     .filter(Boolean);

  //   try {
  //     setLoading(true);
  //     await Promise.all(apiCalls);
  //     onSuccess();
  //     onRemove(selected);
  //     setSelected([]);
  //     setShowRemoveFriendsDialog(false);
  //   } catch (err) {
  //     console.error("Failed to remove friends", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRemove = async () => {
    const apiCalls = selected
      .map((userId) => {
        if (!friends) return null;
        const friend = friends.find((f) => f.id === userId);
        if (!friend) return null;
        console.log(libraryId, friend.userId, "library id & member id");

        return axiosInstance.put("/user/removeLibFromFollower", {
          followerId: friend.userId,
          libraryId,
        });
      })
      .filter(Boolean);

    try {
      setLoading(true);
      await Promise.all(apiCalls);

      // ✅ Update shelves: remove selected friend IDs from matching shelf
      setShelves((prevShelves: any[]) =>
        prevShelves.map((shelf) => {
          if (shelf.libraryId === libraryId) {
            const newCount = Math.max(
              0,
              (shelf.friendsWithAccess || 0) - selected.length
            );

            return {
              ...shelf,
              friendsWithAccess: newCount,
            };
          }
          return shelf;
        })
      );

      console.log(shelves, "$$$$$$$$$$");
      onSuccess();
      onRemove(selected);
      setSelected([]);
      setShowRemoveFriendsDialog(false);
    } catch (err) {
      console.error("Failed to remove friends", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && typeof fetchFriendsWithAccess === "function") {
      fetchFriendsWithAccess();
    }
  }, [isOpen, fetchFriendsWithAccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
        <h2 className="text-xl font-semibold text-center mb-4">
          Remove Friends from "{shelfName}"
        </h2>

        <input
          type="text"
          placeholder="Search friends"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 bg-gray-100"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-2 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {(friends ?? [])
              .filter((f) =>
                f.fullName.toLowerCase().includes(search.toLowerCase())
              )
              .map((friend) => (
                <label
                  key={friend.id}
                  className="bg-white rounded-xl shadow p-4 flex gap-4 items-start transition hover:shadow-md border cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(friend.id)}
                    onChange={() => toggleSelect(friend.id)}
                    className="mt-2 accent-red-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.profileImage}
                        alt={friend.fullName}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                      <div>
                        <div className="font-semibold text-base text-gray-800">
                          {friend.fullName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {friend.phoneNumber}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      <span className="capitalize">{friend.type}</span> —{" "}
                      {friend.status}
                    </div>
                  </div>
                </label>
              ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600"
          >
            Cancel
          </button>
          <button
            disabled={selected.length === 0 || loading}
            onClick={handleRemove}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
          >
            {loading ? "Removing..." : "Remove Selected"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveFriendsDialog;
