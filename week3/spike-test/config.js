export const config = {
   // Key configurations for Stress in this section
   stages: [
    { duration: '2m', target: 1000 }, // fast ramp-up to a high point
    // No plateau
    { duration: '1m', target: 0 }, // quick ramp-down to 0 users
  ],
};
