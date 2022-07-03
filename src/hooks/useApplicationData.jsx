import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  // State
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // setDay
  const setDay = day => setState({ ...state, day });

  // useEffect
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
      // VVV RESETS/RANDOMIZES DB VVV
      // axios.get('/api/debug/reset')
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      setState(prev => ({
        ...prev,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      }));

      //console.log('interviewers: ', interviewers.data);
    });
  }, [])

  // bookInterview
  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const updatedSpotsForDays = (dayName, days, appointments) => {
      const dayObj = days.find(item => item.name === state.day)
      let spots = 0;
      dayObj.appointments.forEach(id => {
        if (!appointments[id].interview) {
          spots += 1;
        }
      })
      const newDay = { ...dayObj, spots }
      return days.map(day => day.name === dayName ? newDay : day);
    }

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState(prev => {
          return {
            ...prev,
            appointments,
            days: updatedSpotsForDays(prev.day, prev.days, appointments)
          }
        })
      })
  }

  // cancelInterview
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const day = state.days.find(item => item.name === state.day)
        day.spots += 1;
        const days = state.days;
        const dayIndex = days.findIndex(item => day.name === item.name)
        days.splice(dayIndex, 1, day)
        setState({
          ...state,
          appointments,
          days
        });
      })
  }

  return { state, setDay, bookInterview, cancelInterview }
}