import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  buttonBase,
  buttonColorsDanger,
  buttonColorsDisabled,
  buttonColorsPrimary,
  buttonColorsSecondary,
  directoryRow,
  interactiveDirectoryRow,
} from "../styles/styles";
import { ProjectContext } from "./ProjectContext";

function sanitizePath(path) {
  const isPathEmpty = path.trim() === "";
  const hasIllegalCharacters = /[:*?"<>()|;]/.test(path);
  if (isPathEmpty || hasIllegalCharacters) {
    return "";
  }
  return path.trim();
}

function getParentDirectory(path) {
  const parts = path.split("/");
  parts.pop();
  return parts.join("/");
}

export function getOriginalFilePath(memCachePath) {
  // Memory Cache stores a copy of the original file in a strange way.
  // For example, for the memCachePath below:
  // AI Blog Posts/uploads/__home__john__src__memory-cache-browser-client__src/api/.openapi-generator/FILES
  // We want to return:
  // /home/john/src/memory-cache-browser-client/src/api/.openapi-generator/FILES
  const parts = memCachePath.split("__");
  parts.shift(); // Remove the first element
  return parts.join("/");
}

function FileListItem({ file, i }) {
  const [showCopiedIcon, setShowCopiedIcon] = useState(false);

  return (
    <tr className={twMerge([i % 2 == 0 ? "bg-gray-100" : "bg-gray-200"])}>
      <td className="font-light text-sm py-4 px-4">
        {getOriginalFilePath(file)}
      </td>
      <td>
        <button
          className={twMerge(
            buttonBase,
            buttonColorsSecondary,
            showCopiedIcon ? buttonColorsPrimary : "",
          )}
          onClick={() => {
            navigator.clipboard.writeText(
              `file:///${getOriginalFilePath(file)}`,
            );
            setShowCopiedIcon(true);
            setTimeout(() => {
              setShowCopiedIcon(false);
            }, 1000);
          }}
        >
          {(showCopiedIcon && (
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
          )) || <ClipboardDocumentIcon className="w-6 h-6" />}
        </button>
      </td>
    </tr>
  );
}

function FileList({ rerender }) {
  const { activeProject, filesApi } = useContext(ProjectContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [projectDirectories, setProjectDirectories] = useState([]);

  async function getFileList() {
    const fileList =
      await filesApi.listProjectFilesApiV1ListProjectFilesProjectIdGet({
        projectId: activeProject.id,
      });
    setFileList(fileList);
  }

  useEffect(() => {
    getFileList();
  }, [isExpanded, activeProject, rerender]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={twMerge(
          directoryRow,
          interactiveDirectoryRow,
          "w-full h-12",
          "font-light text-lg",
          "space-x-4",
          "pr-6",
        )}
      >
        <p>{`${fileList.length} files in cache`}</p>
        {isExpanded ? (
          <EyeIcon className="w-6 h-6" />
        ) : (
          <EyeSlashIcon className="w-6 h-6" />
        )}
      </button>
      {isExpanded && (
        <table className="w-full">
          <tbody className="w-full">
            {fileList.map((file, i) => {
              return <FileListItem file={file} key={`file-${i}`} i={i} />;
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

function FilesTab() {
  const { activeProject, projectsApi, filesApi } = useContext(ProjectContext);
  const [projectDirectories, setProjectDirectories] = useState([]);
  const [newDirectoryPath, setNewDirectoryPath] = useState("");
  const [pathInvalid, setPathInvalid] = useState(false);
  const [rerender, setRerender] = useState(Math.random()); // Hack used to force a rerender
  const [refreshButtonText, setRefreshButtonText] = useState("Refresh");

  async function getProjectDirectories() {
    const projectDirectories =
      await projectsApi.listProjectDirectoriesApiV1ListProjectDirectoriesGet({
        projectId: activeProject?.id,
      });
    setProjectDirectories(projectDirectories);
  }
  useEffect(() => {
    getProjectDirectories();
  }, [activeProject, projectsApi]);

  return (
    <div>
      <h1 className="font-light text-lg text-gray-400 mb-4">Directories</h1>
      <table className={twMerge("w-full my-8")}>
        <tbody className={twMerge("space-y-2")}>
          {projectDirectories.map((directory, i) => (
            <tr className={twMerge(directoryRow)} key={`directory-${i}`}>
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
                    setProjectDirectories([
                      projectDirectories.filter(
                        (projectDirectory) =>
                          projectDirectory.id !== directory.id,
                      ),
                    ]);
                    setRerender(Math.random()); // Force rerender because file list needs to be updated
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          <tr className={twMerge(directoryRow, "flex")} key="add-directory">
            <td className="w-full">
              <form
                className="flex justify-between w-full items-center"
                onSubmit={async (e) => {
                  e.preventDefault();

                  const path = sanitizePath(newDirectoryPath);
                  if (path !== sanitizePath(newDirectoryPath)) {
                    console.error("Invalid path");
                    return;
                  }

                  const result =
                    await projectsApi.createProjectDirectoryApiV1CreateProjectDirectoryPost(
                      {
                        projectId: activeProject.id,
                        path,
                      },
                    );
                  getProjectDirectories();

                  setRerender(Math.random()); // Force rerender because file list needs to be updated
                }}
              >
                <input
                  type="text"
                  className={twMerge(
                    "h-8 rounded-md text-xl font-light text-slate-900 flex-grow",
                  )}
                  value={newDirectoryPath}
                  onChange={(e) => {
                    setNewDirectoryPath(e.target.value);
                    const path = sanitizePath(e.target.value);
                    setPathInvalid(path !== e.target.value);
                  }}
                />
                {pathInvalid && (
                  <p className="ml-4 text-red-500 text-sm">Invalid path</p>
                )}
                <button
                  type="submit"
                  disabled={pathInvalid}
                  className={twMerge(
                    buttonBase,
                    buttonColorsPrimary,
                    "ml-4",
                    pathInvalid ? "cursor-not-allowed" : "",
                    pathInvalid ? buttonColorsDisabled : "",
                  )}
                >
                  Add Directory
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-between">
        <h1 className="font-light text-lg text-gray-400 mb-4">Files</h1>
        <button
          type="button"
          className={twMerge(
            buttonBase,
            buttonColorsSecondary,
            "h-8",
            refreshButtonText === "Refreshing..." ? "cursor-not-allowed" : "",
          )}
          onClick={async () => {
            // Refresh file list
            setRefreshButtonText("Refreshing...");
            const result =
              await filesApi.apiSyncProjectFilesApiV1SyncProjectFilesPost({
                projectId: activeProject.id,
              });
            getProjectDirectories();
            setRerender(Math.random()); // Force rerender because file list needs to be updated
            setTimeout(() => {
              setRefreshButtonText("Refresh");
            }, 1000);
          }}
        >
          {refreshButtonText}
        </button>
      </div>
      <FileList rerender={rerender} />
    </div>
  );
}

export default FilesTab;
