import http from "k6/http";
import { sleep } from "k6";
import { check } from "k6";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";
import {config} from "./config.js"

const BASE_URL = "http://localhost:8888";
const ENDPOINTS = ["/customers", "/brands", "/vehicles"];

// Configuration on K6
export let options = {
  vus : config.vus,
  duration: config.duration
};

// Payload Generator using faker
export const payloadCredential = () => ({
  username: faker.name.firstName(),
  password: "password"
});

// Registration function
function registFunc (user) {
  const credentials = payloadCredential()
  const registHeaders = {
    "Content-Type": "application/json",
  };

  const registResponse = http.post(
    `${BASE_URL}/register`,
    JSON.stringify(credentials),
    {
      headers: registHeaders,
    }
  );
  if(registResponse.status !== 201){
    console.log(registResponse.body)
  }
  check(registResponse, {
    "Verify Regist Response Body": (r) => r.body.includes(`${credentials.username} has been registered.`),
    "Verify Regist Response Code": (r) => r.status === 201,
  });
  writeStatus(user, "/register", registResponse.status);
  return credentials
}

// Login function
function loginAndGetAuthToken(credentials,user) {
  
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

// main function
export default function () {
  const credentials = registFunc(__VU)
  // Check if the current endpoint requires authentication
  const endpointRequiresAuth = (endpoint) =>
    endpoint !== "/brands" && endpoint !== "/vehicles";

  let authToken;
  for (const endpoint of ENDPOINTS) {
    if (endpointRequiresAuth(endpoint)) {
      authToken = loginAndGetAuthToken(credentials,__VU);
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
    }
    sleep(2);
  }
}
