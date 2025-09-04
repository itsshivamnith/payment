const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const blockchainService = require('../services/blockchainService');

const prisma = new PrismaClient();

class PaymentMonitor {
  start() {
    console.log('🔄 Starting payment monitor...');
    
    cron.schedule('*/5 * * * *', () => {
      this.checkExpiredPayments();
    });

    cron.schedule('* * * * *', () => {
      this.monitorPendingPayments();
    });

    console.log('✅ Payment monitor started');
  }

  async checkExpiredPayments() {
    try {
      const expiredPayments = await prisma.payment.findMany({
        where: {
          status: 'PENDING',
          expiresAt: {
            lt: new Date()
          }
        }
      });

      for (const payment of expiredPayments) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'EXPIRED' }
        });

        blockchainService.stopMonitoring(payment.currency, payment.paymentAddress);
        console.log(`⏰ Payment ${payment.id} expired`);
      }

    } catch (error) {
      console.error('Error checking expired payments:', error);
    }
  }

  async monitorPendingPayments() {
    try {
      const pendingPayments = await prisma.payment.findMany({
        where: {
          status: 'PENDING',
          expiresAt: {
            gt: new Date()
          }
        },
        include: { wallet: true }
      });

      for (const payment of pendingPayments) {
        blockchainService.startMonitoring(
          payment.currency, 
          payment.paymentAddress, 
          payment.id
        );
      }

    } catch (error) {
      console.error('Error monitoring pending payments:', error);
    }
  }
}

module.exports = new PaymentMonitor();
