
const ipApiConnector = require('../connectors/IPAPIConnector');
const ipStackConnector = require('../connectors/IPStackConnector');
const RateLimitExceededError = require('../utils/RateLimitExceededError');
const countriesCaching = require('./CountriesCaching');
const rateLimit = require('./RateLimit');

async function getCountryByIp(ip) {
  const cachedValue = countriesCaching.getCountryByIp(ip)
  if (cachedValue) {
    return cachedValue;
  }

  if (!rateLimit.hasReachedLimit("IP_STACK")) {
    return await queryCountryFromIpStack(ip);
  }

  if (!rateLimit.hasReachedLimit("IP_API")) {
    return await queryCountryFromIpApi(ip);
  }

  throw new RateLimitExceededError();
}

async function queryCountryFromIpStack(ip) {
  const countryName = ipStackConnector.lookupIp(ip);
  countriesCaching.storeCountry(countryName, ip);
  rateLimit.logCall("IP_STACK");
  return countryName;
}

async function queryCountryFromIpApi(ip) {
  const countryName = ipApiConnector.lookupIp(ip);
  countriesCaching.storeCountry(countryName, ip);
  rateLimit.logCall("IP_API");
  return countryName;
}

module.exports = {
  getCountryByIp
};