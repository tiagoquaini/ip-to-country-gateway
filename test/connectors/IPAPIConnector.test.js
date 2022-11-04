const { describe, expect, test } = require('@jest/globals');
const IPAPIConnector = require('../../src/connectors/IPAPIConnector');
const HTTPResponseError = require('../../src/utils/HTTPResponseError');

const nock = require('nock');

describe('IPStackConnector', () => {
  let ipAddr, baseUrl, countryData;

  beforeAll(() => {
    ipAddr = "8.8.8.8";
    baseUrl = "http://ip-api.com/json";
    countryData = { "country": "United States" };
  });

  test('Should successfully call API URL', async () => {
    nock(baseUrl)
      .get(`/${ipAddr}?fields=country`)
      .reply(200, countryData);
    const data = await IPAPIConnector.lookupIp(ipAddr);
    expect(data).toEqual(countryData.country);
  });

  test('Should throw HTTPResponseError when API call fails', async () => {
    nock(baseUrl)
      .get(`/${ipAddr}?fields=country`)
      .reply(500);
    try {
      await IPAPIConnector.lookupIp(ipAddr);
    } catch (err) {
      expect(err).toBeInstanceOf(HTTPResponseError);
    }
  });
});