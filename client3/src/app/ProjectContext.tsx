import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Project } from "../api/models/Project";
import { ProjectsApi } from "../api/apis/ProjectsApi";
import { Configuration } from "../api";

//export interface Project {
//    /**
//     *
//     * @type {string}
//     * @memberof Project
//     */
//    projectName: string;
//    /**
//     *
//     * @type {string}
//     * @memberof Project
//     */
//    projectId: string;
//}

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  fetchProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const projectsApi = new ProjectsApi(
    new Configuration({ basePath: "http://localhost:4444" }),
  );

  async function fetchProjects() {
    const result = await projectsApi.listProjectsApiV1ListProjectsGet();
    console.log(result);
    setProjects(result.projects);
  }

  return (
    <ProjectContext.Provider
      value={{ projects, activeProjectId, setActiveProjectId, fetchProjects }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
