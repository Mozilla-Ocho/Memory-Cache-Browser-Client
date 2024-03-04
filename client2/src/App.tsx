import "./App.css";
import { ProjectsApi } from "./api/apis/ProjectsApi"; // Add this line
import { Configuration } from "./api";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { GlobalLayout } from "@/components/modules/layouts/GlobalLayout/GlobalLayout";

function App() {
  const projectsApi = new ProjectsApi(
    new Configuration({ basePath: "http://localhost:4444" })
  );

  const handleButtonClick = async () => {
    try {
      const result = await projectsApi.listProjectsApiV1ListProjectsGet();
      console.log(result);
    } catch (error) {
      console.error("Failed to list projects:", error);
    }
  };

  return (
    // Routing needs to be set up here.
    <GlobalLayout>
      <main className="p-12">
        <Button onClick={handleButtonClick}>List Projects</Button>
        <h2 className="mt-12 mb-4">context form</h2>
        <ContextMenu>
          <ContextMenuTrigger>
            {" "}
            <Button>Right click to see context menu</Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
            <ContextMenuItem>Billing</ContextMenuItem>
            <ContextMenuItem>Team</ContextMenuItem>
            <ContextMenuItem>Subscription</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </main>
    </GlobalLayout>
  );
}

export default App;
