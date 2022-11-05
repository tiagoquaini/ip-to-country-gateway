const { describe, expect, test } = require('@jest/globals');
const IPLookupService = require('../../src/services/IPLookupService');
const RateLimitExceededError = require('../../src/utils/RateLimitExceededError');
const COUNTRY_NAME = "United States";
const IP_ADDR = "8.8.8.8";

jest.mock('../../src/connectors/IPAPIConnector', () => {
  return {
    lookupIp: jest.fn(() => COUNTRY_NAME)
  }
});
const mockIpApiConnector = require('../../src/connectors/IPAPIConnector');

jest.mock('../../src/connectors/IPStackConnector', () => {
  return {
    lookupIp: jest.fn(() => COUNTRY_NAME)
  }
});
const mockIpStackConnector = require('../../src/connectors/IPStackConnector');

jest.mock('../../src/services/RateLimit', () => {
  return {
    hasReachedLimit: jest.fn(() => false),
    logCall: jest.fn(() => Promise.resolve())
  }
});
const mockRateLimit = require('../../src/services/RateLimit');

jest.mock('../../src/services/CountriesCaching', () => {
  return {
    getCountryByIp: jest.fn(() => null),
    storeCountry: jest.fn(() => Promise.resolve())
  }
});
const mockCountriesCaching = require('../../src/services/CountriesCaching');


describe('IPLookupService', () => {
  afterEach(() => {
    mockCountriesCaching.getCountryByIp.mockClear();
    mockRateLimit.hasReachedLimit.mockClear();
    mockIpStackConnector.lookupIp.mockClear();
    mockIpApiConnector.lookupIp.mockClear();
  });

  test('Should default to cached values and not affect rate limits', async () => {
    mockCountriesCaching.getCountryByIp.mockImplementationOnce(() => COUNTRY_NAME);
    const response = await IPLookupService.getCountryByIp(IP_ADDR);
    expect(mockCountriesCaching.getCountryByIp.mock.calls.length).toBe(1);
    expect(mockRateLimit.hasReachedLimit.mock.calls.length).toBe(0);
    expect(mockIpStackConnector.lookupIp.mock.calls.length).toBe(0);
    expect(mockIpApiConnector.lookupIp.mock.calls.length).toBe(0);
    expect(response).toEqual(COUNTRY_NAME);
  });

  test('Should query in IP_STACK when value is not cached', async () => {
    const response = await IPLookupService.getCountryByIp(IP_ADDR);
    expect(mockCountriesCaching.getCountryByIp.mock.calls.length).toBe(1);
    expect(mockRateLimit.hasReachedLimit.mock.calls.length).toBe(1);
    expect(mockIpStackConnector.lookupIp.mock.calls.length).toBe(1);
    expect(mockIpApiConnector.lookupIp.mock.calls.length).toBe(0);
    expect(response).toEqual(COUNTRY_NAME);
  });

  test('Should query in IP_API when value is not cached and IP_STACK reached rate limit', async () => {
    mockRateLimit.hasReachedLimit.mockImplementationOnce(() => true);
    const response = await IPLookupService.getCountryByIp(IP_ADDR);
    expect(mockCountriesCaching.getCountryByIp.mock.calls.length).toBe(1);
    expect(mockRateLimit.hasReachedLimit.mock.calls.length).toBe(2);
    expect(mockIpStackConnector.lookupIp.mock.calls.length).toBe(0);
    expect(mockIpApiConnector.lookupIp.mock.calls.length).toBe(1);
    expect(response).toEqual(COUNTRY_NAME);
  });

  test('Should throw aquery in IP_API when value is not cached and IP_STACK reached rate limit', async () => {
    // block both services
    mockRateLimit.hasReachedLimit.mockImplementationOnce(() => true);
    mockRateLimit.hasReachedLimit.mockImplementationOnce(() => true);

    await expect(
      IPLookupService.getCountryByIp(IP_ADDR)
    ).rejects.toThrow(new RateLimitExceededError());
    expect(mockCountriesCaching.getCountryByIp.mock.calls.length).toBe(1);
    expect(mockIpStackConnector.lookupIp.mock.calls.length).toBe(0);
    expect(mockIpApiConnector.lookupIp.mock.calls.length).toBe(0);
  });
});