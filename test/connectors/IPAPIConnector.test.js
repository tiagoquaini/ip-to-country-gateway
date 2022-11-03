const { describe, expect, test } = require('@jest/globals');
const IPAPIConnector = require('../../src/connectors/IPAPIConnector');
const fetch = require('node-fetch');
const HTTPResponseError = require('../../src/utils/HTTPResponseError');
const { Response, Headers } = jest.requireActual('node-fetch');

jest.mock('node-fetch');

const headers = new Headers({
  'Content-Type': 'application/json',
  Accept: '*/*'
});

const ResponseSuccess = {
  status: 200,
  statusText: 'success',
  headers: headers
};
const ResponseError = {
  status: 400,
  statusText: 'error',
  headers: headers
};

describe('IPStackConnector', () => {
  let ipAddr, baseUrl, countryData;

  beforeAll(() => {
    ipAddr = "8.8.8.8";
    baseUrl = "http://ip-api.com/json";
    countryData = { data: { "country_name": "United States" } };
  });

  test('Should successfully call API URL', async () => {
    const apiResponse = new Response(JSON.stringify(countryData), ResponseSuccess);
    fetch.mockResolvedValueOnce(Promise.resolve(apiResponse));
    const data = await IPAPIConnector.lookupIp(ipAddr);
    expect(data).toEqual(countryData);
    expect(fetch).toBeCalledWith(`${baseUrl}/${ipAddr}?fields=country`);
  });

  test('Should throw HTTPResponseError when API call fails', async () => {
    const apiResponse = new Response(null, ResponseError);
    fetch.mockResolvedValueOnce(Promise.resolve(apiResponse));
    try {
      await IPAPIConnector.lookupIp(ipAddr);
    } catch (err) {
      expect(fetch).toBeCalledWith(`${baseUrl}/${ipAddr}?fields=country`);
      expect(err).toBeInstanceOf(HTTPResponseError);
    }
  });
});