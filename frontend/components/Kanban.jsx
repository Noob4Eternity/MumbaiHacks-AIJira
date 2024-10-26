import { useState, useEffect } from "react";
import React from "react";
import { ref, onValue, set, remove } from "firebase/database";
import { db } from "@/config/firebase";

const Kanban = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });

  useEffect(() => {
    // Reference to the tasks and users nodes
    const tasksRef = ref(db, 'tasks');
    const usersRef = ref(db, 'users');

    // Fetch and organize tasks
    const fetchTasks = () => {
      onValue(tasksRef, (snapshot) => {
        const tasksData = snapshot.val() || {};
        const unassignedTasks = [];
        
        // Process unassigned tasks
        Object.entries(tasksData).forEach(([taskId, taskName]) => {
          unassignedTasks.push({
            id: taskId,
            title: taskName,
            priority: "Medium" // You can modify this as needed
          });
        });

        // Fetch user tasks
        onValue(usersRef, (userSnapshot) => {
          const usersData = userSnapshot.val() || {};
          const inProgressTasks = [];
          const doneTasks = [];

          // Process user tasks
          Object.entries(usersData).forEach(([userId, userTasks]) => {
            Object.entries(userTasks).forEach(([taskId, status]) => {
              const task = {
                id: taskId,
                title: tasksData[taskId] || taskId,
                priority: "Medium",
                assignedTo: userId
              };

              if (status === "In Progress") {
                inProgressTasks.push(task);
              } else if (status === "Done") {
                doneTasks.push(task);
              }
            });
          });

          setTasks({
            todo: unassignedTasks,
            inProgress: inProgressTasks,
            done: doneTasks
          });
        });
      });
    };

    fetchTasks();
  }, []);

  const handleDragStart = (e, taskId, sourceColumn) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
    e.dataTransfer.setData("taskTitle", tasks[sourceColumn].find(t => t.id === taskId)?.title);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");
    const taskTitle = e.dataTransfer.getData("taskTitle");

    if (sourceColumn === targetColumn) return;

    try {
      if (sourceColumn === "todo") {
        // When moving from todo to other columns:
        // 1. Remove from tasks (unassigned tasks)
        await remove(ref(db, `tasks/${taskId}`));
        
        // 2. Add to user assignments
        const status = targetColumn === "inProgress" ? "In Progress" : "Done";
        await set(ref(db, `users/testUser/${taskId}`), status);
      } 
      else if (targetColumn === "todo") {
        // When moving back to todo:
        // 1. Remove from user assignments
        await remove(ref(db, `users/testUser/${taskId}`));
        
        // 2. Add back to unassigned tasks
        await set(ref(db, `tasks/${taskId}`), taskTitle);
      }
      else {
        // Moving between inProgress and done:
        const status = targetColumn === "inProgress" ? "In Progress" : "Done";
        await set(ref(db, `users/testUser/${taskId}`), status);
      }

      // Update local state
      setTasks((prev) => {
        const task = prev[sourceColumn].find((t) => t.id === taskId);
        return {
          ...prev,
          [sourceColumn]: prev[sourceColumn].filter((t) => t.id !== taskId),
          [targetColumn]: [...prev[targetColumn], task],
        };
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {["todo", "inProgress", "done"].map((column) => (
        <div
          key={column}
          className="p-4 rounded-3xl"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column)}
        >
          <h3 className="font-semibold mb-3 text-gray-600">
            {column === "todo"
              ? "To Do"
              : column === "inProgress"
              ? "In Progress"
              : "Done"}
          </h3>
          {tasks[column].map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id, column)}
              className="bg-slate-900 p-3 rounded-2xl mb-2 cursor-pointer hover:shadow-md transition-shadow"
            >
              <h4 className="text-white">{task.title}</h4>
              <span
                className={`text-sm ${
                  task.priority === "High"
                    ? "text-red-500"
                    : task.priority === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {task.priority}
              </span>
              {task.assignedTo && (
                <div className="text-xs text-gray-400 mt-1">
                  Assigned to: {task.assignedTo}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Kanban;