const cron = require('node-cron');
const priceService = require('../services/priceService');

class PriceUpdater {
  start() {
    console.log('💰 Starting price updater...');
    
    cron.schedule('*/5 * * * *', () => {
      this.updatePrices();
    });

    this.updatePrices();
    console.log('✅ Price updater started');
  }

  async updatePrices() {
    try {
      await priceService.updateAllRates();
    } catch (error) {
      console.error('Error updating prices:', error);
    }
  }
}

module.exports = new PriceUpdater();
