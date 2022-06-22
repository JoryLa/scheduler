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
      axios.get('/api/debug/reset')
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      setState(prev => ({
        ...prev,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      }));

      console.log('interviewers: ', interviewers.data);
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

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState({
          ...state,
          appointments
        });
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
        setState({
          ...state,
          appointments
        });
      })
  }

  return { state, setDay, bookInterview, cancelInterview }
}