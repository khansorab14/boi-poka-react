// components/home/ShelvesTab.tsx
import React from "react";

import ShelvesTabView from "../../../components/ui/shelves/shelves-tab-view";

const ShelvesTab: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto mb-20 px-4">
      <ShelvesTabView />
    </div>
  );
};

export default ShelvesTab;
