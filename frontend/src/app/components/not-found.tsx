import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { Home, Sparkles, AlertCircle } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E9FF] via-white to-[#F0E9FF] flex items-center justify-center p-4">
 
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#937CB4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#5A4079] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-[#422462] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-[#937CB4]/20 shadow-2xl p-12 text-center">
 
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#422462] blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#422462] to-[#5A4079] rounded-full p-6">
                <AlertCircle className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
 
          <div className="mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="h-8 w-8 text-[#937CB4] animate-pulse-glow" />
              <h1 className="text-8xl font-bold bg-gradient-to-r from-[#422462] via-[#5A4079] to-[#937CB4] bg-clip-text text-transparent">
                404
              </h1>
              <Sparkles className="h-8 w-8 text-[#937CB4] animate-pulse-glow" />
            </div>
            <h2 className="text-3xl font-bold text-[#200B43] mb-2">
              Page Not Found
            </h2>
            <p className="text-[#5A4079] text-lg">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
 
          <div className="h-1 w-32 mx-auto mb-8 bg-gradient-to-r from-[#422462] via-[#5A4079] to-[#937CB4] rounded-full"></div>
 
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-[#937CB4]/30 hover:bg-[#F0E9FF] text-[#422462]"
            >
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/app/dashboard")}
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
 
          <p className="mt-8 text-sm text-[#5A4079]">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
