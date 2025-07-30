import React from "react";

interface LocationMapSettingProps {
  data: {
    Location1?: string;
    Location2?: string;
  } | null;
}

const LocationMapSetting: React.FC<LocationMapSettingProps> = ({ data }) => {
  console.log(data, "data from location");
  if (!data) return null;

  const { Location1 = "N/A", Location2 = "N/A" } = data;

  return (
    <div className="text-sm text-start font-serif">
      <div className="mb-2">
        <span className="font-semibold">-</span> {Location1}
      </div>
      <div className="mb-2">
        <span className="font-semibold">-</span> {Location2}
      </div>
    </div>
  );
};

export default LocationMapSetting;
