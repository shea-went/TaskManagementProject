import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/detailstyle.css";
import { useNavigate } from "react-router-dom";

const CompletedTasks = () => {
    const [completedTasks, setCompletedTasks] = useState([]);
    const navigate = useNavigate();

    // Refs to store gesture variables
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const mouseStartX = useRef(0);
    const mouseEndX = useRef(0);

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const filteredTasks = tasks.filter((task) => task.status === "completed");
        setCompletedTasks(filteredTasks);
    }, []);

    const handleGesture = useCallback (() => {
        if (touchEndX.current < touchStartX.current - 50 || mouseEndX.current < mouseStartX.current - 50) {
            // Swipe left or mouse left
            navigate("/high-priority");
        } else if (touchEndX.current > touchStartX.current + 50 || mouseEndX.current > mouseStartX.current + 50) {
            // Swipe right or mouse right
            navigate("/");
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

    return (
        <div>
            <h1>Completed Tasks</h1>
            <ul id="completed-tasks">
                {completedTasks.length === 0 ? (
                    <li>No completed tasks found.</li>
                ) : (
                    completedTasks.map((task, index) => (
                        <li key={index}>
                            {task.title} (Completed on: {task.completionDate})
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default CompletedTasks;

