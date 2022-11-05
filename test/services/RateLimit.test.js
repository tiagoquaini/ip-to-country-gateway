const { describe, expect, test } = require('@jest/globals');
const RateLimit = require('../../src/services/RateLimit');

describe('RateLimit', () => {
  test('Should allow requests until rate limit is reached', async () => {
    process.env.IP_STACK_RATE_LIMIT = 3;
    process.env.IP_API_RATE_LIMIT = 3;
    const service = "IP_STACK";
    const service2 = "IP_API";
    expect(RateLimit.hasReachedLimit(service)).toBeFalsy();
    RateLimit.logCall(service);
    expect(RateLimit.hasReachedLimit(service)).toBeFalsy();
    RateLimit.logCall(service);
    expect(RateLimit.hasReachedLimit(service)).toBeFalsy();
    RateLimit.logCall(service);
    expect(RateLimit.hasReachedLimit(service)).toBeTruthy();
    expect(RateLimit.hasReachedLimit(service2)).toBeFalsy();
  });

  test('Should reject limit validation when service is unknown', async () => {
    const service = "UNKNOWN";
    expect(RateLimit.hasReachedLimit(service)).toBeFalsy();
  });
});