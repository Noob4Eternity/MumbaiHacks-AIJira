import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script"; // Ensure gapi is installed

const CLIENT_ID = "AIzaSyApdgzxy9sXJMr46mZcr-WmRaoTwdcDiCs"; // Replace with your Client ID
const API_KEY = "AIzaSyApdgzxy9sXJMr46mZcr-WmRaoTwdcDiCs"; // Replace with your API Key
const SCOPES = "https://www.googleapis.com/auth/calendar.events"; // Scopes for calendar access

const Scheduler = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    summary: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      }).then(() => {
        const auth = gapi.auth2.getAuthInstance();
        setIsSignedIn(auth.isSignedIn.get());
        auth.isSignedIn.listen(setIsSignedIn);
      });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const createEvent = () => {
    const { summary, startTime, endTime } = eventDetails;

    const event = {
      summary: summary,
      start: {
        dateTime: startTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime,
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`, // Ensure unique requestId
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    }).then((response) => {
      alert("Event created: " + response.result.htmlLink);
      console.log("Event details:", response.result);
    }).catch((error) => {
      console.error("Error creating event:", error);
    });
  };

  return (
    <div>
      <h1>Schedule a Google Meet</h1>
      {isSignedIn ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <div>
            <input
              type="text"
              name="summary"
              placeholder="Event Summary"
              value={eventDetails.summary}
              onChange={handleChange}
            />
            <input
              type="datetime-local"
              name="startTime"
              placeholder="Start Time"
              value={eventDetails.startTime}
              onChange={handleChange}
            />
            <input
              type="datetime-local"
              name="endTime"
              placeholder="End Time"
              value={eventDetails.endTime}
              onChange={handleChange}
            />
            <button onClick={createEvent}>Create Event</button>
          </div>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
};

export default Scheduler;
