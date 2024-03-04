import React, { useEffect } from "react";
import { useProject } from "./ProjectContext";
import { ProjectsApi } from "../api/apis/ProjectsApi";
import { Configuration } from "../api";

const Dashboard: React.FC = () => {
  const { projects, activeProjectId, setActiveProjectId } = useProject();

  const selectedProject = projects.find(
    (project) => project.id === activeProjectId,
  ) || { name: "No project selected", id: "-1" };

  const projectsApi = new ProjectsApi(
    new Configuration({ basePath: "http://localhost:4444" }),
  );

  useEffect(() => {
    async function fetchData() {
      const result = await projectsApi.listProjectsApiV1ListProjectsGet();
      console.log(result);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Selected project: {selectedProject.name}</p>
    </div>
  );
};

export default Dashboard;
