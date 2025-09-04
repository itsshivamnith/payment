'use client';
import Link from 'next/link';
import { UserButton, useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Wallet, BarChart3, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              sBTC Gateway
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isSignedIn && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/create-payment" 
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Create Payment</span>
              </Link>
              <Link 
                href="/payments" 
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Payments
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-sm text-slate-600">
                  Welcome, <span className="font-semibold text-slate-900">{user?.firstName}</span>
                </div>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-blue-100 hover:ring-blue-200 transition-all"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && isSignedIn && (
          <div className="md:hidden py-4 border-t border-slate-200/50">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/create-payment" 
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plus className="h-4 w-4" />
                <span>Create Payment</span>
              </Link>
              <Link 
                href="/payments" 
                className="text-slate-600 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Payments
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
