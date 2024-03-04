import { useState } from "react";
import Sidebar from "../components/DarkSidebar";
/* import Dashboard from "./Dashboard";
 * import Projects from "./Projects"; */

const Dashboard = () => {
  return <h1>Dashboard</h1>;
};
const Projects = () => {
  return <h1>Projects</h1>;
};

export default function App() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  // Function to change the active component
  const handleSelectionChange = (selectedComponent) => {
    setActiveComponent(selectedComponent);
  };

  // Function to render the active component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Projects":
        return <Projects />;
      // Add more cases as needed
      default:
        return <Dashboard />;
    }
  };

  return (
    <Sidebar onSelectionChange={handleSelectionChange}>
      {renderActiveComponent()}
    </Sidebar>
  );
}
