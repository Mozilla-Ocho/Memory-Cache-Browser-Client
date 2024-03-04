import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context state
interface ProjectContextType {
  activeProject: string | null;
  setActiveProject: (projectId: string | null) => void;
}

// Create a context with an undefined initial value, but assert the type
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
