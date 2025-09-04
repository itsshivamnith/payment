'use client';
import { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import CurrencySelector from './CurrencySelector';
import { SUPPORTED_CURRENCIES, WALLET_ADDRESSES, USD_RATES } from '../constants/currencies';

export default function PaymentForm({ onSuccess }) {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'BTC',
    memo: '',
    description: '',
    webhookUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Generate proper QR codes for each currency
  const generateQRData = (currency, address, amount, memo) => {
    switch (currency) {
      case 'BTC':
        return `bitcoin:${address}?amount=${amount}&label=${encodeURIComponent(memo)}`;
      case 'ETH':
        const weiAmount = (parseFloat(amount) * Math.pow(10, 18)).toString();
        return `ethereum:${address}@1?value=${weiAmount}`;
      case 'USDT':
        return `ethereum:${address}@1?contractAddress=0xdAC17F958D2ee523a2206206994597C13D831ec7&uint256=${(parseFloat(amount) * Math.pow(10, 6)).toString()}`;
      case 'sBTC':
        return `stacks:${address}?amount=${amount}&memo=${encodeURIComponent(memo)}&asset=sbtc`;
      case 'STX':
        return `stacks:${address}?amount=${amount}&memo=${encodeURIComponent(memo)}`;
      default:
        return `${currency.toLowerCase()}:${address}?amount=${amount}&label=${encodeURIComponent(memo)}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoaded || !isSignedIn) {
      setErrors({ submit: 'Please sign in to create payments' });
      return;
    }
    
    if (!formData.amount || !formData.memo) {
      setErrors({ 
        amount: !formData.amount ? 'Amount is required' : '',
        memo: !formData.memo ? 'Memo is required' : ''
      });
      return;
    }

    setLoading(true);
    
    try {
      // ✅ Use real wallet address for the selected currency
      const paymentAddress = WALLET_ADDRESSES[formData.currency];
      
      if (!paymentAddress) {
        throw new Error(`Wallet address not configured for ${formData.currency}`);
      }

      const usdAmount = parseFloat(formData.amount) * USD_RATES[formData.currency];
      
      // Create payment with REAL data
      const payment = {
        id: 'pay_' + Date.now() + Math.random().toString(36).substring(2, 9),
        amount: formData.amount,
        currency: formData.currency,
        memo: formData.memo,
        description: formData.description,
        status: 'PENDING',
        paymentAddress: paymentAddress,
        usdAmount: usdAmount,
        webhookUrl: formData.webhookUrl,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        qrData: generateQRData(formData.currency, paymentAddress, formData.amount, formData.memo),
        walletType: SUPPORTED_CURRENCIES[formData.currency].walletType
      };

      console.log('✅ Payment created:', payment);
      
      // ✅ Store payment in localStorage for dashboard
      const existingPayments = JSON.parse(localStorage.getItem('recentPayments') || '[]');
      existingPayments.unshift(payment);
      localStorage.setItem('recentPayments', JSON.stringify(existingPayments.slice(0, 50))); // Keep last 50
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess(payment);
      
      // Clear form
      setFormData({
        amount: '',
        currency: 'BTC',
        memo: '',
        description: '',
        webhookUrl: ''
      });

    } catch (error) {
      console.error('Payment creation error:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Loading and auth states
  if (!isLoaded) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border p-6 max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6">Please sign in to create payment requests</p>
        <a href="/sign-in" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Payment Request
        </h2>
        <p className="text-gray-600">
          Accept payments in Bitcoin, Ethereum, USDT, sBTC, and STX
        </p>
        <div className="mt-2 text-sm bg-green-50 text-green-700 p-3 rounded-lg">
          ✅ Real wallet addresses with automatic wallet detection
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <input
              name="amount"
              type="number"
              step="0.00000001"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.001"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency *
            </label>
            <CurrencySelector
              value={formData.currency}
              onChange={(currency) => setFormData(prev => ({ ...prev, currency }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Memo *
          </label>
          <input
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Payment for services..."
            maxLength={100}
          />
          {errors.memo && <p className="text-red-500 text-sm mt-1">{errors.memo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            placeholder="Additional details..."
            maxLength={250}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL (Optional)
          </label>
          <input
            name="webhookUrl"
            type="url"
            value={formData.webhookUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://yoursite.com/webhook"
          />
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isLoaded || !isSignedIn}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Payment Request...
            </>
          ) : (
            'Create Payment Request'
          )}
        </button>
      </form>
    </div>
  );
}
