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
  const [selectedTask, setSelectedTask] = useState(null);
  const [inputModalVisible, setInputModalVisible] = useState(false); // State to manage input modal visibility
  const [newTaskTitle, setNewTaskTitle] = useState(""); // State for new task input



  useEffect(() => {
    const tasksRef = ref(db, "tasks");
    const usersRef = ref(db, "users");

    const fetchTasks = () => {
      onValue(tasksRef, (snapshot) => {
        const tasksData = snapshot.val() || {};
        const unassignedTasks = [];

        Object.entries(tasksData).forEach(([taskId, taskName]) => {
          unassignedTasks.push({
            id: taskId,
            title: taskName,
            priority: "Medium",
          });
        });

        onValue(usersRef, (userSnapshot) => {
          const usersData = userSnapshot.val() || {};
          const inProgressTasks = [];
          const doneTasks = [];

          Object.entries(usersData).forEach(([userId, userTasks]) => {
            Object.entries(userTasks).forEach(([taskId, status]) => {
              const task = {
                id: taskId,
                title: tasksData[taskId] || taskId,
                priority: "Medium",
                assignedTo: userId,
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
            done: doneTasks,
          });
        });
      });
    };

    fetchTasks();
  }, []);

  const handleQuerySend = async () => {
    if (!newTaskTitle) return; // Ensure input is not empty
  
    try {
      // Fetch response from the server
      const response = await fetch('http://127.0.0.1:5000/api/v1/generate-user-story', {
        method: 'POST', // Assuming you want to send data to the server
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "initial_request": newTaskTitle }), // Send the task title
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json(); // Assuming the server responds with JSON
      
      // Log the received data
      console.log('Received data:', data); 
  
      closeInputModal(); // Close modal after logging
      setNewTaskTitle(""); // Clear the input
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  

  const handleDragStart = (e, taskId, sourceColumn) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
    const task = tasks[sourceColumn].find((t) => t.id === taskId);
    if (task) {
      e.dataTransfer.setData("taskTitle", task.title);
    }
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
        await remove(ref(db, `tasks/${taskId}`));
        const status = targetColumn === "inProgress" ? "In Progress" : "Done";
        await set(ref(db, `users/testUser/${taskId}`), status);
      } else if (targetColumn === "todo") {
        await remove(ref(db, `users/testUser/${taskId}`));
        await set(ref(db, `tasks/${taskId}`), taskTitle);
      } else {
        const status = targetColumn === "inProgress" ? "In Progress" : "Done";
        await set(ref(db, `users/testUser/${taskId}`), status);
      }

      setTasks((prev) => {
        const task = prev[sourceColumn].find((t) => t.id === taskId);
        if (!task) return prev;

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

  const openTaskModal = (task) => {
    setSelectedTask(task);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
  };

  const openInputModal = () => {
    setInputModalVisible(true);
  };

  const closeInputModal = () => {
    setInputModalVisible(false);
    setNewTaskTitle(""); // Clear input when closing modal
  };

  const handleInputChange = (e) => {
    setNewTaskTitle(e.target.value);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle) return; // Ensure input is not empty

    const newTaskRef = ref(db, `tasks/${new Date().getTime()}`); // Use timestamp as ID
    await set(newTaskRef, newTaskTitle);
    closeInputModal(); // Close modal after saving
  };

  return (
    <div className="relative">
      {/* Navbar with + icon */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Kanban Board</h1>
        <button onClick={openInputModal} className="text-white bg-blue-500 p-2 rounded">
          +
        </button>
      </div>

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
                onClick={() => openTaskModal(task)}
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

        {selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-black">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full text-black">
              <h3 className="text-xl font-semibold mb-2 text-black">{selectedTask.title}</h3>
              <p>Priority: {selectedTask.priority}</p>
              <p>Assigned to: {selectedTask.assignedTo || "Unassigned"}</p>
              <button
                className="mt-4 p-2 bg-blue-500 text-white rounded"
                onClick={closeTaskModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {inputModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-black">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full text-black">
              <h3 className="text-xl font-semibold mb-2">Enter Client Requirements</h3>
              <input
                type="text"
                value={newTaskTitle}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="Enter Requirements"
              />
              <button
                className="mt-4 mx-2 p-2 bg-green-500 text-white rounded"
                onClick={handleQuerySend}
              >
                Add Task
              </button>
              <button
                className="mt-2 p-2 bg-red-500 text-white rounded"
                onClick={closeInputModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kanban;
