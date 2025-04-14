import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tasks from "./components/Tasks";
import TaskDetails from "./components/Task Details";
import HighPriority from "./components/High Priority";
import CompletedTasks from "./components/Completed Tasks";
import TaskStatistics from "./components/TaskStatistics";


function App() {
  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/task-details" element={<TaskDetails />} />
        <Route path="/high-priority" element={<HighPriority />} />
        <Route path="/completed-tasks" element={<CompletedTasks />} />
        <Route path="/task-statistics" element={<TaskStatistics />} />
      </Routes>
    </Router>
  );
  
}


export default App;
