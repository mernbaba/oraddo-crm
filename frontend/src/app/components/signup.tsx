import { useState } from "react";
import { Button } from "./ui/button";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2, Phone, Briefcase } from "lucide-react";
import api from "../api";

type UserType = "user" | "admin" | "employee";

interface SignupProps {
  role: UserType;
  onSwitchRole?: (role: UserType) => void;
  onShowLogin: () => void;
}

export function Signup({ role, onSwitchRole, onShowLogin }: SignupProps) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/api/orgRegister", {
        fullName,
        phoneNumber,
        email,
        companyName,
        title,
        password,
        userType: role
      });

      alert("Signup successful. Please sign in.");
      onShowLogin();
    } catch (error) {
      console.error("Signup failed", error);
      alert("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F0E9FF] via-white to-[#F0E9FF]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#937CB4] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#5A4079] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-[#422462] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "4s" }}></div>
        <div className="absolute inset-0 ai-grid-bg opacity-30"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#937CB4] via-[#5A4079] to-[#422462] animate-gradient"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white animate-pulse-glow" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-4xl font-bold gradient-text">Oraddo</h1>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#937CB4] to-[#5A4079] text-xs font-bold text-white shadow-lg">
                AI
              </div>
            </div>
            <p className="text-[#5A4079] text-sm">Create your workspace account</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-2xl p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button type="button" onClick={() => onSwitchRole?.("user")} variant="outline" className={role === "user" ? "border-[#422462] text-[#422462]" : "border-[#937CB4]/30 text-[#5A4079]"}>User</Button>
                <Button type="button" onClick={() => onSwitchRole?.("admin")} variant="outline" className={role === "admin" ? "border-[#422462] text-[#422462]" : "border-[#937CB4]/30 text-[#5A4079]"}>Admin</Button>
                <Button type="button" onClick={() => onSwitchRole?.("employee")} variant="outline" className={role === "employee" ? "border-[#422462] text-[#422462]" : "border-[#937CB4]/30 text-[#5A4079]"}>Employee</Button>
              </div>

              <h2 className="text-2xl font-bold text-[#200B43] mb-2">
                {role === "admin" ? "Create Admin Account" : role === "employee" ? "Create Employee Account" : "Create User Account"}
              </h2>
              <p className="text-[#5A4079] text-sm mb-6">
                {role === "admin"
                  ? "Register a super admin profile"
                  : role === "employee"
                  ? "Register an employee workspace account"
                  : "Register your company and start using Oraddo CRM"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter your company name"
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your role/title"
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      required
                      className="w-full pl-11 pr-12 py-3 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A4079] hover:text-[#422462] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#200B43] mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5A4079]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                      className="w-full pl-11 pr-12 py-3 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A4079] hover:text-[#422462] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-white shadow-lg transition-all bg-gradient-to-r from-[#422462] to-[#5A4079] hover:from-[#5A4079] hover:to-[#422462] shadow-[#937CB4]/30"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                  {!isSubmitting && <ArrowRight className="h-5 w-5 ml-2" />}
                </Button>

                <Button
                  type="button"
                  onClick={onShowLogin}
                  variant="outline"
                  className="w-full py-3 border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
                >
                  Back to {role === "admin" ? "Admin" : role === "employee" ? "Employee" : "User"} Sign In
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#5A4079]">
            <p>© 2024 Oraddo AI. All rights reserved.</p>
            <p className="mt-1">Made in India</p>
          </div>
        </div>
      </div>
    </div>
  );
}