import { FolderIcon, FolderPlusIcon } from "@heroicons/react/20/solid";
import { PencilIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  buttonBase,
  buttonColorsPrimary,
  buttonColorsSecondary,
  buttonColorsDanger,
  tabHeader,
  tabHeaderActive,
} from "../styles/styles";
import { ProjectContext } from "./ProjectContext";
import ProjectFileListCondensed from "./ProjectFileListCondensed";
import TextBoxForm from "./TextBoxForm";
import FilesTab from "./FilesTab";
import VectorSearchTab from "./VectorSearchTab";
import ChatTab from "./ChatTab";

function AddProjectDirectory({ refresh }) {
  const [path, setPath] = useState("");
  const { projectsApi, activeProject } = useContext(ProjectContext);

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
      console.error("No active cache or path is empty");
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
            className="pl-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring focus:ring-indigo-500 focus:border-indigo-500 "
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
  const [expanded, setExpanded] = useState(false);
  const expandButtonText = expanded ? "Collapse" : "Expand";
  const { projectsApi, activeProject } = useContext(ProjectContext);
  return (
    <li className="flex-col mx-4 leading-6">
      <div
        className="flex my-4 items-center justify-between h-full text-sm"
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <div className="flex w-0 flex-1 items-center">
          <FolderIcon
            className="h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <div className="ml-4 flex h-full min-w-0 flex-1 gap-2">
            <span
              className="h-full"
              onClick={(e) => {
                console.log("hi");
                e.preventDefault();
                // Prevent bubbling
                e.stopPropagation();
              }}
              className="truncate font-medium"
            >
              {path}
            </span>
            <span className="invisible flex-shrink-0 text-gray-400">
              {count > 1
                ? `${count} Documents`
                : count === 1
                  ? "1 Document"
                  : "Empty"}
            </span>
          </div>
        </div>
        <div className="ml-4 flex flex-shrink-0 space-x-4 items-center">
          <button
            onClick={() => {
              setExpanded(!expanded);
            }}
            type="button"
            className="rounded-md bg-gray-200 p-2 font-medium text-gray-900 hover:text-gray-800"
          >
            {expandButtonText}
          </button>
          <span className="text-gray-200" aria-hidden="true">
            |
          </span>
          <button
            onClick={() => {
              onDelete(id);
            }}
            type="button"
            className="rounded-md bg-gray-200 p-2 font-medium text-gray-900 hover:text-gray-800"
          >
            Remove
          </button>
        </div>
      </div>
      {expanded && (
        <div className="flex w-full flex-col my-4 pt-4 space-y-2">
          <div className="h-8">File</div>
          <div className="h-8">File</div>
          <div className="h-8">File</div>
          <div className="h-8">File</div>
        </div>
      )}
    </li>
  );
}

let tabIndex = 0;
const TABS = {
  FILES: tabIndex++,
  VECTOR_SEARCH: tabIndex++,
  CHAT: tabIndex++,
};
const tabs = [
  { id: TABS.FILES, name: "Files", component: FilesTab },
  { id: TABS.VECTOR_SEARCH, name: "Vector Search", component: VectorSearchTab },
  { id: TABS.CHAT, name: "Chat", component: ChatTab },
];

export default function ProjectSettings() {
  const {
    activeProject,
    projectsApi,
    filesApi,
    ingestApi,
    ragApi,
    setActiveProject,
  } = useContext(ProjectContext);

  const [projectDirectories, setProjectDirectories] = useState([]);
  const [reply, setReply] = useState("");
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [projectName, setProjectName] = useState(activeProject?.name);
  const [localProjectName, setLocalProjectName] = useState(activeProject?.name);
  const [activeTab, setActiveTab] = useState(tabs[0].id); // Default to first tab

  const handleKeyPress = (event, tabId) => {
    // Check if the key pressed is Enter or Space
    if (event.key === "Enter" || event.key === " ") {
      // Prevent the default action to avoid scrolling on space press
      event.preventDefault();
      setActiveTab(tabId);
    }
  };

  // Update the project name on the server when it changes locally, with useEffect
  useEffect(() => {
    // Use the projectsApi
    if (projectName !== localProjectName) {
      console.log("TODO: Update the project name on the server");
      //setProjectName(localProjectName);
    }
  }, [localProjectName]);

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

  async function ingestFiles() {
    const response =
      await ingestApi.ingestProjectFilesApiV1IngestProjectFilesPost({
        projectId: activeProject.id,
      });
    console.log(response);
  }

  async function deleteProject() {
    await projectsApi.deleteProjectApiV1DeleteProjectDelete({
      projectId: activeProject.id,
    });
  }

  async function deleteProjectDirectory(directoryId) {
    await projectsApi.apiDeleteProjectDirectoryApiV1DeleteProjectDirectoryDelete(
      {
        directoryId: directoryId,
      },
    );
  }

  async function ragAsk(prompt) {
    console.log("prompt is:", prompt);
    console.log("activeProject.id is:", activeProject.id);
    const response = await ragApi.ragAskApiV1RagAskPost({
      ragAskRequest: {
        projectId: activeProject.id,
        prompt,
      },
    });
    console.log(response.response);
    setReply(response.response);
  }

  return (
    <>
      <div className="">
        {(isEditingProjectName && (
          <form
            className="flex items-center space-x-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setIsEditingProjectName(false);
              const project =
                await projectsApi.updateProjectApiV1UpdateProjectPost({
                  projectId: activeProject.id,
                  projectName: localProjectName,
                });
              console.log("project is:", project);
              setActiveProject(project);
            }}
          >
            <input
              type="text"
              className={twMerge("h-8 rounded-md")}
              value={localProjectName}
              onChange={(e) => setLocalProjectName(e.target.value)}
            />
            <button
              type="submit"
              className={twMerge(buttonBase, buttonColorsPrimary)}
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditingProjectName(false);
                setLocalProjectName(projectName);
              }}
              className={twMerge(buttonBase, buttonColorsDanger)}
              type="button"
            >
              <XCircleIcon
                className="h-5 w-5 flex-shrink-0 text-white"
                aria-hidden="true"
              />
            </button>
          </form>
        )) || (
          <div className="flex space-x-4">
            <h3 className="text-2xl font-light text-slate-900">
              {activeProject?.name}
            </h3>
            <button
              type="button"
              className={twMerge(
                buttonBase,
                "px-1.5",
                "py-0",
                buttonColorsSecondary,
                "bg-gray-400",
              )}
              onClick={() => {
                setIsEditingProjectName(true);
              }}
            >
              <PencilIcon
                className="h-5 w-5 flex-shrink-0 text-white"
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>
      <fieldset className="flex justify-between my-8">
        {tabs.map((tab) => (
          <div key={tab.id} className="tab">
            <input
              type="radio"
              id={`tab-${tab.id}`}
              name="tab"
              className="hidden"
              checked={activeTab === tab.id}
              onChange={() => setActiveTab(tab.id)}
              aria-hidden="true"
            />
            <label
              htmlFor={`tab-${tab.id}`}
              className={twMerge(
                tabHeader,
                activeTab === tab.id && tabHeaderActive,
              )}
              tabIndex="0" // Make label focusable
              onClick={() => setActiveTab(tab.id)}
              onKeyPress={(event) => handleKeyPress(event, tab.id)}
              // ARIA role for better screen reader support
              role="button"
              aria-pressed={activeTab === tab.id}
            >
              {tab.name}
            </label>
          </div>
        ))}
      </fieldset>

      {activeTab == TABS.FILES && <FilesTab />}
      {activeTab == TABS.VECTOR_SEARCH && <VectorSearchTab />}
      {activeTab == TABS.CHAT && <ChatTab />}
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="hidden px-4 py-6 ">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Vector Search
            </dt>
            <dd className="mt-1 flex text-sm leading-6 text-gray-700 w-full">
              <div className="flex w-full justify-around">
                <TextBoxForm onSubmit={ragAsk} />

                <div>
                  <p>{reply || "reply goes here"}</p>
                </div>
              </div>
            </dd>
          </div>
          <div className="hidden px-4 py-6 ">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Actions
            </dt>
            <dd className="mt-1 flex text-sm leading-6 text-gray-700 gap-x-2">
              <button
                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={syncFiles}
              >
                Sync Files
              </button>

              <button
                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={ingestFiles}
              >
                Ingest Files
              </button>

              <button
                className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                onClick={deleteProject}
              >
                Delete Project
              </button>
            </dd>
          </div>
          <div className="hidden px-4 py-6 ">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Directories
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 ">
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
                      await deleteProjectDirectory(directoryId);
                    }}
                  />
                ))}
                <AddProjectDirectory refresh={doit} />
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
