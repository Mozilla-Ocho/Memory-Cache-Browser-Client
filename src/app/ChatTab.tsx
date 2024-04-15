import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useContext, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  buttonBase,
  buttonColorsDanger,
  buttonColorsPrimary,
  buttonColorsSecondary,
  linkColor,
} from "../styles/styles";
import { ProjectContext } from "./ProjectContext";

interface ChatMessage {
  message: string;
  sender: string; // user, ai, system
}

function saveChatToLocalStorage(chatMessages, projectId) {
  localStorage.setItem(
    `chatMessages-${projectId}`,
    JSON.stringify(chatMessages),
  );
}
function loadChatFromLocalStorage(projectId) {
  const chatMessages = localStorage.getItem(`chatMessages-${projectId}`);
  return chatMessages ? JSON.parse(chatMessages) : [];
}

function ChatTab() {
  const { activeProject, ragApi, llamafileApi } = useContext(ProjectContext);
  const [projectDirectories, setProjectDirectories] = useState<>([]);
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [runningModelInfo, setRunningModelInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkModelRunning() {
      const result =
        await llamafileApi.apiRunningLlamafileInfoApiV1RunningLlamafileInfoGet();
      setRunningModelInfo(result);
    }
    checkModelRunning();
  }, []);

  async function checkWaitingForChatStatus() {
    const response =
      await ragApi.checkWaitingForChatStatusApiV1CheckWaitingForChatStatusPost({
        projectId: activeProject.id,
      });
    setIsLoading(response.isWaiting);
  }

  useEffect(() => {
    checkWaitingForChatStatus();
    const interval = setInterval(() => {
      checkWaitingForChatStatus();
    }, 1000);
    return () => clearInterval(interval);
  }, [activeProject]);

  useEffect(() => {
    setChatMessages(loadChatFromLocalStorage(activeProject.id));
  }, [activeProject]);

  function appendChatMessage(message, sender) {
    saveChatToLocalStorage(
      [
        ...loadChatFromLocalStorage(activeProject.id),
        {
          message,
          sender,
        },
      ],
      activeProject.id,
    );
    setChatMessages(loadChatFromLocalStorage(activeProject.id));
  }

  async function sendRagChatMessage(message) {
    setIsLoading(true);
    const result = await ragApi.ragAskApiV1RagAskPost({
      ragAskRequest: {
        projectId: activeProject.id,
        prompt: message,
      },
    });
    setIsLoading(false);
    if (result.status == "error") {
      console.error(result);
      appendChatMessage(`[error] ${result.message}`, "system");
    } else {
      appendChatMessage(result.response, "ai");
    }
  }

  return (
    <div>
      {(!runningModelInfo && (
        <p className="bg-red-200 w-full rounded-lg py-4 px-4 flex justify-between items-center">
          No model is running.&nbsp;
          <button
            onClick={() => {
              navigate("/models");
            }}
            className={twMerge(buttonBase, buttonColorsSecondary)}
          >
            Select a model
          </button>
        </p>
      )) || (
        <p className="bg-green-200 w-full rounded-lg py-4 px-4 flex justify-between items-center">
          Running {runningModelInfo.model}. &nbsp;
          <button
            onClick={() => {
              navigate("/models");
            }}
            className={twMerge(buttonBase, buttonColorsSecondary)}
          >
            Switch to a different model
          </button>
        </p>
      )}

      {chatMessages.map((message, i) => (
        <p key={`chat-message-${i}`} className="text-gray-500 my-4">
          {message.sender == "user"
            ? "You: "
            : message.sender == "system"
              ? "System:"
              : "AI: "}
          {message.message}
        </p>
      ))}

      {isLoading && (
        <ArrowPathIcon
          className={twMerge(
            "h-8 w-8 flex-shrink-0 text-gray-800",
            "animate-spin my-4",
          )}
          aria-hidden="true"
        />
      )}

      <div className="flex justify-between space-x-4 my-4">
        <input
          type="text"
          placeholder="Enter a query"
          className="border border-gray-200 rounded p-2 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            sendRagChatMessage(query);
            setQuery("");
            appendChatMessage(query, "user");
          }}
          disabled={!runningModelInfo}
          className={twMerge(
            buttonBase,
            buttonColorsPrimary,
            !!runningModelInfo ? "cursor-pointer" : "cursor-not-allowed",
          )}
        >
          Send
        </button>
        <button
          type="button"
          onClick={() => {
            saveChatToLocalStorage([], activeProject.id);
            setChatMessages([]);
          }}
          className={twMerge(buttonBase, buttonColorsDanger)}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default ChatTab;
