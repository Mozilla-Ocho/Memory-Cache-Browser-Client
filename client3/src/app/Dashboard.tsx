import React from "react";
import { useProject } from "./ProjectContext"; // Adjust the import path as necessary

const Dashboard: React.FC = () => {
  const { projects, activeProjectId, setActiveProjectId } = useProject();

  const selectedProject = projects.find(
    (project) => project.id === activeProjectId,
  ) || { name: "No project selected", id: "-1" };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Selected project: {selectedProject.name}</p>
    </div>
  );
};

export default Dashboard;
