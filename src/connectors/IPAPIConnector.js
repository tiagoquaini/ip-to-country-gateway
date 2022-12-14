const BaseLookupConnector = require("./BaseLookupConnector");
const BASE_URL = "http://ip-api.com/json";

class IPAPIConnector extends BaseLookupConnector {
  constructor() {
    super(BASE_URL);
  }

  buildUrl(ipAddress) {
    return `${this.baseUrl}/${ipAddress}?fields=country`;
  }

  async lookupIp(ipAddress) {
    const countryData = await super.lookupIp(ipAddress);
    return countryData?.country;
  }
}

module.exports = new IPAPIConnector();