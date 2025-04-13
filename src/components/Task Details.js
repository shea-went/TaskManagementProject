import React, { useState, useEffect, useCallback } from "react";
import "../styles/detailstyle.css";

const TaskDetails = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  const currentTask = tasks[currentTaskIndex] || {
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    completionDate: "",
    category: "default",
    priority: "5",
    status: "pending",
    location: "Not Available",
    audio: "",
    video: "",
    document: "",
  };

  const updateTaskDetails = (field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[currentTaskIndex] = { ...updatedTasks[currentTaskIndex], [field]: value };
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const addNewTask = () => {
    const newTask = {
      title: "",
      description: "",
      startDate: "",
      dueDate: "",
      completionDate: "",
      category: "default",
      priority: "5",
      status: "pending",
      location: "Not Available",
      audio: "",
      video: "",
      document: "",
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setCurrentTaskIndex(updatedTasks.length - 1); // Set the index after updating the tasks
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };
  const getLocation = useCallback (async () => {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY; // Securely access the API key
    const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

    const requestBody = { considerIp: true };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const location = `Latitude: ${data.location.lat}, Longitude: ${data.location.lng}`;
      updateTaskDetails("location", location);
    } catch (error) {
      console.error("Failed to fetch location:", error);
      updateTaskDetails("location", "Location not available");
    }
  }, [updateTaskDetails]);

  useEffect(() => {
    getLocation();
  }, [getLocation]); // Include getLocation in the dependency array

  return (
    <div>
      <section id="management">
        <div id="add-task">
          <button id="add-task-button" onClick={addNewTask}>
            ⊞
          </button>
        </div>
        <div id="Task-details">
          <span id="Task-title">{currentTask.title || "Task Title"}</span>
        </div>
        <div>
          <label htmlFor="task-title-input">Task Title:</label>
          <input
            type="text"
            id="task-title-input"
            value={currentTask.title}
            onChange={(e) => updateTaskDetails("title", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="task-description-input">Description:</label>
          <input
            type="text"
            id="task-description-input"
            value={currentTask.description}
            onChange={(e) => updateTaskDetails("description", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="start-date-input">Start Date:</label>
          <input
            type="date"
            id="start-date-input"
            value={currentTask.startDate}
            onChange={(e) => updateTaskDetails("startDate", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="due-date-input">Due Date:</label>
          <input
            type="date"
            id="due-date-input"
            value={currentTask.dueDate}
            onChange={(e) => updateTaskDetails("dueDate", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="completion-date-input">Completion Date:</label>
          <input
            type="date"
            id="completion-date-input"
            value={currentTask.completionDate}
            onChange={(e) => updateTaskDetails("completionDate", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={currentTask.category}
            onChange={(e) => updateTaskDetails("category", e.target.value)}
          >
            <option key="new-landscaping" value="new-landscaping">
              New Landscaping
            </option>
            <option key="site-clearing" value="site-clearing">
              Site Clearing
            </option>
            <option key="paint-maintenance" value="paint-maintenance">
              Paint Maintenance
            </option>
            <option key="grass-maintenance" value="grass-maintenance">
              Grass Maintenance
            </option>
            <option key="general-maintenance" value="general-maintenance">
              General Maintenance
            </option>
            <option key="default" value="default">
              Default
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="priority-level">Priority Level:</label>
          <select
            id="priority-level"
            value={currentTask.priority}
            onChange={(e) => updateTaskDetails("priority", e.target.value)}
          >
            <option value="1">Critical</option>
            <option value="2">Urgent</option>
            <option value="3">High Priority</option>
            <option value="4">Medium Priority</option>
            <option value="5">Low Priority</option>
          </select>
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={currentTask.status}
            onChange={(e) => updateTaskDetails("status", e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label>Location:</label>
          <span id="task-location">{currentTask.location}</span>
        </div>
        <div>
          <label htmlFor="task-document">Upload Task Document (PDF):</label>
          <input
            type="file"
            id="task-document"
            accept="application/pdf"
            onChange={(e) =>
              updateTaskDetails("document", e.target.files[0]?.name || "")
            }
          />
        </div>
        <audio id="audio-player" controls>
          <source src={currentTask.audio} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
        <video id="video-player" controls>
          <source src="task-video.mp4" type="video/mp4" />
          Your browser does not support the video element.
        </video>
        <div>
          <button type="submit" id="save-changes-button" onClick={() => {}}>
            Save Changes
          </button>
        </div>
        <div id="navigation">
          <a href="/">
            <img src="return-button.png" alt="Return" />
          </a>
        </div>
        <div id="stats-tab">
          <a href="TaskStatistics.html">Stats</a>
        </div>
      </section>
    </div>
  );
};
export default TaskDetails;