export const config = {
   // Key configurations for Stress in this section
  stages: [
    { duration: '10m', target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: '30m', target: 200 }, // stay at higher 200 users for 10 minutes
    { duration: '5m', target: 0 }, // ramp-down to 0 users
  ],
};
