import { useParams, useNavigate, useLocation } from "react-router-dom";
import BooksTab from "../../../home/home/book-tab";
import { ArrowLeft } from "lucide-react";
import { useNavigationDataStore } from "../../../../store/inner-circle/use-navigation-store";

const BuddyLibraryView = () => {
  const {
    buddyId: stateBuddyId,
    fullName,
    // profileImage,
    // librariesSharedByBuddy,
    // librariesSharedByUser,
    // totalBooksSharedByBuddy,
    // totalBooksSharedByUser,
    // booksSharedByBuddy,
    // booksSharedByUser,
  } = useLocation().state || {}; // ✅ flatten the destructure

  const { buddyId: urlBuddyId } = useParams(); // fallback

  const navigate = useNavigate();
  const setRefreshData = useNavigationDataStore((s: any) => s.setRefreshData);

  return (
    <div className="flex flex-col h-full">
      {/* Header with back arrow */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <button
          onClick={() => {
            setRefreshData(false);
            navigate(-1);
          }}
        >
          <ArrowLeft size={20} />
        </button>
        {/* <button
          onClick={() =>
            navigate(-1, {
              state: { refreshData: false },
            })
          }
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button> */}
        <div>
          <h2 className="text-xl font-semibold">{fullName}</h2>
        </div>
      </div>

      <BooksTab
        setMoveMode={() => {}}
        buddyId={urlBuddyId || stateBuddyId}
        mode="buddy"
      />
    </div>
  );
};

export default BuddyLibraryView;
