import { ArrowPathIcon } from "@heroicons/react/20/solid";
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  buttonBase,
  buttonColorsPrimary,
  buttonColorsSecondary,
} from "../styles/styles";
import { getOriginalFilePath } from "./FilesTab";
import { ProjectContext } from "./ProjectContext";

function DbSearchResult({ result, i, query }) {
  const [showCopiedIcon, setShowCopiedIcon] = useState(false);
  console.log("result", result);

  const fileContent = result.file_content;
  const lowercaseFileContent = fileContent.toLowerCase();
  const lowercaseQuery = query.toLowerCase();
  let remainingContent = fileContent;
  let remainingLowercaseContent = lowercaseFileContent;
  const parts = [];

  while (
    query.length > 0 &&
    remainingLowercaseContent.includes(lowercaseQuery)
  ) {
    const index = remainingLowercaseContent.indexOf(lowercaseQuery);
    const before = remainingContent.substring(0, index);
    const after = remainingContent.substring(index + query.length);
    parts.push(before);
    // Push the query from the remaining content, in its original case
    parts.push(remainingContent.substring(index, index + query.length));
    remainingContent = after;
    remainingLowercaseContent = after.toLowerCase();
  }
  parts.push(remainingContent);

  return (
    <div className="flex flex-col border border-gray-200 rounded space-y-4">
      {/* round result.distance to 2 decimal places */}
      <div className="flex items-center justify-between w-full h-8">
        <p className="text-sm font-light mx-4">
          Distance: {Math.round(result.distance * 100) / 100}
        </p>
        <p className="flex-grow text-sm font-light">
          {getOriginalFilePath(result.file_path)}
        </p>
        <button
          className={twMerge(
            buttonBase,
            buttonColorsSecondary,
            showCopiedIcon ? buttonColorsPrimary : "",
            "place-self-end",
          )}
          onClick={() => {
            navigator.clipboard.writeText(
              `file:///${getOriginalFilePath(result.file_path)}`,
            );
            setShowCopiedIcon(true);
            setTimeout(() => {
              setShowCopiedIcon(false);
            }, 1000);
          }}
        >
          {(showCopiedIcon && (
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
          )) || <ClipboardDocumentIcon className="w-6 h-6" />}
        </button>
      </div>
      <div className="flex items-center">
        <p className="p-4 text-sm">
          {parts.map((part, i) => {
            if (i == parts.length - 1) {
              return part;
            }
            // Every second part is the query, so we highlight it
            return (
              <span
                key={`part-${i}`}
                className={
                  i % 2 == 0 ? "text-gray-700" : "bg-yellow-200 text-yellow-800"
                }
              >
                {part}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

function VectorSearchTab() {
  const { activeProject, ingestApi, ragApi } = useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showFinishedLoadingToast, setShowFinishedLoadingToast] =
    useState(false);

  const [dbSearchResults, setDbSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  async function updateVectorDatabase() {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const result =
      await ingestApi.ingestProjectFilesApiV1IngestProjectFilesPost({
        projectId: activeProject.id,
      });
    setIsLoading(false);
    setShowFinishedLoadingToast(true);
    setTimeout(() => {
      setShowFinishedLoadingToast(false);
    }, 5000);
  }

  async function searchVectorDatabase(query: string) {
    const result = await ragApi.vectorDbQueryApiV1VectorDbQueryPost({
      ragAskRequest: {
        projectId: activeProject.id,
        prompt: query,
      },
    });
    setDbSearchResults(result);
  }

  useEffect(() => {
    if (query == "") {
      setDbSearchResults([]);
    } else {
      searchVectorDatabase(query);
    }
  }, [query]);

  useEffect(() => {
    setDbSearchResults([]);
    setQuery("");
  }, [activeProject]);

  return (
    <div>
      {showFinishedLoadingToast && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          Vector database updated successfully!
        </div>
      )}
      <div className="flex justify-between">
        <h1 className="font-light text-lg text-gray-400">Vector Search</h1>
        <button
          type="button"
          onClick={updateVectorDatabase}
          className={twMerge(buttonBase, buttonColorsPrimary)}
        >
          <ArrowPathIcon
            className={twMerge(
              "h-5 w-5 flex-shrink-0 text-white",
              isLoading ? "animate-spin" : "",
            )}
            aria-hidden="true"
          />
        </button>
      </div>
      <div>
        {/* Create a form field that allows the user to enter a query. We will perform a similarity search on the vector database using the ragApi */}
        <input
          type="text"
          placeholder="Enter a query"
          className="border border-gray-200 rounded p-2 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={() => searchVectorDatabase(query)}
          className={twMerge(buttonBase, buttonColorsPrimary)}
        >
          Search
        </button>
      </div>

      <div className="space-y-4">
        {dbSearchResults.map((result, i) => (
          <DbSearchResult
            result={result}
            key={`result-${i}`}
            i={i}
            query={query}
          />
        ))}
      </div>
    </div>
  );
}

export default VectorSearchTab;