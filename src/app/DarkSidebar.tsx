import { CpuChipIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import MemoryCacheLogo from "../MC-Brainprint1.svg";
import { ProjectContext } from "./ProjectContext";

const navigation = [{ name: "Llamafiles", href: "/models", icon: CpuChipIcon }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DarkSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    projects,
    activeProject,
    openNewProjectDialog,
    setOpenNewProjectDialog,
  } = useContext(ProjectContext);
  const location = useLocation();
  // Function to determine if the nav item is the current page
  const isCurrent = (href) => {
    // Exact match for root
    if (href === "/" && location.pathname === "/") {
      return true;
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
            <div className="flex h-16 shrink-0 items-center">
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
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
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
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Your Caches
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {projects.map((project) => (
                      <li key={project.id}>
                        <Link
                          href={`/projects/${project.id}`}
                          to={`/projects/${project.id}`}
                          className={classNames(
                            project.id === activeProject?.id
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

                    <button
                      onClick={() => setOpenNewProjectDialog(true)}
                      type="button"
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      New Cache
                    </button>
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

        <main className="py-10 pl-72">
          <div className="px-4 px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
