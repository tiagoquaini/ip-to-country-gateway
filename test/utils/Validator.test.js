const { describe, expect, test } = require('@jest/globals');
const Validator = require('../../src/utils/Validator');

describe('Validator', () => {
  test('Should allow valid IP addresses', async () => {
    expect(Validator.isValidIpAddress("8.8.8.8")).toBeTruthy();
    expect(Validator.isValidIpAddress("192.168.0.1")).toBeTruthy();
    expect(Validator.isValidIpAddress("127.0.0.1")).toBeTruthy();
    expect(Validator.isValidIpAddress("::1")).toBeTruthy();
  });

  test('Should reject invalid IP addresses', async () => {
    expect(Validator.isValidIpAddress("255")).toBeFalsy();
    expect(Validator.isValidIpAddress("190.212")).toBeFalsy();
    expect(Validator.isValidIpAddress("a.b.c.d")).toBeFalsy();
    expect(Validator.isValidIpAddress("190.168.0.z")).toBeFalsy();
    expect(Validator.isValidIpAddress("190.2122.0.1")).toBeFalsy();
    expect(Validator.isValidIpAddress(null)).toBeFalsy();
    expect(Validator.isValidIpAddress("askjfhasd")).toBeFalsy();
  });
});