'use client';
import { useState } from 'react';
import PaymentForm from '../components/PaymentForm';
import PaymentWidget from '../components/PaymentWidget';
import Link from 'next/link';

export default function CreatePaymentPage() {
  const [currentPayment, setCurrentPayment] = useState(null);

  const handlePaymentSuccess = (payment) => {
    setCurrentPayment(payment);
  };

  const handlePaymentUpdate = (updatedPayment) => {
    setCurrentPayment(updatedPayment);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Multi-Crypto Payment Gateway</h1>
            <p className="text-gray-600">Accept payments in Bitcoin, Ethereum, USDT, sBTC, and STX</p>
          </div>
          
          <Link 
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            View Dashboard
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Form */}
          <div>
            <PaymentForm onSuccess={handlePaymentSuccess} />
          </div>

          {/* Payment Widget (shows after creation) */}
          <div>
            {currentPayment ? (
              <PaymentWidget 
                payment={currentPayment} 
                onPaymentUpdate={handlePaymentUpdate}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border p-12 text-center">
                <div className="text-6xl mb-4">🪙</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Payment Request</h3>
                <p className="text-gray-600">
                  Fill out the form to generate a QR code and payment options for your customers.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-4xl mb-4">🦊</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">MetaMask Integration</h3>
            <p className="text-gray-600 text-sm">
              Direct payments for ETH and USDT through MetaMask wallet
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-4xl mb-4">🪙</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Stacks Wallet Support</h3>
            <p className="text-gray-600 text-sm">
              Native sBTC and STX payments through Leather wallet
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Universal QR Codes</h3>
            <p className="text-gray-600 text-sm">
              Works with 100+ cryptocurrency wallets worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
