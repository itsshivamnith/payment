const crypto = require('crypto');

class Encryption {
  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
  }

  encrypt(text) {
    if (!text) return null;
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText) {
    if (!encryptedText) return null;
    
    const [ivHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !encrypted) return null;
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher(this.algorithm, this.key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  generateApiKey() {
    const timestamp = Date.now().toString();
    const randomPart = crypto.randomBytes(16).toString('hex');
    return `gw_${timestamp}_${randomPart}`;
  }
}

module.exports = new Encryption();
