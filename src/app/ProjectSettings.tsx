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

  const [reply, setReply] = useState("");
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [projectName, setProjectName] = useState(activeProject?.name);
  const [localProjectName, setLocalProjectName] = useState(activeProject?.name);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleKeyPress = (event, tabId) => {
    // Check if the key pressed is Enter or Space
    if (event.key === "Enter" || event.key === " ") {
      // Prevent the default action to avoid scrolling on space press
      event.preventDefault();
      setActiveTab(tabId);
    }
  };

  useEffect(() => {
    setLocalProjectName(activeProject?.name);
    setProjectName(activeProject?.name);
    setIsEditingProjectName(false);
  }, [activeProject]);

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
