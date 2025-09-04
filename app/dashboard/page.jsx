import PaymentDashboard from '../components/PaymentDashboard';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/create-payment" className="text-2xl font-bold text-blue-600">
              🪙 CryptoGateway
            </Link>
            <span className="text-gray-400">|</span>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          
          <Link href="/create-payment" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Create Payment
          </Link>
        </div>
      </div>
      
      <PaymentDashboard />
    </div>
  );
}
