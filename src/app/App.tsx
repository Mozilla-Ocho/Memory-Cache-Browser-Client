import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProjectProvider } from "./ProjectContext"; // Adjust the import path as necessary
import Dashboard from "./Dashboard";
import DocumentStore from "./DocumentStore";
import Projects from "./Projects";
import Sidebar from "./DarkSidebar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
    children: [
      { path: "/", element: <Dashboard />, index: true },
      { path: "dashboard", element: <Dashboard /> },
      { path: "projects", element: <Projects /> },
      { path: "documents", element: <DocumentStore /> },
      { path: "projects/:projectId", element: <Dashboard /> },
      // The way the :projectId works is that it's a URL parameter that can be accessed in the component
      // using the useParams hook from react-router-dom. For example:
      // const { projectId } = useParams();
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
