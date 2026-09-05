import React, { useState, useEffect } from "react";
import {
  ActiveView,
  Complaint,
} from "./types";
import { StorageService } from "./services/storage";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { ReportIssueForm } from "./components/ReportIssueForm";
import { ComplaintTracker } from "./components/ComplaintTracker";
import { AdminDashboard } from "./components/AdminDashboard";
import { CitizenDashboard } from "./components/CitizenDashboard";
import { ComplaintDetailsModal } from "./components/ComplaintDetailsModal";
import { AboutModal } from "./components/AboutModal";
import {
  ShieldCheck,
  CheckCircle2,
  Heart,
  ExternalLink,
  BookOpen,
  PhoneCall,
  Activity,
} from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [trackTargetId, setTrackTargetId] = useState<string>("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load complaints
  const refreshComplaints = () => {
    const list = StorageService.getComplaints();
    setComplaints(list);
  };

  useEffect(() => {
    refreshComplaints();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleNavigateToTrack = (id: string) => {
    setTrackTargetId(id);
    setActiveView("track");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReportSuccess = (newComplaint: Complaint) => {
    refreshComplaints();
    showToast(`Complaint ${newComplaint.complaintId} successfully lodged!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-5 right-5 z-50 bg-white border border-emerald-500/80 text-emerald-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5 text-xs animate-bounce"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        openAboutModal={() => setIsAboutModalOpen(true)}
        complaintCount={complaints.length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === "home" && (
          <LandingPage
            complaints={complaints}
            setActiveView={(v) => {
              setActiveView(v);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onTrackId={handleNavigateToTrack}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        )}

        {activeView === "report" && (
          <ReportIssueForm
            onSuccess={handleReportSuccess}
            onNavigateToTrack={handleNavigateToTrack}
          />
        )}

        {activeView === "track" && (
          <ComplaintTracker
            initialId={trackTargetId}
            onNavigateToReport={() => {
              setActiveView("report");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeView === "citizen-dashboard" && (
          <CitizenDashboard
            allComplaints={complaints}
            onNavigateToReport={() => {
              setActiveView("report");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onNavigateToTrack={handleNavigateToTrack}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        )}

        {activeView === "admin-dashboard" && (
          <AdminDashboard
            complaints={complaints}
            onRefresh={() => {
              refreshComplaints();
              showToast("Municipal records refreshed.");
            }}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        )}
      </main>

      {/* Complaint Inspection Modal */}
      <ComplaintDetailsModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onTrackId={handleNavigateToTrack}
      />

      {/* Project & Deployment Docs Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Municipal Civic Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Brand & Tagline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg text-slate-900 font-display">
                  Fix<span className="text-emerald-600">My</span>Street
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                A centralized municipal issue reporting platform empowering citizens to report infrastructure hazards and enabling cities to fix them faster.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>All Municipal Systems Operational</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Civic Services
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("report");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-slate-600 hover:text-emerald-600 transition"
                  >
                    Report Road & Drainage Issues
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("track");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-slate-600 hover:text-emerald-600 transition"
                  >
                    Track Existing Complaint ID
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("citizen-dashboard");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-slate-600 hover:text-emerald-600 transition"
                  >
                    Citizen Activity History
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("admin-dashboard");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-slate-600 hover:text-emerald-600 transition"
                  >
                    Municipal Admin Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Academic & Project Info */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Student Project
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsAboutModalOpen(true)}
                    className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" /> Project Architecture & Guide
                  </button>
                </li>
                <li>Final-Year Computer Science Engineering</li>
                <li>AI Vibe Coding MVP Capstone</li>
                <li>Free Tier & Zero External Paid Costs ($0)</li>
              </ul>
            </div>

            {/* Col 4: Civic Helpline Emergency Numbers */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Civic Helplines
              </h4>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Road Hazards: 1800-425-ROADS</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Water & Sewage: 1800-233-WATER</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Streetlight Outage: 1800-112-LIGHT</span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  For immediate life-threatening structural collapses, dial 112.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} FixMyStreet — Centralized Civic Issue Reporting Platform.</p>
            <p className="flex items-center gap-1">
              Developed with Vite, React, Express, Gemini AI & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
