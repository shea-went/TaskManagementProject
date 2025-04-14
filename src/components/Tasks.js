import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/taskstyle.css";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
    const [tasks, setTasks] = useState([]); // State for tasks
    const [currentIndex, setCurrentIndex] = useState(0); // State for calendar index
    const [filters, setFilters] = useState({
        priority: "all",
        status: "all",
        category: "all",
    }); // State for filters
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [searchResults, setSearchResults] = useState([]); // State for search results
    const [showSearchPopup, setShowSearchPopup] = useState(false); // State for search popup visibility
    const navigate = useNavigate(); // Hook for navigation

    // Refs to store gesture variables
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const mouseStartX = useRef(0);
    const mouseEndX = useRef(0);

    useEffect(() => {
        // Load tasks from localStorage
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        setTasks(storedTasks);
    }, []);

    // Filter tasks based on selected filters
    const filteredTasks = tasks.filter((task) => {
        const matchesPriority =
            filters.priority === "all" || task.priority === filters.priority;
        const matchesStatus =
            filters.status === "all" || task.status === filters.status;
        const matchesCategory =
            filters.category === "all" || task.category === filters.category;
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPriority && matchesStatus && matchesCategory && matchesSearch;
    });

    // Display tasks for the current page
    const displayTasks = () => {
        const startIndex = currentIndex;
        const tasksToDisplay = filteredTasks.slice(startIndex, startIndex + 10);

        if (tasksToDisplay.length === 0) {
            return <li>No tasks found.</li>;
        }
        return tasksToDisplay.map((task, index) => (
            <li
                key={index}
                className="task-item"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, task)}
                onClick={() => toggleTaskDetails(task)}
            >
                <p>{task.title}</p>
                <div className="task-details">{task.description}</div>
            </li>
        ));
    };

    // Handle drag-and-drop
    const handleDragStart = (e, task) => {
        e.dataTransfer.setData("task", JSON.stringify(task));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedTask = JSON.parse(e.dataTransfer.getData("task"));
        const targetTaskTitle = e.target.closest(".task-item")?.querySelector("p")?.textContent;

        if (!targetTaskTitle) {
            console.error("Drop target is invalid.");
            return;
        }

        // Find the index of the dropped task and the target task
        const droppedTaskIndex = tasks.findIndex((task) => task.title === droppedTask.title);
        const targetTaskIndex = tasks.findIndex((task) => task.title === targetTaskTitle);

        if (droppedTaskIndex === -1 || targetTaskIndex === -1) {
            console.error("Task indices are invalid.");
            return;
        }

        // Reorder the tasks array
        const updatedTasks = [...tasks];
        const [removedTask] = updatedTasks.splice(droppedTaskIndex, 1);
        updatedTasks.splice(targetTaskIndex, 0, removedTask);

        // Update state and localStorage
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Show task details
    const toggleTaskDetails = (task) => {
        alert(
            `Task Details:\n\nTitle: ${task.title}\nDescription: ${task.description}\nPriority: ${task.priority}\nStatus: ${task.status}\nCategory: ${task.category}\nLocation: ${task.location}`
        );
    };

    // Search tasks
    const searchTasks = () => {
        const results = tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });

        setSearchResults(results);
        setShowSearchPopup(true); // Show the search popup
    };

    // Display calendar
    const displayCalendar = () => {
        const calendarBars = [];
        const date = new Date();
        date.setDate(date.getDate() + currentIndex);

        const today = new Date().toISOString().split("T")[0]; // Define 'today' here

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(date);
            currentDay.setDate(date.getDate() + i);
            const currentDayString = currentDay.toISOString().split("T")[0]; // Define 'currentDayString' here
            const dateString = currentDay.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            const tasksForDate = tasks.filter(
                (task) => task.dueDate === currentDayString
            );
            const overdueTasks = tasks.filter(
                (task) => task.dueDate < today && task.dueDate === currentDayString
            );

            calendarBars.push(
                <div
                    key={i}
                    className="calendar-bar"
                    style={{
                        backgroundColor: overdueTasks.length > 0 ? "red" : "lightgray",
                    }}
                    onClick={(e) => {
                        const taskDetails = e.currentTarget.querySelector(".task-details");
                        if (taskDetails) {
                            taskDetails.style.display =
                                taskDetails.style.display === "block" ? "none" : "block";
                        }
                    }}
                >
                    <div>{dateString}</div>
                    <div className="task-details" style={{ display: "none" }}>
                        {tasksForDate.map((task, index) => (
                            <div
                                key={index}
                                className="task-item"
                                onClick={() => toggleTaskDetails(task)}
                            >
                                {task.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return calendarBars;
    };

    // Handle gestures for navigation
    const handleGesture  = useCallback(() => {
        if (touchEndX.current < touchStartX.current - 50 || mouseEndX.current < mouseStartX.current - 50) {
            // Swipe left or mouse left
            navigate("/completed-tasks");
        } else if (touchEndX.current > touchStartX.current + 50 || mouseEndX.current > mouseStartX.current + 50) {
            // Swipe right or mouse right
            navigate("/high-priority");
        }
    },[navigate, touchEndX, touchStartX, mouseEndX, mouseStartX]);

    useEffect(() => {
        const handleTouchStart = (e) => {
            touchStartX.current = e.changedTouches[0].clientX;
        };
        const handleTouchEnd = (e) => {
            touchEndX.current = e.changedTouches[0].clientX;
            handleGesture();
        };
        const handleMouseDown = (e) => {
            mouseStartX.current = e.clientX;
        };
        const handleMouseUp = (e) => {
            mouseEndX.current = e.clientX;
            handleGesture();
        };

        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchend", handleTouchEnd);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleGesture]);

    // Scroll functionality for the calendar
    useEffect(() => {
        const calendarContainer = document.getElementById("calendar-container");

        const handleScroll = (event) => {
            if (event.deltaY > 0) {
                // Scroll down
                setCurrentIndex((prevIndex) => prevIndex + 7);
            } else {
                // Scroll up
                setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 7)); // Prevent negative index
            }
        };

        if (calendarContainer) {
            calendarContainer.addEventListener("wheel", handleScroll);
        }

        return () => {
            if (calendarContainer) {
                calendarContainer.removeEventListener("wheel", handleScroll);
            }
        };
    }, []);

    // Update filters
    const updateFilter = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
        setCurrentIndex(0); // Reset pagination when filters change
    };

    // Close the search popup when clicking outside or clearing the search query
    useEffect(() => {
        const handleOutsideClick = (event) => {
            const searchPopup = document.getElementById("search-popup");
            if (searchPopup && !searchPopup.contains(event.target)) {
                setShowSearchPopup(false); // Hide the search popup
            }
        };

        if (showSearchPopup) {
            document.addEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [showSearchPopup]);

    // Automatically close the popup when the search query is cleared
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setShowSearchPopup(false);
        }
    }, [searchQuery]);

    return (
        <div>
            <h1>Task List</h1>

            {/* Search Bar */}
            <div id="search-bar-container">
                <input
                    type="text"
                    id="search-bar"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchTasks(); // Trigger search dynamically
                    }}
                />
                {showSearchPopup && (
                    <div id="search-popup">
                        <ul id="search-results">
                            {searchResults.length === 0 ? (
                                <li>No tasks found.</li>
                            ) : (
                                searchResults.map((task, index) => (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            localStorage.setItem("currentTask", JSON.stringify(task));
                                            navigate("/task-details"); // Navigate to Task Details page
                                        }}
                                    >
                                        {task.title}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div id="filters">
                <select
                    id="filter-priority"
                    onChange={(e) => updateFilter("priority", e.target.value)}
                >
                    <option value="all">All Priorities</option>
                    <option value="1">Critical</option>
                    <option value="2">Urgent</option>
                    <option value="3">High Priority</option>
                    <option value="4">Medium Priority</option>
                    <option value="5">Low Priority</option>
                </select>
                <select
                    id="filter-status"
                    onChange={(e) => updateFilter("status", e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <select
                    id="filter-category"
                    onChange={(e) => updateFilter("category", e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="new-landscaping">New Landscaping</option>
                    <option value="site-clearing">Site Clearing</option>
                    <option value="paint-maintenance">Paint Maintenance</option>
                    <option value="grass-maintenance">Grass Maintenance</option>
                    <option value="general-maintenance">General Maintenance</option>
                </select>
            </div>

            {/* Navigation to Task Details */}
            <div id="navigation">
                <button id="go-to-task-details" onClick={() => navigate("/task-details")}>
                    Add Task
                </button>
            </div>

            {/* Task List */}
            <ul id="task-list" onDragOver={handleDragOver} onDrop={handleDrop}>
                {displayTasks()}
            </ul>

            {/* Calendar */}
            <div id="calendar-container">{displayCalendar()}</div>
        </div>
    );
};

export default Tasks;

