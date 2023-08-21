const BASE_URL = "http://localhost:8080";
const ENDPOINTS = ["/customers", "/brands", "/vehicles"];

const configAverageLoadTest = {
  // Key configurations for avg load test in this section
  stages: [
    { duration: "5m", target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: "30m", target: 100 }, // stay at 100 users for 10 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};

const configBreakPointTest = {
  // Key configurations for breakpoint in this section
  executor: "ramping-arrival-rate", //Assure load increase if the system slows
  stages: [
    { duration: "2h", target: 700 }, // just slowly ramp-up to a HUGE load
  ],
};

const configSmokeTest = {
  vus: 1, // Key for Smoke test. Keep it at 1, 2, 3, max 5 VUs
  duration: "1m", // This can be shorter or just a few iterations
};

const configSoakTest = {
  // Key configurations for Soak test in this section
  stages: [
    { duration: "5m", target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: "4h", target: 100 }, // stay at 100 users for 4 hours!!!
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};

const configSpikeTest = {
    // Key configurations for Stress in this section
    stages: [
     { duration: '2m', target: 1000 }, // fast ramp-up to a high point
     // No plateau
     { duration: '1m', target: 0 }, // quick ramp-down to 0 users
   ],
 };
 

const configStressTest = {
  // Key configurations for Stress in this section
  stages: [
    { duration: "10m", target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: "30m", target: 200 }, // stay at higher 200 users for 10 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};

export {
  configAverageLoadTest,
  configBreakPointTest,
  configSmokeTest,
  configSpikeTest,
  configStressTest,
  configSoakTest,
  BASE_URL,
  ENDPOINTS
};
