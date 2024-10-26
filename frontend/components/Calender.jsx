import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import TextField from "@mui/material/TextField"; // Import TextField for input rendering
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"; // Import DateTimePicker
import dayjs from "dayjs"; // Import dayjs to use for conversions

const Calender = () => {
  const { user } = UserAuth();
  console.log(user);

  // State for start and end date and time
  const [start, setStart] = useState(dayjs()); // Initialize with current date and time as Dayjs
  const [end, setEnd] = useState(dayjs()); // Initialize with current date and time as Dayjs
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  if (!user) {
    return <div>Please log in to access calendar features.</div>;
  }
  const accessToken = user.stsTokenManager?.accessToken;

  console.log("Access Token:", accessToken);

  async function createCalendarEvent() {
    console.log("Creating calendar event");
    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start.toISOString(), // Date.toISOString() ->
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
      },
      end: {
        dateTime: end.toISOString(), // Date.toISOString() ->
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
      },
    };
    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken, // Access token for google
      },
      body: JSON.stringify(event),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        alert("Event created, check your Google Calendar!");
      });
  }

  return (
    <div className="flex flex-col gap-4 text-black">
      {/* Start Date Picker */}
      <div className="flex flex-col">
        <span className="font-semibold">Start of the Event</span>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            onChange={(newValue) => setStart(newValue)} // Set start date and time
            value={start} // Controlled value for start date and time
            renderInput={(params) => <TextField {...params} variant="outlined" />} // Use TextField for styling
          />
        </LocalizationProvider>
      </div>

      {/* End Date Picker */}
      <div className="flex flex-col">
        <span className="font-semibold">End of the Event</span>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            onChange={(newValue) => setEnd(newValue)} // Set end date and time
            value={end} // Controlled value for end date and time
            renderInput={(params) => <TextField {...params} variant="outlined" />} // Use TextField for styling
          />
        </LocalizationProvider>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold">Event Name</label>
        <input
          type="text"
          className="border rounded p-2"
          onChange={(e) => setEventName(e.target.value)}
        />

        <label className="font-semibold">Event Description</label>
        <input
          type="text"
          className="border rounded p-2"
          onChange={(e) => setEventDescription(e.target.value)}
        />

        <hr className="my-4" />
        <button
          onClick={createCalendarEvent}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Create Calendar Event
        </button>
      </div>
    </div>
  );
};

export default Calender;
