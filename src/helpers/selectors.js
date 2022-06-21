export function getAppointmentsForDay(state, day) {
  const foundDay = state.days.find(element => element.name === day);
  if (!foundDay) {
    return [];
  }
  return foundDay.appointments.map(id => state.appointments[id])
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };
}

export function getInterviewersForDay(state, day) {
  const foundDay = state.days.find(element => element.name === day);
  if (!foundDay) {
    return [];
  }
  return foundDay.interviewers.map(id => state.interviewers[id])
}