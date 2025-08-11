
//@ts-nocheck
import React, { useState, useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";

interface AuthorDataItem {
  authorOrigin: string;
  percentage: number;
}

interface AuthorChartProps {
  authorData?: AuthorDataItem[];
}

const AuthorChart: React.FC<AuthorChartProps> = ({ authorData }) => {
  console.log(authorData, "authorData from main");
  const colorPalette = [
    "#E95B5B",
    "#4BA3C3",
    "#4E8D64",
    "#7FB77E",
    "#EADFA0",
    "#C792EA",
  ];
  const transformedData = useMemo(
    () =>
      authorData?.map((item, index) => ({
        asset: item.authorOrigin,
        amount: item.percentage,
        color: colorPalette[index % colorPalette.length], // cycle colors
      })) || [],
    [authorData]
  );

  const [selectedAsset, setSelectedAsset] = useState(
    transformedData[0]?.asset || ""
  );
  const [selectedAmount, setSelectedAmount] = useState(
    transformedData[0]?.amount || 0
  );

  const chartOptions: AgChartOptions = {
    data: transformedData,
    series: [
      {
        type: "donut",
        angleKey: "amount",
        calloutLabelKey: "asset",
        innerRadiusRatio: 0.6,
        fills: transformedData.map((d) => d.color),
        strokes: ["#fff"],
        strokeWidth: 2,
        sectorLabel: { enabled: false },
        calloutLabel: { enabled: false },
        highlightStyle: {
          item: {

            offset: 8,
          },
        },
        listeners: {

          nodeClick: (event) => {
            setSelectedAsset(event.datum.asset);
            setSelectedAmount(event.datum.amount);
          },
        },
      },
    ],
    legend: { enabled: false }, // Disable built-in legend
    title: { enabled: false },
  };

  if (!transformedData.length) {
    return <p>No author origin data available.</p>;
  }

  return (
    <div className="p-6 bg-white flex flex-col items-center rounded-lg shadow-sm w-full max-w-md">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">{"Authors Form"}</h1>
      </div>

      <div style={{ width: 400, height: 400, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: "bold" }}>
            {selectedAmount}%
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>{selectedAsset}</div>
        </div>
        <AgCharts options={chartOptions} />
      </div>

      {/* Custom legend */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, auto)",
          gap: "8px 40px",
          marginTop: "16px",
        }}
      >
        {transformedData.map((item) => (
          <div
            key={item.asset}
            style={{ display: "flex", alignItems: "center" }}
          >
            <span style={{ fontWeight: "bold", marginRight: "6px" }}>
              {item.amount.toFixed(1)}%
            </span>
            <span
              style={{
                width: 12,
                height: 12,
                backgroundColor: item.color,
                display: "inline-block",
                marginRight: "6px",
                borderRadius: 2,
              }}
            ></span>
            <span>{item.asset}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorChart;
