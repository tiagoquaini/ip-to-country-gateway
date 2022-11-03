const fetch = require('node-fetch');
const HTTPResponseError = require('../utils/HTTPResponseError');

class BaseLookupConnector {
  constructor(baseUrl) {
    if (!baseUrl) {
      throw new Error("Missing base URL for IP lookup interface!");
    }
    if(!this.buildUrl) {
      throw new Error("Missing 'buildUrl' method implementation for IP lookup interface!");
    }
    this.baseUrl = baseUrl;
  }

  async lookupIp(ipAddress) {
    const url = this.buildUrl(ipAddress);
    const response = await fetch(url);
    checkStatus(response);
    return await response.json();
  }
}

function checkStatus(response) {
	if (response.ok) {
		return response;
	} else {
		throw new HTTPResponseError(response);
	}
}

module.exports = BaseLookupConnector;