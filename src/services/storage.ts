import { Complaint, ComplaintStatus, Priority, Department, User } from "../types";

const STORAGE_KEY = "fixmystreet_complaints_v2";
const MY_REPORTS_KEY = "fixmystreet_citizen_reports_v2";
const USERS_KEY = "fixmystreet_users_v2";
const CURRENT_USER_KEY = "fixmystreet_current_user_v2";

interface StoredAccount extends User {
  passwordHash: string;
}

export const DEFAULT_USERS: StoredAccount[] = [
  {
    id: "usr_citizen_01",
    name: "Rahul Sharma",
    email: "rahul.s@example.com",
    phone: "+91 98450 12345",
    role: "citizen",
    ward: "Ward 4 - Central Zone",
    joinedDate: "2026-07-15",
    passwordHash: "password123",
  },
  {
    id: "usr_admin_01",
    name: "Inspector Rajesh Verma",
    email: "admin@fixmystreet.gov",
    phone: "+91 94480 88990",
    role: "admin",
    ward: "Central Municipal Office",
    department: "Roads & Bridges Department",
    joinedDate: "2026-01-10",
    passwordHash: "admin123",
  },
];

export const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    complaintId: "FMS-2026-001",
    issueCategory: "Pothole",
    description: "Deep pothole spanning approximately 1.5 meters near the bus stop curb. Multiple two-wheelers have skidded during evening peak hours.",
    photo: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    location: "4th Cross Avenue, Near Central Park West Gate",
    latitude: 12.9716,
    longitude: 77.5946,
    status: "In Progress",
    priority: "High",
    date: "2026-08-30 09:15 AM",
    citizenName: "Rahul Sharma",
    citizenPhone: "+91 98450 12345",
    citizenEmail: "rahul.s@example.com",
    assignedDepartment: "Roads & Bridges Department",
    aiDetectionResult: {
      issue_category: "Pothole",
      confidence: 0.94,
      severity: "High",
      recommended_department: "Roads & Bridges Department",
      description: "Severe asphalt cavity and base layer deterioration detected. Priority patch resurfacing required.",
      model_source: "AI Vision Classifier",
      detected_at: "2026-08-30 09:16 AM",
    },
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-08-30 09:15 AM",
        note: "Complaint lodged via FixMyStreet Citizen Portal.",
        updatedBy: "Citizen",
      },
      {
        status: "Verified",
        timestamp: "2026-08-30 11:30 AM",
        note: "Civic field inspector confirmed road surface hazard.",
        updatedBy: "Inspector Verma (Zone 3)",
      },
      {
        status: "In Progress",
        timestamp: "2026-08-31 08:00 AM",
        note: "Road maintenance crew dispatched with cold-mix asphalt patch unit.",
        updatedBy: "Executive Engineer Kumar",
      },
    ],
    adminNotes: "Crew dispatched. Surface compacting scheduled for completion by 4:00 PM.",
  },
  {
    complaintId: "FMS-2026-002",
    issueCategory: "Garbage",
    description: "Community waste receptacle overflowing for 4 days. Stray animals scattering refuse across pedestrian walkway.",
    photo: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
    location: "Market Road, Behind Civic Supermarket Sector 4",
    latitude: 12.9785,
    longitude: 77.6012,
    status: "Verified",
    priority: "Medium",
    date: "2026-09-01 02:40 PM",
    citizenName: "Anita Desai",
    citizenPhone: "+91 97412 88765",
    citizenEmail: "anita.desai@example.com",
    assignedDepartment: "Solid Waste Management",
    aiDetectionResult: {
      issue_category: "Garbage",
      confidence: 0.96,
      severity: "Medium",
      recommended_department: "Solid Waste Management",
      description: "High volume solid organic and plastic waste backlog detected surrounding primary bin container.",
      model_source: "AI Vision Classifier",
      detected_at: "2026-09-01 02:41 PM",
    },
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-09-01 02:40 PM",
        note: "Complaint submitted with geotagged photo.",
        updatedBy: "Citizen",
      },
      {
        status: "Verified",
        timestamp: "2026-09-01 05:15 PM",
        note: "Sanitation supervisor verified overflowing secondary collection point.",
        updatedBy: "Sanitation Supervisor Rao",
      },
    ],
    adminNotes: "Compactor truck route updated to service this point on morning shift.",
  },
  {
    complaintId: "FMS-2026-003",
    issueCategory: "Water Leakage",
    description: "Potable water pipeline rupture underneath pavement creating localized flooding and loss of drinking water pressure.",
    photo: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80",
    location: "2nd Main Boulevard, Adjacent to Metro Station Pillar 142",
    latitude: 12.9654,
    longitude: 77.5832,
    status: "Submitted",
    priority: "Critical",
    date: "2026-09-03 08:20 AM",
    citizenName: "Karthik Nair",
    citizenPhone: "+91 99001 44556",
    citizenEmail: "karthik.n@example.com",
    assignedDepartment: "Water Supply & Sewerage Board",
    aiDetectionResult: {
      issue_category: "Water Leakage",
      confidence: 0.95,
      severity: "High",
      recommended_department: "Water Supply & Sewerage Board",
      description: "Active high-pressure subterranean fluid breach with pavement sub-base pooling identified.",
      model_source: "AI Vision Classifier",
      detected_at: "2026-09-03 08:21 AM",
    },
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-09-03 08:20 AM",
        note: "Critical water loss report received.",
        updatedBy: "Citizen",
      },
    ],
    adminNotes: "Emergency valve isolation crew alerted.",
  },
  {
    complaintId: "FMS-2026-004",
    issueCategory: "Broken Streetlight",
    description: "Cluster of 3 overhead streetlights dark for over a week, rendering the crosswalk hazardous for senior citizens and students.",
    photo: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    location: "Hospital Road, Junction with North Ring Boulevard",
    latitude: 12.9834,
    longitude: 77.5721,
    status: "Resolved",
    priority: "Low",
    date: "2026-08-25 07:10 PM",
    citizenName: "Pooja Hegde",
    citizenPhone: "+91 98860 99881",
    citizenEmail: "pooja.h@example.com",
    assignedDepartment: "Electrical & Public Lighting",
    aiDetectionResult: {
      issue_category: "Broken Streetlight",
      confidence: 0.91,
      severity: "Medium",
      recommended_department: "Electrical & Public Lighting",
      description: "Non-functional sodium luminaire fixture with ballast failure indicated.",
      model_source: "AI Vision Classifier",
      detected_at: "2026-08-25 07:11 PM",
    },
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-08-25 07:10 PM",
        note: "Issue submitted by resident.",
        updatedBy: "Citizen",
      },
      {
        status: "Verified",
        timestamp: "2026-08-26 10:00 AM",
        note: "Inspection noted phase fuse burnout on pole feeder panel.",
        updatedBy: "Electrical Linesman Patil",
      },
      {
        status: "In Progress",
        timestamp: "2026-08-26 03:00 PM",
        note: "Replacement LED fixtures installed and wired.",
        updatedBy: "Electrical Line Crew",
      },
      {
        status: "Resolved",
        timestamp: "2026-08-26 08:30 PM",
        note: "Night illumination test verified 100% operational lux output.",
        updatedBy: "Junior Engineer Electrical",
      },
    ],
    adminNotes: "Upgraded sodium lamps to energy-saving 65W LED street fixtures. Full resolution complete.",
  },
  {
    complaintId: "FMS-2026-005",
    issueCategory: "Drainage Blockage",
    description: "Stormwater catch basin choked with construction silt and plastic debris, causing sewage backflow after rain.",
    photo: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    location: "Industrial Link Road, Opposite Rail Goods Terminal",
    latitude: 12.9591,
    longitude: 77.6105,
    status: "Submitted",
    priority: "High",
    date: "2026-09-04 11:45 AM",
    citizenName: "Vikram Sen",
    citizenPhone: "+91 94481 33221",
    citizenEmail: "vikram.sen@example.com",
    assignedDepartment: "Stormwater Drainage Division",
    aiDetectionResult: {
      issue_category: "Drainage Blockage",
      confidence: 0.93,
      severity: "High",
      recommended_department: "Stormwater Drainage Division",
      description: "Severe silt sedimentation and culvert entrance blockage restricting flow capacity.",
      model_source: "AI Vision Classifier",
      detected_at: "2026-09-04 11:46 AM",
    },
    statusHistory: [
      {
        status: "Submitted",
        timestamp: "2026-09-04 11:45 AM",
        note: "Report registered with photo evidence.",
        updatedBy: "Citizen",
      },
    ],
    adminNotes: "Suction desilting machine requisitioned.",
  },
];

export const StorageService = {
  getComplaints(): Complaint[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Seed with sample data on first run
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_COMPLAINTS));
        return SAMPLE_COMPLAINTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn("Storage read error, using sample data:", e);
      return SAMPLE_COMPLAINTS;
    }
  },

  getComplaintById(id: string): Complaint | undefined {
    const list = this.getComplaints();
    const clean = (id || "").trim().toUpperCase();
    return list.find((c) => c.complaintId.toUpperCase() === clean);
  },

  generateNextComplaintId(): string {
    const list = this.getComplaints();
    const year = new Date().getFullYear();
    const prefix = `FMS-${year}-`;
    
    const numbers = list
      .map((c) => {
        const parts = c.complaintId.split("-");
        return parts.length === 3 ? parseInt(parts[2], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNum = (maxNum + 1).toString().padStart(3, "0");
    return `${prefix}${nextNum}`;
  },

  createComplaint(complaintData: Omit<Complaint, "complaintId" | "date" | "statusHistory">): Complaint {
    const newId = this.generateNextComplaintId();
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) + " " + now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newComplaint: Complaint = {
      ...complaintData,
      complaintId: newId,
      date: dateFormatted,
      statusHistory: [
        {
          status: complaintData.status || "Submitted",
          timestamp: dateFormatted,
          note: "Civic complaint formally recorded on FixMyStreet portal.",
          updatedBy: complaintData.citizenName || "Citizen",
        },
      ],
    };

    const list = this.getComplaints();
    const updatedList = [newComplaint, ...list];
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      this.addCitizenReportId(newId);
    } catch (e) {
      console.error("Storage write error:", e);
    }

    return newComplaint;
  },

  updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    note: string,
    updatedBy: string = "Municipal Authority",
    department?: Department,
    priority?: Priority
  ): Complaint | null {
    const list = this.getComplaints();
    const index = list.findIndex((c) => c.complaintId.toUpperCase() === id.toUpperCase());
    if (index === -1) return null;

    const now = new Date();
    const timestamp = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) + " " + now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const current = list[index];
    const newHistoryRecord = {
      status: newStatus,
      timestamp,
      note: note || `Status transitioned to ${newStatus}`,
      updatedBy,
    };

    const updated: Complaint = {
      ...current,
      status: newStatus,
      assignedDepartment: department || current.assignedDepartment,
      priority: priority || current.priority,
      adminNotes: note ? `${note} (${timestamp})` : current.adminNotes,
      statusHistory: [newHistoryRecord, ...current.statusHistory],
    };

    list[index] = updated;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to update complaint in storage:", e);
    }

    return updated;
  },

  getCitizenReportIds(): string[] {
    try {
      const data = localStorage.getItem(MY_REPORTS_KEY);
      return data ? JSON.parse(data) : ["FMS-2026-001", "FMS-2026-003"];
    } catch {
      return ["FMS-2026-001", "FMS-2026-003"];
    }
  },

  addCitizenReportId(id: string) {
    try {
      const current = this.getCitizenReportIds();
      if (!current.includes(id)) {
        localStorage.setItem(MY_REPORTS_KEY, JSON.stringify([id, ...current]));
      }
    } catch (e) {
      console.error("Failed to save report id:", e);
    }
  },

  resetToDefault() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_COMPLAINTS));
      localStorage.setItem(MY_REPORTS_KEY, JSON.stringify(["FMS-2026-001", "FMS-2026-003"]));
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
      console.error("Reset error:", e);
    }
  },

  /* ---------------- AUTHENTICATION & USER MANAGEMENT ---------------- */
  getAccounts(): StoredAccount[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (!data) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_USERS;
    }
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Default to logged-out initially, or user can click quick demo login
      return null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error("Failed to set current user:", e);
    }
  },

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const cleanEmail = (email || "").trim().toLowerCase();
    const accounts = this.getAccounts();
    const found = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!found) {
      return {
        success: false,
        error: "No account found with this email address.",
      };
    }

    if (found.passwordHash !== password) {
      return {
        success: false,
        error: "Invalid password. Please check your credentials.",
      };
    }

    const { passwordHash, ...userProfile } = found;
    this.setCurrentUser(userProfile);
    return {
      success: true,
      user: userProfile,
    };
  },

  register(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: "citizen" | "admin";
    ward?: string;
    department?: Department;
  }): { success: boolean; user?: User; error?: string } {
    const cleanEmail = (data.email || "").trim().toLowerCase();
    if (!cleanEmail || !data.name.trim() || !data.password) {
      return { success: false, error: "Please provide all required fields." };
    }

    const accounts = this.getAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: "An account with this email address already exists. Please sign in instead.",
      };
    }

    const newUser: StoredAccount = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone?.trim() || "",
      role: data.role,
      ward: data.ward?.trim() || (data.role === "citizen" ? "Ward 4 - Central Zone" : "City Administration"),
      department: data.department,
      joinedDate: new Date().toISOString().slice(0, 10),
      passwordHash: data.password,
    };

    const updated = [...accounts, newUser];
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist new user:", e);
    }

    const { passwordHash, ...userProfile } = newUser;
    this.setCurrentUser(userProfile);
    return {
      success: true,
      user: userProfile,
    };
  },

  logout(): void {
    this.setCurrentUser(null);
  },
};
