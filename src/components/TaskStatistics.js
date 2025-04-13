import React, { useState, useEffect, useRef, useCallback } from "react";
import { Chart } from "chart.js/auto";
import "../styles/taskstyle.css";
import { useNavigate } from "react-router-dom";

const TaskStatistics = () => {
    const [completedTasks, setCompletedTasks] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [priorityCounts, setPriorityCounts] = useState({});
    const navigate = useNavigate();

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const mouseStartX = useRef(0);
    const mouseEndX = useRef(0);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const handleGesture = useCallback(() => {
        if (touchEndX.current < touchStartX.current - 50 || mouseEndX.current < mouseStartX.current - 50) {
            navigate("/completed-tasks");
        } else if (touchEndX.current > touchStartX.current + 50 || mouseEndX.current > mouseStartX.current + 50) {
            navigate("/tasks");
        }
    }, [navigate]);

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        if (!Array.isArray(tasks)) {
            console.error("Invalid tasks data in localStorage");
            return;
        }

        let completed = 0;
        let pending = 0;
        const priorities = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

        tasks.forEach((task) => {
            if (task.status === "completed") completed++;
            if (task.status === "pending") pending++;
            if (task.priority) priorities[task.priority]++;
        });

        setCompletedTasks(completed);
        setPendingTasks(pending);
        setPriorityCounts(priorities);

        if (chartInstance.current) {
            chartInstance.current.data.datasets[0].data = Object.values(priorities);
            chartInstance.current.update();
        } else {
            const ctx = chartRef.current.getContext("2d");
            chartInstance.current = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["Critical", "Urgent", "High Priority", "Medium Priority", "Low Priority"],
                    datasets: [
                        {
                            label: "Task Count by Priority",
                            data: Object.values(priorities),
                            backgroundColor: ["red", "orange", "yellow", "blue", "green"],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                        },
                    },
                },
            });
        }

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

            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [handleGesture]);

    return (
        <div>
            <h1>Task Statistics</h1>
            <p>Completed Tasks: {completedTasks}</p>
            <p>Pending Tasks: {pendingTasks}</p>
            <p>Priority Counts: {JSON.stringify(priorityCounts)}</p>
            <canvas ref={chartRef} width="400" height="200"></canvas>
        </div>
    );
};

export default TaskStatistics;

