import Kanban from "@/components/Kanban";
import React, { useState } from "react";

function Index() {
  return (
    <div className="flex bg-slate-900 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white rounded-3xl shadow-lg  ml-4 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Sidebar</h2>
        <ul className="space-y-3">
          <li className="text-gray-600 hover:text-gray-800 transition-colors">Item 1</li>
          <li className="text-gray-600 hover:text-gray-800 transition-colors">Item 2</li>
          <li className="text-gray-600 hover:text-gray-800 transition-colors">Item 3</li>
          <li className="text-gray-600 hover:text-gray-800 transition-colors">Item 4</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6">
        {/* Kanban Board and Additional Div */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Kanban Board */}
          <div className="col-span-2 bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Kanban Board</h2>
            <Kanban />
          </div>

          {/* Additional Div */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Additional Div</h2>
            <p className="text-gray-600">Details for the additional section...</p>
          </div>
        </div>

        {/* Schedule Sections */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-700">Schedule 1</h3>
            <p className="text-gray-600">Details for Schedule 1...</p>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-700">Schedule 2</h3>
            <p className="text-gray-600">Details for Schedule 2...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
