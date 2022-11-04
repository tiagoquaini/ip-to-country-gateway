const { describe, expect, test } = require('@jest/globals');
const IPStackConnector = require('../../src/connectors/IPStackConnector');
const HTTPResponseError = require('../../src/utils/HTTPResponseError');
const nock = require('nock');

describe('IPStackConnector', () => {
  let ipAddr, baseUrl, apiKey, countryData;

  beforeAll(() => {
    ipAddr = "8.8.8.8";
    baseUrl = "https://api.ipstack.com";
    apiKey = "API_KEY";
    process.env.IPSTACK_API_KEY = apiKey;
    countryData = { "country_name": "United States" } ;
  });

  test('Should successfully call API URL', async () => {
    nock(baseUrl)
      .get(`/${ipAddr}?access_key=${apiKey}&fields=country_name`)
      .reply(200, countryData);
    const data = await IPStackConnector.lookupIp(ipAddr);
    expect(data).toEqual(countryData.country_name);
  });

  test('Should throw HTTPResponseError when API call fails', async () => {
    nock(baseUrl)
      .get(`/${ipAddr}?access_key=${apiKey}&fields=country_name`)
      .reply(500);
    try {
      await IPStackConnector.lookupIp(ipAddr);
    } catch (err) {
      expect(err).toBeInstanceOf(HTTPResponseError);
    }
  });
});