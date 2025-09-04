module.exports = {
  networks: {
    bitcoin: {
      mainnet: {
        name: 'mainnet',
        apiUrl: 'https://api.blockcypher.com/v1/btc/main',
        confirmationsRequired: 3
      },
      testnet: {
        name: 'testnet',
        apiUrl: 'https://api.blockcypher.com/v1/btc/test3',
        confirmationsRequired: 1
      }
    },
    ethereum: {
      mainnet: {
        name: 'mainnet',
        chainId: 1,
        rpcUrl: process.env.ETH_RPC_URL,
        confirmationsRequired: 12
      },
      sepolia: {
        name: 'sepolia',
        chainId: 11155111,
        rpcUrl: process.env.ETH_SEPOLIA_RPC_URL,
        confirmationsRequired: 3
      }
    },
    stacks: {
      mainnet: {
        name: 'mainnet',
        apiUrl: 'https://api.hiro.so',
        confirmationsRequired: 1
      },
      testnet: {
        name: 'testnet',
        apiUrl: 'https://api.testnet.hiro.so',
        confirmationsRequired: 1
      }
    }
  },
  supportedCurrencies: ['BTC', 'ETH', 'USDT', 'STX', 'sBTC'],
  contractAddresses: {
    mainnet: {
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    },
    sepolia: {
      USDT: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
    }
  }
};
