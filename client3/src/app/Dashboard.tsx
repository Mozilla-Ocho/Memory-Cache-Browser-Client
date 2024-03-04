import React, { useEffect } from "react";
import { useProject } from "./ProjectContext";

const Dashboard: React.FC = () => {
  const { projects, activeProjectId, setActiveProjectId, fetchProjects } =
    useProject();

  const selectedProject = projects.find(
    (project) => project.id === activeProjectId,
  ) || { name: "No project selected", id: "-1" };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Selected project: {selectedProject.name}</p>
    </div>
  );
};

export default Dashboard;
