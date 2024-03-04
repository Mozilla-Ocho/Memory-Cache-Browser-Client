import React from "react";
import { useProject } from "./ProjectContext"; // Adjust the import path as necessary

const Dashboard: React.FC = () => {
  const { setActiveProject } = useProject();

  const changeActiveProject = (projectId: string) => {
    setActiveProject(projectId);
  };

  return (
    <div>
      <button onClick={() => changeActiveProject("123")}>
        Change Active Project
      </button>
      <button onClick={() => changeActiveProject("245")}>
        Change Active Project
      </button>
    </div>
  );
};

export default Dashboard;
