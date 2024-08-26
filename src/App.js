import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import PasswordReset from "./components/PasswordReset";
import AdminPage from "./components/AdminPage";
import Dashboard from "./components/Dashboard";
import ProjectPage from "./components/ProjectPage";
import ProjectMenu from "./components/ProjectMenu";
import ProjectClientDetails from "./components/ProjectClientDetails";
import AddTeamMember from "./components/AddTeamMember";
import RemoveTeamMember from "./components/RemoveTeamMember";
import CreateTask from "./components/CreateTask";
import UpdateTask from "./components/UpdateTask";
import ViewTaskDetails from "./components/ViewTaskDetails";
import TeamMemberPage from "./components/TeamMemberPage";
import CreateUser from "./components/CreateUser";
import RemoveTask from "./components/RemoveTask";
import UpdateTaskStatus from "./components/UpdateTaskStatus";
import UpdateUser from "./components/UpdateUser";
import DeactivateUser from "./components/DeactiveUser";
import AssignRole from "./components/AssignRole";
import CreateClient from "./components/CreateClient";
import UserDetails from "./components/UserDetails";
import TaskMilestoneChart from "./components/TaskMilestoneChart";
import CreateProject from "./components/CreateProject";
import TaskDetails from "./components/TaskDetails";
import ProjectManagerPage from "./components/ProjectManagerPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="registration" element={<CreateUser />} />
          <Route path="update-user" element={<UpdateUser />} />
          <Route path="deactivate-user" element={<DeactivateUser />} />
          <Route path="assign-role" element={<AssignRole />} />
          <Route path="create-client" element={<CreateClient />} />
          <Route path="user-details" element={<UserDetails />} />
          <Route path="create-project" element={<CreateProject />} />
          <Route path="monitor-task-details" element={<TaskDetails />} />
        </Route>
        <Route
          path="/project-manager/projects"
          element={<ProjectManagerPage />}
        />
        <Route
          path="/project-details-menu/:projectId"
          element={<ProjectMenu />}
        >
          <Route
            path="viewprojectclientdetails/:projectId"
            element={<ProjectClientDetails />}
          />
          <Route
            path="add-team-member-to-project/:projectId"
            element={<AddTeamMember />}
          />
          <Route
            path="remove-team-member-from-project/:projectId"
            element={<RemoveTeamMember />}
          />
          <Route
            path="assign-task-to-team-member/:projectId"
            element={<CreateTask />}
          />
          <Route path="update-task/:projectId" element={<UpdateTask />} />
          <Route path="delete-task/:projectId" element={<RemoveTask />} />
          <Route
            path="view-task-details/:projectId"
            element={<ViewTaskDetails />}
          />
          <Route
            path="project-dashboard/:projectId"
            element={<TaskMilestoneChart />}
          />
        </Route>
        <Route path="/team-member" element={<TeamMemberPage />} />
        <Route
          path="/team-member/update-task-status"
          element={<UpdateTaskStatus />}
        />
      </Routes>
    </Router>
  );
}

export default App;