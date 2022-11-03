const BaseLookupConnector = require("./BaseLookupConnector");
const BASE_URL = "https://api.ipstack.com";
const API_KEY = process.env.IPSTACK_API_KEY;

class IPStackConnector extends BaseLookupConnector {
  constructor() {
    super(BASE_URL);
  }

  buildUrl(ipAddress) {
    return `${this.baseUrl}/${ipAddress}?access_key=${API_KEY}&fields=country_name`;
  }
}

module.exports = new IPStackConnector();