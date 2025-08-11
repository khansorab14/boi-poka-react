import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PersonaRadarChart = ({ content }: any) => {
  const chartData = {
    labels: content.labels,
    datasets: [
      {
        label: "Reading Distribution (%)",
        data: content.percentages,
        backgroundColor: "rgba(147, 197, 253, 0.3)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 40,
        angleLines: { color: "#E5E7EB" },
        grid: { color: "#E5E7EB" },
        pointLabels: {
          font: { size: 10 },
          color: "#111827",
          callback: function (value: any) {
            const label = String(value);
            return label.length > 10 ? label.slice(0, 10) + "…" : label;
          },
        },
        ticks: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="w-full max-w-xl flex justify-center items-center mb-6">
      <Radar data={chartData} options={chartOptions} />
    </div>
  );
};

export default PersonaRadarChart;
