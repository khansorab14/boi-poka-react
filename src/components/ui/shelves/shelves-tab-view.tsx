import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios-instance";
import { useUIStore } from "../../../store/ui-store";
import ShelfDialog from "./shelf-dialouge";
import RenameShelfDialog from "./rename-shlef-dialouge";
import { toast } from "react-toastify";
import ShelfActionDrawer from "../my-shelf-tab/shelf-action-drawer";
import ShareBooksFlow from "../my-shelf-tab/share-book-flow";
import RemoveFriendsDialog from "../my-shelf-tab/remove-friend-dialouge";
import RemoveBooksDialog from "../my-shelf-tab/remove-book-dialouge";

interface Shelf {
  libraryId: string;
  libraryName: string;
  libraryType: "csv" | "physical" | "others";
  createdAt: string;
  bookCount: number;
  friendsWithAccess: number;
  booksData?: { _id: string }[];
}

interface FriendAccess {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  profileImage: string;
  status: string;
  libraryName: string;
  isPrivate: boolean;
  followedAt: string;
}

interface LibraryStats {
  totalBooksCount: number;
  physicalBook: number;
  csvBook: number;
  othersBook: number;
}

const ShelvesTabView = () => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  console.log(selectedShelf, "selectedShelf-->");
  const [showDrawer, setShowDrawer] = useState(false);
  const { setShowLibrary } = useUIStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [removeMode, setRemoveMode] = useState(false);

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [friendsWithAccess, setFriendsWithAccess] = useState<FriendAccess[]>(
    []
  );
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  // const [friendsErrorMessage, setFriendsErrorMessage] = useState("");
  const [shareModeStage, setShareModeStage] = useState<
    "select" | "customInput" | null
  >(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showRemoveFriendsDialog, setShowRemoveFriendsDialog] = useState(false);

  const fetchLibraryData = async () => {
    try {
      const res = await axiosInstance.get("/userbook/getLibraryData");
      const data = res.data?.data;
      if (data) {
        setShelves(data.libraryData);
        setStats({
          totalBooksCount: data.totalBooksCount,
          physicalBook: data.physicalBook,
          csvBook: data.csvBook,
          othersBook: data.othersBook,
        });
      }
    } catch (err) {
      console.error("Failed to fetch libraries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchFriendsWithAccess = async (libraryId?: string) => {
    try {
      const response = await axiosInstance.get(
        `/innercircle/getFriendsAccessByLibraryId/${libraryId}`
      );

      const data = response.data?.data;

      if (!data || data.length === 0) {
        setFriendsWithAccess([]);
        // setFriendsErrorMessage("No invitations found for the library");
        return;
      }

      const friends = data.map((friend: any, index: number) => {
        const accessInfo = friend.libraryAccess?.find(
          (access: any) => access.libraryId === libraryId
        );

        return {
          id: friend.receiverId || String(index),
          userId: friend.receiverId,
          fullName: friend.fullName,
          phoneNumber: friend.mobileNumber,
          profileImage: friend.profileImage,
          status: accessInfo?.status || "Pending",
          libraryName: accessInfo?.libraryName || "",
          isPrivate: accessInfo?.isPrivate ?? false,
          followedAt: friend.followedAt,
        };
      });

      setFriendsWithAccess(friends);
      // setFriendsErrorMessage("");
    } catch (error: any) {
      console.error("Failed to fetch friends with access", error);
      setFriendsWithAccess([]);
      // setFriendsErrorMessage("Something went wrong while fetching data.");
    }
  };

  const openDrawer = (shelf: Shelf) => {
    setSelectedShelf(shelf);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setSelectedShelf(null);
    setShowDrawer(false);
  };

  const handleShare = async (
    invitees: { fullName: string; phoneNumber: string }[]
  ) => {
    try {
      if (!selectedShelf?.libraryId) {
        toast.error("No library selected");
        return;
      }

      const payload = {
        invitees: invitees.map((invitee) => ({
          ...invitee,
          libraryIds: [selectedShelf.libraryId],
        })),
      };

      const response = await axiosInstance.post(
        "/innercircle/sendInvitation",
        payload
      );

      toast.success("Shared successfully!");
      console.log("Share successful:", response.data);
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Share failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-4  mt-6">
      {stats && (
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div className="bg-yellow-50 p-3 rounded">
            <div className="text-gray-500">total books</div>
            <div className="text-xl font-semibold">{stats.totalBooksCount}</div>
          </div>
          <div className="bg-teal-100 p-3 rounded">
            <div className="text-gray-500">physical</div>
            <div className="text-xl font-semibold">{stats.physicalBook}</div>
          </div>
          <div className="bg-blue-100 p-3 rounded">
            <div className="text-gray-500">csv</div>
            <div className="text-xl font-semibold">{stats.csvBook}</div>
          </div>
          <div className="bg-rose-100 p-3 rounded">
            <div className="text-gray-500">others</div>
            <div className="text-xl font-semibold">{stats.othersBook}</div>
          </div>
        </div>
      )}

      {shelves.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No books found in library
        </div>
      )}
      {/* <h1>{JSON.stringify(shelves)}</h1> */}
      {shelves.length > 0 &&
        shelves.map((shelf) => {
          return (
            <div
              key={shelf.libraryId}
              className="bg-yellow-50 rounded p-4 flex justify-between items-center cursor-pointer"
              onClick={() => openDrawer(shelf)}
            >
              <div>
                <div className="text-lg font-medium">{shelf.libraryName}</div>
                <div className="text-sm text-gray-500">{shelf.createdAt}</div>
                <div className="text-black text-[10px] mt-2">●●●</div>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-sm text-gray-500">friends</span>
                <span className="text-lg font-semibold">
                  {shelf.friendsWithAccess}
                </span>
                <span className="text-sm text-gray-500 mt-2">books</span>
                <span className="text-lg font-semibold">{shelf.bookCount}</span>
              </div>
            </div>
          );
        })}

      <RemoveBooksDialog
        isOpen={removeMode}
        onClose={() => {
          setRemoveMode(false);
          setSelectedBookIds([]);
        }}
        // stats={stats}
        // setStats={setStats}
        shelves={shelves}
        setShelves={setShelves}
        shelfName={selectedShelf?.libraryName || ""}
        books={selectedShelf?.booksData || []}
        selectedBookIds={selectedBookIds}
        setSelectedBookIds={setSelectedBookIds}
        libraryId={selectedShelf?.libraryId}
        onSuccess={() => {
          setShelves((prev) =>
            prev.filter((s) => s.libraryId !== selectedShelf?.libraryId)
          );
          closeDrawer();
          fetchLibraryData(); // 🔁 REFRESH after delete
        }}
        // isLoading={isBooksLoading}
        onRemoveSelected={() => {
          // Call API or function to remove books
          console.log("Remove these:", selectedBookIds);

          setRemoveMode(false);
        }}
      />

      <ShelfActionDrawer
        showDrawer={showDrawer}
        selectedShelf={selectedShelf}
        closeDrawer={closeDrawer}
        setShowDeleteDialog={setShowDeleteDialog}
        setShareModeStage={setShareModeStage}
        setShowLibrary={setShowLibrary}
        setRemoveMode={setRemoveMode}
        setShowRenameDialog={setShowRenameDialog}
        setShowRemoveFriendsDialog={setShowRemoveFriendsDialog}
        fetchFriendsWithAccess={fetchFriendsWithAccess}
      />

      <RemoveFriendsDialog
        isOpen={showRemoveFriendsDialog}
        shelfName={selectedShelf?.libraryName || ""}
        friends={friendsWithAccess}
        shelves={shelves}
        setShelves={setShelves}
        libraryId={selectedShelf?.libraryId || ""}
        onClose={() => setShowRemoveFriendsDialog(false)}
        setShowRemoveFriendsDialog={setShowRemoveFriendsDialog}
        onSuccess={() => {
          toast.success("Friends removed successfully!");
          // fetchFriendsWithAccess(selectedShelf?.libraryId);
          setShowRemoveFriendsDialog(false);
        }}
        onRemove={(selectedIds) => {
          console.log("Removed friends:", selectedIds);
          setShowRemoveFriendsDialog(false);
          // toast.success("Friends removed successfully");
        }}
      />

      <ShelfDialog
        isOpen={showDeleteDialog}
        libraryId={selectedShelf?.libraryId || ""}
        shelfName={selectedShelf?.libraryName || ""}
        onClose={() => setShowDeleteDialog(false)}
        onSuccess={() => {
          setShelves((prev) =>
            prev.filter((s) => s.libraryId !== selectedShelf?.libraryId)
          );
          closeDrawer();
        }}
      />

      <RenameShelfDialog
        isOpen={showRenameDialog}
        currentName={selectedShelf?.libraryName || ""}
        onClose={() => setShowRenameDialog(false)}
        onRenameSuccess={(libraryId, newName) => {
          setShelves((prev) =>
            prev.map((s) =>
              s.libraryId === libraryId ? { ...s, libraryName: newName } : s
            )
          );
        }}
      />

      <ShareBooksFlow
        shareModeStage={shareModeStage}
        setShareModeStage={setShareModeStage as any}
        fullName={fullName}
        setFullName={setFullName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        contactList={friendsWithAccess}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
        handleShare={handleShare}
      />
    </div>
  );
};

export default ShelvesTabView;
