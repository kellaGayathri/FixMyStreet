import React, { useState } from "react";
import { MapPin, Navigation, Compass, CheckCircle2 } from "lucide-react";
import { Complaint } from "../types";

interface CivicMapViewProps {
  mode?: "picker" | "viewer";
  selectedLat?: number;
  selectedLng?: number;
  selectedAddress?: string;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  complaints?: Complaint[];
  onSelectComplaint?: (complaint: Complaint) => void;
}

// Preset landmarks in the municipal area for quick student testing
export const CIVIC_LANDMARKS = [
  { name: "Central Park West Gate", lat: 12.9716, lng: 77.5946, x: 280, y: 190 },
  { name: "City Market Road Sector 4", lat: 12.9785, lng: 77.6012, x: 520, y: 130 },
  { name: "Metro Station Pillar 142", lat: 12.9654, lng: 77.5832, x: 190, y: 310 },
  { name: "Civil Hospital Junction", lat: 12.9834, lng: 77.5721, x: 140, y: 90 },
  { name: "Industrial Corridor Link", lat: 12.9591, lng: 77.6105, x: 610, y: 370 },
  { name: "Municipal Town Hall Square", lat: 12.9745, lng: 77.5901, x: 380, y: 220 },
];

export const CivicMapView: React.FC<CivicMapViewProps> = ({
  mode = "viewer",
  selectedLat = 12.9716,
  selectedLng = 77.5946,
  selectedAddress = "Central Park West Gate",
  onLocationSelect,
  complaints = [],
  onSelectComplaint,
}) => {
  const [pinPosition, setPinPosition] = useState<{ x: number; y: number }>({
    x: 380,
    y: 220,
  });
  const [geoLocating, setGeoLocating] = useState(false);
  const [activePinComplaint, setActivePinComplaint] = useState<Complaint | null>(null);

  // SVG coordinate bounds mapped to approximate municipal coordinates
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== "picker" || !onLocationSelect) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const svgWidth = 800;
    const svgHeight = 460;
    const clickX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const clickY = ((e.clientY - rect.top) / rect.height) * svgHeight;

    setPinPosition({ x: clickX, y: clickY });

    // Approximate lat/long conversion for city bounding box
    const lat = +(12.99 - (clickY / svgHeight) * 0.04).toFixed(4);
    const lng = +(77.56 + (clickX / svgWidth) * 0.06).toFixed(4);

    // Find nearest landmark or generate street address
    let closestLandmark = CIVIC_LANDMARKS[0];
    let minDistance = 999999;

    CIVIC_LANDMARKS.forEach((lm) => {
      const dist = Math.hypot(lm.x - clickX, lm.y - clickY);
      if (dist < minDistance) {
        minDistance = dist;
        closestLandmark = lm;
      }
    });

    const streetName =
      minDistance < 60
        ? `Near ${closestLandmark.name}`
        : `Civic Sector Road ${Math.floor(clickX / 80) + 1}, Cross ${Math.floor(clickY / 60) + 1}`;

    onLocationSelect(lat, lng, streetName);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const lat = +pos.coords.latitude.toFixed(4);
        const lng = +pos.coords.longitude.toFixed(4);
        const addr = `Current GPS Location (${lat}, ${lng})`;
        setPinPosition({ x: 400, y: 230 });
        if (onLocationSelect) {
          onLocationSelect(lat, lng, addr);
        }
      },
      (err) => {
        setGeoLocating(false);
        console.warn("GPS error, defaulting to central civic landmark:", err.message);
        // Graceful fallback to central civic landmark
        const fallback = CIVIC_LANDMARKS[5];
        setPinPosition({ x: fallback.x, y: fallback.y });
        if (onLocationSelect) {
          onLocationSelect(fallback.lat, fallback.lng, fallback.name);
        }
      },
      { timeout: 8000 }
    );
  };

  const handleLandmarkClick = (lm: (typeof CIVIC_LANDMARKS)[0]) => {
    setPinPosition({ x: lm.x, y: lm.y });
    if (onLocationSelect) {
      onLocationSelect(lm.lat, lm.lng, lm.name);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "#f59e0b"; // amber
      case "Verified":
        return "#3b82f6"; // blue
      case "In Progress":
        return "#8b5cf6"; // purple
      case "Resolved":
        return "#10b981"; // emerald
      default:
        return "#64748b";
    }
  };

  return (
    <div id="civic-map-container" className="w-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs">
      {/* Map Control Bar */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
          <span className="font-semibold text-slate-800">
            {mode === "picker" ? "Interactive Location Picker (Click anywhere to drop pin)" : "Municipal Civic Ward Map"}
          </span>
        </div>

        {mode === "picker" ? (
          <div className="flex items-center gap-2">
            <button
              id="use-current-location-btn"
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition shadow-2xs disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${geoLocating ? "animate-spin" : ""}`} />
              {geoLocating ? "Acquiring GPS..." : "Use Current Location"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Submitted</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Verified</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> In Progress</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Resolved</span>
          </div>
        )}
      </div>

      {/* SVG Stylized Civic Map Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[420px] bg-slate-50 cursor-crosshair overflow-hidden select-none">
        <svg
          viewBox="0 0 800 460"
          className="w-full h-full"
          onClick={handleMapClick}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="460" fill="#f8fafc" />
          <rect width="800" height="460" fill="url(#grid)" />

          {/* City River */}
          <path
            d="M 0 380 Q 200 320 400 350 T 800 290"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="28"
            opacity="0.6"
          />
          <path
            d="M 0 380 Q 200 320 400 350 T 800 290"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="12"
            opacity="0.7"
          />
          <text x="310" y="345" fill="#0284c7" fontSize="10" fontWeight="600" opacity="0.8">
            RIVERFRONT CORRIDOR
          </text>

          {/* City Parks / Green Belts */}
          <rect x="230" y="140" width="130" height="90" rx="12" fill="#dcfce7" opacity="0.7" stroke="#86efac" strokeWidth="1" />
          <text x="255" y="190" fill="#15803d" fontSize="10" fontWeight="600" opacity="0.9">
            CENTRAL PARK
          </text>

          <rect x="580" y="60" width="140" height="70" rx="10" fill="#dcfce7" opacity="0.6" stroke="#86efac" strokeWidth="1" />
          <text x="610" y="100" fill="#15803d" fontSize="9" fontWeight="600" opacity="0.8">
            BOTANICAL BELT
          </text>

          {/* Major Roads & Highways */}
          {/* Main Ring Road */}
          <path
            d="M 80 40 L 720 40 L 740 420 L 60 420 Z"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          {/* Inner Arterial Roads */}
          <line x1="80" y1="230" x2="720" y2="230" stroke="#94a3b8" strokeWidth="8" />
          <line x1="400" y1="40" x2="400" y2="420" stroke="#94a3b8" strokeWidth="8" />
          <line x1="220" y1="40" x2="220" y2="420" stroke="#cbd5e1" strokeWidth="5" />
          <line x1="580" y1="40" x2="580" y2="420" stroke="#cbd5e1" strokeWidth="5" />
          <line x1="80" y1="130" x2="720" y2="130" stroke="#cbd5e1" strokeWidth="5" />
          <line x1="80" y1="330" x2="720" y2="330" stroke="#cbd5e1" strokeWidth="5" />

          {/* Road Labels */}
          <text x="410" y="70" fill="#64748b" fontSize="8" fontWeight="600" letterSpacing="1">
            NORTH-SOUTH METRO EXPRESSWAY
          </text>
          <text x="100" y="222" fill="#64748b" fontSize="8" fontWeight="600" letterSpacing="1">
            2ND MAIN ARTERIAL BOULEVARD
          </text>
          <text x="460" y="122" fill="#94a3b8" fontSize="8">
            MARKET CONNECTOR
          </text>
          <text x="100" y="322" fill="#94a3b8" fontSize="8">
            HOSPITAL AVENUE
          </text>

          {/* Municipal Landmark Pins */}
          {CIVIC_LANDMARKS.map((lm, idx) => (
            <g
              key={idx}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleLandmarkClick(lm);
              }}
            >
              <circle cx={lm.x} cy={lm.y} r="6" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              <circle cx={lm.x} cy={lm.y} r="2.5" fill="#0284c7" />
              <text x={lm.x + 10} y={lm.y + 4} fill="#334155" fontSize="9" fontWeight="600">
                {lm.name}
              </text>
            </g>
          ))}

          {/* Mode: VIEWER - Display all reported complaints as colored markers */}
          {mode === "viewer" &&
            complaints.map((c) => {
              const normalizedX = Math.max(
                70,
                Math.min(730, 80 + ((c.longitude - 77.56) / 0.06) * 640)
              );
              const normalizedY = Math.max(
                40,
                Math.min(420, 420 - ((c.latitude - 12.95) / 0.04) * 380)
              );

              const color = getStatusColor(c.status);

              return (
                <g
                  key={c.complaintId}
                  className="cursor-pointer transition hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePinComplaint(c);
                    if (onSelectComplaint) onSelectComplaint(c);
                  }}
                >
                  <circle cx={normalizedX} cy={normalizedY} r="14" fill={color} opacity="0.2" className="animate-ping" />
                  <circle cx={normalizedX} cy={normalizedY} r="8" fill={color} stroke="#ffffff" strokeWidth="2" />
                  <text
                    x={normalizedX}
                    y={normalizedY + 2.5}
                    fill="#ffffff"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    !
                  </text>
                </g>
              );
            })}

          {/* Mode: PICKER - Current dropped pin */}
          {mode === "picker" && (
            <g transform={`translate(${pinPosition.x}, ${pinPosition.y})`} className="pointer-events-none">
              <ellipse cx="0" cy="0" rx="10" ry="4" fill="#000000" opacity="0.25" />
              <path
                d="M 0 -26 C -8 -26 -12 -20 -12 -12 C -12 -2 0 0 0 0 C 0 0 12 -2 12 -12 C 12 -20 8 -26 0 -26 Z"
                fill="#059669"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="-14" r="4" fill="#ffffff" />
            </g>
          )}
        </svg>

        {/* Selected Complaint Popup on Map View */}
        {activePinComplaint && mode === "viewer" && (
          <div
            className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm bg-white/95 border border-slate-200 text-slate-900 rounded-xl p-3.5 shadow-lg backdrop-blur-md z-10"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                  {activePinComplaint.complaintId}
                </span>
                <h4 className="font-semibold text-sm text-slate-900 mt-1">{activePinComplaint.issueCategory}</h4>
              </div>
              <button
                type="button"
                onClick={() => setActivePinComplaint(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 mb-2.5">{activePinComplaint.description}</p>
            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
              <span className="text-slate-500">{activePinComplaint.location}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: `${getStatusColor(activePinComplaint.status)}18`,
                  color: getStatusColor(activePinComplaint.status),
                }}
              >
                {activePinComplaint.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info / Quick Landmark Preset Bar in Picker Mode */}
      {mode === "picker" && (
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Pinned: <strong className="text-slate-900">{selectedAddress}</strong> ({selectedLat}°N, {selectedLng}°E)
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-slate-500 text-[11px]">Quick Presets:</span>
            {CIVIC_LANDMARKS.slice(0, 3).map((lm, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleLandmarkClick(lm)}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] whitespace-nowrap transition shadow-2xs"
              >
                {lm.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
