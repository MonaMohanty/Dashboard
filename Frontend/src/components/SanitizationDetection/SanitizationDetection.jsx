import axios from "axios";
import { useState, useEffect, useRef } from "react";
// import TimeVsElementGraph from "../GenerateGraphs/TimeVsElementGraph/TimeVsElementGraph";
import TimeVsElementSazitization from "../GenerateGraphs/SanitizationGraph/TimeVsElementSanitization";
// import AllAnomaliesGraph from "../GenerateGraphs/AllAnomaliesGraph/AllAnomaliesGraph";
// import DataVsAnomaliesGraph from "../GenerateGraphs/DataVsAnomaliesGraph/DataVsAnomaliesGraph";

const SanitizationDetection = () => {
  const [data, setData] = useState([]); // State to store the most recent rows
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [streaming, setStreaming] = useState(false); // State to track streaming status
  const [intervalId, setIntervalId] = useState(null); // ID of the interval
  const [hasMoreData, setHasMoreData] = useState(true); // Whether more data is available
  const [selectedOption, setSelectedOption] = useState("");

  const lastFetchedIndexRef = useRef(0); // Ref to track the last fetched index

  // Function to fetch data from the server
  const fetchData = async () => {
    const fileId = "1XQ867NlPleUCzRm2weroUm9ZfPJQywCz"; // File ID to send
    const maxRows = 10; // Number of rows to fetch per request

    try {
      const response = await axios.get(
        `http://localhost:5000/fetch-data?fileId=${fileId}&maxRows=${maxRows}&startIndex=${lastFetchedIndexRef.current}`,
        {
          responseType: "text",
        }
      );

      const responseData = response.data
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));

      if (responseData.length > 0) {
        console.log("Fetched rows:", responseData);
        // Update the ref directly with the new index
        lastFetchedIndexRef.current += responseData.length;

        // Update state to store only the most recent rows
        setData(responseData);
      } else {
        console.log("All data has been fetched.");
        setHasMoreData(false); // Signal that no more data is available
        handleStopClick(); // Stop streaming automatically
      }
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("Failed to fetch CSV data.");
        setHasMoreData(false); // Stop further requests
        handleStopClick(); // Stop streaming automatically
      } else {
        setError("No more data to fetch.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Start streaming when button is clicked
  const handleButtonClick = () => {
    if (!streaming) {
      setLoading(true);
      setStreaming(true);

      if (!intervalId) {
        const newIntervalId = setInterval(fetchData, 3000); // Fetch every 3 seconds
        setIntervalId(newIntervalId);
      }
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

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
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
        Sanitization Detection
      </h2>
      <div className="text-center space-x-5">
        <button
          onClick={handleButtonClick}
          className="btn  bg-blue-500 text-2xl px-5 py-2 rounded-lg"
          disabled={loading || streaming}
        >
          {!loading && !streaming ? "Start Streaming" : "Streaming Data..."}
        </button>
        {streaming && (
          <button
            onClick={handleStopClick}
            className="btn  bg-red-500 text-2xl mt-4  px-5 py-2 rounded-lg"
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

      {error && <p className="text-red-500 text-center py-5">{error}</p>}
      {!hasMoreData && <p>All data has been fetched.</p>}

      {loading ? (
        <div className="text-center min-h-[400px] flex justify-center items-center">
          <span className="loading loading-spinner text-error text-5xl p-10"></span>
        </div>
      ) : (
        <div>
          <div className="w-full">
            {data.length > 0 && (
              <table className=" table-auto w-full mt-10 border-collapse border border-gray-300">
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
            <TimeVsElementSazitization
              data={data}
              metric="MQ135 Raw Value"
              label="MQ135 Raw Value"
              title="MQ135 Raw Value"
              color="rgba(75, 192, 192, 1)"
            />
            <TimeVsElementSazitization
              data={data}
              metric="CO2 Concentration (ppm)"
              label="CO2 Concentration (ppm)"
              title="CO2 Concentration Detection"
              color="rgba(255, 99, 132, 1)"
            />
            <TimeVsElementSazitization
              data={data}
              metric="Ammonia Concentration (ppm)"
              label="Ammonia Concentration (ppm)"
              title="Ammonia Concentration Detection"
              color="rgba(54, 162, 235, 1)"
            />
          </div>
          {/* <AllAnomaliesGraph data={data} /> */}
        </div>
      )}
    </div>
  );
};

export default SanitizationDetection;
