const { PrismaClient } = require('@prisma/client');
const QRCode = require('qrcode');
const blockchainService = require('./blockchainService');
const priceService = require('./priceService');
const webhookService = require('./webhookService');
const helpers = require('../utils/helpers');
const constants = require('../utils/constants');
const encryption = require('../utils/encryption');

const prisma = new PrismaClient();

class PaymentService {
  constructor() {
    blockchainService.on('transactionDetected', this.handleTransactionDetected.bind(this));
  }

  async createPayment(userId, paymentData) {
    const { 
      amount, 
      currency, 
      memo, 
      description, 
      expiresIn = constants.DEFAULTS.PAYMENT_EXPIRY,
      webhookUrl 
    } = paymentData;

    try {
      if (!constants.CURRENCIES[currency.toUpperCase()]) {
        throw new Error(`Unsupported currency: ${currency}`);
      }

      let wallet = await this.getOrCreateWallet(userId, currency);
      const usdRate = await priceService.getRate(currency);
      const usdAmount = parseFloat(amount) * usdRate;

      const payment = await prisma.payment.create({
        data: {
          userId,
          walletId: wallet.id,
          amount: parseFloat(amount),
          currency: currency.toUpperCase(),
          usdAmount,
          memo: memo || `Payment for ${amount} ${currency}`,
          description,
          paymentAddress: wallet.address,
          webhookUrl,
          expiresAt: helpers.addMinutes(new Date(), Math.floor(expiresIn / 60)),
          status: 'PENDING'
        }
      });

      const qrCodeUrl = await this.generateQRCode(payment);

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: { qrCodeUrl }
      });

      blockchainService.startMonitoring(currency, wallet.address, payment.id);

      return {
        ...updatedPayment,
        wallet: {
          address: wallet.address,
          currency: wallet.currency
        }
      };

    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  async getOrCreateWallet(userId, currency) {
    let wallet = await prisma.wallet.findFirst({
      where: {
        userId,
        currency: currency.toUpperCase(),
        isActive: true
      }
    });

    if (!wallet) {
      const walletData = await blockchainService.generateWallet(currency);
      
      wallet = await prisma.wallet.create({
        data: {
          userId,
          currency: currency.toUpperCase(),
          address: walletData.address,
          privateKey: walletData.privateKey ? encryption.encrypt(walletData.privateKey) : null,
          publicKey: walletData.publicKey,
          balance: 0
        }
      });
    }

    return wallet;
  }

  async generateQRCode(payment) {
    try {
      const paymentURI = helpers.generatePaymentURI(
        payment.currency,
        payment.paymentAddress,
        payment.amount.toString(),
        payment.memo
      );

      return await helpers.generateQRCode(paymentURI);
    } catch (error) {
      throw new Error(`QR code generation failed: ${error.message}`);
    }
  }

  async handleTransactionDetected(event) {
    const { paymentId, currency, address, transaction } = event;
    
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { wallet: true }
      });

      if (!payment || payment.status !== 'PENDING') {
        return;
      }

      await prisma.transaction.upsert({
        where: { txHash: transaction.txid },
        update: {
          confirmations: transaction.confirmations,
          status: transaction.confirmations >= 1 ? 'CONFIRMED' : 'PENDING'
        },
        create: {
          userId: payment.userId,
          paymentId: payment.id,
          walletId: payment.walletId,
          txHash: transaction.txid,
          fromAddress: transaction.from || 'unknown',
          toAddress: payment.paymentAddress,
          amount: transaction.amount,
          currency: payment.currency,
          confirmations: transaction.confirmations,
          status: transaction.confirmations >= 1 ? 'CONFIRMED' : 'PENDING',
          type: 'INCOMING'
        }
      });

      const amountMatches = Math.abs(transaction.amount - parseFloat(payment.amount)) < 0.00000001;
      
      if (amountMatches && transaction.confirmations >= 1) {
        await this.confirmPayment(payment, transaction);
      }

    } catch (error) {
      console.error('Error handling transaction:', error);
    }
  }

  async confirmPayment(payment, transaction) {
    const confirmedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date()
      }
    });

    blockchainService.stopMonitoring(payment.currency, payment.paymentAddress);

    if (payment.webhookUrl) {
      await webhookService.sendWebhook(payment.webhookUrl, {
        event: 'payment.confirmed',
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: 'CONFIRMED',
          confirmedAt: new Date()
        },
        transaction: {
          txHash: transaction.txid,
          amount: transaction.amount,
          confirmations: transaction.confirmations
        }
      });
    }

    console.log(`✅ Payment ${payment.id} confirmed!`);
  }

  async getPayments(userId, options = {}) {
    const { limit = 50, offset = 0, status, currency } = options;
    
    const where = { userId };
    if (status) where.status = status;
    if (currency) where.currency = currency.toUpperCase();

    return await prisma.payment.findMany({
      where,
      include: {
        wallet: {
          select: {
            address: true,
            currency: true
          }
        },
        transactions: {
          where: { status: 'CONFIRMED' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
  }

  async getPaymentById(paymentId, userId) {
    return await prisma.payment.findFirst({
      where: { id: paymentId, userId },
      include: {
        wallet: true,
        transactions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async getPaymentStats(userId) {
    const payments = await prisma.payment.findMany({
      where: { userId }
    });

    const stats = {
      total: payments.length,
      confirmed: payments.filter(p => p.status === 'CONFIRMED').length,
      pending: payments.filter(p => p.status === 'PENDING').length,
      failed: payments.filter(p => p.status === 'FAILED').length,
      totalAmount: payments
        .filter(p => p.status === 'CONFIRMED')
        .reduce((sum, p) => sum + parseFloat(p.usdAmount || 0), 0)
    };

    return stats;
  }
}

module.exports = new PaymentService();
