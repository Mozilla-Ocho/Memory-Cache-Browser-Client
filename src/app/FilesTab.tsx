import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "./ProjectContext";

function FilesTab() {
  const { activeProject, projectsApi } = useContext(ProjectContext);
  const [projectDirectories, setProjectDirectories] = useState<string[]>([]);

  useEffect(() => {
    async function getProjectDirectories() {
      const projectDirectories =
        await projectsApi.listProjectDirectoriesApiV1ListProjectDirectoriesGet({
          projectId: activeProject?.id,
        });
      console.log(projectDirectories);
      setProjectDirectories(projectDirectories);
    }
    getProjectDirectories();
  }, [activeProject, projectsApi]);

  return (
    <div>
      <h1 className="font-light text-lg text-gray-400">Directories</h1>
      <table>
        {projectDirectories.map((directory) => (
          <tr>
            <td>{directory.path}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default FilesTab;
