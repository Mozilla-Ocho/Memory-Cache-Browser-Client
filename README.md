# Memory Cache Browser Client (Attempt 1)

Plan:
- [x] Use create-react-app with typescript enabled
- [x] Add openapi generator as a dependency
- [x] Generate client code from the openapi spec
- [ ] Compare fetch and axios and decide which to use
- [ ] Serve the built client code as static files from the backend
- [ ] Pair with Nick to get add a simple dashboard
- [ ] Pair with Kate to configure styling
- [ ] Reflect on version 1 and decide what to do next

## Dev Log

I created a new react app with typescript enabled.
``` sh
npx create-react-app client1 --template typescript
cd client1
```

I added openapi generator as a dev dependency.
``` sh
npm install @openapitools/openapi-generator-cli -D
```

I downloaded the openapi spec from memory cache hub. 
```sh
wget http://localhost:4444/openapi.json
```

I generate typescript-fetch client code from the openapi spec.
``` sh
npx @openapitools/openapi-generator-cli generate -i openapi.json -g typescript-fetch -o src/api
```

I tested the generated code:

``` ts
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
```


# Generating Client Code from the OpenAPI Spec

- Run Memory Cache Hub.
- Download openapi.json: `wget http://localhost:4444/openapi.json`
- Generate client code: `npx @openapitools/openapi-generator-cli generate -i openapi.json -g typescript-axios -o my-app/src/api`
