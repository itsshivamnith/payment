const axios = require('axios');
const crypto = require('crypto');

class WebhookService {
  constructor() {
    this.maxRetries = 3;
    this.timeout = 10000;
  }

  async sendWebhook(url, data, secret = process.env.WEBHOOK_SECRET) {
    const payload = JSON.stringify(data);
    const signature = this.generateSignature(payload, secret);

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'CryptoGateway-Webhook/1.0',
      'X-Webhook-Signature': signature,
      'X-Webhook-Timestamp': Date.now().toString()
    };

    return await this.sendWithRetry(url, payload, headers);
  }

  generateSignature(payload, secret) {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  async sendWithRetry(url, payload, headers) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await axios.post(url, payload, {
          headers,
          timeout: this.timeout
        });

        console.log('Webhook sent successfully', { url, status: response.status });
        return response.data;
      } catch (error) {
        console.error('Webhook send failed', { url, attempt, error: error.message });

        if (attempt === this.maxRetries) {
          throw error;
        }

        await this.sleep(1000 * Math.pow(2, attempt));
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new WebhookService();
