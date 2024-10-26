import Calender from "../components/Calender";
import Kanban from "../components/Kanban";
import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function Index() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      {/* Main Content Area */}
      <div className="flex-grow p-5">
        {/* Kanban Board and Additional Div */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Kanban Board */}
          <div className="col-span-2 bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Kanban Board</h2>
            <Kanban />
          </div>

          {/* Additional Div */}
          <div className="bg-white rounded-3xl shadow-lg p-5">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Team Members</h2>
            <div className="text-gray-600">
              {[
                {
                  name: "Dev More",
                  designation: "Senior Developer",
                  task: "Working on the new authentication system",
                  online: true,
                },
                {
                  name: "Karan Dwari",
                  designation: "Project Manager",
                  task: "Overseeing the migration to cloud services",
                  online: false,
                },
                {
                  name: "Ved Datar",
                  designation: "UX Designer",
                  task: "Designing new user interface for the mobile app",
                  online: true,
                },
              ].map((employee, index) => (
                <div key={index} className="flex items-center mb-4">
                  {/* Circle Avatar */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    {/* Name */}
                    <p className="font-bold">{employee.name}</p>
                    {/* Designation */}
                    <p className="text-sm text-gray-500">{employee.designation}</p>
                    {/* Task and Online Status */}
                    <div className="flex items-center">
                      <div
                        className={`w-2.5 h-2.5 rounded-full mr-2 ${
                          employee.online ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <p className="text-sm text-gray-600">{employee.task}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Sections */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-black mb-4">Google Calendar</h3>
            <Calender />
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="font-semibold text-black">Google Drive</h3>
            <p className="text-gray-600">Details for Schedule 2...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
