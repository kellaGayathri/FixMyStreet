import React, { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { User } from "../types";

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateHome,
}) => {
  const [roleTab, setRoleTab] = useState<"citizen" | "admin">("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both your email address and password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = StorageService.login(email, password);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.error || "Authentication failed.");
      }
    }, 350);
  };

  const handleQuickDemoLogin = (demoRole: "citizen" | "admin") => {
    setErrorMsg(null);
    setIsLoading(true);
    const demoEmail = demoRole === "citizen" ? "rahul.s@example.com" : "admin@fixmystreet.gov";
    const demoPass = demoRole === "citizen" ? "password123" : "admin123";

    setEmail(demoEmail);
    setPassword(demoPass);
    setRoleTab(demoRole);

    setTimeout(() => {
      const res = StorageService.login(demoEmail, demoPass);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      }
    }, 300);
  };

  return (
    <div id="login-page" className="max-w-md mx-auto my-12 px-4 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 mb-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">
              Fix<span className="text-emerald-600">My</span>Street
            </span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track reported issues or manage city infrastructure dispatch
          </p>
        </div>

        {/* Role Segmented Switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200/80">
          <button
            id="tab-role-citizen"
            type="button"
            onClick={() => {
              setRoleTab("citizen");
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
              roleTab === "citizen"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Citizen Portal
          </button>

          <button
            id="tab-role-admin"
            type="button"
            onClick={() => {
              setRoleTab("admin");
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
              roleTab === "admin"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Municipal Officer
          </button>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Demo Credentials:
            </span>
            <span className="text-[10px] text-slate-400">Exam / Review Mode</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="quick-demo-citizen-btn"
              type="button"
              onClick={() => handleQuickDemoLogin("citizen")}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-lg border border-emerald-200 text-left transition flex items-center justify-between"
            >
              <span>Rahul (Citizen)</span>
              <span className="text-[10px] text-emerald-600">Fill & Go →</span>
            </button>

            <button
              id="quick-demo-admin-btn"
              type="button"
              onClick={() => handleQuickDemoLogin("admin")}
              className="py-1.5 px-2 bg-white hover:bg-blue-50 text-blue-800 text-[11px] font-semibold rounded-lg border border-blue-200 text-left transition flex items-center justify-between"
            >
              <span>Inspector (Admin)</span>
              <span className="text-[10px] text-blue-600">Fill & Go →</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div
            id="login-error-alert"
            className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleTab === "citizen" ? "e.g. rahul.s@example.com" : "e.g. admin@fixmystreet.gov"}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => alert("For this demonstration MVP, you can use: 'password123' for citizens or 'admin123' for municipal officers.")}
                className="text-[11px] text-slate-500 hover:text-emerald-700 underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="login-password-input"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 py-3 rounded-xl font-bold text-white text-xs flex items-center justify-center gap-2 shadow-xs transition ${
              roleTab === "admin"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In as {roleTab === "citizen" ? "Citizen" : "Municipal Officer"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{" "}
            <button
              id="goto-register-btn"
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-emerald-700 hover:text-emerald-800 underline ml-1"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
