module.exports = {
  CURRENCIES: {
    BTC: 'Bitcoin',
    ETH: 'Ethereum', 
    USDT: 'Tether USD',
    STX: 'Stacks',
    sBTC: 'Stacks Bitcoin'
  },

  PAYMENT_STATUS: {
    PENDING: 'PENDING',
    PARTIAL: 'PARTIAL',
    CONFIRMED: 'CONFIRMED',
    EXPIRED: 'EXPIRED',
    FAILED: 'FAILED'
  },

  TRANSACTION_STATUS: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    FAILED: 'FAILED'
  },

  DEFAULTS: {
    PAYMENT_EXPIRY: 3600,
    MONITORING_INTERVAL: 30000,
    PRICE_UPDATE_INTERVAL: 300000,
    PAGINATION_LIMIT: 50
  },

  WEBHOOK_EVENTS: {
    PAYMENT_CREATED: 'payment.created',
    PAYMENT_CONFIRMED: 'payment.confirmed',
    PAYMENT_EXPIRED: 'payment.expired',
    PAYMENT_FAILED: 'payment.failed'
  }
};
