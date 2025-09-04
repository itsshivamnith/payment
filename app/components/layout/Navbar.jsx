'use client';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { Wallet, BarChart3, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0E1116]/95 via-[#151A21]/95 to-[#0E1116]/95 backdrop-blur-md border-b border-[#2A3039]/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo - Sexy gradient and hover effect */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-[#0052FF] to-[#00FFB2] rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Wallet className="h-6 w-6 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0052FF]/20 to-[#00FFB2]/20 animate-pulse"></div>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[#0052FF] via-[#00FFB2] to-[#FF7A00] bg-clip-text text-transparent">
              sBTC Gateway
            </span>
          </Link>

          {/* Desktop Navigation - Clean and sexy */}
          {isSignedIn && (
            <div className="hidden md:flex items-center space-x-2">
              <Link 
                href="/dashboard" 
                className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-[#E5E5E5] hover:text-[#00FFB2] hover:bg-[#1A1F26] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <Link 
                href="/create-payment" 
                className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-[#E5E5E5] hover:text-[#FF7A00] hover:bg-[#1A1F26] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Create Payment</span>
              </Link>
            </div>
          )}

          {/* Right Side - User section */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                {/* Welcome message - Sexy typography */}
                <div className="hidden md:block">
                  <span className="text-[#AEB4BE] text-sm">Welcome back,</span>
                  <span className="ml-1 text-[#00FFB2] font-bold capitalize">{user?.firstName}</span>
                </div>
                
                {/* Enhanced UserButton */}
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-11 h-11 ring-2 ring-[#0052FF] hover:ring-[#00FFB2] transition-all duration-300 hover:scale-105 shadow-lg",
                      userButtonPopoverCard: "bg-[#1A1F26] border border-[#2A3039] shadow-2xl backdrop-blur-md",
                      userButtonPopoverHeaderTitle: "text-[#E5E5E5]",
                      userButtonPopoverHeaderSubtitle: "text-[#AEB4BE]",
                      userButtonPopoverActionButton: "text-[#E5E5E5] hover:text-[#00FFB2] hover:bg-[#252A32] transition-colors",
                      userButtonPopoverFooter: "hidden"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/sign-in" 
                  className="text-[#AEB4BE] hover:text-[#00FFB2] font-medium px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-[#1A1F26]/50"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="relative bg-gradient-to-r from-[#0052FF] to-[#1F6BFF] hover:from-[#0848E1] hover:to-[#0052FF] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-[#0052FF]/25 overflow-hidden group"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00FFB2]/20 to-[#FF7A00]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}

            {/* Mobile menu button - Sexy animation */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#E5E5E5] hover:text-[#00FFB2] hover:bg-[#1A1F26] rounded-lg transition-all duration-300 group"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="relative">
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Sleek dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-[#1A1F26]/95 backdrop-blur-xl border border-[#2A3039]/50 shadow-2xl rounded-b-2xl mx-4 overflow-hidden">
            <div className="py-4 space-y-1">
              {isSignedIn && (
                <>
                  {/* Mobile user info */}
                  <div className="px-6 py-3 border-b border-[#2A3039]/50">
                    <span className="text-[#AEB4BE] text-sm">Welcome back,</span>
                    <span className="ml-1 text-[#00FFB2] font-bold capitalize">{user?.firstName}</span>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    className="flex items-center space-x-3 px-6 py-3 text-[#E5E5E5] hover:text-[#00FFB2] hover:bg-[#252A32] transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <Link 
                    href="/create-payment" 
                    className="flex items-center space-x-3 px-6 py-3 text-[#E5E5E5] hover:text-[#FF7A00] hover:bg-[#252A32] transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Payment</span>
                  </Link>
                </>
              )}
              
              {!isSignedIn && (
                <div className="px-6 py-3 space-y-2">
                  <Link 
                    href="/sign-in" 
                    className="block text-[#AEB4BE] hover:text-[#00FFB2] py-2 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/sign-up" 
                    className="block bg-gradient-to-r from-[#0052FF] to-[#1F6BFF] text-white py-2 px-4 rounded-lg font-semibold text-center transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
