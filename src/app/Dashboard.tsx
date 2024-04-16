import React from "react";
import {
  linkColor,
  listItem,
  tabHeaderText,
  tabH2Text,
} from "../styles/styles";
import { twMerge as tm } from "tailwind-merge";

// The Dashboard is less a "dashboard" and more an "how to" page.
// TODO: Explain:
// - What is Memory Cache.
// - The Memory Cache Hub (which must be running if the dashboard is working).
// - How to create a cache.
// - How to add directories to a cache.
// - How to use vector search
// - How to use the chat tab

function Dashboard() {
  return (
    <div className="w-full max-w-screen-lg flex flex-col">
      <h1 className={tm(tabHeaderText)}>Memory Cache</h1>
      <p>Memory Cache is an experimental project exploring personal AI.</p>
      <h2 className={tm(tabH2Text)}>How To</h2>
      <ul>
        <li className={tm(listItem)}>
          <p>Create a cache with the button in the sidebar.</p>
        </li>
        <li className={tm(listItem)}>
          <p>
            Add directories to the cache by typing the path in the input field
            and clicking "Add Directory".
          </p>
        </li>
        <li className={tm(listItem)}>
          <p>
            The Vector Search tab will allow you to perform a similarity search
            on chunks of files from your cache.
          </p>
        </li>
        <li className={tm(listItem)}>
          <p>
            The Chat Tab will allow you to allow you to have a conversation with
            an AI chatbot, augmented with data from your cache.
          </p>
        </li>
        <li className={tm(listItem)}>
          <p>
            In order to use the chat tab, you must select an LLM to run. Memory
            Cache will automatically download and run the model as a&nbsp;
            <a
              href="https://github.com/Mozilla-Ocho/llamafile?tab=readme-ov-file#llamafile"
              className={linkColor}
            >
              llamafile
            </a>
            .
          </p>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;
