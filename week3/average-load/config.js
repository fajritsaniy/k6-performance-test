export const config = {
  // Key configurations for avg load test in this section
  stages: [
    { duration: "5m", target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: "30m", target: 100 }, // stay at 100 users for 10 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};
