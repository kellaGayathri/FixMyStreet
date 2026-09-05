import React, { useState } from "react";
import {
  AlertTriangle,
  FilePlus,
  Search,
  Building2,
  BookOpen,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { ActiveView } from "../types";

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  openAboutModal: () => void;
  complaintCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  openAboutModal,
  complaintCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">
                  Fix<span className="text-emerald-600">My</span>Street
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Civic Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Centralized Civic Issue Reporting & Municipal Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <button
              id="nav-home-btn"
              type="button"
              onClick={() => handleNavClick("home")}
              className={`px-3 py-2 rounded-lg transition ${
                activeView === "home"
                  ? "bg-slate-100 text-slate-900 font-semibold border border-slate-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              Home
            </button>

            <button
              id="nav-report-btn"
              type="button"
              onClick={() => handleNavClick("report")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition shadow-xs ${
                activeView === "report"
                  ? "bg-emerald-700 text-white font-semibold"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              }`}
            >
              <FilePlus className="w-4 h-4" />
              Report Issue
            </button>

            <button
              id="nav-track-btn"
              type="button"
              onClick={() => handleNavClick("track")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
                activeView === "track"
                  ? "bg-slate-100 text-slate-900 font-semibold border border-slate-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <Search className="w-4 h-4" />
              Track Status
            </button>

            <button
              id="nav-citizen-dashboard-btn"
              type="button"
              onClick={() => handleNavClick("citizen-dashboard")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
                activeView === "citizen-dashboard"
                  ? "bg-slate-100 text-slate-900 font-semibold border border-slate-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Citizen Area
            </button>

            <button
              id="nav-admin-dashboard-btn"
              type="button"
              onClick={() => handleNavClick("admin-dashboard")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition border ${
                activeView === "admin-dashboard"
                  ? "bg-blue-600 text-white font-semibold border-blue-700 shadow-xs"
                  : "text-blue-700 bg-blue-50/70 hover:bg-blue-100/80 border-blue-200"
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              Municipal Admin
              <span className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full border ${
                activeView === "admin-dashboard"
                  ? "bg-blue-800 text-white border-blue-700"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              }`}>
                {complaintCount}
              </span>
            </button>
          </nav>

          {/* Right Action: Student Project Guide & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              id="about-docs-btn"
              type="button"
              onClick={openAboutModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shadow-2xs"
              title="CSE Final Year Project Documentation & Vercel Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Project Docs</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <button
            type="button"
            onClick={() => handleNavClick("home")}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeView === "home" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-700"
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("report")}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <FilePlus className="w-4 h-4" />
            Report Civic Issue (Photo & Map)
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("track")}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeView === "track" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-700"
            }`}
          >
            <Search className="w-4 h-4" />
            Track Complaint Status
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("citizen-dashboard")}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeView === "citizen-dashboard" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-700"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            My Citizen Reports
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("admin-dashboard")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeView === "admin-dashboard" ? "bg-blue-600 text-white font-semibold" : "text-blue-700 bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Municipal Admin Dashboard
            </div>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200">
              {complaintCount} issues
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
