import { PlusIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge as tm } from "tailwind-merge";
import { ProjectContext } from "./ProjectContext";
import { aboutH1, aboutH2, aboutLI, linkColor } from "../styles/styles";
import { toLocalStorage } from "../utils/localStorage";
import { TABS } from "./ProjectSettings";
import { NavLink } from "react-router-dom";

function Dashboard() {
  const { projects, activeProject, projectsApi, setActiveProject } =
    useContext(ProjectContext);
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-screen-lg flex flex-col">
      <h1 className={tm(aboutH1, "mb-4")}>Memory Cache</h1>
      <p className={tm("text-lg")}>
        Memory Cache is an experimental project exploring personal AI. You can
        learn more on the&nbsp;
        <a className={tm(linkColor)} href="https://memorycache.ai/">
          website.
        </a>
        &nbsp;
      </p>
      <h2 className={tm(aboutH2, "mt-8 mb-3")}>Getting Started</h2>
      <ul className={tm("list-none list-inside")}>
        <li className={tm(aboutLI)}>
          <span className={tm("flex items-center")}>
            <p className={tm("select-none")}>◦&nbsp;&nbsp;</p>
            <p>
              <b>Create a cache</b> with the&nbsp;
            </p>
            <button
              className="w-48 text-white bg-gray-800 hover:text-white hover:bg-gray-800 group flex gap-x-4 rounded-md p-2 text-sm font-semibold items-center"
              onClick={async () => {
                const randomAdjectives = [
                  "Red",
                  "Blue",
                  "Green",
                  "Yellow",
                  "Purple",
                  "Orange",
                  "Fun",
                  "Super",
                  "Mega",
                  "Ultra",
                  "Hyper",
                  "Giga",
                  "Tera",
                  "Studious",
                  "Silly",
                  "Serious",
                  "Happy",
                ];
                const randomAnimals = [
                  "Squid",
                  "Octopus",
                  "Doggo",
                  "Kitty",
                  "Puppy",
                  "Kitten",
                  "Panda",
                  "Bear",
                  "Lion",
                  "Tiger",
                  "Elephant",
                ];

                const randomProjectName = `${randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)]} ${randomAnimals[Math.floor(Math.random() * randomAnimals.length)]}`;
                const response =
                  await projectsApi.createProjectApiV1CreateProjectPost({
                    projectName: randomProjectName,
                  });
                if (!response.status === "ok") {
                  console.warn("Failed to create project", response);
                } else {
                  setActiveProject(response.projects[0]);
                }
                toLocalStorage("activeTab", TABS.FILES);
                navigate(`/projects/${response.projects[0].id}`);
              }}
              type="button"
            >
              <PlusIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              <span>Create New Cache</span>
            </button>
            <p>&nbsp;button in the sidebar.</p>
          </span>
        </li>
        <li className={tm(aboutLI)}>
          <div className={tm("flex")}>
            <p className={tm("select-none")}>◦&nbsp;&nbsp;</p>
            <p className={tm("")}>
              <b>Add directories</b> to your cache by typing their file paths in
              the input field and clicking "Add Directory".
            </p>
          </div>

          <ul className={tm("list-none list-inside pl-8 py-2 text-sm")}>
            <li>
              <a
                className={tm(linkColor)}
                href="https://support.apple.com/guide/mac-help/get-file-folder-and-disk-information-on-mac-mchlp1774/mac#mchl733ed990"
              >
                How to find file paths on MacOS
              </a>
            </li>
            <li>
              <a
                className={tm(linkColor)}
                href="https://www.wikihow.com/Find-a-File%27s-Path-on-Windows"
              >
                How to find file paths on Windows
              </a>
            </li>
            <li>
              <a
                className={tm(linkColor)}
                href="https://linuxhandbook.com/get-file-path/"
              >
                How to find file paths on Linux
              </a>
            </li>
          </ul>
        </li>
        <li className={tm(aboutLI)}>
          <div className={tm("flex")}>
            <p className={tm("select-none")}>◦&nbsp;&nbsp;</p>

            <p className={tm("inline")}>
              Type a query in the{" "}
              <b
                className={tm("font-light text-lg bg-gray-100 rounded-md p-2")}
              >
                Vector Search
              </b>{" "}
              tab to show results based on similarity search. This is the{" "}
              <b>retrieval</b> part of{" "}
              <a
                className={tm(linkColor)}
                href="https://python.langchain.com/docs/use_cases/question_answering/#what-is-rag"
              >
                retrieval-augmented generation (RAG)
              </a>
              .
            </p>
          </div>
        </li>
        <li className={tm(aboutLI)}>
          <div className="flex">
            <p className={tm("select-none")}>◦&nbsp;&nbsp;</p>
            <p className={tm("inline")}>
              The{" "}
              <b
                className={tm("font-light text-lg bg-gray-100 rounded-md p-2")}
              >
                Chat Tab
              </b>{" "}
              will allow you to allow you to have a conversation with an AI
              chatbot, augmented with data from your cache.
            </p>
          </div>
        </li>
        <li className={tm(aboutLI)}>
          <div className="flex">
            <p className={tm("select-none")}>◦&nbsp;&nbsp;</p>
            <p className={tm("inline")}>
              In order to use the chat tab, you must select an LLM from the{" "}
              <NavLink className={tm(linkColor)} to="/models">
                models
              </NavLink>{" "}
              menu. Memory Cache will automatically download and run the model
              as a&nbsp;
              <a
                href="https://github.com/Mozilla-Ocho/llamafile?tab=readme-ov-file#llamafile"
                className={linkColor}
              >
                llamafile
              </a>
              .
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;
