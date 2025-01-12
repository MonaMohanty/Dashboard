import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ImageDetection from "./components/object-detection/ImageDetection";
import VideoDetection from "./components/object-detection/VideoDetection";
import AnomalyDetection from "./components/AnomalyDetection/AnomalyDetection";
import SanitizationDetection from "./components/SanitizationDetection/SanitizationDetection";

function App() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <Sidebar />
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/anomaly-detection" element={<AnomalyDetection />} />
        <Route
          path="/sanitization-monitoring"
          element={<SanitizationDetection />}
        />
        <Route path="/Object-Detection/Image" element={<ImageDetection />} />
        <Route path="/Object-Detection/Video" element={<VideoDetection />} />
      </Routes>
    </div>
  );
}

export default App;
