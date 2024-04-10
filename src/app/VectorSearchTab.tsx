import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "./ProjectContext";

function VectorSearchTab() {
  const { activeProject, projectsApi } = useContext(ProjectContext);
  const [projectDirectories, setProjectDirectories] = useState<string[]>([]);

  return (
    <div>
      <h1 className="font-light text-lg text-gray-400">Vector Search</h1>
    </div>
  );
}

export default VectorSearchTab;
