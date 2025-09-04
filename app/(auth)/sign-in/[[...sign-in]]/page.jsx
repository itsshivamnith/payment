import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-600">Sign in to your sBTC Payment Gateway</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg p-6">
          <SignIn 
            appearance={{
              elements: {
                footer: "hidden",
                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                card: "shadow-none bg-transparent"
              }
            }}
            routing="path"
            path="/sign-in"
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
