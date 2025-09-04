'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function MetaMaskPayment({ payment }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setUserAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask not installed. Please install MetaMask wallet.');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      setIsConnected(true);
      setUserAddress(address);
      setError('');
    } catch (error) {
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  const sendPayment = async () => {
    if (!window.ethereum || !isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setSending(true);
    setError('');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Prepare transaction
      const transaction = {
        to: payment.paymentAddress,
        value: ethers.utils.parseEther(payment.amount.toString()),
        gasLimit: 21000, // Standard ETH transfer gas limit
      };

      // Send transaction
      const tx = await signer.sendTransaction(transaction);
      setTxHash(tx.hash);

      console.log('🎉 Transaction sent:', tx.hash);
      console.log('⏳ Waiting for confirmation...');

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt);

      // Notify parent component of successful payment
      if (payment.onPaymentSuccess) {
        payment.onPaymentSuccess({
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
          status: 'confirmed'
        });
      }

    } catch (error) {
      console.error('Payment failed:', error);
      setError('Payment failed: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <span className="mr-2">🦊</span>
          Pay with MetaMask
        </h3>
        {isConnected && (
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Amount:</span>
          <span className="font-bold">{payment.amount} ETH</span>
        </div>
        
        <div className="flex justify-between">
          <span>USD Value:</span>
          <span>≈ ${payment.usdAmount?.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>To Address:</span>
          <span className="font-mono">
            {payment.paymentAddress.slice(0, 10)}...{payment.paymentAddress.slice(-8)}
          </span>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {txHash && (
          <div className="bg-green-500/20 border border-green-400 rounded-lg p-3">
            <p className="text-sm">✅ Transaction sent!</p>
            <a 
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline hover:no-underline"
            >
              View on Etherscan: {txHash.slice(0, 20)}...
            </a>
          </div>
        )}

        <div className="pt-4">
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Connect MetaMask Wallet
            </button>
          ) : (
            <button
              onClick={sendPayment}
              disabled={sending}
              className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  Sending Payment...
                </span>
              ) : (
                `Send ${payment.amount} ETH`
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
