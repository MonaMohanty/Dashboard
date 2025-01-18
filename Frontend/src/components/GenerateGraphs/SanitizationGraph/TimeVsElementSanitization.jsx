import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const TimeVsElementSazitization = ({ data, metric, label, title, color }) => {
  const [chartData, setChartData] = useState(null);
  const [xAxisTitle, setXAxisTitle] = useState("Time");

  useEffect(() => {
    if (data) {
      // Extract the date and time separately
      const times = data.map(
        (item) => new Date(item.Timestamp).toLocaleTimeString() // Only the time part
      );
      const dateLabel = new Date(data[0]?.Timestamp).toLocaleDateString(); // First data point's date

      const metricData = data.map((item) => parseFloat(item[metric])); // Metric values

      // Prepare chart data structure
      setChartData({
        labels: times,
        datasets: [
          {
            label: label || metric,
            data: metricData,
            borderColor: color || "rgba(75, 192, 192, 1)",
            backgroundColor: color ? `${color}0.2` : "rgba(75, 192, 192, 0.2)",
            fill: false,
            tension: 0.1,
          },
        ],
      });

      // Set the x-axis title dynamically
      setXAxisTitle(dateLabel);
    }
  }, [data, metric, label, color]);

  return (
    <div className="min-w-full min-h-[500px]">
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: xAxisTitle,
                },
              },
              y: {
                title: {
                  display: true,
                  text: label || metric,
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: title || `${metric} Over Time`,
              },
            },
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default TimeVsElementSazitization;
