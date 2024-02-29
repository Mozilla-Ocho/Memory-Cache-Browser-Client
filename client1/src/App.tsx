import "./App.css";
import { ProjectsApi } from "./api/apis/ProjectsApi"; // Add this line
import { Configuration } from "./api";

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

  return <button onClick={handleButtonClick}>List Projects</button>;
}

export default App;
