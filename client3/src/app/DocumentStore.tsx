import React from "react";
import { useProject } from "./ProjectContext"; // Adjust the import path as necessary

const DocumentStore: React.FC = () => {
  const { activeProject } = useProject();

  return <div>Current Active Project: {activeProject}</div>;
};

export default DocumentStore;
