import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProjectProvider } from "./ProjectContext";
import Sidebar from "./DarkSidebar";
import Dashboard from "./Dashboard";
import Projects from "./Projects";
import Models from "./Models";
import Project from "./Project";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
    children: [
      { path: "/", element: <Dashboard />, index: true },
      { path: "dashboard", element: <Dashboard /> },
      { path: "models", element: <Models /> },
      { path: "projects/:projectId", element: <Project /> },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <ProjectProvider>
      <RouterProvider router={router} />
    </ProjectProvider>
  );
};

export default App;
