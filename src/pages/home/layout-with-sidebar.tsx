import React, { useState, useEffect } from "react";
import Footer from "../../components/common/header-footer/footer";
import Header from "../../components/common/header-footer/header";
import { useAuthStore } from "../../state/use-auth-store";

import { AnimatePresence, motion } from "framer-motion";

import Home from "../../pages/home/home";
import InnerCircle from "../bottom-tab-navigation/inner-circle/inner-circle";
import IamBoared from "../bottom-tab-navigation/iam-boared/iam-boared";
import MyPersona from "../bottom-tab-navigation/persona/my-persona";
import Sidebar from "../side-bar/side-bar";
import axiosInstance from "../../api/axios-instance";
import { useNavigateTabStore } from "../../store/navigate-tab-store";

const tabOrder = [
  "Library",
  "Inner Circle",
  "I am Bored",
  "My Persona",
  "Settings",
];

const LayoutWithSidebar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const token = useAuthStore((state) => state.token);

  const { currentTab, previousTab } = useNavigateTabStore();

  const getDirection = (current: string, previous: string) => {
    const currentIndex = tabOrder.indexOf(current);
    const prevIndex = tabOrder.indexOf(previous);
    return currentIndex > prevIndex ? 1 : -1;
  };

  const direction = getDirection(currentTab, previousTab as string);

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  const fetchUserData = async () => {
    try {
      const res = await axiosInstance.get("/user/getUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const renderMainContent = () => {
    const contentMap: Record<string, JSX.Element> = {
      Library: <Home />,
      "Inner Circle": <InnerCircle />,
      "I am Bored": <IamBoared />,
      "My Persona": <MyPersona />,
      Settings: <MyPersona />,
    };

    const currentContent = contentMap[currentTab] ?? (
      <div className="p-4">Coming Soon</div>
    );

    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentTab}
          custom={direction}
          initial={{ x: direction * 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {currentContent}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        userData={userData}
      />
      <Header
        onMenuOpen={() => setMenuOpen(true)}
        onSearchToggle={() => console.log("Search toggled")}
      />
      <main className="flex-grow overflow-y-auto">{renderMainContent()}</main>
      <Footer />
    </div>
  );
};

export default LayoutWithSidebar;
