const {Web3} = require('web3');
const axios = require('axios');
const bitcoin = require('bitcoinjs-lib');
const ECPair = require('ecpair');
const ecc = require('tiny-secp256k1');
const EventEmitter = require('events');

const ECPairFactory = ECPair.ECPairFactory(ecc);

class BlockchainService extends EventEmitter {
  constructor() {
    super();
    
    this.web3 = new Web3(process.env.ETH_RPC_URL);
    this.btcNetwork = process.env.BTC_NETWORK === 'mainnet' 
      ? bitcoin.networks.bitcoin 
      : bitcoin.networks.testnet;
    
    this.btcApi = axios.create({
      baseURL: process.env.BITCOIN_RPC_URL,
      timeout: 30000,
      params: { token: process.env.BLOCKCYPHER_TOKEN }
    });
    
    this.stacksApi = axios.create({
      baseURL: process.env.STACKS_API_URL,
      timeout: 30000
    });
    
    this.monitoringIntervals = new Map();
  }

  // Bitcoin operations
  async generateBTCAddress() {
    try {
      const keyPair = ECPairFactory.makeRandom({ network: this.btcNetwork });
      const { address } = bitcoin.payments.p2pkh({ 
        pubkey: keyPair.publicKey, 
        network: this.btcNetwork 
      });
      
      return {
        address,
        privateKey: keyPair.toWIF(),
        publicKey: keyPair.publicKey.toString('hex'),
        network: this.btcNetwork === bitcoin.networks.bitcoin ? 'mainnet' : 'testnet'
      };
    } catch (error) {
      throw new Error(`BTC address generation failed: ${error.message}`);
    }
  }

  async getBTCBalance(address) {
    try {
      const response = await this.btcApi.get(`/addrs/${address}/balance`);
      return {
        confirmed: response.data.balance / 100000000,
        unconfirmed: response.data.unconfirmed_balance / 100000000,
        total: response.data.final_balance / 100000000
      };
    } catch (error) {
      throw new Error(`BTC balance fetch failed: ${error.message}`);
    }
  }

  async getBTCTransactions(address, limit = 10) {
    try {
      const response = await this.btcApi.get(`/addrs/${address}/full?limit=${limit}`);
      return response.data.txs.map(tx => ({
        txid: tx.hash,
        amount: tx.total / 100000000,
        confirmations: tx.confirmations,
        timestamp: new Date(tx.confirmed),
        from: tx.inputs[0]?.addresses?.[0],
        to: tx.outputs[0]?.addresses?.[0]
      }));
    } catch (error) {
      throw new Error(`BTC transactions fetch failed: ${error.message}`);
    }
  }

  // Ethereum operations
  async generateETHAddress() {
    try {
      const account = this.web3.eth.accounts.create();
      return {
        address: account.address,
        privateKey: account.privateKey,
        publicKey: account.address,
        network: process.env.ETH_NETWORK || 'mainnet'
      };
    } catch (error) {
      throw new Error(`ETH address generation failed: ${error.message}`);
    }
  }

  async getETHBalance(address) {
    try {
      const balanceWei = await this.web3.eth.getBalance(address);
      const balanceEth = this.web3.utils.fromWei(balanceWei, 'ether');
      return {
        confirmed: parseFloat(balanceEth),
        unconfirmed: 0,
        total: parseFloat(balanceEth)
      };
    } catch (error) {
      throw new Error(`ETH balance fetch failed: ${error.message}`);
    }
  }

  // Stacks operations
  async generateStacksAddress() {
    try {
      const randomBytes = require('crypto').randomBytes(32);
      const address = `ST${randomBytes.toString('hex').substring(0, 38)}`;
      
      return {
        address,
        privateKey: randomBytes.toString('hex'),
        publicKey: randomBytes.toString('hex'),
        network: process.env.STACKS_NETWORK || 'testnet'
      };
    } catch (error) {
      throw new Error(`Stacks address generation failed: ${error.message}`);
    }
  }

  async getStacksBalance(address) {
    try {
      const response = await this.stacksApi.get(`/extended/v1/address/${address}/balances`);
      const stxBalance = parseFloat(response.data.stx.balance) / 1000000;
      
      return {
        confirmed: stxBalance,
        unconfirmed: 0,
        total: stxBalance
      };
    } catch (error) {
      throw new Error(`Stacks balance fetch failed: ${error.message}`);
    }
  }

  // Generic operations
  async getBalance(currency, address) {
    const handlers = {
      'BTC': () => this.getBTCBalance(address),
      'ETH': () => this.getETHBalance(address),
      'USDT': () => this.getETHBalance(address),
      'STX': () => this.getStacksBalance(address),
      'sBTC': () => this.getStacksBalance(address)
    };

    const handler = handlers[currency.toUpperCase()];
    if (!handler) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    return await handler();
  }

  async generateWallet(currency) {
    const handlers = {
      'BTC': () => this.generateBTCAddress(),
      'ETH': () => this.generateETHAddress(),
      'USDT': () => this.generateETHAddress(),
      'STX': () => this.generateStacksAddress(),
      'sBTC': () => this.generateStacksAddress()
    };

    const handler = handlers[currency.toUpperCase()];
    if (!handler) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    return await handler();
  }

  // Monitoring operations
  startMonitoring(currency, address, paymentId) {
    const monitorKey = `${currency}-${address}`;
    
    if (this.monitoringIntervals.has(monitorKey)) {
      return;
    }

    console.log(`🔍 Starting monitoring for ${currency} address: ${address}`);

    const interval = setInterval(async () => {
      try {
        await this.checkForNewTransactions(currency, address, paymentId);
      } catch (error) {
        console.error(`❌ Monitoring error for ${currency}:${address}:`, error.message);
      }
    }, 30000);

    this.monitoringIntervals.set(monitorKey, interval);

    setTimeout(() => {
      this.stopMonitoring(currency, address);
    }, 24 * 60 * 60 * 1000);
  }

  stopMonitoring(currency, address) {
    const monitorKey = `${currency}-${address}`;
    const interval = this.monitoringIntervals.get(monitorKey);
    
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(monitorKey);
      console.log(`⏹️ Stopped monitoring ${currency} address: ${address}`);
    }
  }

  async checkForNewTransactions(currency, address, paymentId) {
    try {
      const transactions = await this.getTransactions(currency, address, 5);
      
      for (const tx of transactions) {
        if (tx.confirmations > 0 && tx.amount > 0) {
          this.emit('transactionDetected', {
            paymentId,
            currency,
            address,
            transaction: tx
          });
        }
      }
    } catch (error) {
      console.error('Transaction check failed:', error);
    }
  }

  async getTransactions(currency, address, limit = 10) {
    const handlers = {
      'BTC': () => this.getBTCTransactions(address, limit),
      'ETH': () => [],
      'USDT': () => [],
      'STX': () => [],
      'sBTC': () => []
    };

    const handler = handlers[currency.toUpperCase()];
    if (!handler) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    return await handler();
  }
}

module.exports = new BlockchainService();
