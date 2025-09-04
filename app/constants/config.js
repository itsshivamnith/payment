export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  timeout: 30000
};

export const SUPPORTED_CURRENCIES = {
  BTC: { name: 'Bitcoin', symbol: '₿', color: '#f7931a' },
  ETH: { name: 'Ethereum', symbol: 'Ξ', color: '#627eea' },
  USDT: { name: 'Tether USD', symbol: '₮', color: '#26a17b' },
  sBTC: { name: 'Stacks Bitcoin', symbol: '₿', color: '#5546ff' },
  STX: { name: 'Stacks', symbol: 'STX', color: '#5546ff' }
};


export const APP_CONFIG = {
  name: 'sBTC Payment Gateway',
  description: 'Accept Bitcoin payments via sBTC with ease'
};
