import "./App.css";
import { ProjectsApi } from "./api/apis/ProjectsApi"; // Add this line
import { Configuration } from "./api";
import { Button } from "./components/ui/button";

function App() {
  const projectsApi = new ProjectsApi(
    new Configuration({ basePath: "http://localhost:4444" }),
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
    <>
      <button
        className="text-3xl font-bold underline"
        onClick={handleButtonClick}
      >
        List Projects
      </button>

      <Button variant="outline" onClick={handleButtonClick}>
        Another Button
      </Button>
    </>
  );
}

export default App;
