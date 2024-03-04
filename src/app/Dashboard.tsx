import React, { useEffect, useState } from "react";
import { useProject } from "./ProjectContext";
import ProjectFileList from "./ProjectFileList";
import ProjectSelectionListBox from "./ProjectSelectionListBox";
import GetStarted from "./GetStarted";

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

  const updateProjects = async () => {
    const response = await projectsApi.listProjectsApiV1ListProjectsGet();
    setProjects(response.projects);
  };

  useEffect(() => {
    updateProjects();
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

  if (projects.length === 0) {
    return <GetStarted />;
  }

  const deleteActiveProject = async () => {
    const activeProjectName = activeProject.projectName;
    setActiveProject(undefined);
    await projectsApi.deleteProjectApiV1DeleteProjectDelete({
      deleteProjectRequest: { projectName: activeProjectName },
    });
    updateProjects();
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <ProjectSelectionListBox />

      {/* Show the delete project button only if there is an active project */}

      {activeProject && (
        <>
          <button
            onClick={deleteActiveProject}
            type="button"
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Delete Project
          </button>
          <ProjectFileList projectFileList={projectFileList} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
