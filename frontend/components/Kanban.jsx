import { useState } from "react";
import React from "react";

const Kanban = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: "1", title: "Research project requirements", priority: "High" },
      { id: "2", title: "Design mockups", priority: "Medium" },
      { id: "3", title: "Setup development environment", priority: "Low" },
    ],
    inProgress: [
      { id: "4", title: "Implement authentication", priority: "High" },
      { id: "5", title: "Create database schema", priority: "Medium" },
    ],
    done: [
      { id: "6", title: "Project planning", priority: "High" },
      { id: "7", title: "Team meeting", priority: "Medium" },
    ],
  });

  const handleDragStart = (e, taskId, sourceColumn) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    if (sourceColumn === targetColumn) return;

    setTasks((prev) => {
      const task = prev[sourceColumn].find((t) => t.id === taskId);
      const newTasks = {
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter((t) => t.id !== taskId),
        [targetColumn]: [...prev[targetColumn], task],
      };
      return newTasks;
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div
          className=" p-4 rounded-3xl "
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "todo")}
        >
          <h3 className="font-semibold mb-3 text-gray-600">To Do</h3>
          {tasks.todo.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id, "todo")}
              className="bg-slate-900 p-3 rounded-2xl  mb-2 cursor-pointer hover:-md transition-"
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
            </div>
          ))}
        </div>

        <div
          className=" p-4 rounded-3xl "
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "inProgress")}
        >
          <h3 className="font-semibold mb-3 text-gray-600">In Progress</h3>
          {tasks.inProgress.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id, "inProgress")}
              className="bg-slate-900 p-3 rounded-2xl  mb-2 cursor-pointer hover:-md transition-"
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
            </div>
          ))}
        </div>

        <div
          className=" p-4 rounded-3xl "
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "done")}
        >
          <h3 className="font-semibold mb-3 text-gray-600">Done</h3>
          {tasks.done.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id, "done")}
              className="bg-slate-900 p-3 rounded-2xl  mb-2 cursor-pointer hover:-md transition-"
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
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Kanban;
