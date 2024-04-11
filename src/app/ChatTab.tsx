import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useContext, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import {
  buttonBase,
  buttonColorsDanger,
  buttonColorsPrimary,
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
  const { activeProject, ragApi } = useContext(ProjectContext);
  const [projectDirectories, setProjectDirectories] = useState<>([]);
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    console.log("Asking memory cache about...", message);
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
      <h1 className="font-light text-lg text-gray-400 my-4">Chat Tab</h1>

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
          className={twMerge(buttonBase, buttonColorsPrimary)}
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
