'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';

export default function CurrencySelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const currencies = Object.entries(SUPPORTED_CURRENCIES).map(([id, currency]) => ({
    id,
    ...currency
  }));

  const selectedCurrency = currencies.find(c => c.id === value) || currencies[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{selectedCurrency.icon}</span>
          <div>
            <div className="font-medium text-gray-900">{selectedCurrency.symbol} {selectedCurrency.name}</div>
            <div className="text-xs text-gray-500 capitalize">
              {selectedCurrency.walletType === 'metamask' && '🦊 MetaMask'}
              {selectedCurrency.walletType === 'stacks' && '🪙 Leather Wallet'}
              {selectedCurrency.walletType === 'qr' && '📱 QR Code Only'}
            </div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
          <div className="py-1">
            {currencies.map((currency) => (
              <button
                key={currency.id}
                type="button"
                onClick={() => {
                  onChange(currency.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                  value === currency.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <span className="text-lg">{currency.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{currency.symbol} {currency.name}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {currency.walletType === 'metamask' && '🦊 MetaMask'}
                    {currency.walletType === 'stacks' && '🪙 Leather Wallet'}
                    {currency.walletType === 'qr' && '📱 QR Code Only'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
