export const config = {
  // Key configurations for breakpoint in this section
  executor: 'ramping-arrival-rate', //Assure load increase if the system slows
  stages: [
    { duration: '2h', target: 700 }, // just slowly ramp-up to a HUGE load
  ],
};
