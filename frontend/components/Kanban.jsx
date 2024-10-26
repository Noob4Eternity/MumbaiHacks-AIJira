import { useState, useEffect } from "react";
import React from "react";
import { ref, onValue, set, remove } from "firebase/database";
import { db } from "../pages/firebase";

const Kanban = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  useEffect(() => {
    const tasksRef = ref(db, "tasks");
    const usersRef = ref(db, "users");

    const fetchTasks = () => {
      onValue(tasksRef, (snapshot) => {
        const tasksData = snapshot.val() || {};
        const unassignedTasks = [];

        Object.entries(tasksData).forEach(([taskId, taskInfo]) => {
          unassignedTasks.push({
            id: taskId,
            title: taskInfo.title || "Untitled Task",
            priority: taskInfo.priority || "Medium",
          });
        });

        onValue(usersRef, (userSnapshot) => {
          const usersData = userSnapshot.val() || {};
          const inProgressTasks = [];
          const doneTasks = [];

          Object.entries(usersData).forEach(([userId, userTasks]) => {
            Object.entries(userTasks).forEach(([taskId, taskInfo]) => {
              const task = {
                id: taskId,
                title: taskInfo.title || "Untitled Task",
                priority: taskInfo.priority || "Medium",
                assignedTo: userId,
                status: taskInfo.status,
              };

              if (taskInfo.status === "In Progress") {
                inProgressTasks.push(task);
              } else if (taskInfo.status === "Done") {
                doneTasks.push(task);
              }
            });
          });

          setTasks({
            todo: unassignedTasks,
            inProgress: inProgressTasks,
            done: doneTasks,
          });
        });
      });
    };

    fetchTasks();
  }, []);

  const handleDragStart = (e, taskId, sourceColumn) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };

  const handleDrop = async (e, targetColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    if (sourceColumn === targetColumn) return;

    // Temporarily disable local state update to avoid duplication
    const task = tasks[sourceColumn].find((t) => t.id === taskId);
    if (!task) {
      console.error("Task not found in the source column:", sourceColumn);
      return;
    }

    try {
      // Perform the Firebase update but do not change local state directly
      if (sourceColumn === "todo") {
        await remove(ref(db, `tasks/${taskId}`));
        const status = targetColumn === "inProgress" ? "In Progress" : "Done";
        await set(ref(db, `users/testUser/${taskId}`), {
          title: task.title,
          priority: task.priority,
          status: status,
        });
      } else if (targetColumn === "todo") {
        await remove(ref(db, `users/testUser/${taskId}`));
        await set(ref(db, `tasks/${taskId}`), {
          title: task.title,
          priority: task.priority,
        });
      } else {
        const status = targetColumn === "inProgress" ? "In Progress" : "Done";
        await set(ref(db, `users/testUser/${taskId}`), {
          title: task.title,
          priority: task.priority,
          status: status,
        });
      }

      // Let Firebase `onValue` listener update the state after the drop.
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
            {column === "todo" ? "To Do" : column === "inProgress" ? "In Progress" : "Done"}
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
                <div className="text-xs text-gray-400 mt-1">Assigned to: {task.assignedTo}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Kanban;
