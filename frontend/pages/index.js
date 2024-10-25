import Nav from "@/components/Nav";
import React from "react";

function Index() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-100 rounded-r-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
        <ul>
          <li className="mb-2">Item 1</li>
          <li className="mb-2">Item 2</li>
          <li className="mb-2">Item 3</li>
          <li className="mb-2">Item 4</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4">
        {/* Kanban Board and Additional Div */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Kanban Board */}
          <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-semibold mb-2">Kanban Board</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg shadow">To Do</div>
              <div className="bg-yellow-100 p-4 rounded-lg shadow">In Progress</div>
              <div className="bg-green-100 p-4 rounded-lg shadow">Done</div>
            </div>
          </div>

          {/* Additional Div */}
          <div className="bg-gray-200 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">Additional Div</h2>
            {/* Content for the additional div */}
            <p>Details for the additional section...</p>
          </div>
        </div>

        {/* Schedule Sections */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold">Schedule 1</h3>
            <p>Details for Schedule 1...</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold">Schedule 2</h3>
            <p>Details for Schedule 2...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
