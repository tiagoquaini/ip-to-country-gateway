const net = require('net');

function isValidIpAddress(ipAddr) {
  return net.isIP(ipAddr) !== 0;
}

module.exports = {
  isValidIpAddress
};