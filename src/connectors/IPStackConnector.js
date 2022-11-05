const BaseLookupConnector = require("./BaseLookupConnector");
const BASE_URL = "http://api.ipstack.com";

class IPStackConnector extends BaseLookupConnector {
  constructor() {
    super(BASE_URL);
  }
  
  buildUrl(ipAddress) {
    const API_KEY = process.env.IPSTACK_API_KEY;
    return `${this.baseUrl}/${ipAddress}?access_key=${API_KEY}&fields=country_name`;
  }

  async lookupIp(ipAddress) {
    const countryData = await super.lookupIp(ipAddress);
    return countryData?.country_name;
  }
}

module.exports = new IPStackConnector();