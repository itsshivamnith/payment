const express = require('express');
const crypto = require('crypto');
const blockchainService = require('../services/blockchainService');

const router = express.Router();

// BlockCypher webhook for Bitcoin
router.post('/blockcypher', async (req, res) => {
  try {
    const { hash, addresses, total, confirmations } = req.body;
    
    if (confirmations > 0) {
      for (const address of addresses) {
        blockchainService.emit('transactionDetected', {
          currency: 'BTC',
          address,
          transaction: {
            txid: hash,
            amount: total / 100000000,
            confirmations,
            timestamp: new Date()
          }
        });
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('BlockCypher webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Test webhook endpoint
router.post('/test', (req, res) => {
  console.log('Test webhook received:', req.body);
  res.json({ status: 'received', timestamp: new Date() });
});

module.exports = router;
