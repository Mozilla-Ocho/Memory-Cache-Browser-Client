import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Project } from "../api/models/Project";
import { FilesApi } from "../api/apis/FilesApi";
import { IngestApi } from "../api/apis/IngestApi";
import { LlamafileApi } from "../api/apis/LlamafileApi";
import { ProjectsApi } from "../api/apis/ProjectsApi";
import { RagApi } from "../api/apis/RagApi";
import { SummariesApi } from "../api/apis/SummariesApi";
import { Configuration } from "../api";

interface ProjectContextType {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  filesApi: FilesApi;
  ingestApi: IngestApi;
  llamafileApi: LlamafileApi;
  projectsApi: ProjectsApi;
  ragApi: RagApi;
  summariesApi: SummariesApi;
  openNewProjectDialog: boolean;
  setOpenNewProjectDialog: (open: boolean) => void;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined,
);

interface ProjectProviderProps {
  children: ReactNode;
}

// TODO: ProjectProvider is probably not the right name for this component.
//       For now my plan is just to put a bunch of global state in here.
export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [openNewProjectDialog, setOpenNewProjectDialog] = useState(false);

  const configuration = new Configuration({
    basePath: "http://localhost:4444",
  });

  const filesApi = new FilesApi(configuration);
  const ingestApi = new IngestApi(configuration);
  const llamafileApi = new LlamafileApi(configuration);
  const projectsApi = new ProjectsApi(configuration);
  const ragApi = new RagApi(configuration);
  const summariesApi = new SummariesApi(configuration);

  const reloadProjects = async () => {
    const response = await projectsApi.listProjectsApiV1ListProjectsGet();
    return setProjects(response.projects);
  };

  useEffect(() => {
    reloadProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
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
        openNewProjectDialog,
        setOpenNewProjectDialog,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
