import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DataVsAnomaliesGraph = ({
  data,
  property,
  label,
  yLabel,
  normalColor,
}) => {
  //   if (!data || data.length === 0) return <p>No data available</p>;

  // Extract times and filter out null or undefined values
  const times = data.map((d) =>
    d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : "Unknown"
  );

  // Extract the date for the x-axis title
  const dateLabel = data[0]?.timestamp
    ? new Date(data[0].timestamp).toLocaleDateString()
    : "Unknown Date";

  // Filter and map the data points for the selected property
  const propertyData = data
    .map((d) => parseFloat(d[property])) // Parse numeric values for the selected property
    .map((value) => (isNaN(value) ? null : value)); // Replace invalid numbers with null

  // Calculate the mean and standard deviation for the valid data points
  const validData = propertyData.filter((value) => value !== null);
  const mean =
    validData.reduce((sum, value) => sum + value, 0) / validData.length;
  const stdDev = Math.sqrt(
    validData.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      validData.length
  );

  const lowerThreshold = mean - 2 * stdDev;
  const upperThreshold = mean + 2 * stdDev;

  // Assign colors based on whether the data is within the threshold or not
  const pointColors = propertyData.map((value) =>
    value === null || value > upperThreshold || value < lowerThreshold
      ? "rgba(255, 99, 132, 1)" // Anomalous points are red
      : normalColor
  );

  // Data to be plotted in the chart
  const chartData = {
    labels: times,
    datasets: [
      {
        label: label,
        data: propertyData,
        backgroundColor: pointColors,
        borderColor: normalColor,
        borderWidth: 2,
        pointRadius: 5,
        fill: false,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            const isAnomaly =
              value === null || value > upperThreshold || value < lowerThreshold
                ? " (Anomaly)"
                : "";
            return `${label}: ${value !== null ? value : "N/A"}${isAnomaly}`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: yLabel } },
      x: {
        title: { display: true, text: dateLabel }, // Set the date as the x-axis title
      },
    },
  };

  return (
    <div className="min-w-full min-h-[500px]">
      <h3 className="text-xl font-bold text-center mb-4">{label}</h3>
      <Line data={chartData} options={options} />
      {/* <p className="text-center mt-2">
        Threshold: {isNaN(lowerThreshold) ? "N/A" : lowerThreshold.toFixed(2)} -
        {isNaN(upperThreshold) ? "N/A" : upperThreshold.toFixed(2)}
      </p> */}
    </div>
  );
};

export default DataVsAnomaliesGraph;
