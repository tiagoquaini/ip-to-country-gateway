const CircuitBreaker = require('opossum');
const ipApiConnector = require('../connectors/IPAPIConnector');
const ipStackConnector = require('../connectors/IPStackConnector');
const RateLimitExceededError = require('../utils/RateLimitExceededError');
const countriesCaching = require('./CountriesCaching');
const rateLimit = require('./RateLimit');
const Logger = require('../utils/Logger');

// define circuit breakers for APIs
const breakerOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};
const ipStackBreaker = new CircuitBreaker(queryCountryFromIpStack, breakerOptions);
const ipApiBreaker = new CircuitBreaker(queryCountryFromIpApi, breakerOptions);

async function getCountryByIp(ip) {
  const cachedValue = countriesCaching.getCountryByIp(ip)
  if (cachedValue) {
    Logger.log(`Retrieving IP address '${ip}' from cache`);
    return cachedValue;
  }

  let countryName = await ipStackBreaker.fire(ip);

  if (!countryName) {
    countryName = await ipApiBreaker.fire(ip);
  }

  if (countryName) {
    return countryName;
  }

  throw new RateLimitExceededError();
}

async function queryCountryFromIpStack(ip) {
  if (rateLimit.hasReachedLimit("IP_STACK")) {
    return null;
  }
  Logger.log(`Retrieving IP address '${ip}' from IP Stack`);
  const countryName = await ipStackConnector.lookupIp(ip);
  countriesCaching.storeCountry(countryName, ip);
  rateLimit.logCall("IP_STACK");
  return countryName;
}

async function queryCountryFromIpApi(ip) {
  if (rateLimit.hasReachedLimit("IP_API")) {
    return null;
  }
  Logger.log(`Retrieving IP address '${ip}' from IP API`);
  const countryName = await ipApiConnector.lookupIp(ip);
  countriesCaching.storeCountry(countryName, ip);
  rateLimit.logCall("IP_API");
  return countryName;
}

module.exports = {
  getCountryByIp
};