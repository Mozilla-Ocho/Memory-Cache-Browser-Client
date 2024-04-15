import React from "react";
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "./ProjectContext";
import { linkColor } from "../styles/styles";
import { twMerge } from "tailwind-merge";

function LlamafileInfoRow({ llamafile }) {
  const { llamafileApi } = useContext(ProjectContext);
  const [status, setStatus] = useState("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);

  const tableDataStyle = "whitespace-nowrap py-4 text-base text-gray-900";

  function randomStatus() {
    const statuses = ["idle", "downloading", "absent", "running", "error"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  async function getLlamafileStatus() {
    setStatus("loading");
    try {
      const response =
        await llamafileApi.checkLlamafileStatusApiV1CheckLlamafileStatusPost({
          llamafileFilename: llamafile.filename,
        });
      setStatus(response.status);
      if (response.status === "downloading") {
        setDownloadProgress(response.progress);
      }
    } catch (error) {
      setStatus("error");
    }
  }

  useEffect(() => {
    getLlamafileStatus();
  }, [llamafile.name, llamafileApi]);

  // If the status is "downloading, then check the status every second"
  useEffect(() => {
    if (status === "downloading") {
      const interval = setInterval(() => {
        getLlamafileStatus();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  async function download() {
    await llamafileApi.downloadLlamafileByNameApiV1DownloadLlamafileByNamePost({
      llamafileFilename: llamafile.filename,
    });
    getLlamafileStatus();
  }

  async function start() {
    await llamafileApi.apiStartLlamafileApiV1StartLlamafilePost({
      llamafileFilename: llamafile.filename,
    });
    getLlamafileStatus();
  }

  async function stop() {
    await llamafileApi.apiStopLlamafileApiV1StopLlamafilePost({
      llamafileFilename: llamafile.filename,
    });
    getLlamafileStatus();
  }

  async function retry() {
    await stop();
    await start();
  }

  async function remove() {
    await llamafileApi.apiDeleteLlamafileApiV1DeleteLlamafileDelete({
      llamafileFilename: llamafile.filename,
    });
    getLlamafileStatus();
  }

  async function getDownloadStatus() {
    return null;
  }

  async function cancelDownload() {
    return null;
  }

  // Llamafile status is one of: "idle", "downloading", "absent", "running", "error"
  // If the status is "absent", show a download button
  // If the status is "running", show a stop button
  // If the status is "error", show a retry button
  // If the status is "idle", show a run button and a delete button
  // If the status is "downloading", show a spinner and a cancel button

  return (
    <tr className="items-center">
      <td className={tableDataStyle}>{llamafile.model}</td>
      <td className={tableDataStyle}>{llamafile.size}</td>
      <td className={tableDataStyle}>{status}</td>

      {status === "absent" && (
        <td className={tableDataStyle}>
          <button
            type="button"
            onClick={download}
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Download
          </button>
        </td>
      )}

      {status === "running" && (
        <td className={tableDataStyle}>
          <button
            type="button"
            onClick={stop}
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Stop
          </button>
        </td>
      )}

      {status === "error" && (
        <td className={tableDataStyle}>
          <button
            type="button"
            onClick={retry}
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Retry
          </button>
        </td>
      )}

      {status === "idle" && (
        <td className={twMerge(tableDataStyle, "flex space-x-2")}>
          <button
            type="button"
            onClick={start}
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Run
          </button>
          <button
            type="button"
            onClick={remove}
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Delete
          </button>
        </td>
      )}

      {status === "downloading" && (
        <td className={twMerge(tableDataStyle, "flex space-x-2")}>
          {/* For download progress, always show a fixed size number, which is 3 characters wide */}
          <h2>{`${downloadProgress.toFixed(0).padStart(3)}%`}</h2>
          <button
            type="button"
            onClick={cancelDownload}
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
        </td>
      )}
    </tr>
  );
}

function Models() {
  const { llamafileApi } = useContext(ProjectContext);
  const [llamafiles, setLlamafiles] = useState([]);
  useEffect(() => {
    async function getLlamafiles() {
      try {
        const response =
          await llamafileApi.listLlamafilesApiV1ListLlamafilesGet();
        setLlamafiles(response);
      } catch (error) {
        console.error(error);
      }
    }
    getLlamafiles();
  }, [llamafileApi]);

  const tableHeaderStyle = "py-3.5 text-left text-sm font-light text-gray-400";

  return (
    <div className="max-w-screen-lg">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-light text-gray-400 mb-4">Models</h1>
          <p className="mt-2 text-base text-gray-700">
            Select a large language model. Memory Cache will download and run
            the model as a&nbsp;
            <a
              href="https://github.com/Mozilla-Ocho/llamafile?tab=readme-ov-file#llamafile"
              className={linkColor}
            >
              llamafile
            </a>
            .
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className={tableHeaderStyle}>
                    Name
                  </th>
                  <th scope="col" className={tableHeaderStyle}>
                    Size
                  </th>
                  <th scope="col" className={tableHeaderStyle}>
                    Status
                  </th>
                  <th scope="col" className={tableHeaderStyle}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {llamafiles.map((llamafile) => (
                  <LlamafileInfoRow
                    key={llamafile.filename}
                    llamafile={llamafile}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Models;
