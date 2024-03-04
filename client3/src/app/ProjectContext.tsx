import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Project {
  id: string;
  name: string;
  // Add more attributes here as needed
}

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
  const [projects, setProjects] = useState<Project[]>([
    { id: "0", name: "Loading..." },
  ]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>("0");

  const fetchProjects = async () => {
    // Fetch projects from the backend
    // This is a placeholder, replace with your actual fetch call
    /* const response = await fetch('/api/projects');
     * const projects = await response.json(); */
    await new Promise((resolve) => setTimeout(resolve, 300));
    setProjects([
      { id: "aa1", name: "Project 1" },
      { id: "bb2", name: "Project 2" },
      { id: "cc3", name: "Project 3" },
      { id: "dd4", name: "Project 4" },
    ]);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{ projects, activeProjectId, setActiveProjectId, fetchProjects }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
