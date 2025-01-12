import axios from "axios";
import { useState, useEffect, useRef } from "react";
// import TimeVsElementGraph from "../GenerateGraphs/TimeVsElementGraph/TimeVsElementGraph";
import TimeVsElementSazitization from "../GenerateGraphs/SanitizationGraph/TimeVsElementSanitization";
// import DataVsAnomaliesGraph from "../GenerateGraphs/DataVsAnomaliesGraph/DataVsAnomaliesGraph";

const SanitizationDetection = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  //   const [lastFetchedIndex, setLastFetchedIndex] = useState(0); // Track the last fetched index
  const lastFetchedIndexRef = useRef(0);
  const MAX_ROWS = 600;

  // Parse CSV data from backend
  const fetchData = async () => {
    const fileId = "1XQ867NlPleUCzRm2weroUm9ZfPJQywCz"; // File ID to send
    const maxRows = 50;

    // console.log('fetching data with last index as', lastFetchedIndex);

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

      // console.log(responseData.length)

      if (responseData.length > 0) {
        console.log(
          "Initial value of lastFetchedIndex:",
          lastFetchedIndexRef.current
        );

        // Update the ref directly
        lastFetchedIndexRef.current += responseData.length;

        // console.log('last fetched index is now', lastFetchedIndex+responseData.length);
        setData((prevData) => {
          // Update data without creating a new array if possible
          const combinedData = prevData.concat(responseData);

          if (combinedData.length > MAX_ROWS) {
            // Remove the oldest rows directly in-place
            combinedData.splice(0, combinedData.length - MAX_ROWS);
          }

          return combinedData;
        });
      }
    } catch (err) {
      setError("Failed to fetch CSV data.");
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
  return (
    <div className="w-full px-5 my-5 z-10 min-h-screen">
      <h2 className="text-center font-bold text-5xl mb-10">
        Sanitization Detection
      </h2>
      <div className="text-center space-x-5">
        <button
          onClick={handleButtonClick}
          className="btn  bg-red-500 text-2xl"
          disabled={loading || streaming}
        >
          {!loading && !streaming ? "Start Streaming" : "Streaming Data..."}
        </button>
        {streaming && (
          <button
            onClick={handleStopClick}
            className="btn btn-danger text-2xl mt-4"
          >
            Stop Streaming
          </button>
        )}
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

            {/* <DataVsAnomaliesGraph
              data={data}
              property="cpu_temperature"
              label="CPU Temperature (°C)"
              yLabel="CPU Temperature (°C)"
              normalColor="rgba(54, 162, 235, 1)"
            />
            <DataVsAnomaliesGraph
              data={data}
              property="cpu_temperature"
              label="CPU Temperature (°C)"
              yLabel="CPU Temperature (°C)"
              normalColor="rgba(54, 162, 235, 1)"
            /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SanitizationDetection;
