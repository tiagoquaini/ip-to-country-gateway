require("dotenv").config();

const callNumber = {
  IP_STACK: 0,
  IP_API: 0
};

function hasReachedLimit(service) {
  const rateLimit = process.env[service + "_RATE_LIMIT"];
  return callNumber[service] !== undefined && callNumber[service] >= parseInt(rateLimit || -1);
}

function logCall(service) {
  if (callNumber[service] !== undefined) {
    callNumber[service] = callNumber[service] + 1;
  }
}

module.exports = {
  hasReachedLimit,
  logCall
};
