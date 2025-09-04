import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-600">Join sBTC Payment Gateway and start accepting Bitcoin</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg p-6">
          <SignUp 
            appearance={{
              elements: {
                footer: "hidden",
                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                card: "shadow-none bg-transparent"
              }
            }}
            routing="path"
            path="/sign-up"
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
