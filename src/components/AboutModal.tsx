import React from "react";
import {
  X,
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-1">
              Final-Year CSE AI Vibe Coding Project
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              FixMyStreet — Architecture & Deployment Guide
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive reference for academic examiners, project evaluation, GitHub and Vercel.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* 1. Problem Statement */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              1. Project Problem Statement
            </h3>
            <p className="text-slate-700">
              Modern municipalities struggle with fragmented citizen reporting channels (cluttered phone lines, disorganized emails, unverified social media complaints). <strong>FixMyStreet</strong> bridges citizens and municipal authorities into a single transparent civic pipeline. Citizens lodge geotagged issues with photo evidence, AI classifies the hazard and routes it to the correct department, and both citizens and authorities track progress in real-time.
            </p>
          </div>

          {/* 2. Five Core Features Verification */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. Verification of 5 Core Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-emerald-700 text-xs block mb-1">
                  Feature 1: Civic Issue Reporting
                </span>
                <p className="text-[11px] text-slate-600">
                  Citizens select categories (Pothole, Garbage, Drainage, Water Leak, Streetlight, Infrastructure) and provide descriptions with validation.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-blue-700 text-xs block mb-1">
                  Feature 2: Photo & Location Upload
                </span>
                <p className="text-[11px] text-slate-600">
                  File upload / camera preview, browser drag-and-drop, interactive municipal ward map, GPS geolocation, and coordinate tagging.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-purple-700 text-xs block mb-1">
                  Feature 3: Complaint Status Tracking
                </span>
                <p className="text-[11px] text-slate-600">
                  Unique reference IDs (e.g. FMS-2026-001) with a 4-milestone visual tracker: Submitted → Verified → In Progress → Resolved.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-cyan-800 text-xs block mb-1">
                  Feature 4: Municipal Admin Dashboard
                </span>
                <p className="text-[11px] text-slate-600">
                  Centralized command center with status transitions, department reassignment, priority escalation, CSV export, and ward map.
                </p>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 sm:col-span-2">
                <span className="font-bold text-emerald-800 text-xs block mb-1">
                  Feature 5: AI-Based Issue Detection
                </span>
                <p className="text-[11px] text-emerald-950">
                  Dual-tier AI architecture: Connects to server-side Gemini 3.8 Flash via @google/genai, with automatic client-side heuristic fallback for 100% free offline / static deployment.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Free & Open-Source Cost Compliance ($0 Spent) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              3. Zero-Cost Student Project Compliance
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                No paid subscription
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                No credit card required
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                No paid database (LocalStorage/In-Memory)
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                No paid authentication service
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Free Gemini Flash or Local heuristic AI
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                100% Vercel & GitHub compatible
              </li>
            </ul>
          </div>

          {/* 4. Local Execution & Vercel Deployment Commands */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              4. How to Run Locally & Deploy
            </h3>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 text-slate-100">
              <span className="text-slate-400 block"># 1. Install dependencies</span>
              <p className="text-emerald-400">npm install</p>
              <span className="text-slate-400 block pt-1"># 2. Run local development server</span>
              <p className="text-emerald-400">npm run dev</p>
              <span className="text-slate-400 block pt-1"># 3. Build for production</span>
              <p className="text-emerald-400">npm run build</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
              <span className="font-bold text-slate-900 block">Deploying to Vercel in 2 Minutes:</span>
              <p className="text-slate-600">
                1. Push code to your personal GitHub repository (<code className="text-emerald-700 font-mono">git push origin main</code>).
              </p>
              <p className="text-slate-600">
                2. Go to <strong>vercel.com</strong> → Import your GitHub repo.
              </p>
              <p className="text-slate-600">
                3. Framework Preset: <strong>Vite</strong>. Build Command: <code className="text-emerald-700 font-mono">npm run build</code>. Output Directory: <code className="text-emerald-700 font-mono">dist</code>.
              </p>
              <p className="text-slate-600">
                4. Click <strong>Deploy</strong>. Your application is live instantly!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
          >
            Got it, return to FixMyStreet
          </button>
        </div>
      </div>
    </div>
  );
};
