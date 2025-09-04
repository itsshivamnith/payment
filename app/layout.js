import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'sBTC Payment Gateway',
  description: 'Accept Bitcoin payments via sBTC with ease',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className="scroll-smooth">
        <body className={`${inter.className} bg-[#0E1116] text-[#E5E5E5] min-h-screen flex flex-col`}>
          {/* Navigation */}
          <nav className="bg-[#1A1F26] backdrop-blur-md border-b border-[#2A3039] shadow-2xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0052FF] to-[#00FFB2] flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <span className="text-white font-bold text-xl">₿</span>
                  </div>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-[#0052FF] via-[#00FFB2] to-[#FF7A00] bg-clip-text text-transparent">
                    sBTC Gateway
                  </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-8 text-gray-400 select-none">
                  <Link href="/dashboard" className="hover:text-[#00FFB2] transition-colors duration-300 font-semibold">
                    Dashboard
                  </Link>
                  <Link href="/create-payment" className="hover:text-[#FF7A00] transition-colors duration-300 font-semibold">
                    Create Payment
                  </Link>
                  <Link href="/payments" className="hover:text-[#00FFB2] transition-colors duration-300 font-semibold">
                    Payments
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-grow max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-[#1A1F26] border-t border-[#2A3039] py-6 mt-auto shadow-inner text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} sBTC Payment Gateway. All rights reserved.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
