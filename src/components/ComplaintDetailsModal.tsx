import React from "react";
import {
  X,
  MapPin,
  Calendar,
  Building,
  Sparkles,
  User,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Complaint } from "../types";

interface ComplaintDetailsModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onTrackId: (id: string) => void;
}

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  complaint,
  onClose,
  onTrackId,
}) => {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-900">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {complaint.complaintId}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  complaint.status === "Resolved"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : complaint.status === "In Progress"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : complaint.status === "Verified"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {complaint.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5 font-display">{complaint.issueCategory}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 space-y-5 text-xs">
          {/* Photo & Geotag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3]">
              <img
                src={complaint.photo}
                alt={complaint.issueCategory}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[10px]">Location:</span>
                    <strong className="text-slate-900 text-xs">{complaint.location}</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-600">
                  GPS: {complaint.latitude}°N, {complaint.longitude}°E
                </div>

                <div className="text-slate-700">
                  <span className="text-slate-500 block text-[10px]">Assigned Department:</span>
                  <span className="font-semibold text-emerald-700 text-xs">{complaint.assignedDepartment}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Priority</span>
                  <span className="font-bold text-slate-900">{complaint.priority}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Reported On</span>
                  <span className="font-medium text-slate-700">{complaint.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              Issue Description:
            </span>
            <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* AI Result if present */}
          {complaint.aiDetectionResult && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> AI Visual Diagnostics
                </span>
                <span className="text-[10px] text-emerald-800 bg-white px-2 py-0.5 rounded font-bold border border-emerald-300">
                  {Math.round(complaint.aiDetectionResult.confidence * 100)}% Confidence
                </span>
              </div>
              <p className="text-emerald-950 text-[11px]">
                {complaint.aiDetectionResult.description}
              </p>
            </div>
          )}

          {/* Status Timeline History */}
          <div>
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-2">
              Action & Resolution History:
            </span>
            <div className="space-y-2">
              {complaint.statusHistory.map((h, i) => (
                <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{h.status}</strong>
                      <span className="text-slate-500 text-[10px]">{h.timestamp}</span>
                    </div>
                    <p className="text-slate-700 text-[11px] mt-0.5">{h.note}</p>
                    <span className="text-slate-500 text-[10px] block mt-0.5">By: {h.updatedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onTrackId(complaint.complaintId);
              onClose();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
          >
            Open Live Status Tracker <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
