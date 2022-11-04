const { describe, expect, test } = require('@jest/globals');
const CountriesCaching = require('../../src/services/CountriesCaching');

describe('CountriesCaching', () => {
  let ipAddr, ipAddr2, countryName, countryName2;

  beforeAll(() => {
    ipAddr = "8.8.8.8";
    ipAddr2 = "8.8.8.9";
    countryName = "United States";
    countryName2 = "Canada";
  });

  test('Should successfully cache a country name', async () => {
    const cachedValueBeforeStore = CountriesCaching.getCountryByIp(ipAddr);
    expect(cachedValueBeforeStore).toBeUndefined();
    CountriesCaching.storeCountry(countryName, ipAddr);
    const cachedValueAfterStore = CountriesCaching.getCountryByIp(ipAddr);
    expect(cachedValueAfterStore).toBe(countryName);
  });

  test('Should prevent changes to cached values', async () => {
    CountriesCaching.storeCountry(countryName2, ipAddr2);
    let cachedValue = CountriesCaching.getCountryByIp(ipAddr2);
    cachedValue = countryName;
    expect(CountriesCaching.getCountryByIp(ipAddr2)).toBe(countryName2);
  });
});