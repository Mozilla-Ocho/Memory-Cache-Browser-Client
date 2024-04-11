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

  useEffect(() => {
    setLocalProjectName(activeProject?.name);
    setProjectName(activeProject?.name);
    setIsEditingProjectName(false);
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
    <div className="w-full max-w-screen-lg flex flex-col">
      {(isEditingProjectName && (
        <form
          className="grid grid-cols-3 self-center"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsEditingProjectName(false);
            const project =
              await projectsApi.updateProjectApiV1UpdateProjectPost({
                projectId: activeProject.id,
                projectName: localProjectName,
              });
            setActiveProject(project);
            setProjectName(project.name);
            setLocalProjectName(project.name);
          }}
        >
          <div></div>
          <input
            type="text"
            className={twMerge(
              "mx-4 h-8 rounded-md text-2xl font-light text-slate-900 text-center",
            )}
            value={localProjectName}
            onChange={(e) => setLocalProjectName(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              className={twMerge(buttonBase, buttonColorsPrimary, "flex-0")}
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditingProjectName(false);
                setLocalProjectName(projectName);
              }}
              className={twMerge(buttonBase, buttonColorsDanger, "flex-0")}
              type="button"
            >
              <XCircleIcon
                className="h-5 w-5 flex-shrink-0 text-white"
                aria-hidden="true"
              />
            </button>
          </div>
        </form>
      )) || (
        <div className="grid grid-cols-3 self-center">
          <div></div>
          <h3 className="mx-4 text-2xl font-light text-slate-900 text-center">
            {activeProject?.name}
          </h3>
          <div className="flex">
            <button
              type="button"
              className={twMerge(
                buttonBase,
                "px-1.5",
                "py-1",
                "self-center",
                buttonColorsSecondary,
                "bg-gray-400",
              )}
              onClick={() => {
                setLocalProjectName(projectName);
                setIsEditingProjectName(true);
              }}
            >
              <PencilIcon
                className="h-5 w-5 flex-shrink-0 text-white"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      )}
      <fieldset className="self-center flex space-x-8 my-8">
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
    </div>
  );
}
