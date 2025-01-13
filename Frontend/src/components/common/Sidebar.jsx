import {
  BarChart2,
  Shield,
  Eye,
  Menu,
  ChevronDown,
  ChevronUp,
  PieChart,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Overview",
    icon: PieChart,
    color: "#12a6f0",
    href: "/",
  },
  {
    name: "Computer Anomaly Detection",
    icon: Shield,
    color: "#6366f1",
    href: "/anomaly-detection",
    // subOptions: [
    // 	{ name: "CPU Temp vs Time", href: "/anomaly-detection/cpuTemp-vs-time" },
    // 	{ name: "CPU Usage vs Time", href: "/anomaly-detection/cpuUsage-vs-time" },
    // 	{ name: "CPU Load vs Time", href: "/anomaly-detection/cpuLoad-vs-time" },
    // 	{ name: "CPU Power vs Time", href: "/anomaly-detection/cpuPower-vs-time" },
    // 	{ name: "Battery vs Time", href: "/anomaly-detection/battery-vs-time" },
    // 	{ name: "Memory vs Time", href: "/anomaly-detection/memory-vs-time" },
    // ],
  },
  {
    name: "Sanitization and Monitoring",
    icon: BarChart2,
    color: "#8B5CF6",
    href: "/sanitization-monitoring",
  },
  {
    name: "Object Detection",
    icon: Eye,
    color: "#3B82F6",
    href: "/object-detection",
    subOptions: [
      { name: "Image Detection", href: "/Object-Detection/Image" },
      { name: "Video Detection", href: "/Object-Detection/Video" },
    ],
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Tracks open submenu


  return (
    <motion.div
      className={`relative max-h-screen z-20 transition-all duration-300 ease-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 300 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.href}>
              {!item.subOptions ? (
                <Link to={item.href}>
                  <div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <item.icon
                        size={20}
                        style={{ color: item.color, minWidth: "20px" }}
                      />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            className="ml-4 whitespace-nowrap"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Link>
              ) : (
                <>
                  <div
                    className="flex items-center justify-between p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() =>
                      setOpenSubmenu(
                        openSubmenu === item.name ? null : item.name
                      )
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon
                        size={20}
                        style={{ color: item.color, minWidth: "20px" }}
                      />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            className="ml-4 whitespace-nowrap"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {isSidebarOpen && (
                      <motion.div>
                        {openSubmenu === item.name ? (
                          <ChevronUp size={20} className="mx-2" />
                        ) : (
                          <ChevronDown size={20} className="mx-2" />
                        )}
                      </motion.div>
                    )}
                  </div>

                  <AnimatePresence>
                    {item.subOptions &&
                      openSubmenu === item.name &&
                      isSidebarOpen && (
                        <motion.div
                          className="ml-8 mt-2"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.subOptions.map((sub) => (
                            <Link key={sub.href} to={sub.href}>
                              <div className="p-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors mb-1">
                                {sub.name}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );



};

export default Sidebar;
