import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  FileCheck2,
  AlertCircle,
  MapPin,
  Calendar,
  Building,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  User,
  ArrowRight,
} from "lucide-react";
import { Complaint, ComplaintStatus } from "../types";
import { StorageService } from "../services/storage";

interface ComplaintTrackerProps {
  initialId?: string;
  onNavigateToReport: () => void;
}

const STATUS_STEPS: { status: ComplaintStatus; label: string; desc: string; icon: any }[] = [
  {
    status: "Submitted",
    label: "Submitted",
    desc: "Complaint logged and queued for municipal inspection",
    icon: Clock,
  },
  {
    status: "Verified",
    label: "Verified",
    desc: "Field inspector confirmed hazard and validity",
    icon: FileCheck2,
  },
  {
    status: "In Progress",
    label: "In Progress",
    desc: "Civic repair crew or equipment dispatched on site",
    icon: Wrench,
  },
  {
    status: "Resolved",
    label: "Resolved",
    desc: "Work completed, inspected, and signed off",
    icon: CheckCircle2,
  },
];

export const ComplaintTracker: React.FC<ComplaintTrackerProps> = ({
  initialId = "",
  onNavigateToReport,
}) => {
  const [searchId, setSearchId] = useState(initialId || "FMS-2026-001");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      doSearch(initialId);
    } else {
      doSearch("FMS-2026-001");
    }
  }, [initialId]);

  const doSearch = (idToSearch: string) => {
    const cleanId = idToSearch.trim();
    if (!cleanId) return;

    setSearched(true);
    const found = StorageService.getComplaintById(cleanId);
    setComplaint(found || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(searchId);
  };

  const getStepIndex = (status: ComplaintStatus): number => {
    switch (status) {
      case "Submitted":
        return 0;
      case "Verified":
        return 1;
      case "In Progress":
        return 2;
      case "Resolved":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = complaint ? getStepIndex(complaint.status) : 0;

  // Preset demo complaint IDs for quick student evaluation
  const demoIds = ["FMS-2026-001", "FMS-2026-002", "FMS-2026-003", "FMS-2026-004", "FMS-2026-005"];

  return (
    <div id="complaint-tracker-page" className="max-w-4xl mx-auto my-8 px-4">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          FEATURE 3: Real-Time Complaint Tracking
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          Track Complaint Status
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Enter your unique complaint reference ID to view real-time inspection, crew dispatch, and resolution milestones.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              id="complaint-search-input"
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. FMS-2026-001"
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none uppercase font-mono transition"
            />
          </div>

          <button
            id="search-complaint-btn"
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 text-sm"
          >
            <Search className="w-4 h-4" />
            Track Issue
          </button>
        </form>

        {/* Quick Demo ID suggestion chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Quick Test IDs:</span>
          {demoIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSearchId(id);
                doSearch(id);
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${
                searchId.toUpperCase() === id
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* RESULT VIEW */}
      {complaint ? (
        <div className="space-y-6">
          {/* Main Status Milestone Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            {/* Top metadata bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200">
              <div>
                <span className="text-[11px] uppercase font-mono tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  {complaint.complaintId}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{complaint.issueCategory}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    complaint.status === "Resolved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : complaint.status === "In Progress"
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : complaint.status === "Verified"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  Status: {complaint.status}
                </span>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    complaint.priority === "Critical"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : complaint.priority === "High"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {complaint.priority} Priority
                </span>
              </div>
            </div>

            {/* 4-STAGE VISUAL TIMELINE (FEATURE 3) */}
            <div className="py-8">
              <div className="relative">
                {/* Horizontal Progress Bar */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-700"
                    style={{
                      width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.status} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? isCurrent
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-4 ring-emerald-100"
                                : "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400 border border-slate-300"
                          }`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span
                            className={`text-xs font-bold block ${
                              isCompleted ? "text-slate-900" : "text-slate-400"
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="text-[10px] text-slate-500 hidden sm:block max-w-[130px] mx-auto mt-0.5 leading-tight">
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Department & Notes Banner */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Assigned Authority: <strong className="text-slate-900">{complaint.assignedDepartment}</strong>
                </span>
              </div>
              {complaint.adminNotes && (
                <div className="text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[11px]">
                  <strong className="text-emerald-700">Latest Field Update:</strong> {complaint.adminNotes}
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo & Location Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Civic Evidence & Geotag
              </h3>

              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[16/10] mb-3">
                <img
                  src={complaint.photo}
                  alt={complaint.issueCategory}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Location:</strong> {complaint.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                  <span>Coordinates: {complaint.latitude}°N, {complaint.longitude}°E</span>
                </div>
              </div>
            </div>

            {/* Description & AI Dossier */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Report Description & Citizen Details
                </h3>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed mb-4">
                  "{complaint.description}"
                </p>

                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Lodged By:
                    </span>
                    <span className="text-slate-900 font-medium">{complaint.citizenName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Submitted On:
                    </span>
                    <span className="text-slate-900 font-medium">{complaint.date}</span>
                  </div>
                </div>

                {/* AI Classification Card (FEATURE 5) */}
                {complaint.aiDetectionResult && (
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI Diagnostic Result
                      </span>
                      <span className="text-[10px] text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                        {Math.round(complaint.aiDetectionResult.confidence * 100)}% Confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700">
                      {complaint.aiDetectionResult.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Audit Log */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase tracking-wider">
                  Timeline Audit Log:
                </span>
                <div className="space-y-2">
                  {complaint.statusHistory.map((history, idx) => (
                    <div key={idx} className="text-[11px] flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900">{history.status}</strong>
                          <span className="text-slate-400 text-[10px]">{history.timestamp}</span>
                          <span className="text-slate-500 text-[10px]">by {history.updatedBy}</span>
                        </div>
                        <p className="text-slate-600 text-[10px] mt-0.5">{history.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : searched ? (
        <div id="complaint-not-found-card" className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-lg mx-auto shadow-xs">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Complaint Not Found</h3>
          <p className="text-xs text-slate-600 mb-5">
            We couldn't locate any record matching ID <strong className="text-slate-900">{searchId}</strong>.
            Please verify the complaint number format (e.g. FMS-2026-001) or file a new report.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchId("FMS-2026-001");
                doSearch("FMS-2026-001");
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition border border-slate-200"
            >
              Try Demo ID: FMS-2026-001
            </button>
            <button
              type="button"
              onClick={onNavigateToReport}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-xs"
            >
              File New Issue
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
