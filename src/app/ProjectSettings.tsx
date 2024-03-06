import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useProject } from "./ProjectContext";
import ProjectFileListCondensed from "./ProjectFileListCondensed";

import { PaperClipIcon } from "@heroicons/react/20/solid";
import { FolderIcon } from "@heroicons/react/20/solid";
import { FolderPlusIcon } from "@heroicons/react/20/solid";

function AddProjectDirectory({ refresh }) {
  const [path, setPath] = useState("");
  const { projectsApi, activeProject } = useProject();

  const isPathEmpty = path.trim() === "";
  // Check if the path has characters that are not allowed in file names
  const hasIllegalCharacters = /[:*?"<>|]/.test(path);

  const handleAddDirectory = async () => {
    if (activeProject && !isPathEmpty && !hasIllegalCharacters) {
      await projectsApi.createProjectDirectoryApiV1CreateProjectDirectoryPost({
        projectId: activeProject.id,
        path: path.trim(),
      });
      refresh();
    } else {
      console.error("No active project or path is empty");
    }
  };

  return (
    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
      <div className="flex w-0 flex-1 items-center">
        <FolderPlusIcon
          className="h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
        <div className="flex flex-grow space-x-4">
          <label htmlFor="dirname" className="sr-only">
            Directory
          </label>
          <input
            type="text" // Changed from "string" to "text" as it's the correct type for input
            name="dir"
            id="dirname"
            className="pl-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="/path/to/directory"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </div>

        <div className="ml-4 flex flex-shrink-0 space-x-4">
          <button
            onClick={handleAddDirectory}
            type="button"
            disabled={isPathEmpty || hasIllegalCharacters} // Disable the button if path is empty
            className={`rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm flex ${isPathEmpty || hasIllegalCharacters ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            Add Directory
          </button>
        </div>
      </div>
    </li>
  );
}

function ProjectDirectory({
  id,
  path,
  count,
  onDelete,
}: {
  id: int;
  path: string;
  count: number;
  onDelete: (id: int) => void;
}) {
  const { projectsApi, activeProject } = useProject();
  return (
    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
      <div className="flex w-0 flex-1 items-center">
        <FolderIcon
          className="h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
        <div className="ml-4 flex min-w-0 flex-1 gap-2">
          <span className="truncate font-medium">{path}</span>
          <span className="flex-shrink-0 text-gray-400">
            {count > 1
              ? `${count} Documents`
              : count === 1
                ? "1 Document"
                : "Empty"}
          </span>
        </div>
      </div>
      <div className="ml-4 flex flex-shrink-0 space-x-4">
        <button
          type="button"
          className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
        >
          Refresh
        </button>
        <span className="text-gray-200" aria-hidden="true">
          |
        </span>
        <button
          onClick={() => {
            onDelete(id);
          }}
          type="button"
          className="rounded-md bg-white font-medium text-gray-900 hover:text-gray-800"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export default function Example() {
  const { activeProject, projectsApi, filesApi } = useProject();

  const [projectDirectories, setProjectDirectories] = useState([]);

  const doit = async () => {
    if (activeProject) {
      const result =
        await projectsApi.listProjectDirectoriesApiV1ListProjectDirectoriesGet({
          projectId: activeProject.id,
        });
      setProjectDirectories(result);
    }
  };
  // Use useEffect to get the active project's ProjectDirectory s
  useEffect(() => {
    doit();
  }, [activeProject]);

  async function syncFiles() {
    const response =
      await filesApi.apiSyncProjectFilesApiV1SyncProjectFilesPost({
        projectId: activeProject.id,
      });
    // TODO: Cause the ProjectFileListCondensed to refresh
  }

  async function deleteProject() {
    await projectsApi.deleteProjectApiV1DeleteProjectDelete({
      deleteProjectRequest: {
        projectId: activeProject.id,
      },
    });
  }

  return (
    <>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          {activeProject?.name}
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Project Settings
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Project Name
            </dt>
            <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-3 sm:mt-0">
              <span className="flex-grow">{activeProject?.name}</span>
              <span className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button>
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              About
            </dt>
            <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-3 sm:mt-0">
              <span className="flex-grow">
                Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                proident. Irure nostrud pariatur mollit ad adipisicing
                reprehenderit deserunt qui eu.
              </span>
              <span className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </button>
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Project Directories
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-3 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                {projectDirectories.map((dir) => (
                  <ProjectDirectory
                    id={dir.id}
                    path={dir.path}
                    count={10}
                    onDelete={async (directoryId) => {
                      console.log("Deleting project", directoryId);
                      await projectsApi.deleteProjectDirectoryApiV1DeleteProjectDirectoryDelete(
                        { directoryId: directoryId },
                      );
                      doit();
                    }}
                  />
                ))}
                <AddProjectDirectory refresh={doit} />
              </ul>
            </dd>
          </div>

          <button
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={syncFiles}
          >
            Sync Files
          </button>

          <button
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={deleteProject}
          >
            Delete Project
          </button>

          <ProjectFileListCondensed />

          <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Project Files
            </dt>
            <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-3 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <FolderIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="font-medium">{"ABC"}</span>
                  </div>
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="font-medium">{"foo bar baz"}</span>
                  </div>
                </li>
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <FolderIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="font-medium">{"ABCkldjsalk;jsdalf"}</span>
                  </div>
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="font-medium">{"foo bar baz"}</span>
                  </div>
                </li>
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <FolderIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="font-medium">{"ABCkldjsalk;jsdalf"}</span>
                  </div>
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="font-medium">{"foo bar baz"}</span>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
