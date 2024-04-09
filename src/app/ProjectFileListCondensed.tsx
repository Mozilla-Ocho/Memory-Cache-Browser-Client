import { useProject } from "./ProjectContext";
import { useState } from "react";
import { useEffect } from "react";

export default function Example() {
  const { filesApi, activeProject } = useProject();

  const [files, setFiles] = useState([]);

  function getFileTypeFromFileName(filename) {
    const parts = filename.split(".");
    const extension = parts[parts.length - 1];
    return extension;
  }

  function getFileNameFromPath(path) {
    const parts = path.split("/");
    return parts[parts.length - 1];
  }

  function getOneLevelUpDirectoryFromPath(path) {
    const parts = path.split("/");
    parts.pop();
    let lastPart = parts.pop();
    // Replace __ with / to get the original directory name
    return lastPart.replace(/__/g, "/");
  }

  async function listProjectFiles() {
    const response =
      await filesApi.listProjectFilesApiV1ListProjectFilesProjectIdGet({
        projectId: activeProject.id,
      });
    console.log(response);
    setFiles(
      response.map((file) => {
        return {
          projectDirectory: getOneLevelUpDirectoryFromPath(file),
          filename: getFileNameFromPath(file),
          filetype: getFileTypeFromFileName(file),
        };
      }),
    );
  }

  useEffect(() => {
    listProjectFiles();
  }, [filesApi, activeProject]);

  return (
    <div className="px-4">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto -mx-8">
          <div className="inline-block min-w-full py-2 align-middle px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Directory
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Filename
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Filetype
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                      {file.projectDirectory || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                      {file.filename || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {file.filetype || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
