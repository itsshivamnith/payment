const QRCode = require('qrcode');

class Helpers {
  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  generatePaymentURI(currency, address, amount, memo = '') {
    const uriMap = {
      'BTC': `bitcoin:${address}?amount=${amount}&label=${encodeURIComponent(memo)}`,
      'ETH': `ethereum:${address}?value=${amount}`,
      'USDT': `ethereum:${address}?value=${amount}`,
      'STX': `stacks:${address}?amount=${amount}&memo=${encodeURIComponent(memo)}`,
      'sBTC': `bitcoin:${address}?amount=${amount}&label=${encodeURIComponent(memo)}`
    };

    return uriMap[currency.toUpperCase()] || `${currency.toLowerCase()}:${address}?amount=${amount}`;
  }

  async generateQRCode(data, options = {}) {
    const defaultOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      ...options
    };

    return await QRCode.toDataURL(data, defaultOptions);
  }

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    };

    console.log(JSON.stringify(logEntry, null, 2));
  }
}

module.exports = new Helpers();
