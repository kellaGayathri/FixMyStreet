export type IssueCategory =
  | "Pothole"
  | "Garbage"
  | "Drainage Blockage"
  | "Water Leakage"
  | "Broken Streetlight"
  | "Damaged Infrastructure"
  | "Other";

export type ComplaintStatus =
  | "Submitted"
  | "Verified"
  | "In Progress"
  | "Resolved";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export type Department =
  | "Roads & Bridges Department"
  | "Solid Waste Management"
  | "Stormwater Drainage Division"
  | "Water Supply & Sewerage Board"
  | "Electrical & Public Lighting"
  | "Public Works Department"
  | "General Civic Maintenance";

export interface AIDetectionResult {
  issue_category: IssueCategory | string;
  confidence: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  recommended_department: Department | string;
  description: string;
  model_source?: string;
  detected_at?: string;
}

export interface StatusUpdateRecord {
  status: ComplaintStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface Complaint {
  complaintId: string;
  issueCategory: IssueCategory;
  description: string;
  photo: string;
  location: string;
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  priority: Priority;
  date: string;
  citizenName: string;
  citizenPhone?: string;
  citizenEmail?: string;
  assignedDepartment: Department;
  aiDetectionResult?: AIDetectionResult;
  statusHistory: StatusUpdateRecord[];
  adminNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "citizen" | "admin";
  ward?: string;
  department?: Department;
  joinedDate: string;
}

export type ActiveView =
  | "home"
  | "report"
  | "track"
  | "citizen-dashboard"
  | "admin-dashboard"
  | "login"
  | "register";
