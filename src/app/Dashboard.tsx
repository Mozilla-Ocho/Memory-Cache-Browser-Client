import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "./ProjectContext";
import ProjectFileList from "./ProjectFileList";
import ProjectSelectionListBox from "./ProjectSelectionListBox";
import GetStarted from "./GetStarted";
import NewProjectDialog from "./NewProjectDialog";
import ProjectSettings from "./ProjectSettings";

const Dashboard: React.FC = (props) => {
  return <h1>Dashboard</h1>;
};

export default Dashboard;
