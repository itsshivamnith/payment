const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PriceService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    this.coingeckoApi = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
      timeout: 10000
    });
  }

  async getRate(currency) {
    const cacheKey = `rate-${currency.toLowerCase()}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.rate;
      }
    }

    try {
      const dbRate = await prisma.currencyRate.findUnique({
        where: { currency: currency.toUpperCase() }
      });

      if (dbRate && (Date.now() - dbRate.updatedAt.getTime()) < this.cacheTimeout) {
        const rate = parseFloat(dbRate.usdRate);
        this.cache.set(cacheKey, { rate, timestamp: Date.now() });
        return rate;
      }

      const rate = await this.fetchRateFromAPI(currency);
      
      await prisma.currencyRate.upsert({
        where: { currency: currency.toUpperCase() },
        update: { usdRate: rate },
        create: { currency: currency.toUpperCase(), usdRate: rate }
      });

      this.cache.set(cacheKey, { rate, timestamp: Date.now() });
      return rate;

    } catch (error) {
      console.error(`Failed to get rate for ${currency}:`, error.message);
      return 1;
    }
  }

  async fetchRateFromAPI(currency) {
    const coinMap = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDT': 'tether',
      'STX': 'stacks',
      'sBTC': 'bitcoin'
    };

    const coinId = coinMap[currency.toUpperCase()];
    if (!coinId) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const response = await this.coingeckoApi.get('/simple/price', {
      params: {
        ids: coinId,
        vs_currencies: 'usd'
      }
    });

    return response.data[coinId]?.usd || 1;
  }

  async updateAllRates() {
    const currencies = ['BTC', 'ETH', 'USDT', 'STX'];
    
    for (const currency of currencies) {
      try {
        await this.getRate(currency);
        console.log(`✅ Updated rate for ${currency}`);
      } catch (error) {
        console.error(`❌ Failed to update rate for ${currency}:`, error.message);
      }
    }
  }
}

module.exports = new PriceService();
