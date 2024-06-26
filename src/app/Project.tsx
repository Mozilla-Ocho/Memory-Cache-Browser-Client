import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GetStarted from "./GetStarted";
import NewProjectDialog from "./NewProjectDialog";
import { ProjectContext } from "./ProjectContext";
import ProjectSettings from "./ProjectSettings";

const Project: React.FC = (props) => {
  const [projectFileList, setProjectFileList] = useState<string[]>([]);
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
  } = useContext(ProjectContext);
  const { projectId } = useParams();
  if (projectId && activeProject && parseInt(projectId) !== activeProject.id) {
    const project = projects.find(
      (project) => project.id === parseInt(projectId),
    );
    if (project) {
      setActiveProject(project);
    }
  }

  useEffect(() => {
    reloadProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects]);

  if (projects.length === 0) {
    return <GetStarted />;
  }

  const deleteActiveProject = async () => {
    const activeProjectId = activeProject.id;
    setActiveProject(undefined);
    await projectsApi.deleteProjectApiV1DeleteProjectDelete({
      projectId: activeProjectId,
    });
    await reloadProjects();
  };

  return (
    <div>
      <NewProjectDialog />

      {activeProject && <ProjectSettings />}
    </div>
  );
};

export default Project;
