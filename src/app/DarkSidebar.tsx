import {
  CpuChipIcon,
  PlusIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import MemoryCacheLogo from "../MC-Brainprint1.svg";
import { ProjectContext } from "./ProjectContext";
import { toLocalStorage } from "../utils/localStorage";
import { TABS } from "./ProjectSettings";
import { twMerge as tm } from "tailwind-merge";

const navigation = [
  { name: "About", href: "/", icon: BookOpenIcon },
  { name: "Models", href: "/models", icon: CpuChipIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function DarkSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { projects, activeProject, projectsApi, setActiveProject } =
    useContext(ProjectContext);

  const navigate = useNavigate();

  const location = useLocation();
  // Function to determine if the nav item is the current page
  const isCurrent = (href) => {
    // Exact match for root
    if (href === "/" && location.pathname === "/") {
      return true;
    }
    if (href === "/") {
      return false;
    }
    // Prefix match for other paths, ignoring dynamic segments
    return location.pathname.startsWith(href.replace(/\/:[^\/]+/, ""));
  };

  return (
    <>
      <div>
        <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div
              onClick={() => {
                navigate("/");
              }}
              className={tm("flex h-16 shrink-0 items-center cursor-pointer")}
            >
              <img
                className="h-8 w-auto filter invert brightness-0"
                src={MemoryCacheLogo}
                alt="Memory Cache"
              />
              <h2 className="ml-4 text-gray-300 text-lg font-semibold leading-6 truncate">
                Memory Cache
              </h2>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li key="navigation-items">
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item, i) => (
                      <li key={`nav-${i}`}>
                        <Link
                          href={item.href}
                          to={item.href}
                          className={classNames(
                            isCurrent(item.href)
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li key="cache-list">
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Your Caches
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {projects.map((project) => (
                      <li key={`cache-${project.id}`}>
                        <Link
                          href={`/projects/${project.id}`}
                          to={`/projects/${project.id}`}
                          className={classNames(
                            isCurrent(`/projects/${project.id}`)
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {project.name[0]}
                          </span>
                          <span className="truncate">{project.name}</span>
                        </Link>
                      </li>
                    ))}

                    <li key="new-cache-button" className="mt-2 space-y-1 ">
                      <button
                        className="w-full text-gray-200 bg-gray-900 hover:text-white hover:bg-gray-800 group flex gap-x-4 rounded-md p-2 text-sm font-semibold items-center"
                        onClick={async () => {
                          // Create a new project with a default name,
                          // Then navigate to the new project page
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
                            await projectsApi.createProjectApiV1CreateProjectPost(
                              {
                                projectName: randomProjectName,
                              },
                            );
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
                    </li>
                  </ul>
                </li>
                <li className="hidden -mx-6 mt-auto">
                  <Link
                    href={`/settings`}
                    to={`/settings`}
                    className={classNames(
                      "text-gray-400 hover:text-white hover:bg-gray-800",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                      {"Settings"}
                    </span>
                    <span className="truncate">{"Settings"}</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <main className="pl-72">
          <div className="py-8 px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

export default DarkSidebar;
