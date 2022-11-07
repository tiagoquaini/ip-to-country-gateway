const { RateLimiter } = require("limiter");
require("dotenv").config();

const ipStackDefinedLimit = parseInt(process.env.IP_STACK_RATE_LIMIT || 0);
const ipStackLimiter = new RateLimiter({
  tokensPerInterval: ipStackDefinedLimit,
  interval: "hour",
  fireImmediately: true
});

const ipApiDefinedLimit = parseInt(process.env.IP_API_RATE_LIMIT || 0);
const ipApiLimiter = new RateLimiter({
  tokensPerInterval: ipApiDefinedLimit,
  interval: "hour",
  fireImmediately: true
});

const services = {
  IP_STACK: "IP_STACK",
  IP_API: "IP_API"
};

async function hasReachedLimit(service) {
  let remainingCalls = 0;

  if (service === services.IP_STACK) {
    remainingCalls = await ipStackLimiter.removeTokens(1);
  }
  if (service === services.IP_API) {
    remainingCalls = await ipApiLimiter.removeTokens(1);
  }

  return remainingCalls === -1; // limiter will be -1 when limit is reached
}

module.exports = {
  hasReachedLimit
};
