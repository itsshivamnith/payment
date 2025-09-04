'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';


export default function PaymentDashboard() {
  const [payments, setPayments] = useState([]);
  const [copied, setCopied] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, CONFIRMED

  useEffect(() => {
    // Load payments from localStorage
    const loadPayments = () => {
      const stored = JSON.parse(localStorage.getItem('recentPayments') || '[]');
      setPayments(stored);
    };

    loadPayments();
    
    // Refresh payments every 10 seconds
    const interval = setInterval(loadPayments, 10000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const updatePaymentStatus = (paymentId, newStatus) => {
    const updatedPayments = payments.map(payment => 
      payment.id === paymentId ? { ...payment, status: newStatus } : payment
    );
    setPayments(updatedPayments);
    localStorage.setItem('recentPayments', JSON.stringify(updatedPayments));
  };

  const getFilteredPayments = () => {
    if (filter === 'ALL') return payments;
    return payments.filter(payment => payment.status === filter);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'EXPIRED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBlockchainExplorer = (payment) => {
    const explorers = {
      'BTC': `https://blockstream.info/address/${payment.paymentAddress}`,
      'ETH': `https://etherscan.io/address/${payment.paymentAddress}`,
      'USDT': `https://etherscan.io/address/${payment.paymentAddress}`,
      'sBTC': `https://explorer.stacks.co/address/${payment.paymentAddress}`,
      'STX': `https://explorer.stacks.co/address/${payment.paymentAddress}`
    };
    return explorers[payment.currency] || `https://blockchain.info/address/${payment.paymentAddress}`;
  };

  const filteredPayments = getFilteredPayments();
  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'PENDING').length,
    confirmed: payments.filter(p => p.status === 'CONFIRMED').length,
    totalValue: payments.reduce((sum, p) => sum + (p.usdAmount || 0), 0)
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Dashboard</h1>
        <p className="text-gray-600">Track all your cryptocurrency payments in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <span className="text-2xl">💵</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
          <div className="flex space-x-2">
            {['ALL', 'PENDING', 'CONFIRMED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">Create your first payment request to see it here.</p>
          </div>
        ) : (
          filteredPayments.map((payment) => {
            const currency = SUPPORTED_CURRENCIES[payment.currency] || { 
              name: payment.currency, 
              color: '#6B7280',
              icon: '🪙'
            };
            
            return (
              <div key={payment.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{currency.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {payment.amount} {payment.currency}
                        </h3>
                        <p className="text-sm text-gray-500">≈ ${payment.usdAmount?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      payment.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Payment ID</p>
                    <p className="text-sm font-mono text-gray-600">{payment.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Memo</p>
                    <p className="text-sm text-gray-600">{payment.memo}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Wallet Type</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {payment.currency === 'ETH' || payment.currency === 'USDT' ? 'MetaMask' :
                       payment.currency === 'sBTC' || payment.currency === 'STX' ? 'Leather Wallet' :
                       'QR Code Only'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Payment Address</p>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-mono flex-1 break-all">{payment.paymentAddress}</span>
                    <button
                      onClick={() => copyToClipboard(payment.paymentAddress, payment.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {copied === payment.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-3">
                    {payment.status === 'PENDING' && (
                      <button
                        onClick={() => updatePaymentStatus(payment.id, 'CONFIRMED')}
                        className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Mark as Confirmed
                      </button>
                    )}
                  </div>
                  
                  <a 
                    href={getBlockchainExplorer(payment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View on Explorer</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
