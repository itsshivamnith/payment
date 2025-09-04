'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';


export default function CurrencySelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currencies = Object.entries(SUPPORTED_CURRENCIES).map(([id, currency]) => ({
    id,
    ...currency,
  }));

  const selectedCurrency = currencies.find((c) => c.id === value) || currencies[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full px-4 py-3 bg-[#121416] border border-[#2A3039] rounded-xl shadow-md flex items-center justify-between text-[#E5E5E5] hover:border-[#0052FF] focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:ring-offset-1 transition"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{selectedCurrency.icon}</span>
          <div>
            <div className="font-semibold text-white">
              {selectedCurrency.symbol} {selectedCurrency.name}
            </div>
            <div className="text-xs text-[#8C93A0] capitalize">
              {selectedCurrency.walletType === 'metamask' && '🦊 MetaMask'}
              {selectedCurrency.walletType === 'stacks' && '🪙 Leather Wallet'}
              {selectedCurrency.walletType === 'qr' && '📱 QR Code Only'}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-[#8C93A0] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-[#121416] border border-[#2A3039] rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none">
          <ul
            role="listbox"
            aria-activedescendant={value}
            tabIndex={-1}
            className="py-1"
          >
            {currencies.map((currency) => (
              <li
                key={currency.id}
                id={currency.id}
                role="option"
                aria-selected={value === currency.id}
                tabIndex={0}
                onClick={() => {
                  onChange(currency.id);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onChange(currency.id);
                    setIsOpen(false);
                  }
                }}
                className={`flex items-center px-4 py-3 cursor-pointer space-x-3 transition-colors ${
                  value === currency.id
                    ? 'bg-[#0052FF] text-white'
                    : 'text-[#E5E5E5] hover:bg-[#0052FF]/30'
                }`}
              >
                <span className="text-xl">{currency.icon}</span>
                <div className="flex-1 select-none">
                  <div className="font-semibold">{currency.symbol} {currency.name}</div>
                  <div className="text-xs text-[#8C93A0] capitalize pointer-events-none">
                    {currency.walletType === 'metamask' && '🦊 MetaMask'}
                    {currency.walletType === 'stacks' && '🪙 Leather Wallet'}
                    {currency.walletType === 'qr' && '📱 QR Code Only'}
                  </div>
                </div>
                {value === currency.id && (
                  <CheckCircle className="h-5 w-5 text-[#00FFB2]" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
