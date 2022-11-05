const ipLookupService = require('../services/IPLookupService');
const HTTPResponseError = require('../utils/HTTPResponseError');
const RateLimitExceededError = require('../utils/RateLimitExceededError');
const validator = require('../utils/Validator');

async function getCountryByIp(req, res) {
  const ip = req.params.ip;
  if (!validator.isValidIpAddress(ip)) {
    res.status(400).send("Invalid IP address");
    return;
  }

  try {
    const countryName = await ipLookupService.getCountryByIp(ip);
    if (countryName) {
      res.status(200).send(countryName);
    } else {
      res.status(404).send("IP address not found");
    }
  } catch (err) {
    if (err instanceof HTTPResponseError) {
      res.status(400).send(`Bad request: '${err.message}'`);
      return;
    }
    if (err instanceof RateLimitExceededError) {
      res.status(429).send("Rate limits exceeded");
      return;
    }
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  getCountryByIp
};