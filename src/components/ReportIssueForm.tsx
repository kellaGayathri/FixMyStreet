import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Info,
  ShieldAlert,
  Sliders,
  Copy,
  Check,
} from "lucide-react";
import {
  IssueCategory,
  Priority,
  Department,
  AIDetectionResult,
  Complaint,
} from "../types";
import { CivicMapView } from "./CivicMapView";
import { AIService } from "../services/aiService";
import { StorageService } from "../services/storage";

interface ReportIssueFormProps {
  onSuccess: (complaint: Complaint) => void;
  onNavigateToTrack: (id: string) => void;
}

const ISSUE_CATEGORIES: { id: IssueCategory; label: string; icon: string; desc: string }[] = [
  { id: "Pothole", label: "Pothole / Road Damage", icon: "🕳️", desc: "Cavities, craters, broken bitumen or road depressions" },
  { id: "Garbage", label: "Garbage & Waste Dump", icon: "🗑️", desc: "Overflowing municipal bins, uncollected refuse, illegal dumping" },
  { id: "Drainage Blockage", label: "Drainage Blockage", icon: "🌊", desc: "Choked storm drains, overflowing sewers, roadside silt" },
  { id: "Water Leakage", label: "Water Pipe Leakage", icon: "💧", desc: "Burst drinking water pipelines, high pressure fountain leaks" },
  { id: "Broken Streetlight", label: "Broken Streetlight", icon: "💡", desc: "Dark luminaires, broken lampposts, exposed wiring" },
  { id: "Damaged Infrastructure", label: "Damaged Infrastructure", icon: "🚧", desc: "Cracked sidewalks, broken bridges, collapsed handrails" },
  { id: "Other", label: "Other Civic Anomaly", icon: "⚠️", desc: "Miscellaneous municipal issues requiring field attention" },
];

const SAMPLE_PHOTOS = [
  {
    label: "Pothole Sample",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    category: "Pothole" as IssueCategory,
  },
  {
    label: "Garbage Overflow",
    url: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
    category: "Garbage" as IssueCategory,
  },
  {
    label: "Water Leak",
    url: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80",
    category: "Water Leakage" as IssueCategory,
  },
  {
    label: "Streetlight Issue",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    category: "Broken Streetlight" as IssueCategory,
  },
];

const DEPARTMENT_MAP: Record<IssueCategory, Department> = {
  Pothole: "Roads & Bridges Department",
  Garbage: "Solid Waste Management",
  "Drainage Blockage": "Stormwater Drainage Division",
  "Water Leakage": "Water Supply & Sewerage Board",
  "Broken Streetlight": "Electrical & Public Lighting",
  "Damaged Infrastructure": "Public Works Department",
  Other: "General Civic Maintenance",
};

export const ReportIssueForm: React.FC<ReportIssueFormProps> = ({
  onSuccess,
  onNavigateToTrack,
}) => {
  // Form State
  const [category, setCategory] = useState<IssueCategory>("Pothole");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [locationAddress, setLocationAddress] = useState("Central Park West Gate");
  const [lat, setLat] = useState<number>(12.9716);
  const [lng, setLng] = useState<number>(77.5946);
  const [citizenName, setCitizenName] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
  const [priority, setPriority] = useState<Priority>("High");

  // AI State
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState<AIDetectionResult | null>(null);
  const [aiApplied, setAiApplied] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo Upload Handler (Supports drag/drop & file selection)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPhotoUrl(base64);
      setAiResult(null);
      setAiApplied(false);
      // Auto trigger AI analysis for seamless citizen vibe
      triggerAIAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSamplePhoto = (sample: typeof SAMPLE_PHOTOS[0]) => {
    setPhotoUrl(sample.url);
    setCategory(sample.category);
    setAiResult(null);
    setAiApplied(false);
    triggerAIAnalysis(sample.url, sample.category);
  };

  // FEATURE 5 — AI Analysis Trigger
  const triggerAIAnalysis = async (imgData: string, hintCategory?: string) => {
    setAnalyzingAI(true);
    setErrorMessage(null);
    try {
      const result = await AIService.detectIssue({
        imageBase64: imgData,
        userNotes: description,
        categoryHint: hintCategory || category,
      });
      setAiResult(result);
    } catch (err: any) {
      console.warn("AI analysis error:", err);
      // Fallback response guarantees no crash
      setAiResult(AIService.runLocalCivicClassifier(description, category));
    } finally {
      setAnalyzingAI(false);
    }
  };

  const applyAIRecommendations = () => {
    if (!aiResult) return;
    if (aiResult.issue_category && ISSUE_CATEGORIES.some((c) => c.id === aiResult.issue_category)) {
      setCategory(aiResult.issue_category as IssueCategory);
    }
    if (aiResult.severity) {
      setPriority(aiResult.severity as Priority);
    }
    if (!description && aiResult.description) {
      setDescription(aiResult.description);
    }
    setAiApplied(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!description.trim()) {
      setErrorMessage("Please enter a description explaining the issue.");
      return;
    }
    if (!photoUrl) {
      setErrorMessage("Please upload a photo of the civic issue or select a demo sample.");
      return;
    }
    if (!locationAddress.trim()) {
      setErrorMessage("Please select a location on the map or enter a landmark.");
      return;
    }
    if (!citizenName.trim()) {
      setErrorMessage("Please enter your name as the reporting citizen.");
      return;
    }

    setSubmitting(true);

    try {
      const assignedDepartment = DEPARTMENT_MAP[category] || "General Civic Maintenance";

      const newComplaint = StorageService.createComplaint({
        issueCategory: category,
        description: description.trim(),
        photo: photoUrl,
        location: locationAddress,
        latitude: lat,
        longitude: lng,
        status: "Submitted",
        priority,
        citizenName: citizenName.trim(),
        citizenPhone: citizenPhone.trim() || undefined,
        assignedDepartment,
        aiDetectionResult: aiResult || undefined,
      });

      setSubmitting(false);
      setCreatedComplaint(newComplaint);
      onSuccess(newComplaint);
    } catch (err: any) {
      setSubmitting(false);
      setErrorMessage("Something went wrong while lodging the complaint. Please try again.");
      console.error(err);
    }
  };

  const copyComplaintId = () => {
    if (!createdComplaint) return;
    navigator.clipboard.writeText(createdComplaint.complaintId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  // SUCCESS CONFIRMATION MODAL
  if (createdComplaint) {
    return (
      <div id="complaint-success-card" className="max-w-2xl mx-auto my-10 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs text-slate-800">
        <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2 font-display">
          Civic Complaint Registered Successfully!
        </h2>
        <p className="text-slate-600 text-center text-sm mb-6 max-w-md mx-auto">
          Your complaint has been submitted to the municipal authority and routed to the{" "}
          <strong className="text-emerald-700">{createdComplaint.assignedDepartment}</strong>.
        </p>

        {/* Unique Complaint ID Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
              Unique Complaint Tracking ID
            </span>
            <span className="text-2xl font-mono font-extrabold text-emerald-700 tracking-wider">
              {createdComplaint.complaintId}
            </span>
          </div>

          <button
            id="copy-complaint-id-btn"
            type="button"
            onClick={copyComplaintId}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition shadow-2xs"
          >
            {copiedId ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy ID
              </>
            )}
          </button>
        </div>

        {/* Complaint Summary Summary Box */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-xs space-y-2 mb-6">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Category:</span>
            <span className="font-semibold text-slate-900">{createdComplaint.issueCategory}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Location:</span>
            <span className="font-semibold text-slate-900">{createdComplaint.location}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Initial Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
              {createdComplaint.status}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Assigned Department:</span>
            <span className="font-semibold text-emerald-700">{createdComplaint.assignedDepartment}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="track-complaint-now-btn"
            type="button"
            onClick={() => onNavigateToTrack(createdComplaint.complaintId)}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition shadow-xs"
          >
            Track Status Live
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="report-another-btn"
            type="button"
            onClick={() => {
              setCreatedComplaint(null);
              setDescription("");
              setPhotoUrl("");
              setAiResult(null);
              setAiApplied(false);
            }}
            className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-300 transition shadow-2xs"
          >
            Report Another Problem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="report-issue-form-page" className="max-w-4xl mx-auto my-8 px-4">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          FEATURE 1 & 2: Citizen Issue Lodgement
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          Report a Civic Problem
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Upload photo evidence, pinpoint the location on the municipal map, and let our AI classify the department.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Validation Notice</p>
            <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: PHOTO UPLOAD & AI DETECTION (FEATURE 2 & FEATURE 5) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                1. Photo Upload & AI Classification
              </h3>
              <p className="text-xs text-slate-500">
                Upload a real photo or select a quick student sample below.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              AI Vision Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Area / Dropzone */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-file-input"
              />

              {photoUrl ? (
                <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] shadow-2xs">
                  <img
                    src={photoUrl}
                    alt="Civic issue preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold transition shadow-xs"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerAIAnalysis(photoUrl)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-Analyze AI
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  id="photo-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-slate-100/70 rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center aspect-[4/3]"
                >
                  <div className="w-12 h-12 rounded-lg bg-white shadow-2xs border border-slate-200 text-emerald-600 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Click or drag image here</span>
                  <span className="text-xs text-slate-500 mt-1">Supports PNG, JPG, JPEG (Max 15MB)</span>
                  <span className="mt-3 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Camera & Geotag Capable
                  </span>
                </div>
              )}

              {/* Quick Preset Civic Samples for Student Testing */}
              <div className="mt-3">
                <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                  Or pick a test sample (Student CSE Testing):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSamplePhoto(sample)}
                      className="text-[11px] p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-left truncate transition shadow-2xs"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FEATURE 5: AI RESULT CARD */}
            <div className="flex flex-col justify-between">
              {analyzingAI ? (
                <div className="h-full bg-slate-50 border border-emerald-300 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-sm font-semibold text-slate-900">AI Vision Engine Scanning...</span>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Classifying civic hazard category, detecting damage severity, and routing to municipal department.
                  </p>
                </div>
              ) : aiResult ? (
                <div id="ai-result-card" className="h-full bg-slate-50 border border-emerald-300 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                          AI Issue Classification Result
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                        {aiResult.model_source || "AI Engine"}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      <div>
                        <span className="text-[11px] text-slate-500">Detected Category:</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-base font-extrabold text-slate-900">
                            {aiResult.issue_category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {Math.round(aiResult.confidence * 100)}% Confidence
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                          <span className="text-slate-500 text-[10px] block">Severity</span>
                          <span
                            className={`font-bold ${
                              aiResult.severity === "High"
                                ? "text-red-600"
                                : aiResult.severity === "Medium"
                                ? "text-amber-600"
                                : "text-emerald-700"
                            }`}
                          >
                            {aiResult.severity}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                          <span className="text-slate-500 text-[10px] block">Recommended Dept</span>
                          <span className="font-semibold text-slate-800 truncate block">
                            {aiResult.recommended_department}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 shadow-2xs">
                        <span className="text-slate-700 font-semibold block text-[10px] mb-0.5">
                          AI Visual Assessment:
                        </span>
                        {aiResult.description}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <button
                      id="apply-ai-btn"
                      type="button"
                      onClick={applyAIRecommendations}
                      disabled={aiApplied}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                        aiApplied
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      }`}
                    >
                      {aiApplied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          AI Recommendations Applied to Form
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Apply AI Recommendations to Form
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                  <Sparkles className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm font-semibold text-slate-700">AI Civic Classifier Ready</span>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Upload a photo or pick a sample on the left to automatically trigger visual categorization.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: ISSUE CATEGORY & DETAILS (FEATURE 1) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            2. Issue Category & Description
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Select the problem type and provide details to help municipal crews resolve it swiftly.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-5">
            {ISSUE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategory(cat.id);
                  setAiApplied(false);
                }}
                className={`p-3 rounded-lg text-left border transition flex flex-col justify-between ${
                  category === cat.id
                    ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-500"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="text-xl mb-1.5">{cat.icon}</div>
                <div>
                  <div className="font-semibold text-xs text-slate-900">{cat.label}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{cat.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="complaint-description" className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description of the Civic Problem <span className="text-red-500">*</span>
              </label>
              <textarea
                id="complaint-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the severity, physical dimensions, exact landmarks, or public safety hazard..."
                className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 transition outline-none shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Severity Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-lg p-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                >
                  <option value="Low">Low (Non-emergency civic maintenance)</option>
                  <option value="Medium">Medium (Affecting local traffic/comfort)</option>
                  <option value="High">High (Immediate pedestrian or vehicle hazard)</option>
                  <option value="Critical">Critical (Severe hazard, pipe rupture, life risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Routing Municipal Department (Auto-Assigned)
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-emerald-700 font-semibold truncate">
                  {DEPARTMENT_MAP[category]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: LOCATION & INTERACTIVE MAP (FEATURE 2) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                3. Location & Civic Map Geotag
              </h3>
              <p className="text-xs text-slate-500">
                Click directly on the municipal map or use current GPS to set the exact coordinates.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <CivicMapView
              mode="picker"
              selectedLat={lat}
              selectedLng={lng}
              selectedAddress={locationAddress}
              onLocationSelect={(newLat, newLng, address) => {
                setLat(newLat);
                setLng(newLng);
                setLocationAddress(address);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2">
                <label htmlFor="location-address-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address / Landmark <span className="text-red-500">*</span>
                </label>
                <input
                  id="location-address-input"
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="e.g. 4th Cross Avenue, Near Central Park West Gate"
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-lg p-2.5 text-xs text-slate-900 outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Coordinates (Lat, Lng)
                </label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-600 truncate">
                  {lat}°N, {lng}°E
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: CITIZEN CONTACT INFO */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            4. Citizen Reporting Details
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Required for verification and status notification updates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="citizen-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="citizen-name-input"
                type="text"
                required
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-lg p-2.5 text-xs text-slate-900 outline-none shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="citizen-phone-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone Number (Optional)
              </label>
              <input
                id="citizen-phone-input"
                type="tel"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                placeholder="e.g. +91 98450 12345"
                className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-lg p-2.5 text-xs text-slate-900 outline-none shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON BAR */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            id="submit-civic-issue-btn"
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering Complaint...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Submit Civic Complaint
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
