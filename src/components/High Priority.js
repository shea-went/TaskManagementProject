import React, { useState, useEffect, useRef , useCallback } from "react";
import "../styles/detailstyle.css";
import { useNavigate } from "react-router-dom";

const HighPriority = () => {
    const [highPriorityTasks, setHighPriorityTasks] = useState([]);
    const navigate = useNavigate();

    // Refs to store gesture variables
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const mouseStartX = useRef(0);
    const mouseEndX = useRef(0);

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const filteredTasks = tasks.filter(
            (task) => task.priority === "1" || task.priority === "2" || task.priority === "3"
        );
        setHighPriorityTasks(filteredTasks);
    }, []);

    const handleGesture = useCallback(() => {
        if (touchEndX.current < touchStartX.current - 50 || mouseEndX.current < mouseStartX.current - 50) {
            // Swipe left or mouse left
            navigate("/completed-tasks");
        } else if (touchEndX.current > touchStartX.current + 50 || mouseEndX.current > mouseStartX.current + 50) {
            // Swipe right or mouse right
            navigate("/");
        }
    }, [navigate, touchStartX, touchEndX, mouseStartX, mouseEndX]);

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

    return (
        <div>
            <h1>High Priority Tasks</h1>
            <ul id="high-priority-task-list">
                {highPriorityTasks.length === 0 ? (
                    <li>No high priority tasks found.</li>
                ) : (
                    highPriorityTasks.map((task, index) => (
                        <li key={index}>
                            {task.title} (Due: {task.dueDate})
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default HighPriority;