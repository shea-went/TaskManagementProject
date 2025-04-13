// Chart.js script to create a bar chart for task priorities
document.addEventListener("DOMContentLoaded", function () {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const priorityCounts = [0, 0, 0, 0, 0]; // For priorities 1 to 5

    tasks.forEach(task => {
        const priority = parseInt(task.priority, 10);
        if (priority >= 1 && priority <= 5) {
            priorityCounts[priority - 1]++;
        }
    });

    const ctx = document.getElementById("myBarChart").getContext("2d");

    const data = {
        labels: ["Critical", "Urgent", "High Priority", "Medium Priority", "Low Priority"],
        datasets: [{
            label: "Number of Tasks",
            data: priorityCounts,
            backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)"
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)"
            ],
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    new Chart(ctx, {
        type: "bar",
        data: data,
        options: options
    });
});