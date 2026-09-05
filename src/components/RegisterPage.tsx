import React, { useState } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { Department, User as UserType } from "../types";

interface RegisterPageProps {
  onRegisterSuccess: (user: UserType) => void;
  onNavigateToLogin: () => void;
  onNavigateHome: () => void;
}

const MUNICIPAL_DEPARTMENTS: Department[] = [
  "Roads & Bridges Department",
  "Solid Waste Management",
  "Stormwater Drainage Division",
  "Water Supply & Sewerage Board",
  "Electrical & Public Lighting",
  "Public Works Department",
  "General Civic Maintenance",
];

const CIVIC_WARDS = [
  "Ward 1 - North Lake Suburbs",
  "Ward 2 - Heritage Market Zone",
  "Ward 3 - Metro Transit Corridor",
  "Ward 4 - Central Zone & Commercial Hub",
  "Ward 5 - Greenbelt Residential Sector",
  "Ward 6 - Tech & Industrial Enclave",
  "Ward 7 - South Ring Boulevard",
];

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateHome,
}) => {
  const [role, setRole] = useState<"citizen" | "admin">("citizen");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ward, setWard] = useState(CIVIC_WARDS[3]);
  const [department, setDepartment] = useState<Department>(MUNICIPAL_DEPARTMENTS[0]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg("Please complete all mandatory fields marked with an asterisk (*).");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters in length.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreedTerms) {
      setErrorMsg("Please accept the Civic Portal Terms of Use to proceed.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = StorageService.register({
        name,
        email,
        phone,
        password,
        role,
        ward: role === "citizen" ? ward : undefined,
        department: role === "admin" ? department : undefined,
      });

      setIsLoading(false);
      if (res.success && res.user) {
        onRegisterSuccess(res.user);
      } else {
        setErrorMsg(res.error || "Registration failed.");
      }
    }, 400);
  };

  return (
    <div id="register-page" className="max-w-xl mx-auto my-10 px-4 sm:px-6">
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
            Create your account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join thousands of active residents improving our city's public spaces
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200/80">
          <button
            id="register-tab-citizen"
            type="button"
            onClick={() => {
              setRole("citizen");
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition ${
              role === "citizen"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Citizen Registration
          </button>

          <button
            id="register-tab-admin"
            type="button"
            onClick={() => {
              setRole("admin");
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition ${
              role === "admin"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Municipal Official
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div
            id="register-error-alert"
            className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Full Legal Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="reg-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sundaram"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Mobile Number <span className="text-slate-400 font-normal">(for SMS alerts)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Role-Specific Field: Ward or Department */}
          {role === "citizen" ? (
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Residential Ward / Locality
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  id="reg-ward-select"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-8 py-2.5 text-xs text-slate-900 outline-none transition appearance-none"
                >
                  {CIVIC_WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Municipal Department Assigned
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  id="reg-dept-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl pl-10 pr-8 py-2.5 text-xs text-slate-900 outline-none transition appearance-none"
                >
                  {MUNICIPAL_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Create Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-confirm-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-600 select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                I agree to the <strong>Civic Issue Reporting Terms</strong>, acknowledge geotagging accuracy guidelines, and consent to receiving complaint status updates.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <button
            id="register-submit-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full mt-3 py-3 rounded-xl font-bold text-white text-xs flex items-center justify-center gap-2 shadow-xs transition ${
              role === "admin"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <span>Complete Registration as {role === "citizen" ? "Citizen" : "Municipal Officer"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Already have an account?{" "}
            <button
              id="goto-login-btn"
              type="button"
              onClick={onNavigateToLogin}
              className="font-bold text-emerald-700 hover:text-emerald-800 underline ml-1"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
