import { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  buttonBase,
  buttonColorsDanger,
  buttonColorsPrimary,
  directoryRow,
} from "../styles/styles";
import { ProjectContext } from "./ProjectContext";

function FilesTab() {
  const { activeProject, projectsApi } = useContext(ProjectContext);
  const [projectDirectories, setProjectDirectories] = useState([]);
  const [expandedDirectories, setExpandedDirectories] = useState([]);
  const [newDirectoryPath, setNewDirectoryPath] = useState("");

  async function getProjectDirectories() {
    const projectDirectories =
      await projectsApi.listProjectDirectoriesApiV1ListProjectDirectoriesGet({
        projectId: activeProject?.id,
      });
    console.log(projectDirectories);
    setProjectDirectories(projectDirectories);
  }
  useEffect(() => {
    getProjectDirectories();
  }, [activeProject, projectsApi]);

  function isDirectoryExpanded(directory) {
    return expandedDirectories.includes(directory.path);
  }

  return (
    <div>
      <h1 className="font-light text-lg text-gray-400 mb-4">Directories</h1>
      <table className={twMerge("w-full")}>
        <tbody>
          {projectDirectories.map((directory, i) => {
            if (!isDirectoryExpanded(directory)) {
              return (
                <tr
                  onClick={() => {
                    setExpandedDirectories([
                      ...expandedDirectories,
                      directory.path,
                    ]);
                  }}
                  className={twMerge(directoryRow)}
                  key={`directory-${i}`}
                >
                  <td>
                    <p className="text-lg">{directory.path}</p>
                  </td>
                  <td>
                    <button
                      className={twMerge(buttonBase, buttonColorsDanger)}
                      onClick={async () => {
                        const result =
                          await projectsApi.apiDeleteProjectDirectoryApiV1DeleteProjectDirectoryDelete(
                            {
                              directoryId: directory.id,
                            },
                          );
                        console.log("Deleted directory", result);
                        setExpandedDirectories([
                          expandedDirectories.filter(
                            (expandedDirectory) =>
                              expandedDirectory !== directory.path,
                          ),
                        ]);
                        setProjectDirectories([
                          projectDirectories.filter(
                            (projectDirectory) =>
                              projectDirectory.id !== directory.id,
                          ),
                        ]);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr key={`directory-${i}`}>
                  <td>
                    <table className={twMerge("w-full")}>
                      <thead
                        onClick={() => {
                          setExpandedDirectories(
                            expandedDirectories.filter(
                              (expandedDirectory) =>
                                expandedDirectory !== directory.path,
                            ),
                          );
                        }}
                      >
                        <tr className={twMerge(directoryRow)}>
                          <th>
                            <p className="text-lg font-normal">
                              {directory.path}
                            </p>
                          </th>
                          <th>
                            <button
                              className={twMerge(
                                buttonBase,
                                buttonColorsDanger,
                              )}
                              onClick={async () => {
                                const result =
                                  await projectsApi.apiDeleteProjectDirectoryApiV1DeleteProjectDirectoryDelete(
                                    {
                                      directoryId: directory.id,
                                    },
                                  );
                                console.log("Deleted directory", result);
                                setExpandedDirectories([
                                  expandedDirectories.filter(
                                    (expandedDirectory) =>
                                      expandedDirectory !== directory.path,
                                  ),
                                ]);
                                setProjectDirectories([
                                  projectDirectories.filter(
                                    (projectDirectory) =>
                                      projectDirectory.id !== directory.id,
                                  ),
                                ]);
                              }}
                            >
                              Remove
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <p>File 1</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              );
            }
          })}
          <tr className={twMerge(directoryRow)} key="add-directory">
            <td className="w-full">
              <form
                className="flex justify-between w-full"
                onSubmit={async (e) => {
                  e.preventDefault();
                  console.log(
                    `Adding directory ${newDirectoryPath} to project ${activeProject.name} (id: ${activeProject.id})`,
                  );
                  const result =
                    await projectsApi.createProjectDirectoryApiV1CreateProjectDirectoryPost(
                      {
                        projectId: activeProject.id,
                        path: newDirectoryPath,
                      },
                    );
                  console.log("Result", result);
                  getProjectDirectories();
                }}
              >
                <input
                  type="text"
                  className={twMerge(
                    "mx-4 h-8 rounded-md text-xl font-light text-slate-900 flex-grow",
                  )}
                  value={newDirectoryPath}
                  onChange={(e) => setNewDirectoryPath(e.target.value)}
                />
                <button
                  type="submit"
                  className={twMerge(buttonBase, buttonColorsPrimary)}
                >
                  Add Directory
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default FilesTab;
