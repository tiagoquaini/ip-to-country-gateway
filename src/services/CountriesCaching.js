class CountriesCaching {
  constructor() {
    this.cache = {};
  }

  getCountryByIp(ip) {
    return this.cache[ip];
  }

  storeCountry(country, ip) {
    if (country && ip) {
      this.cache[ip] = country;
    }
  }
}

const singletonCaching = new CountriesCaching();
Object.freeze(singletonCaching);

module.exports = singletonCaching;
