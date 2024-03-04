import { useState } from "react";
import Sidebar from "../components/DarkSidebar";
/* import Dashboard from "./Dashboard";
 * import Projects from "./Projects"; */
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Dashboard = () => {
  return <h1>Dashboard</h1>;
};
const Projects = () => {
  return <h1>Projects</h1>;
};

/* const router = createBrowserRouter([
 *   {
 *     path: "/",
 *     element: <Dashboard />,
 *     loader: null,
 *     children: [],
 *   },
 *   {
 *     path: "/dashboard",
 *     element: <Dashboard />,
 *     loader: null,
 *     children: [],
 *   },
 *   {
 *     path: "/projects",
 *     element: <Projects />,
 *     loader: null,
 *     children: [],
 *   },
 * ]); */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
    children: [
      { path: "/", element: <Dashboard />, index: true },
      { path: "dashboard", element: <Dashboard /> },
      { path: "projects", element: <Projects /> },
      // Add more routes as needed
    ],
  },
]);

export default function App() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  return <RouterProvider router={router} />;
}
