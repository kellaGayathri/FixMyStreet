import React, { useState } from "react";
import {
  Building2,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  FileCheck2,
  AlertTriangle,
  Download,
  RotateCcw,
  Eye,
  Edit3,
  MapPin,
  Sparkles,
  ChevronDown,
  Layers,
  Map as MapIcon,
  List,
} from "lucide-react";
import {
  Complaint,
  ComplaintStatus,
  IssueCategory,
  Priority,
  Department,
} from "../types";
import { StorageService } from "../services/storage";
import { CivicMapView } from "./CivicMapView";

interface AdminDashboardProps {
  complaints: Complaint[];
  onRefresh: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

const DEPARTMENTS_LIST: Department[] = [
  "Roads & Bridges Department",
  "Solid Waste Management",
  "Stormwater Drainage Division",
  "Water Supply & Sewerage Board",
  "Electrical & Public Lighting",
  "Public Works Department",
  "General Civic Maintenance",
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  complaints,
  onRefresh,
  onSelectComplaint,
}) => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"table" | "map">("table");

  // Status Update Modal State
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("In Progress");
  const [newDepartment, setNewDepartment] = useState<Department>("Roads & Bridges Department");
  const [newPriority, setNewPriority] = useState<Priority>("High");
  const [updateNote, setUpdateNote] = useState("");
  const [officerName, setOfficerName] = useState("Municipal Field Officer");

  // Summary Metrics
  const totalCount = complaints.length;
  const submittedCount = complaints.filter((c) => c.status === "Submitted").length;
  const verifiedCount = complaints.filter((c) => c.status === "Verified").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;
  const criticalCount = complaints.filter((c) => c.priority === "Critical" || c.priority === "High").length;

  // Filtered complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      !searchTerm ||
      c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issueCategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || c.issueCategory === categoryFilter;
    const matchesPriority = priorityFilter === "All" || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleOpenEditModal = (c: Complaint) => {
    setEditingComplaint(c);
    setNewStatus(c.status);
    setNewDepartment(c.assignedDepartment);
    setNewPriority(c.priority);
    setUpdateNote("");
  };

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplaint) return;

    StorageService.updateComplaintStatus(
      editingComplaint.complaintId,
      newStatus,
      updateNote.trim() || `Status updated to ${newStatus} by ${officerName}`,
      officerName,
      newDepartment,
      newPriority
    );

    setEditingComplaint(null);
    onRefresh();
  };

  const handleResetData = () => {
    if (confirm("Reset municipal database to sample demonstration state?")) {
      StorageService.resetToDefault();
      onRefresh();
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Complaint ID",
      "Category",
      "Description",
      "Status",
      "Priority",
      "Department",
      "Location",
      "Citizen Name",
      "Date",
    ];

    const rows = filtered.map((c) => [
      `"${c.complaintId}"`,
      `"${c.issueCategory}"`,
      `"${c.description.replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${c.priority}"`,
      `"${c.assignedDepartment}"`,
      `"${c.location.replace(/"/g, '""')}"`,
      `"${c.citizenName}"`,
      `"${c.date}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fixmystreet_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-dashboard-page" className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            FEATURE 4: Municipal Authority Command Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Municipal Admin Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Review citizen complaints, inspect AI confidence scores, reassign departments, and update resolution states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-csv-btn"
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            id="reset-demo-data-btn"
            type="button"
            onClick={handleResetData}
            title="Reset to sample CSE demo records"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Data
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Issues</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-white border border-amber-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Submitted
          </span>
          <span className="text-2xl font-extrabold text-amber-700 mt-1 block">{submittedCount}</span>
        </div>
        <div className="bg-white border border-blue-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 block flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5" /> Verified
          </span>
          <span className="text-2xl font-extrabold text-blue-700 mt-1 block">{verifiedCount}</span>
        </div>
        <div className="bg-white border border-purple-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-purple-700 block flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5" /> In Progress
          </span>
          <span className="text-2xl font-extrabold text-purple-700 mt-1 block">{inProgressCount}</span>
        </div>
        <div className="bg-white border border-emerald-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{resolvedCount}</span>
        </div>
        <div className="bg-white border border-red-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-red-700 block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> High / Critical
          </span>
          <span className="text-2xl font-extrabold text-red-700 mt-1 block">{criticalCount}</span>
        </div>
      </div>

      {/* Control Bar: Search, Filters & View Toggle */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              id="admin-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID (FMS-2026-001), category, citizen, or street..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              id="view-table-btn"
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Table View
            </button>
            <button
              id="view-map-btn"
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "map"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Ward Map View
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-600 flex items-center gap-1 font-semibold text-[11px]">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Verified">Verified</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-600"
          >
            <option value="All">All Categories</option>
            <option value="Pothole">Potholes</option>
            <option value="Garbage">Garbage</option>
            <option value="Drainage Blockage">Drainage</option>
            <option value="Water Leakage">Water Leaks</option>
            <option value="Broken Streetlight">Streetlights</option>
            <option value="Damaged Infrastructure">Infrastructure</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-600"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {(statusFilter !== "All" || categoryFilter !== "All" || priorityFilter !== "All" || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("All");
                setCategoryFilter("All");
                setPriorityFilter("All");
                setSearchTerm("");
              }}
              className="text-slate-500 hover:text-slate-900 underline text-[11px] ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* CONTENT: MAP VIEW OR TABLE VIEW */}
      {viewMode === "map" ? (
        <div className="space-y-4">
          <CivicMapView
            mode="viewer"
            complaints={filtered}
            onSelectComplaint={(c) => onSelectComplaint(c)}
          />
          <p className="text-xs text-slate-500 text-center">
            Click any pin on the ward map to inspect the complaint card and view quick actions.
          </p>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Complaint ID</th>
                  <th className="py-3.5 px-4">Category & Photo</th>
                  <th className="py-3.5 px-4">Location & Citizen</th>
                  <th className="py-3.5 px-4">Assigned Department</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((c) => (
                    <tr
                      key={c.complaintId}
                      className="hover:bg-slate-50/70 transition group"
                    >
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {c.complaintId}
                      </td>

                      {/* Category & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.photo}
                            alt={c.issueCategory}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{c.issueCategory}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                              {c.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location & Citizen */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 line-clamp-1 max-w-[200px]">
                          {c.location}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Reported by: <span className="text-slate-700 font-medium">{c.citizenName}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4">
                        <span className="text-slate-900 block truncate max-w-[180px]">
                          {c.assignedDepartment}
                        </span>
                        {c.aiDetectionResult && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                            <Sparkles className="w-3 h-3 text-emerald-600" /> AI {Math.round(c.aiDetectionResult.confidence * 100)}%
                          </span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.priority === "Critical"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : c.priority === "High"
                              ? "bg-orange-50 text-orange-700 border border-orange-200"
                              : c.priority === "Medium"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
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
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectComplaint(c)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition"
                            title="View Full Complaint Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(c)}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition flex items-center gap-1 shadow-2xs"
                            title="Update Status & Department"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      No complaints match the selected filters or search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-900">
            <div className="flex items-start justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {editingComplaint.complaintId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Manage Complaint & Update Status
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingComplaint(null)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStatusUpdate} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Complaint Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["Submitted", "Verified", "In Progress", "Resolved"] as ComplaintStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setNewStatus(st)}
                        className={`py-2 px-2.5 rounded-xl font-bold border transition text-center ${
                          newStatus === st
                            ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Municipal Department
                </label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value as Department)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl p-2.5 text-slate-900 outline-none transition"
                >
                  {DEPARTMENTS_LIST.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Severity Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Priority)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl p-2.5 text-slate-900 outline-none transition"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Field Action / Resolution Remark
                </label>
                <textarea
                  rows={3}
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="e.g. Dispatched bitumen patching team with roller. Work completed and verified by junior engineer."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl p-2.5 text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Updating Authority Officer / Designation
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl p-2.5 text-slate-900 outline-none transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  id="save-status-update-btn"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Save & Publish Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
