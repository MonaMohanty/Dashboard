import { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const AllAnomaliesGraph = ({ anomalies }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  useEffect(() => {
    // const chart = chartRef.current;

    if (!anomalies || anomalies.length === 0) return;

    const labels = anomalies.map((item) => item.Timestamp);

    const updatedData = {
      labels,
      datasets: [
        {
          label: "MQ135 Raw Value",
          data: anomalies.map((item) => parseFloat(item["MQ135 Raw Value"])),
          borderColor: "red",
          yAxisID: "y1",
        },
        {
          label: "CO2 Concentration (ppm)",
          data: anomalies.map((item) =>
            parseFloat(item["CO2 Concentration (ppm)"])
          ),
          borderColor: "blue",
          yAxisID: "y2",
        },
        {
          label: "Ammonia Concentration (ppm)",
          data: anomalies.map((item) =>
            parseFloat(item["Ammonia Concentration (ppm)"])
          ),
          borderColor: "green",
          yAxisID: "y3",
        },
      ],
    };

    setChartData(updatedData);
  }, [anomalies]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "MQ135 Raw Value",
        },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "CO2 Concentration (ppm)",
        },
        grid: {
          drawOnChartArea: false, // Avoid overlapping grid lines
        },
      },
      y3: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Ammonia Concentration (ppm)",
        },
        grid: {
          drawOnChartArea: false,
        },
        offset: true, // Add spacing for clarity
      },
    },
  };

  return (
    <Chart ref={chartRef} type="line" data={chartData} options={options} />
  );
};

export default AllAnomaliesGraph;
