import React from "react"; // option
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const days = props.days
  const listDays = days.map((day) => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        onChange={props.onChange}
        //setDay={props.setDay}
      />
    );
  });

  return (
    <ul>{listDays}</ul>
  );
}

