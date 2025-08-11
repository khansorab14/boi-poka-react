import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axiosInstance from "../../../api/axios-instance";
import InvitationCard from "./invitation/invitation-card";
import GroupCard from "./group/group-card";

import { LoaderCircle } from "lucide-react";
import AddMoreButton from "../../comman-inner-circle/add-more-btn";
import ShareModalInner from "./modals/share-modal-innercircle";
import LibrarySelectModal from "./modals/library-select-modal";
import { useInnerCircleTabStore } from "../../../store/inner-circle-tab-store";
import FellowPokaCard from "./fellow-pokas/fello-poka-card";

import { useNavigationDataStore } from "../../../store/inner-circle/use-navigation-store";
import { FellowPokaCardStore } from "../../../store/inner-circle/fellow-poka-card-store";
interface Invitation {
  _id: string;
  addedAt: string;
  libraryId: string;
  senderId: { _id: string };
  senderDetails: {
    fullName: string;
    profileImage?: string;
  };
}
interface Group {
  _id: string;
  name: string;
  avatar: string;
  isPrivate: boolean;
  members?: { id: string }[];
}
interface Buddy {
  buddyId: string;
  fullName: string;
  profileImage: string;
  email: string;
  phone: string;
  booksSharedByBuddy: any[];
  booksSharedByUser: any[];
  librariesSharedByBuddy: any[];
  librariesSharedByUser: any[];
  sharedByBuddyToUser: number;
  sharedByUserToBuddy: number;
  totalBooksSharedByBuddy: number;
  totalBooksSharedByUser: number;
  total: number; // ✅ Add missing property
}
const tabs = ["invitations", "groups", "fellow pokas"] as const;
// type TabType = (typeof tabs)[number];
const dummyContacts = [
  { name: "Alice", phone: "1234567890" },
  { name: "Bob", phone: "2345678901" },
];
const InnerCircle: React.FC = () => {
  // const [activeTab, setActiveTab] = useState<TabType>("invitations");

  const { activeTab, setActiveTab } = useInnerCircleTabStore();
  console.log("activeTab", activeTab);
  const [tabLoading, setTabLoading] = useState<boolean>(true);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [buddies, setBuddies] = useState<Buddy[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLibrarySelectOpen, setLibrarySelectOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const refreshData = useNavigationDataStore((s: any) => s.refreshData);
  const setRefreshData = useNavigationDataStore((s: any) => s.setRefreshData);
  const { setBuddiesStoreData } = FellowPokaCardStore();

  const buddiesStoredData = FellowPokaCardStore<any>((state) => state.buddies);

  console.log(buddiesStoredData, "buddiesStoredData");

  const handleGroupCreated = async () => {
    setTabLoading(true);
    setGroups([]);
    try {
      const groupRes = await axiosInstance.get("/groups/getUserGroups");
      setGroups(groupRes.data?.data?.groups || []);
    } catch (err) {
      console.error("Error refreshing groups:", err);
    } finally {
      setTabLoading(false);
    }
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      setTabLoading(true);
      try {
        if (refreshData) {
          const res = await axiosInstance.get("/buddies/getBuddiesDetails");
          const buddiesData = res.data || [];

          // Set buddies state
          console.log("calling from tab");
          setBuddies(buddiesData);
          setBuddiesStoreData(buddiesData);
          const [invRes] = await Promise.all([
            axiosInstance.get("/user/getInvitation"),
            // axiosInstance.get("/groups/getUserGroups"),

            // axiosInstance.get("/buddies/getBuddiesDetails"),
          ]);

          setInvitations(invRes.data?.data || []);

          // setGroups(groupRes.data?.data?.groups || []);
        } else {
          setRefreshData(true);
          setBuddies(buddiesStoredData);
        }

        console.log("caling for initaal");
        // setBuddies(buddyRes.data);
      } catch (err) {
        console.error("Initial fetch failed:", err);
      } finally {
        setTabLoading(false);
      }
    };
    fetchInitialData();
  }, []);
  useEffect(() => {
    const fetchTabData = async () => {
      setTabLoading(true);
      try {
        if (activeTab === "invitations") {
          // const res = await axiosInstance.get("/user/getInvitation");
          // setInvitations(res.data?.data || []);
        } else if (activeTab === "groups") {
          const res = await axiosInstance.get("/groups/getUserGroups");
          setGroups(res.data?.data?.groups || []);
        }
        // else if (activeTab === "fellow pokas") {
        // console.log("Buddies fetched:", buddiesData);
        // // Log nicely formatted data for debugging
        // console.log("👥 Fellow Pokas (buddies):");
        // buddiesData.forEach((buddy: any, index: number) => {
        //   console.log(`\n${index + 1}. ${buddy.fullName}`);
        //   console.log(`   📧 Email: ${buddy.email}`);
        //   console.log(`   📞 Phone: ${buddy.phone}`);
        //   console.log(
        //     `   🔁 Books shared by user to buddy: ${buddy.totalBooksSharedByUser}`
        //   );
        //   console.log(
        //     `   🔁 Books shared by buddy to user: ${buddy.totalBooksSharedByBuddy}`
        //   );
        //   if (buddy.booksSharedByUser.length > 0) {
        //     console.log("   📚 Books shared by you:");
        //     buddy.booksSharedByUser.forEach((book: any) =>
        //       console.log(`     - ${book.title} by ${book.author}`)
        //     );
        //   }
        //   if (buddy.booksSharedByBuddy.length > 0) {
        //     console.log("   📚 Books shared by buddy:");
        //     buddy.booksSharedByBuddy.forEach((book: any) =>
        //       console.log(`     - ${book.title} by ${book.author}`)
        //     );
        //   }
        //   if (buddy.librariesSharedByUser.length > 0) {
        //     console.log("   🗂️ Libraries you shared:");
        //     buddy.librariesSharedByUser.forEach((lib: any) =>
        //       console.log(
        //         `     - ${lib.libraryName} (${lib.bookCount} books)`
        //       )
        //     );
        //   }
        //   if (buddy.librariesSharedByBuddy.length > 0) {
        //     console.log("   🗂️ Libraries buddy shared:");
        //     buddy.librariesSharedByBuddy.forEach((lib: any) =>
        //       console.log(
        //         `     - ${lib.libraryName} (${lib.bookCount} books)`
        //       )
        //     );
        //   }
        // });
        // }
      } catch (err) {
        console.error(`Failed to fetch data for tab ${activeTab}:`, err);
      } finally {
        setTabLoading(false);
      }
    };

    fetchTabData();
  }, [activeTab]);

  const handleAccept = async (invitation: any) => {
    console.log("Accepting invitation:", invitation.inviteType);
    try {
      const payload: Record<string, string> = {
        libraryId: invitation.libraryId, // ✅ Always required
      };

      switch (invitation.inviteType) {
        case "Book":
          if (invitation.libraryId) {
            payload.libraryId = invitation.libraryId;
          }
          break;

        case "Group":
          if (invitation.groupId) {
            payload.groupId = invitation.groupId;
            payload.senderId = invitation.senderId._id;
          }
          break;

        case "Buddy":
          if (invitation.senderId?._id) {
            payload.senderId = invitation.senderId._id;
            payload.libraryId = invitation.libraryId;
          }
          break;

        default:
          console.warn("Unknown invite type:", invitation.inviteType);
          return;
      }

      await axiosInstance.post("/user/newAcceptInvite", payload);
      console.log("Invitation accepted:", invitation._id);

      setInvitations((prev) =>
        prev.filter((inv: any) => inv._id !== invitation._id)
      );
    } catch (error) {
      console.error("Accept error:", error);
    }
  };

  const handleReject = async (invitation: any) => {
    console.log("Invitation accepted:", invitation.inviteType);
    try {
      const payload: Record<string, string> = {};

      switch (invitation.inviteType) {
        case "Book":
          if (invitation.libraryId) {
            payload.libraryId = invitation.libraryId;
            payload.senderId = invitation.senderId._id;
          }
          break;

        case "Group":
          if (invitation.groupId) {
            payload.groupId = invitation.groupId;
            payload.senderId = invitation.senderId._id;
          }
          break;
        case "Library":
          if (invitation.libraryId) {
            payload.libraryId = invitation.libraryId;
            payload.senderId = invitation.senderId._id;
          }
          break;

        case "Buddy":
          if (invitation.senderId?._id) {
            payload.senderId = invitation.senderId._id;
            payload.senderId = invitation.senderId._id;
          }
          break;

        default:
          console.warn("Unknown invite type:", invitation.inviteType);
          return;
      }

      await axiosInstance.post("/user/newRejectInvite", payload);
      console.log("Invitation rejected:", invitation._id);

      setInvitations((prev) =>
        prev.filter((inv: any) => inv._id !== invitation._id)
      );
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  const handleContactToggle = (phone: string) => {
    setSelectedContacts((prev) =>
      prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone]
    );
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(dummyContacts.map((c) => c.phone));
    }
    setSelectAll(!selectAll);
  };
  const renderTabContent = () => {
    if (tabLoading) {
      return (
        <div className="flex items-center justify-center h-64 w-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <LoaderCircle className="w-10 h-10 text-gray-500 animate-spin" />
          </motion.div>
        </div>
      );
    }
    switch (activeTab) {
      case "invitations":
        return invitations.length === 0 ? (
          <p className="text-gray-500 mt-4">No invitations available.</p>
        ) : (
          <div className="flex flex-col items-center space-y-4 w-full">
            {invitations.map((inv) => (
              <InvitationCard
                buddiesData={buddies}
                key={inv._id}
                invitedAt={inv.addedAt}
                senderName={inv.senderDetails.fullName}
                senderAvatar={
                  inv.senderDetails.profileImage ||
                  "/assets/icons/user-avatar.svg"
                }
                onAccept={() => handleAccept(inv)}
                onReject={() => handleReject(inv)}
              />
            ))}
          </div>
        );
      case "groups":
        return groups.length === 0 ? (
          <p className="text-gray-500 mt-4">No groups available.</p>
        ) : (
          <div className="flex flex-col items-center space-y-4 w-full">
            {groups.map((group) => (
              <GroupCard
                key={group._id}
                name={group.name}
                avatar={group.avatar}
                membersCount={group.members?.length || 0}
                isPrivate={group.isPrivate}
              />
            ))}
          </div>
        );
      case "fellow pokas":
        return !buddiesStoredData ||
          !Array.isArray(buddies) ||
          buddies.length === 0 ? (
          <p className="text-gray-500 mt-4">No fellow pokas available.</p>
        ) : (
          <div className="flex flex-col items-center space-y-4 w-full">
            {buddies.map((buddy, index) => {
              console.log(buddy, "buddybuddy");
              return (
                <FellowPokaCard
                  key={index}
                  buddyId={buddy.buddyId}
                  fullName={buddy.fullName}
                  profileImage={buddy.profileImage}
                  librariesSharedByBuddy={buddy.librariesSharedByBuddy}
                  librariesSharedByUser={buddy.librariesSharedByUser}
                  totalBooksSharedByBuddy={buddy.totalBooksSharedByBuddy}
                  totalBooksSharedByUser={buddy.totalBooksSharedByUser}
                  booksSharedByBuddy={buddy.booksSharedByBuddy}
                  booksSharedByUser={buddy.booksSharedByUser}
                />
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="sticky top-0 z-10 bg-white pt-10 pb-4 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My inner circle</h1>
          <img
            src="/assets/icons/poka.svg"
            alt="Poka"
            className="w-24 h-24 object-contain"
          />
        </div>
        <div className="flex space-x-8 mt-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium capitalize relative ${
                activeTab === tab ? "text-black" : "text-gray-400"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {activeTab !== "fellow pokas" && (
        <AddMoreButton
          activeTab={activeTab}
          onOpenDefaultModal={() => setModalOpen(true)}
          onGroupCreated={handleGroupCreated}
        />
      )}
      <ShareModalInner
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        contacts={dummyContacts}
        selectedContacts={selectedContacts}
        onToggleContact={handleContactToggle}
        onSelectAll={handleSelectAll}
        selectAll={selectAll}
        onShare={() => {
          setModalOpen(false);
          setLibrarySelectOpen(true);
        }}
      />
      <LibrarySelectModal
        isOpen={isLibrarySelectOpen}
        onClose={() => setLibrarySelectOpen(false)}
        onConfirm={async (libraryId) => {
          // setSelectedLibraryId(libraryId);
          setLibrarySelectOpen(false);
          const invitees = dummyContacts
            .filter((c) => selectedContacts.includes(c.phone))
            .map((c) => ({
              fullName: c.name,
              phoneNumber: c.phone,
              libraryIds: [libraryId],
              notificationsEnabled: true,
            }));
          try {
            const response = await axiosInstance.post(
              "/innercircle/sendInvitation",
              { invitees }
            );
            console.log(":white_tick: Shared successfully", response.data);
            setSelectedContacts([]);
            setSelectAll(false);
          } catch (err) {
            console.error(":x: Failed to share:", err);
          }
        }}
      />
    </div>
  );
};
export default InnerCircle;
