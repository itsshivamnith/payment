import Link from 'next/link';
import { 
  Wallet, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Wallet className="h-8 w-8 text-blue-600" />,
      title: 'Easy Integration',
      description: 'Simple API and beautiful widgets for seamless Bitcoin payments via sBTC',
      color: 'from-blue-500/10 to-blue-600/10'
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: 'Secure & Reliable',
      description: 'Built on Stacks blockchain with enterprise-grade security',
      color: 'from-emerald-500/10 to-emerald-600/10'
    },
    {
      icon: <Zap className="h-8 w-8 text-amber-600" />,
      title: 'Lightning Fast',
      description: 'Instant payment confirmations and real-time status updates',
      color: 'from-amber-500/10 to-amber-600/10'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Merchant Friendly',
      description: 'Complete dashboard for managing all your payment requests',
      color: 'from-purple-500/10 to-purple-600/10'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Transactions Processed' },
    { number: '500+', label: 'Active Merchants' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                sBTC Gateway
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href="/sign-in" 
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <div className="inline-flex items-center bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-8">
              <Star className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">
                Trusted by 500+ merchants worldwide
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Accept{' '}
              <span className="bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
                Bitcoin
              </span>{' '}
              Payments
              <br />
              with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                sBTC
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              The easiest way to integrate Bitcoin payments into your business. 
              Create payment requests, generate QR codes, and track transactions seamlessly.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Link 
              href="/sign-up"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/dashboard"
              className="border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/50 transition-all duration-300"
            >
              View Demo Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-bounce-in">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Why Choose Our Gateway?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built for developers, designed for businesses, loved by users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <TrendingUp className="h-16 w-16 text-blue-200 mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to start accepting Bitcoin?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of businesses already using our gateway to accept payments globally
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/create-payment"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
                >
                  Create Your First Payment
                </Link>
                <Link 
                  href="/sign-up"
                  className="border-2 border-blue-300 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">sBTC Gateway</span>
          </div>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            The future of Bitcoin payments. Simple, secure, and built for scale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-slate-400">
                <div>Dashboard</div>
                <div>API Docs</div>
                <div>Pricing</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-slate-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-slate-400">
                <div>Help Center</div>
                <div>Contact</div>
                <div>Status</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-slate-400">
                <div>Privacy</div>
                <div>Terms</div>
                <div>Security</div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-slate-400">
            © 2025 sBTC Gateway. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
