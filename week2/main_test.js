import http from "k6/http";
import { sleep } from "k6";
import { check } from "k6";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";

// Using json file
import { SharedArray } from "k6/data";
const CREDENTIALS = new SharedArray("users collection", function () {
  return JSON.parse(open("./users.json")).users;
});

// Using csv file
// import papaparse from '../libs/papaparse.js';
// import { SharedArray } from 'k6/data';
// const CREDENTIALS = new SharedArray('another data name', function () {
//   // Load CSV file
//   return papaparse.parse(open('./users.csv'), { header: true }).data;
// });

const BASE_URL = "http://localhost:8888";
const ENDPOINTS = ["/customers", "/brands", "/vehicles"];

// Configuration on K6
export let options = {
  vus: 10,
  iterations: 10,
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<350"], // 95% of requests should be below 350ms
  },
};

// Login function
function loginAndGetAuthToken(user, credentials) {
  const loginPayload = {
    username: credentials.username,
    password: credentials.password,
  };

  const loginHeaders = {
    "Content-Type": "application/json",
  };

  const loginResponse = http.post(
    `${BASE_URL}/login`,
    JSON.stringify(loginPayload),
    {
      headers: loginHeaders,
    }
  );
  check(loginResponse, {
    "Verify Login Response Body": (r) => r.body.includes("token"),
    "Verify Login Response Code": (r) => r.status === 201,
  });
  writeStatus(user, "/login", loginResponse.status);

  return loginResponse.json().token;
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
  const userIndex = __VU - 1;
  const credentials = CREDENTIALS[userIndex];

  // Check if the current endpoint requires authentication
  const endpointRequiresAuth = (endpoint) =>
    endpoint !== "/brands" && endpoint !== "/vehicles";

  let authToken;
  for (const endpoint of ENDPOINTS) {
    if (endpointRequiresAuth(endpoint)) {
      authToken = loginAndGetAuthToken(__VU, credentials);
      const resourceHeaders = {
        Authorization: `Bearer ${authToken}`,
      };
      const resourceResponse = http.get(`${BASE_URL}${endpoint}`, {
        headers: resourceHeaders,
      });
      check(resourceResponse, {
        "Verify Customers Response Body": (r) => r.body.includes("OK"),
        "Verify Customers Response Code": (r) => r.status === 200,
      });
      writeStatus(__VU, endpoint, resourceResponse.status);
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

      // // POST using faker
      // authToken = loginAndGetAuthToken(__VU,credentials);
      // const resourceHeaders = {
      //   Authorization: `Bearer ${authToken}`,
      // };
      // const payload = JSON.stringify(payloadDummy());
      // const postResponse = http.post(`${BASE_URL}${endpoint}`,payload,{
      //   headers: resourceHeaders,
      // });
      // console.log(`User ${__VU}: ${endpoint} Faker Data POST Response Status: ${postResponse.status}`)
    }
    sleep(2);
  }
}
