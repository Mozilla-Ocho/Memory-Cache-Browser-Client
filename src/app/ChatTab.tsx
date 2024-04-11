import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "./ProjectContext";

function ChatTab() {
  const { activeProject, projectsApi } = useContext(ProjectContext);
  const [projectDirectories, setProjectDirectories] = useState<string[]>([]);

  return (
    <div>
      <h1 className="font-light text-lg text-gray-400">Chat Tab</h1>
    </div>
  );
}

export default ChatTab;
