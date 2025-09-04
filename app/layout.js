import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'sBTC Payment Gateway',
  description: 'Accept Bitcoin payments via sBTC with ease',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <nav className="bg-white shadow-sm border-b px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">₿</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  sBTC Gateway
                </span>
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</a>
                <a href="/create-payment" className="text-gray-600 hover:text-blue-600">Create Payment</a>
                <a href="/payments" className="text-gray-600 hover:text-blue-600">Payments</a>
              </div>
            </div>
          </nav>
          
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
