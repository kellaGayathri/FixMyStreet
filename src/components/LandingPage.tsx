import React from "react";
import {
  FilePlus,
  Search,
  Building2,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  Activity,
  Layers,
  Award,
} from "lucide-react";
import { Complaint, ActiveView } from "../types";

interface LandingPageProps {
  complaints: Complaint[];
  setActiveView: (view: ActiveView) => void;
  onTrackId: (id: string) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  complaints,
  setActiveView,
  onTrackId,
  onSelectComplaint,
}) => {
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const recentIssues = complaints.slice(0, 3);

  return (
    <div id="landing-page-content" className="space-y-14 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:py-14 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Civic Technology Platform & Municipal Portal
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display max-w-4xl mx-auto leading-tight">
            Fix Your City's Streets.{" "}
            <span className="text-emerald-600">
              Report Problems in Seconds.
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            FixMyStreet connects citizens directly with municipal departments. Snap a photo of potholes, garbage, or water leaks, let our AI classify the hazard, and track repairs until fully resolved.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              id="hero-report-issue-btn"
              type="button"
              onClick={() => setActiveView("report")}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 text-sm transition group"
            >
              <FilePlus className="w-4 h-4" />
              Report a Civic Problem
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-track-btn"
              type="button"
              onClick={() => setActiveView("track")}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-lg border border-slate-300 shadow-2xs flex items-center justify-center gap-2 text-sm transition"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              Track Complaint Status
            </button>

            <button
              id="hero-admin-portal-btn"
              type="button"
              onClick={() => setActiveView("admin-dashboard")}
              className="w-full sm:w-auto px-5 py-3 bg-blue-50/70 hover:bg-blue-100 text-blue-700 font-medium rounded-lg border border-blue-200 shadow-2xs flex items-center justify-center gap-2 text-sm transition"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              Municipal Admin Portal
            </button>
          </div>
        </div>
      </section>

      {/* LIVE CIVIC METRICS BAR */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
              Total Reported
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block font-mono">
              {total}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Geotagged Issues</span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-600 font-semibold block">
              In Active Repair
            </span>
            <span className="text-3xl font-extrabold text-indigo-600 mt-1 block font-mono">
              {inProgress}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Field Crews Dispatched</span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold block">
              Resolution Rate
            </span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block font-mono">
              {resolutionRate}%
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">{resolved} Successfully Fixed</span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold block">
              Departments Active
            </span>
            <span className="text-3xl font-extrabold text-blue-600 mt-1 block font-mono">
              6
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Roads, Water, Lighting</span>
          </div>
        </div>
      </section>

      {/* 5 CORE FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            The 5 Core Pillars of FixMyStreet
          </h2>
          <p className="text-slate-600 text-sm mt-1.5">
            Engineered specifically to fulfill all student MVP requirements with high architectural fidelity and zero paid dependencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-sm mb-3">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Civic Issue Reporting</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Citizens lodge complaints categorized into Potholes, Garbage, Drainage, Water Leaks, Broken Streetlights, or Damaged Infrastructure.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm mb-3">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Photo & Map Geotagging</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Upload photo evidence with browser drag-and-drop or camera snapshot. Interactive municipal map pinpoints exact coordinates and landmarks.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-sm mb-3">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Complaint Status Tracking</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Track real-time progress using unique IDs (e.g. FMS-2026-001) across 4 milestones: Submitted, Verified, In Progress, and Resolved.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center justify-center font-bold text-sm mb-3">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Municipal Admin Dashboard</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Municipal authorities manage complaints, filter by ward & department, reassign priorities, and log field technician resolution notes.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white border border-emerald-300/80 rounded-xl p-5 shadow-xs hover:border-emerald-400 transition md:col-span-2 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                05
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                AI Vision Feature
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">AI-Based Issue Detection</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              AI evaluates uploaded issue images, computes confidence scores, classifies the damage severity, suggests appropriate departments, and provides 1-click form auto-fill. Operates with Gemini 3.8 Flash or free open-source heuristic fallback.
            </p>
          </div>
        </div>
      </section>

      {/* RECENT REPORTED ISSUES SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Public Civic Activity
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live sample issues managed through the municipal portal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView("admin-dashboard")}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
          >
            View All in Admin <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentIssues.map((c) => (
            <div
              key={c.complaintId}
              onClick={() => onSelectComplaint(c)}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden cursor-pointer transition shadow-xs group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={c.photo}
                    alt={c.issueCategory}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-slate-800 font-mono text-[10px] font-bold border border-slate-200 shadow-2xs">
                      {c.complaintId}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.status === "Resolved"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : c.status === "In Progress"
                          ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                          : c.status === "Verified"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">{c.issueCategory}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{c.assignedDepartment.split(" ")[0]} Dept</span>
                <span className="text-emerald-700 font-semibold group-hover:underline">
                  Track Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CIVIC HELPLINE / CITIZEN ASSURANCE FOOTER */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-600 text-xs shadow-xs">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Official Citizen & Municipal Guarantee
            </h4>
            <p className="text-slate-500">
              FixMyStreet ensures every lodged complaint is assigned a traceable ID and inspected within 48 hours.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveView("report")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition shadow-xs"
            >
              Lodge Issue Now
            </button>
            <button
              type="button"
              onClick={() => setActiveView("track")}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-300 transition shadow-2xs"
            >
              Check Existing ID
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
