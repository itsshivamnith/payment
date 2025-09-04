require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  encryption: {
    algorithm: 'aes-256-cbc',
    key: process.env.ENCRYPTION_KEY || 'your-encryption-key-must-be-32-chars-long'
  },
  
  blockchain: {
    bitcoin: {
      network: process.env.BTC_NETWORK || 'testnet',
      apiKey: process.env.BLOCKCYPHER_TOKEN,
    },
    ethereum: {
      network: process.env.ETH_NETWORK || 'sepolia',
      rpcUrl: process.env.ETH_RPC_URL,
      alchemyKey: process.env.ALCHEMY_API_KEY,
    },
    stacks: {
      network: process.env.STACKS_NETWORK || 'testnet',
      apiUrl: process.env.STACKS_API_URL || 'https://api.testnet.hiro.so',
    }
  },
  
  external: {
    coingeckoApiUrl: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
    webhookSecret: process.env.WEBHOOK_SECRET || 'webhook-secret-key'
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
};
