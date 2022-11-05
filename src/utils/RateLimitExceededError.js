class RateLimitExceededError extends Error {
	constructor(...args) {
		super(`Rate limit exceeded for API services`, ...args);
	}
}

module.exports = RateLimitExceededError;