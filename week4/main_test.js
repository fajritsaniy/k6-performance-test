import http from "k6/http";
import { sleep } from "k6";
import { check } from "k6";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";
import {
  configAverageLoadTest,
  configBreakPointTest,
  configSmokeTest,
  configSpikeTest,
  configStressTest,
  configSoakTest,
  BASE_URL,
  ENDPOINTS
} from "./config.js";

// Configuration on K6
export let options = {};

export function setOptions(config) {
  options = config;
}

// Parse command-line arguments
const method = __ENV.METHOD;

const testConfigs = {
    average: { config: configAverageLoadTest, label: "AVERAGE LOAD TEST" },
    breakpoint: { config: configBreakPointTest, label: "BREAKPOINT TEST" },
    smoke: { config: configSmokeTest, label: "SMOKE TEST" },
    soak: { config: configSoakTest, label: "SOAK TEST" },
    spike: { config: configSpikeTest, label: "SPIKE TEST" },
    stress: { config: configStressTest, label: "STRESS TEST" },
  };
  
  const selectedTest = testConfigs[method];
  
  if (selectedTest) {
    setOptions(selectedTest.config);
    console.log(`===RUNNING ${selectedTest.label}===`);
  } else {
    throw new Error(
      "Invalid method. Choose your performance test mode 'average, breakpoint, smoke, soak, spike, stress'"
    );
  }
  

// Console log status function
function writeStatus(user, endpoint, status) {
  let consoleStatus = `User ${user}: ${endpoint} Response Status: ${status}`;
  console.log(consoleStatus);
}

// Payload Generator using faker
export const payloadDummy = () => ({
  name: faker.name.firstName(),
});

// main function
export default function () {
  // Check if the current endpoint requires authentication
  const endpointRequiresAuth = (endpoint) =>
    endpoint !== "/brands" && endpoint !== "/vehicles";

  // let authToken;
  for (const endpoint of ENDPOINTS) {
    if (endpointRequiresAuth(endpoint)) {
    } else if (endpoint === "/vehicles") {
      const resourceResponse = http.get(`${BASE_URL}${endpoint}`);
      check(resourceResponse, {
        "Verify Vehicles Response Body": (r) => r.body.includes("OK"),
        "Verify Vehicles Response Code": (r) => r.status === 200,
      });
      writeStatus(__VU, endpoint, resourceResponse.status);
      const vehicles = resourceResponse.json().data;

      // Extract id from the response (assuming the response is an array of objects)
      if (vehicles.length > 0) {
        const vehicleId = vehicles[0].id;
        const vehicleDetailsEndpoint = `${BASE_URL}${endpoint}/${vehicleId}`;
        const vehicleDetailsResponse = http.get(vehicleDetailsEndpoint);
        writeStatus(
          __VU,
          `${endpoint}/${vehicleId}`,
          vehicleDetailsResponse.status
        );
      }
    } else if (endpoint === "/brands") {
      const resourceResponse = http.get(`${BASE_URL}${endpoint}`);
      check(resourceResponse, {
        "Verify Brands Response Body": (r) => r.body.includes("OK"),
        "Verify Brands Response Code": (r) => r.status === 200,
      });
      writeStatus(__VU, endpoint, resourceResponse.status);
    }
    sleep(2);
  }
}
