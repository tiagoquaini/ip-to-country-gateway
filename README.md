# IP-to-Country Gateway
Small module which receives an IP address, connects to different external API vendors and responds with the country name associated with the received IP address.

## Setup
1. Open the [`.env`](.env) configuration file and update the `IPSTACK_API_KEY` environment variable to your API key received from [IP Stack](https://ipstack.com/product)
2. Run `npm i` to install the required NPM dependencies.

## Usage
Start the application using:
```sh
npm start
```

The application exposes a `GET` endpoint, where the IP address is a part of the URL as:

**HTTP GET** localhost:3000/api/v1/lookup/**:ip**/country

### Rate Limit
The application relies on two different environment variables to manage the rate limits for the external services used. These variables can be configured as:

```sh
IP_STACK_RATE_LIMIT=3
IP_API_RATE_LIMIT=5
```

Where the above configuration would allow a maximum of 3 requests to the IP Stack service, and a maximum of 5 requests to the IP API service. 

## Tests
The application's unit tests can be executed using `npm test`
