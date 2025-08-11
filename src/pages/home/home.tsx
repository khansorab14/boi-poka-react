// components/home/index.tsx
import { useState } from "react";

import TabHeader from "./home/tab-header";
import BooksTab from "./home/book-tab";
import ShelvesTab from "./home/shelves-tab";
import MoveDialog from "./home/move-dialouge";
import { useNavigateTabStore } from "../../store/navigate-tab-store";

const Home = () => {
  const [activeTab, setActiveTab] = useState<"books" | "shelves">("books");
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [moveMode, setMoveMode] = useState<"existing" | "new" | null>(null);
  const data = useNavigateTabStore((state) => state);
  console.log("goBack", data);

  return (
    <>
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "books" ? (
          <BooksTab
            // showMoveDialog={showMoveDialog}
            setShowMoveDialog={setShowMoveDialog}
            setMoveMode={setMoveMode}
          />
        ) : (
          <ShelvesTab />
        )}
      </div>

      {showMoveDialog && (
        <MoveDialog
          setShowMoveDialog={setShowMoveDialog}
          moveMode={moveMode}
          setMoveMode={setMoveMode}
        />
      )}
    </>
  );
};

export default Home;
