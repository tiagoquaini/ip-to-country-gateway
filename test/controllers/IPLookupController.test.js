const { describe, expect, test } = require('@jest/globals');
const IPLookupController = require('../../src/controllers/IPLookupController');
const COUNTRY_NAME = "United States";
const IP_ADDR = "8.8.8.8";

jest.mock('../../src/services/IPLookupService', () => {
  return {
    getCountryByIp: jest.fn(() => Promise.resolve(COUNTRY_NAME))
  }
});
const mockIpLookupService = require('../../src/services/IPLookupService');
const HTTPResponseError = require('../../src/utils/HTTPResponseError');
const RateLimitExceededError = require('../../src/utils/RateLimitExceededError');

jest.mock('../../src/utils/Validator', () => {
  return {
    isValidIpAddress: jest.fn(() => true)
  }
});
const mockValidator = require('../../src/utils/Validator');

describe('IPLookupController', () => {
  let req, res, statusStub, sendStub;

  beforeEach(() => {
    sendStub = jest.fn();
    statusStub = jest.fn(() => {
      return { send: sendStub };
    });
    req = {
      params: {
        ip: IP_ADDR
      }
    };
    res = {
      status: statusStub
    };
  });

  afterEach(() => {
    mockIpLookupService.getCountryByIp.mockClear();
    mockValidator.isValidIpAddress.mockClear();
    sendStub.mockClear();
    statusStub.mockClear();
  });

  test('Should respond HTTP 200 with country name when successfull request', async () => {
    await IPLookupController.getCountryByIp(req, res);
    expect(mockValidator.isValidIpAddress.mock.calls.length).toBe(1);
    expect(mockIpLookupService.getCountryByIp.mock.calls.length).toBe(1);
    expect(statusStub.mock.calls[0][0]).toBe(200);
    expect(sendStub.mock.calls[0][0]).toBe(COUNTRY_NAME);
  });

  test('Should respond HTTP 400 when IP address is invalid', async () => {
    mockValidator.isValidIpAddress.mockImplementationOnce(() => false);
    await IPLookupController.getCountryByIp(req, res);
    expect(mockValidator.isValidIpAddress.mock.calls.length).toBe(1);
    expect(mockIpLookupService.getCountryByIp.mock.calls.length).toBe(0);
    expect(statusStub.mock.calls[0][0]).toBe(400);
    expect(sendStub.mock.calls[0][0]).toBe("Invalid IP address");
  });

  test('Should respond HTTP 404 when IP is not found', async () => {
    mockIpLookupService.getCountryByIp.mockImplementationOnce(() => undefined);
    await IPLookupController.getCountryByIp(req, res);
    expect(mockValidator.isValidIpAddress.mock.calls.length).toBe(1);
    expect(mockIpLookupService.getCountryByIp.mock.calls.length).toBe(1);
    expect(statusStub.mock.calls[0][0]).toBe(404);
    expect(sendStub.mock.calls[0][0]).toBe("IP address not found");
  });

  test('Should respond HTTP 400 when a service error happens on the API', async () => {
    mockIpLookupService.getCountryByIp.mockImplementationOnce(() => {
      throw new HTTPResponseError({ status: 400, statusText: "Generic error message from API" });
    });
    await IPLookupController.getCountryByIp(req, res);
    expect(mockValidator.isValidIpAddress.mock.calls.length).toBe(1);
    expect(mockIpLookupService.getCountryByIp.mock.calls.length).toBe(1);
    expect(statusStub.mock.calls[0][0]).toBe(400);
    expect(sendStub.mock.calls[0][0]).toBe("Bad request: 'HTTP Error Response: 400 Generic error message from API'");
  });

  test('Should respond HTTP 429 when the API rate limits are exceeded', async () => {
    mockIpLookupService.getCountryByIp.mockImplementationOnce(() => {
      throw new RateLimitExceededError();
    });
    await IPLookupController.getCountryByIp(req, res);
    expect(mockValidator.isValidIpAddress.mock.calls.length).toBe(1);
    expect(mockIpLookupService.getCountryByIp.mock.calls.length).toBe(1);
    expect(statusStub.mock.calls[0][0]).toBe(429);
    expect(sendStub.mock.calls[0][0]).toBe("Rate limits exceeded");
  });

  test('Should respond HTTP 500 when any other error happens on the API', async () => {
    mockIpLookupService.getCountryByIp.mockImplementationOnce(() => {
      throw new Error("This is an internal error and should not be sent to the end user");
    });
    await IPLookupController.getCountryByIp(req, res);
    expect(mockValidator.isValidIpAddress.mock.calls.length).toBe(1);
    expect(mockIpLookupService.getCountryByIp.mock.calls.length).toBe(1);
    expect(statusStub.mock.calls[0][0]).toBe(500);
    expect(sendStub.mock.calls[0][0]).toBe("Internal server error");
  });
});