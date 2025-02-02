import axios from "axios";
import { useState, useEffect, useRef } from "react";
import TimeVsElementGraph from "../GenerateGraphs/TimeVsElementGraph/TimeVsElementGraph";
import DataVsAnomaliesGraph from "../GenerateGraphs/DataVsAnomaliesGraph/DataVsAnomaliesGraph";

const AnomalyDetection = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  //   const [lastFetchedIndex, setLastFetchedIndex] = useState(0); // Track the last fetched index
  const lastFetchedIndexRef = useRef(0);
  // const MAX_ROWS = 600;

  // Parse CSV data from backend
  const fetchData = async () => {
    const fileId = "1Xy5X4U-wDxtJhcQEpH8V0H7IGFBgKQqi"; // File ID to send
    const maxRows = 10;

    // console.log('fetching data with last index as', lastFetchedIndex);

    try {
      const response = await axios.get(
        `http://localhost:5000/fetch-csv?fileId=${fileId}&maxRows=${maxRows}&startIndex=${lastFetchedIndexRef.current}`,
        {
          responseType: "text",
        }
      );

      const responseData = response.data
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));

      // console.log(responseData.length)

      if (responseData.length > 0) {
        console.log(
          "Initial value of lastFetchedIndex:",
          lastFetchedIndexRef.current
        );

        // Update the ref directly
        lastFetchedIndexRef.current += responseData.length;
        setData(responseData);

        // console.log('last fetched index is now', lastFetchedIndex+responseData.length);
        // setData((prevData) => {
        //   // Update data without creating a new array if possible
        //   const combinedData = prevData.concat(responseData);

        //   if (combinedData.length > MAX_ROWS) {
        //     // Remove the oldest rows directly in-place
        //     combinedData.splice(0, combinedData.length - MAX_ROWS);
        //   }

        //   return combinedData;
        // });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("Failed to fetch CSV data."); // Stop further requests
        handleStopClick(); // Stop streaming automatically
      } else {
        setError("No more data to fetch.");
      }
    } finally {
      setLoading(false);
    }
  };

  // console.log('updated last index', lastFetchedIndex)

  // Start streaming when button is clicked
  const handleButtonClick = () => {
    if (!streaming) {
      setLoading(true);
      setStreaming(true);

      const newIntervalId = setInterval(fetchData, 3000); // Start streaming every 5 seconds
      setIntervalId(newIntervalId);
    }
  };

  // Stop streaming when stop button is clicked
  const handleStopClick = () => {
    setLoading(false);
    setStreaming(false);
    if (intervalId) {
      clearInterval(intervalId); // Clear the interval to stop streaming
      setIntervalId(null);
    }
  };

  // Stop streaming when component unmounts or when needed
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clear the interval when the component unmounts
      }
    };
  }, [intervalId]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
  };
  return (
    <div className="w-full px-5 py-10 z-10 max-h-screen overflow-y-scroll">
      <h2 className="text-center font-bold text-5xl mb-10">
        Get Data to Analyse your Machine
      </h2>
      <div className="text-center space-x-5">
        <button
          onClick={handleButtonClick}
          className="btn btn-primary bg-blue-500 px-3 py-2 rounded-lg text-2xl"
          disabled={loading || streaming}
        >
          {!loading && !streaming ? "Start Streaming" : "Streaming Data..."}
        </button>
        {streaming && (
          <button
            onClick={handleStopClick}
            className="btn btn-danger text-2xl mt-4 bg-red-500 px-3 py-2 rounded-lg"
          >
            Stop Streaming
          </button>
        )}

        <select
          className="bg-green-500 py-2 px-5 rounded-lg text-xl"
          value={selectedOption}
          onChange={handleChange}
        >
          <option value="" disabled>
            Check Overview
          </option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="next7days">Next 7 Days</option>
          <option value="next30days">Next 30 Days</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <div className="text-center min-h-[400px] flex justify-center items-center">
          <span className="loading loading-spinner text-error text-5xl p-10"></span>
        </div>
      ) : (
        <div>
          <div className="w-full">
            {data.length > 0 && (
              <table className="hidden table-auto w-full mt-10 border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="border border-gray-400 px-4 py-2"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td
                          key={i}
                          className="border border-gray-400 px-4 py-2"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            <TimeVsElementGraph
              data={data}
              metric="cpu_temperature"
              label="CPU Temperature (°C)"
              title="CPU Temperature Over Time"
              color="rgba(255, 99, 132, 1)"
            />
            <TimeVsElementGraph
              data={data}
              metric="cpu_usage"
              label="CPU Usage (%)"
              title="CPU Usage Over Time"
              color="rgba(54, 162, 235, 1)"
            />
            <TimeVsElementGraph
              data={data}
              metric="battery_level"
              label="Battery Level (%)"
              title="Battery Level Over Time"
              color="rgba(75, 192, 192, 1)"
            />
            <TimeVsElementGraph
              data={data}
              metric="cpu_load"
              label="CPU Load"
              title="CPU Load Over Time"
              color="rgba(153, 102, 255, 1)"
            />
            <TimeVsElementGraph
              data={data}
              metric="memory_usage"
              label="Memory Usage (%)"
              title="Memory Usage Over Time"
              color="rgba(255, 159, 64, 1)"
            />
            <TimeVsElementGraph
              data={data}
              metric="cpu_power"
              label="CPU Power (W)"
              title="CPU Power Over Time"
              color="rgba(255, 99, 132, 1)"
            />

            <DataVsAnomaliesGraph
              data={data}
              property="cpu_temperature"
              label="CPU Temperature (°C)"
              yLabel="CPU Temperature (°C)"
              normalColor="rgba(54, 162, 235, 1)"
            />

            <DataVsAnomaliesGraph
              data={data}
              property="cpu_load"
              label="CPU Load"
              yLabel="CPU Load (%)"
              normalColor="rgba(75, 192, 192, 1)"
            />

            <DataVsAnomaliesGraph
              data={data}
              property="memory_usage"
              label="Memory Usage (%)"
              yLabel="Memory Usage (%)"
              normalColor="rgba(153, 102, 255, 1)"
            />

            <DataVsAnomaliesGraph
              data={data}
              property="cpu_power"
              label="CPU Power (W)"
              yLabel="CPU Power (W)"
              normalColor="rgba(255, 159, 64, 1)"
            />

            <DataVsAnomaliesGraph
              data={data}
              property="battery_level"
              label="Battery Level (%)"
              yLabel="Battery Level (%)"
              normalColor="rgba(54, 162, 235, 1)"
            />

            <DataVsAnomaliesGraph
              data={data}
              property="cpu_usage"
              label="CPU Usage (%)"
              yLabel="CPU Usage (%)"
              normalColor="rgba(255, 205, 86, 1)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnomalyDetection;
