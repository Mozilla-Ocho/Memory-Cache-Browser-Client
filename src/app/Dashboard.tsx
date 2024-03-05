import React, { useEffect, useState } from "react";
import { useProject } from "./ProjectContext";
import ProjectFileList from "./ProjectFileList";
import ProjectSelectionListBox from "./ProjectSelectionListBox";
import GetStarted from "./GetStarted";
import NewProjectDialog from "./NewProjectDialog";

const Dashboard: React.FC = () => {
  const [projectFileList, setProjectFileList] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const {
    projects,
    setProjects,
    reloadProjects,
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
    reloadProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects]);

  useEffect(() => {
    if (activeProject) {
      filesApi
        .listFilesApiV1ListFilesProjectNameGet({
          projectName: activeProject.name,
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
    const activeProjectId = activeProject.id;
    setActiveProject(undefined);
    await projectsApi.deleteProjectApiV1DeleteProjectDelete({
      deleteProjectRequest: { projectId: activeProjectId },
    });
    await reloadProjects();
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <NewProjectDialog open={open} setOpen={setOpen} />

      {projects.length > 0 && (
        <>
          <ProjectSelectionListBox />
        </>
      )}

      <button
        onClick={() => setOpen(true)}
        type="button"
        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Create New Project
      </button>

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
