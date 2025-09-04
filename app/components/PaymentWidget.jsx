'use client';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ExternalLink, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';
import { ethers } from 'ethers';

// ✅ FIXED: Use new @stacks/connect v8 imports
import { 
  connect,
  request,
  isConnected,
  disconnect 
} from '@stacks/connect';

export default function PaymentWidget({ payment, onPaymentUpdate }) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(payment.status || 'PENDING');
  
  // MetaMask states
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [metamaskSending, setMetamaskSending] = useState(false);
  const [metamaskTxHash, setMetamaskTxHash] = useState('');
  const [metamaskError, setMetamaskError] = useState('');

  // ✅ FIXED: Stacks wallet states
  const [stacksConnected, setStacksConnected] = useState(false);
  const [stacksSending, setStacksSending] = useState(false);
  const [stacksTxId, setStacksTxId] = useState('');
  const [stacksError, setStacksError] = useState('');
  const [stacksAddress, setStacksAddress] = useState('');

  // Check if Stacks wallet is already connected on component mount
  useEffect(() => {
    if (isConnected()) {
      setStacksConnected(true);
      // Get the connected address from localStorage
      const data = JSON.parse(localStorage.getItem('stacks-connect') || '{}');
      if (data.addresses?.stx?.[0]?.address) {
        setStacksAddress(data.addresses.stx[0].address);
      }
    }
  }, []);

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // MetaMask functions (unchanged)
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      setMetamaskError('MetaMask not installed. Please install MetaMask extension.');
      return;
    }

    try {
      setMetamaskError('');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setMetamaskConnected(true);
      console.log('✅ MetaMask connected');
    } catch (error) {
      if (error.code === 4001) {
        console.log('🚫 User cancelled MetaMask connection');
        setMetamaskError('Connection cancelled by user');
      } else {
        setMetamaskError('Failed to connect MetaMask: ' + error.message);
      }
    }
  };

  const sendMetaMaskPayment = async () => {
    setMetamaskSending(true);
    setMetamaskError('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const balance = await provider.getBalance(await signer.getAddress());
      const requiredAmount = ethers.parseEther(payment.amount.toString());
      
      if (balance < requiredAmount) {
        throw new Error(`Insufficient balance. You have ${ethers.formatEther(balance)} ETH but need ${payment.amount} ETH`);
      }

      const transaction = {
        to: payment.paymentAddress,
        value: requiredAmount,
        gasLimit: payment.currency === 'USDT' ? 65000 : 21000,
      };

      const tx = await signer.sendTransaction(transaction);
      setMetamaskTxHash(tx.hash);
      
      console.log('✅ Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt);
      
      setStatus('CONFIRMED');
      alert(`🎉 Payment successful!\nTransaction: ${tx.hash}`);
      
    } catch (error) {
      console.error('❌ MetaMask payment error:', error);
      
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        setMetamaskError('Transaction cancelled by user');
      } else if (error.message && error.message.includes('insufficient funds')) {
        setMetamaskError('Insufficient funds to complete transaction');
      } else {
        setMetamaskError('Transaction failed: ' + (error.reason || error.message || 'Unknown error'));
      }
    } finally {
      setMetamaskSending(false);
    }
  };

  // ✅ FIXED: Stacks wallet functions using new connect() method
  const connectStacksWallet = async () => {
    setStacksError('');
    
    try {
      console.log('🔄 Connecting to Stacks wallet...');
      
      const response = await connect({
        appDetails: {
          name: 'Multi-Crypto Payment Gateway',
          icon: window.location.origin + '/favicon.ico',
        },
        forceWalletSelect: true, // Force wallet selection dialog
      });

      console.log('✅ Stacks wallet connected:', response);
      
      setStacksConnected(true);
      
      // Get the STX address from the response
      if (response.addresses?.stx?.[0]?.address) {
        setStacksAddress(response.addresses.stx[0].address);
      }
      
    } catch (error) {
      console.error('❌ Stacks wallet connection failed:', error);
      setStacksError('Connection cancelled by user');
    }
  };

  // ✅ FIXED: Send Stacks payment using new request() method
  const sendStacksPayment = async () => {
    setStacksSending(true);
    setStacksError('');

    try {
      console.log('🔄 Sending Stacks payment...');
      
      const amount = payment.currency === 'STX' 
        ? Math.floor(parseFloat(payment.amount) * 1000000) // microSTX
        : Math.floor(parseFloat(payment.amount) * 100000000); // Satoshis for sBTC

      const response = await request('stx_transferStx', {
        recipient: payment.paymentAddress,
        amount: amount.toString(),
        memo: payment.memo,
        network: 'testnet', // Use 'mainnet' for production
      });

      console.log('✅ Stacks payment completed:', response);
      
      setStacksTxId(response.txid || response.result?.txid);
      setStacksSending(false);
      setStatus('CONFIRMED');
      
      alert(`🎉 ${payment.currency} Payment successful!`);
      
    } catch (error) {
      console.error('❌ Stacks payment failed:', error);
      setStacksSending(false);
      setStacksError('Payment cancelled by user');
    }
  };

  const currency = SUPPORTED_CURRENCIES[payment.currency] || { 
    name: payment.currency, 
    color: '#6B7280',
    icon: '🪙'
  };

  const isMetaMaskSupported = ['ETH', 'USDT'].includes(payment.currency);
  const isStacksSupported = ['STX', 'sBTC'].includes(payment.currency);

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6 max-w-md mx-auto">
      <div className="text-center space-y-6">
        
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <span className="mr-2">{currency.icon}</span>
            {payment.currency} Payment Request
          </h3>
          <p className="text-gray-600">Choose your payment method</p>
        </div>

        {/* Status Alert */}
        {status === 'CONFIRMED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-green-800 mb-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-bold">Payment Confirmed! 🎉</span>
            </div>
          </div>
        )}

        {/* QR Code */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-dashed border-blue-200">
          <QRCodeSVG 
            value={payment.qrData}
            size={200}
            className="mx-auto"
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="M"
            marginSize={4}
          />
          <p className="text-xs text-gray-500 mt-3">
            📱 Scan with any {payment.currency} wallet
          </p>
        </div>

        {/* Direct Wallet Payments */}
        {status === 'PENDING' && (
          <div className="space-y-4">
            
            {/* MetaMask Payment (ETH/USDT) */}
            {isMetaMaskSupported && (
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold flex items-center">
                    <span className="mr-2">🦊</span>
                    Pay with MetaMask
                  </h4>
                  {metamaskConnected && (
                    <div className="text-xs bg-white/20 px-2 py-1 rounded-full">Connected</div>
                  )}
                </div>
                
                {metamaskError && (
                  <div className="bg-red-500/20 border border-red-400 rounded-lg p-3 mb-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{metamaskError}</span>
                    </div>
                  </div>
                )}

                {metamaskTxHash && (
                  <div className="bg-green-500/20 border border-green-400 rounded-lg p-3 mb-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>✅ TX: {metamaskTxHash.slice(0, 20)}...</span>
                    </div>
                  </div>
                )}

                {!metamaskConnected ? (
                  <button
                    onClick={connectMetaMask}
                    className="w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Connect MetaMask Wallet
                  </button>
                ) : (
                  <button
                    onClick={sendMetaMaskPayment}
                    disabled={metamaskSending}
                    className="w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    {metamaskSending ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                        Sending Payment...
                      </span>
                    ) : (
                      `Send ${payment.amount} ${payment.currency}`
                    )}
                  </button>
                )}
              </div>
            )}

            {/* ✅ FIXED: Stacks Payment with new API */}
            {isStacksSupported && (
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold flex items-center">
                    <span className="mr-2">🪙</span>
                    Pay with Leather Wallet
                  </h4>
                  {stacksConnected && (
                    <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      Connected {stacksAddress && `• ${stacksAddress.slice(0, 6)}...`}
                    </div>
                  )}
                </div>
                
                {stacksError && (
                  <div className="bg-red-500/20 border border-red-400 rounded-lg p-3 mb-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{stacksError}</span>
                    </div>
                  </div>
                )}

                {stacksTxId && (
                  <div className="bg-green-500/20 border border-green-400 rounded-lg p-3 mb-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>✅ TX: {stacksTxId.slice(0, 20)}...</span>
                    </div>
                  </div>
                )}

                {!stacksConnected ? (
                  <button
                    onClick={connectStacksWallet}
                    className="w-full bg-white text-orange-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Connect Leather Wallet
                  </button>
                ) : (
                  <button
                    onClick={sendStacksPayment}
                    disabled={stacksSending}
                    className="w-full bg-white text-orange-600 font-bold py-3 px-4 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    {stacksSending ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                        Sending Payment...
                      </span>
                    ) : (
                      `Send ${payment.amount} ${payment.currency}`
                    )}
                  </button>
                )}

                {stacksConnected && !stacksSending && (
                  <p className="text-xs mt-2 text-white/80">
                    💡 Clicking send will open your Stacks wallet for confirmation
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Payment Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Amount:</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currency.color }}/>
              <span className="font-bold">{payment.amount} {payment.currency}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">USD Value:</span>
            <span className="font-semibold text-green-600">≈ ${payment.usdAmount?.toFixed(2)}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Address:</label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-mono flex-1 break-all">{payment.paymentAddress}</span>
              <button
                onClick={() => copyToClipboard(payment.paymentAddress)}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Copy address"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
              status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              status === 'PENDING' ? 'bg-blue-100 text-blue-800 animate-pulse' :
              'bg-gray-100 text-gray-800'
            }`}>
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
