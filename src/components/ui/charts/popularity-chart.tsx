import React from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";

interface ChartData {
  asset: string;
  amount: number;
}

interface PopularityChartProps {
  popularity?: Record<string, number>;
}

const PopularityChart: React.FC<PopularityChartProps> = ({ popularity }) => {
  if (!popularity || Object.keys(popularity).length === 0) {
    return <p>No popularity data available.</p>;
  }

  const transformedData: ChartData[] = Object.entries(popularity).map(
    ([country, count]) => ({
      asset: country.charAt(0).toUpperCase() + country.slice(1),
      amount: count,
    })
  );

  const chartOptions: AgChartOptions = {
    data: transformedData,
    title: { text: "Popularity by Country" },
    series: [
      {
        type: "donut",
        angleKey: "amount",
        calloutLabelKey: "asset",
        innerRadiusRatio: 0.6,
        sectorLabel: {
          enabled: true,
          formatter: ({ datum }) => `${datum.asset}: ${datum.amount}`,
        },
      },
    ],
    legend: {
      position: "bottom",
      spacing: 20,
      maxHeight: undefined, // allow full legend height
      maxWidth: undefined, // allow full legend width
      pagination: { enabled: false }, // no arrows
      item: {
        paddingX: 16,
        label: { formatter: ({ datum }) => `${datum.asset} • ${datum.amount}` },
      },
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <AgCharts options={chartOptions} />
    </div>
  );
};

export default PopularityChart;
