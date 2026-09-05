import React, { useState } from "react";
import {
  UserCheck,
  FilePlus,
  Search,
  Clock,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Complaint } from "../types";
import { StorageService } from "../services/storage";

interface CitizenDashboardProps {
  allComplaints: Complaint[];
  onNavigateToReport: () => void;
  onNavigateToTrack: (id: string) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  allComplaints,
  onNavigateToReport,
  onNavigateToTrack,
  onSelectComplaint,
}) => {
  const [filter, setFilter] = useState<string>("All");

  const myReportIds = StorageService.getCitizenReportIds();
  const myComplaints = allComplaints.filter((c) =>
    myReportIds.includes(c.complaintId)
  );

  const displayedComplaints = myComplaints.filter((c) => {
    if (filter === "All") return true;
    return c.status === filter;
  });

  return (
    <div id="citizen-dashboard-page" className="max-w-5xl mx-auto my-8 px-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            Citizen Self-Service Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            My Civic Reports
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track and manage all issues submitted from this device.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
        >
          <FilePlus className="w-4 h-4" />
          Report New Problem
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-3 mb-4 overflow-x-auto border-b border-slate-200 text-xs">
        {["All", "Submitted", "Verified", "In Progress", "Resolved"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filter === st
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {st} ({st === "All" ? myComplaints.length : myComplaints.filter((c) => c.status === st).length})
          </button>
        ))}
      </div>

      {/* Complaints Grid */}
      {displayedComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedComplaints.map((c) => (
            <div
              key={c.complaintId}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 transition shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {c.complaintId}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">{c.issueCategory}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      c.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : c.status === "In Progress"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : c.status === "Verified"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="flex gap-3 my-3">
                  <img
                    src={c.photo}
                    alt={c.issueCategory}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="text-xs space-y-1">
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">{c.description}</p>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{c.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">{c.date}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectComplaint(c)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-semibold transition"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToTrack(c.complaintId)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition flex items-center gap-1 shadow-2xs"
                  >
                    Track <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Complaints Found</h3>
          <p className="text-xs text-slate-600 mb-4">
            You don't have any reported civic issues under the selected status filter.
          </p>
          <button
            type="button"
            onClick={onNavigateToReport}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
          >
            Report an Issue Now
          </button>
        </div>
      )}
    </div>
  );
};
