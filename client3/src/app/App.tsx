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
      { path: "dashboard", element: <Dashboard />, index: true },
      { path: "projects", element: <Projects /> },
      { path: "documents", element: <DocumentStore /> },
      // Add more routes as needed
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
