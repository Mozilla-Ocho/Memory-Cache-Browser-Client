import React, { useEffect, useState } from "react";
import { useProject } from "./ProjectContext";
import ProjectFileList from "./ProjectFileList";

const Dashboard: React.FC = () => {
  const {
    projects,
    setProjects,
    activeProject,
    setActiveProject,
    filesApi,
    ingestApi,
    llamafileApi,
    projectsApi,
    ragApi,
    summariesApi,
  } = useProject();

  useEffect(() => {
    projectsApi
      .listProjectsApiV1ListProjectsGet()
      .then((response) => {
        setProjects(response.projects);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [projectFileList, setProjectFileList] = useState<string[]>([]);

  useEffect(() => {
    if (activeProject) {
      filesApi
        .listFilesApiV1ListFilesProjectNameGet({
          projectName: activeProject.projectName,
        })
        // Sort
        .then((response) => {
          return response.sort();
        })
        .then(setProjectFileList);
    }
  }, [activeProject]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Selected project: {activeProject && activeProject.projectName}</p>
      <ProjectFileList projectFileList={projectFileList} />
    </div>
  );
};

export default Dashboard;
