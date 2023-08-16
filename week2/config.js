export const config = {
    vus: 10,
    iterations: 10,
    thresholds: {
      http_req_failed: ["rate<0.01"], // http errors should be less than 1%
      http_req_duration: ["p(95)<350"], // 95% of requests should be below 350ms
    },
  };
  