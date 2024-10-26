import React from "react";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext";

import DateTimePicker from "react-datetime-picker";

const Calender = () => {
  const { user } = UserAuth();
  const [setstart, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  return (
    <div>
      <button
        onClick={() => {
          console.log(user);
        }}
      ></button>
    </div>
  );
};

export default Calender;
