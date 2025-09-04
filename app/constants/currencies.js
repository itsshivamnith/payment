export const SUPPORTED_CURRENCIES = {
  BTC: { 
    name: 'Bitcoin', 
    symbol: '₿', 
    color: '#f7931a', 
    icon: '🟠',
    walletType: 'qr' // Only QR code support
  },
  ETH: { 
    name: 'Ethereum', 
    symbol: 'Ξ', 
    color: '#627eea', 
    icon: '🔵',
    walletType: 'metamask' // MetaMask wallet
  },
  USDT: { 
    name: 'Tether USD', 
    symbol: '₮', 
    color: '#26a17b', 
    icon: '🟢',
    walletType: 'metamask' // MetaMask wallet (ERC-20)
  },
  sBTC: { 
    name: 'Stacks Bitcoin', 
    symbol: '₿', 
    color: '#5546ff', 
    icon: '🔵',
    walletType: 'stacks' // Stacks/Leather wallet
  },
  STX: { 
    name: 'STX Stacks', 
    symbol: 'STX', 
    color: '#5546ff', 
    icon: '🔵',
    walletType: 'stacks' // Stacks/Leather wallet
  }
};

// Real wallet addresses - REPLACE WITH YOUR OWN
export const WALLET_ADDRESSES = {
  BTC: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',    // Your Bitcoin address
  ETH: '0x6348D6B5a31C3B7994e8d68Af3726cfAaE6feAc0',     // Your Ethereum address
  USDT: '0x742d35Cc6634C0532925a3b8D4C2f3f98C18f1C4',   // Same as ETH (USDT is ERC-20)
  sBTC: 'SP3J5FVXB44H8P32VYJ6G7CMJDE0PAEZG8JY5SKN0',   // Your Stacks address
  STX: 'SP2ZEMC4SKBGY6R5RET1DKAMG2NPRCKBJABDPAJA0'     // Your Stacks address
};

// USD conversion rates (integrate with live API later)
export const USD_RATES = {
  BTC: 45000,
  ETH: 2500,
  USDT: 1,
  sBTC: 45000,
  STX: 0.50
};
