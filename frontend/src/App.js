import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { AlertCircle, Navigation, Activity, Hospital, ShieldAlert, MapPin, Truck, BellRing, CheckCircle, Lock, User, Phone, FileText, RefreshCw, LocateFixed, Sun, Moon, Heart, Skull, Database, Globe, UserPlus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const socket = io('http://localhost:5000');

// Map Coordinates
const hospitals = [{ id: 1, name: "City Hospital", x: 10, y: 15 }, { id: 2, name: "Metro Care", x: 85, y: 10 }, { id: 3, name: "Apex Life", x: 50, y: 15 }, { id: 4, name: "Global Health", x: 15, y: 85 }, { id: 5, name: "Sunrise ER", x: 85, y: 85 }, { id: 6, name: "Care Point", x: 50, y: 90 }, { id: 7, name: "Lifeline", x: 90, y: 50 }];
const emsHubs = [{ id: 1, name: "Hub Alpha", x: 25, y: 25 }, { id: 2, name: "Hub Beta", x: 75, y: 25 }, { id: 3, name: "Hub Gamma", x: 15, y: 50 }, { id: 4, name: "Hub Delta", x: 85, y: 50 }, { id: 5, name: "Central Hub", x: 50, y: 50 }, { id: 6, name: "Hub Echo", x: 25, y: 75 }, { id: 7, name: "Hub Zeta", x: 75, y: 75 }, { id: 8, name: "Hub Omega", x: 50, y: 70 }];

// ================= REALISTIC BUILDING ICONS WITH GLOW ================= //
const RealisticHospitalIcon = ({ className, isReached }) => (
  <svg className={`${className} ${isReached ? 'hosp-glow-active' : ''}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {isReached && <circle cx="50" cy="50" r="45" fill="#22c55e" opacity="0.4" className="animate-pulse"/>}
    <path d="M10 90 H90 V40 H70 V20 H30 V40 H10 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
    <path d="M30 40 H70 V90 H30 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2"/>
    <rect x="42" y="45" width="16" height="30" fill="#ef4444" rx="2"/>
    <rect x="35" y="52" width="30" height="16" fill="#ef4444" rx="2"/>
    <rect x="18" y="50" width="6" height="6" fill="#60a5fa" rx="1"/>
    <rect x="76" y="50" width="6" height="6" fill="#60a5fa" rx="1"/>
    <rect x="18" y="65" width="6" height="6" fill="#60a5fa" rx="1"/>
    <rect x="76" y="65" width="6" height="6" fill="#60a5fa" rx="1"/>
    <rect x="38" y="28" width="8" height="8" fill="#a7f3d0" rx="1"/>
    <rect x="54" y="28" width="8" height="8" fill="#a7f3d0" rx="1"/>
    <rect x="45" y="80" width="10" height="10" fill="#1e293b" rx="1"/>
  </svg>
);

const RealisticHubIcon = ({ className, isActive, isBlinking }) => (
  <svg className={`${className} ${isBlinking ? 'hub-blink-active' : ''}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 90 H90 V50 L50 20 L10 50 Z" fill="#475569" stroke="#1e293b" strokeWidth="2"/>
    <rect x="25" y="60" width="20" height="30" fill="#334155" stroke="#1e293b"/>
    <rect x="55" y="60" width="20" height="30" fill="#334155" stroke="#1e293b"/>
    <rect x="65" y="30" width="15" height="30" fill="#94a3b8" stroke="#1e293b" strokeWidth="2"/>
    <rect x="62" y="25" width="21" height="8" fill="#60a5fa" rx="1" stroke="#1e293b"/>
    <line x1="72" y1="25" x2="72" y2="10" stroke="#1e293b" strokeWidth="2"/>
    <circle cx="72" cy="10" r="3" fill="#ef4444" className={isActive ? 'animate-pulse' : ''}/>
    <circle cx="40" cy="45" r="8" fill="none" stroke="#eab308" strokeWidth="2"/>
    <path d="M35 45 H45 M40 40 V50" stroke="#eab308" strokeWidth="2"/>
  </svg>
);

// --- ANIMATED VEHICLES ---
const CustomDrone = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="20" x2="44" y2="44" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/><line x1="44" y1="20" x2="20" y2="44" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/><circle cx="32" cy="32" r="8" fill="#eab308"/><circle cx="32" cy="32" r="4" fill="#1e293b"/><g><circle cx="16" cy="16" r="12" fill="#334155" opacity="0.5" stroke="#94a3b8" strokeWidth="1"/><path d="M8 16h16 M16 8v16" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.15s" repeatCount="indefinite" /></path></g><g><circle cx="48" cy="16" r="12" fill="#334155" opacity="0.5" stroke="#94a3b8" strokeWidth="1"/><path d="M40 16h16 M48 8v16" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 48 16" to="360 48 16" dur="0.15s" repeatCount="indefinite" /></path></g><g><circle cx="16" cy="48" r="12" fill="#334155" opacity="0.5" stroke="#94a3b8" strokeWidth="1"/><path d="M8 48h16 M16 40v16" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 16 48" to="360 16 48" dur="0.15s" repeatCount="indefinite" /></path></g><g><circle cx="48" cy="48" r="12" fill="#334155" opacity="0.5" stroke="#94a3b8" strokeWidth="1"/><path d="M40 48h16 M48 40v16" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 48 48" to="360 48 48" dur="0.15s" repeatCount="indefinite" /></path></g>
  </svg>
);
const CustomAmbulance = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="16" width="8" height="8" fill="#3b82f6" rx="2"><animate attributeName="opacity" values="1;0;1" dur="0.4s" repeatCount="indefinite" /></rect><rect x="24" y="16" width="8" height="8" fill="#ef4444" rx="2"><animate attributeName="opacity" values="0;1;0" dur="0.4s" repeatCount="indefinite" /></rect><path d="M4 24h36v24H4z" fill="#f8fafc" stroke="#475569" strokeWidth="2"/><path d="M40 32h12l4 6v10H40z" fill="#f8fafc" stroke="#475569" strokeWidth="2"/><path d="M42 34h8l2 3v3h-10z" fill="#bae6fd"/><rect x="18" y="32" width="10" height="4" fill="#ef4444"/><rect x="21" y="29" width="4" height="10" fill="#ef4444"/><circle cx="16" cy="48" r="6" fill="#1e293b"/><circle cx="16" cy="48" r="3" fill="#cbd5e1"/><circle cx="44" cy="48" r="6" fill="#1e293b"/><circle cx="44" cy="48" r="3" fill="#cbd5e1"/>
  </svg>
);

// --- TRANSLATION DICTIONARY WITH MARATHI ---
const translations = {
  EN: {
    appTitle: "SMART EMS ALGORITHM", userTab: "User App (SOS)", hospTab: "Hospital Dashboard",
    loginTitle: "Authorized Personnel Login", loginBtn: "LOGIN TO DASHBOARD",
    createAccTitle: "Register New Admin", createBtn: "REGISTER NEW ACCOUNT",
    switchReg: "Don't have an account? Create one", switchLog: "Already have an account? Login here",
    passMismatch: "Passwords do not match!", regSuccess: "Account Created Successfully! Please login.",
    confirmPassLbl: "Confirm Password",
    formTitle: "Emergency Form", nameLbl: "Patient Name", phoneLbl: "Contact Number", 
    typeLbl: "Incident Type", droneLbl: "Required Drone Payload", ambCountLbl: "Number of Ambulances",
    descLbl: "Description / Injuries", locLbl: "Accident Location", btnDetect: "Auto-Detect Address", btnClickDetect: "📍 Click 'Auto-Detect Address'",
    btnSOS: "INITIATE SOS DISPATCH", btnClear: "CLEAR & NEW EMERGENCY", logsTitle: "System Event Terminal",
    activeAlerts: "Active ER Alerts", patHistory: "Patient History Records",
    saved: "Lives Saved", deceased: "Deceased", totalCases: "Total Cases Handled", survival: "Survival Analytics",
    droneOpts: { AED: "AED (Defibrillator)", Blood: "Blood Pack", FirstAid: "First-Aid Kit", AntiVenom: "Anti-Venom" }
  },
  HI: {
    appTitle: "स्मार्ट ईएमएस सिस्टम", userTab: "यूज़र ऐप (SOS)", hospTab: "अस्पताल डैशबोर्ड",
    loginTitle: "केवल अधिकृत स्टाफ लॉगिन", loginBtn: "डैशबोर्ड में लॉगिन करें",
    createAccTitle: "नया एडमिन रजिस्टर करें", createBtn: "नया अकाउंट बनाएं",
    switchReg: "अकाउंट नहीं है? नया बनाएं", switchLog: "पहले से अकाउंट है? यहाँ लॉगिन करें",
    passMismatch: "पासवर्ड मेल नहीं खाते!", regSuccess: "अकाउंट सफलतापूर्वक बन गया! कृपया लॉगिन करें।",
    confirmPassLbl: "पासवर्ड की पुष्टि करें",
    formTitle: "आपातकालीन फॉर्म", nameLbl: "मरीज़ का नाम", phoneLbl: "संपर्क नंबर", 
    typeLbl: "हादसे का प्रकार", droneLbl: "जरूरी ड्रोन सामग्री", ambCountLbl: "एम्बुलेंस की संख्या",
    descLbl: "विवरण / चोटें", locLbl: "हादसे की जगह", btnDetect: "पता स्वतः खोजें", btnClickDetect: "📍 'पता स्वतः खोजें' बटन दबाएं",
    btnSOS: "SOS डिस्पैच शुरू करें", btnClear: "साफ़ करें और नया केस", logsTitle: "सिस्टम इवेंट टर्मिनल",
    activeAlerts: "सक्रिय अलर्ट", patHistory: "मरीज़ का इतिहास",
    saved: "बचाई गई जान", deceased: "मृतक", totalCases: "कुल मामले", survival: "सर्वाइवल एनालिटिक्स",
    droneOpts: { AED: "AED (हार्ट मशीन)", Blood: "ब्लड पैक (खून)", FirstAid: "फर्स्ट-एड किट", AntiVenom: "सांप का एंटी-वेनम" }
  },
  MR: {
    appTitle: "स्मार्ट ईएमएस प्रणाली", userTab: "युजर ॲप (SOS)", hospTab: "रुग्णालय डॅशबोर्ड",
    loginTitle: "केवळ अधिकृत कर्मचारी लॉगिन", loginBtn: "डॅशबोर्डमध्ये लॉगिन करा",
    createAccTitle: "नवीन ॲडमिन नोंदणी करा", createBtn: "नवीन खाते तयार करा",
    switchReg: "खाते नाही? नवीन तयार करा", switchLog: "आधीच खाते आहे? येथे लॉगिन करा",
    passMismatch: "पासवर्ड जुळत नाहीत!", regSuccess: "खाते यशस्वीरित्या तयार केले! कृपया लॉगिन करा.",
    confirmPassLbl: "पासवर्डची पुष्टी करा",
    formTitle: "आणीबाणी फॉर्म", nameLbl: "रुग्णाचे नाव", phoneLbl: "संपर्क क्रमांक", 
    typeLbl: "घटनेचा प्रकार", droneLbl: "आवश्यक ड्रोन साहित्य", ambCountLbl: "रुग्णवाहिकांची संख्या",
    descLbl: "वर्णन / दुखापती", locLbl: "अपघाताचे ठिकाण", btnDetect: "पत्ता स्वयंचलित शोधा", btnClickDetect: "📍 'पत्ता स्वयंचलित शोधा' वर क्लिक करा",
    btnSOS: "SOS डिस्पॅच सुरू करा", btnClear: "साफ करा आणि नवीन केस", logsTitle: "सिस्टम इव्हेंट टर्मिनल",
    activeAlerts: "सक्रिय अलर्ट", patHistory: "रुग्ण इतिहास नोंदी",
    saved: "वाचवलेले जीव", deceased: "मृत", totalCases: "एकूण प्रकरणे", survival: "सर्व्हायव्हल ॲनालिटिक्स",
    droneOpts: { AED: "AED (हार्ट मशीन)", Blood: "ब्लड पॅक (रक्त)", FirstAid: "फर्स्ट-एड किट", AntiVenom: "अँटी-व्हेनम (साप)" }
  }
};

export default function SmartEMSApp() {
  const [lang, setLang] = useState('EN'); 
  const t = translations[lang];

  const [isDarkMode, setIsDarkMode] = useState(true); 
  const theme = isDarkMode
    ? {
        bg: 'bg-gray-950',
        border: 'border-gray-700',
        panel: 'bg-gray-900',
        text: 'text-gray-100',
        textMuted: 'text-gray-400',
        inputBg: 'bg-gray-800',
        inputBorder: 'border-gray-700',
        mapBg: 'bg-gray-900',
        mapFilter: 'grayscale(0.4) contrast(1.1) brightness(0.85)',
        mapOverlay: 'bg-black/25'
      }
    : {
        bg: 'bg-slate-100',
        border: 'border-slate-300',
        panel: 'bg-white',
        text: 'text-slate-900',
        textMuted: 'text-slate-600',
        inputBg: 'bg-white',
        inputBorder: 'border-slate-300',
        mapBg: 'bg-slate-200',
        mapFilter: 'grayscale(0.05) contrast(1) brightness(1)',
        mapOverlay: 'bg-white/10'
      };
  
  // LOGIN / REGISTER STATES
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState('user'); 
  const [patientType, setPatientType] = useState('Vehicle Accident');
  const [dronePayload, setDronePayload] = useState('First-Aid Kit');
  const [ambulanceCount, setAmbulanceCount] = useState(1); 
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  
  const [dynamicZones, setDynamicZones] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  
  const [logs, setLogs] = useState([]);
  const [dispatches, setDispatches] = useState({});
  const [isDispatched, setIsDispatched] = useState(false); 
  const [hospitalAlerts, setHospitalAlerts] = useState([]);
  const [glowingHospital, setGlowingHospital] = useState(null);

  // NAYA: Empty array, data will load from DB
  const [patientRecords, setPatientRecords] = useState([]);

  const loadPatientRecords = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/records');
      const data = await res.json();
      setPatientRecords(data);
    } catch (err) {
      console.error('DB Fetch Error:', err);
    }
  };

  // FETCH RECORDS ON LOAD
  useEffect(() => {
    loadPatientRecords();
  }, []);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'hospital') {
      loadPatientRecords();
    }
  }, [isLoggedIn, activeTab]);

  useEffect(() => {
    socket.on('status_update', (data) => setLogs(prev => [{ time: data.time, msg: data.message }, ...prev]));
    socket.on('hospital_alert', (data) => setHospitalAlerts(prev => [data, ...prev]));
    
    socket.on('new_emergency', (data) => {
      setDispatches(prev => ({ ...prev, [data.id]: { zone: data.zone, hub: data.hub, hospital: data.hospital, ambulanceCount: data.ambulanceCount, drone: 0, ambulance: 0, phase: 'idle', hubBlinking: true, hospitalReached: false } }));
      
      setTimeout(() => {
        setDispatches(prev => {
          if(!prev[data.id]) return prev;
          return { ...prev, [data.id]: { ...prev[data.id], hubBlinking: false } };
        });
      }, 4000);
    });

    socket.on('tracking_update', (data) => {
      setDispatches(prev => {
        if (!prev[data.id]) return prev;
        const isReached = data.phase === 'to_hospital' && data.ambulance >= 100;
        return { ...prev, [data.id]: { ...prev[data.id], drone: data.drone, ambulance: data.ambulance, phase: data.phase, hospitalReached: isReached || prev[data.id].hospitalReached } };
      });
    });

    return () => { socket.off('status_update'); socket.off('tracking_update'); socket.off('hospital_alert'); socket.off('new_emergency'); };
  }, []);

  // NAYA: DATABASE AUTHENTICATION LOGIC
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoginError(''); setRegSuccessMsg('');
    
    if (isLoginMode) {
      try {
          const res = await fetch('http://localhost:5000/api/login', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user: username, pass: password })
          });
          const data = await res.json();
          if (data.success) {
              setIsLoggedIn(true);
          } else {
              setLoginError('Invalid Username or Password');
              setPassword('');
          }
      } catch (err) { setLoginError('Server/Database not running!'); }
    } else {
      if (password !== confirmPassword) {
         setLoginError(t.passMismatch);
         return;
      }
      try {
          const res = await fetch('http://localhost:5000/api/register', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user: username, pass: password })
          });
          const data = await res.json();
          if (data.success) {
              setRegSuccessMsg(t.regSuccess);
              setTimeout(() => { setIsLoginMode(true); setPassword(''); setConfirmPassword(''); setRegSuccessMsg(''); }, 2000);
          } else {
              setLoginError(data.message || 'Error creating account');
          }
      } catch (err) { setLoginError('Server/Database not running!'); }
    }
  };

  const findNearest = (location, placesList) => {
    let nearest = null; let minDistance = Infinity;
    placesList.forEach(place => {
      const distance = Math.sqrt(Math.pow(place.x - location.x, 2) + Math.pow(place.y - location.y, 2));
      if (distance < minDistance) { minDistance = distance; nearest = place; }
    });
    return nearest;
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            const realAddress = data.display_name ? data.display_name : `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
            const newZone = { id: Date.now(), name: realAddress, x: Math.floor(Math.random() * 60) + 20, y: Math.floor(Math.random() * 60) + 20 };
            setDynamicZones([newZone]); 
            setSelectedZones([newZone]);
            setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg: `Live GPS Location Captured Successfully.` }, ...prev]);
          } catch (error) { alert("Error fetching address."); }
          setIsLocating(false);
        },
        (error) => { setIsLocating(false); alert("GPS access denied."); }
      );
    } else { setIsLocating(false); alert("Geolocation not supported."); }
  };

  const handleSOS = () => {
    if (selectedZones.length === 0) return alert("Please Auto-Detect your location first!");
    setIsDispatched(true);
    selectedZones.forEach(zone => {
      const emergencyId = `EM-${Date.now()}-${zone.id}`;
      const hub = findNearest(zone, emsHubs);
      const hospital = findNearest(zone, hospitals);
      fetch('http://localhost:5000/api/sos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emergencyId, type: patientType, dronePayload, ambulanceCount, severity: 'Critical', location: zone, patientName, contactNumber, description, hub, hospital })
      });
    });
    setLogs([{ time: new Date().toLocaleTimeString(), msg: `CRITICAL ALERT: DISPATCH INITIATED!` }]);
  };

  const handleReset = () => { setIsDispatched(false); setSelectedZones([]); setDynamicZones([]); setPatientName(''); setContactNumber(''); setDescription(''); setAmbulanceCount(1); };

  // NAYA: DATABASE MEIN PATIENT RECORD SAVE KARNA
  const handleResolvePatient = async (alert, outcome) => {
    setHospitalAlerts(hospitalAlerts.filter(a => a.id !== alert.id));
    
    const newRecord = {
      id: alert.id.substring(0, 8), name: alert.patientName, type: alert.type, outcome: outcome,
      time: new Date().toLocaleTimeString(), address: alert.address.substring(0, 30) + '...'
    };
    
    // UI update turant hoga
    setPatientRecords(prev => [newRecord, ...prev]);

    // Backend (MongoDB) mein save hoga
    try {
      await fetch('http://localhost:5000/api/records', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
    } catch(err) { console.error("Failed to save to DB"); }
  };

  const getPos = (d, isDrone) => {
    if (!d || d.phase === 'idle') return { x: 0, y: 0 };
    if (d.phase === 'to_scene' || (isDrone && d.phase === 'to_hospital')) {
      const p = (isDrone && d.phase === 'to_hospital') ? 100 : (isDrone ? d.drone : d.ambulance);
      return { x: d.hub.x + ((d.zone.x - d.hub.x) * (p / 100)), y: d.hub.y + ((d.zone.y - d.hub.y) * (p / 100)) };
    } else if (d.phase === 'to_hospital' && !isDrone) {
      return { x: d.zone.x + ((d.hospital.x - d.zone.x) * (d.ambulance / 100)), y: d.zone.y + ((d.hospital.y - d.zone.y) * (d.ambulance / 100)) };
    }
    return { x: 0, y: 0 };
  };

  const isHospTarget = (hId) => Object.values(dispatches).some(d => d.hospital.id === hId && d.phase === 'to_hospital');
  const isHospReached = (hId) => Object.values(dispatches).some(d => d.hospital.id === hId && d.hospitalReached);
  const isHubActive = (hubId) => Object.values(dispatches).some(d => d.hub.id === hubId);
  const isHubBlinking = (hubId) => Object.values(dispatches).some(d => d.hub.id === hubId && d.hubBlinking);

  const savedCount = patientRecords.filter(r => r.outcome === 'Saved').length;
  const deadCount = patientRecords.filter(r => r.outcome === 'Deceased').length;
  const pieData = [{ name: t.saved, value: savedCount, color: '#22c55e' }, { name: t.deceased, value: deadCount, color: '#ef4444' }];

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans transition-colors duration-500 ${theme.bg}`}>
        
        <div className={`absolute top-6 right-6 flex items-center border rounded-md px-2 ${theme.border} ${theme.panel}`}>
            <Globe className={`w-4 h-4 mr-1 ${theme.textMuted}`} />
            <select value={lang} onChange={(e)=>setLang(e.target.value)} className={`bg-transparent outline-none p-1 text-sm font-bold ${theme.text}`}>
              <option value="EN">English</option>
              <option value="HI">हिंदी</option>
              <option value="MR">मराठी</option>
            </select>
        </div>

        <form onSubmit={handleAuth} className={`p-10 rounded-3xl border shadow-2xl w-full max-w-md animate-fade-in text-center transition-colors duration-500 ${theme.panel} ${theme.border}`}>
          <div className="bg-red-500/10 p-4 rounded-full inline-block mb-4 border border-red-500/20 shadow-inner">
            {isLoginMode ? <Activity className="text-red-500 w-12 h-12 animate-pulse" /> : <UserPlus className="text-red-500 w-12 h-12 animate-pulse" />}
          </div>
          <h1 className={`text-3xl font-bold mb-1 ${theme.text}`}>SMART EMS</h1>
          <p className={`text-sm mb-8 ${theme.textMuted}`}>{isLoginMode ? t.loginTitle : t.createAccTitle}</p>
          
          {loginError && (
              <div className="bg-red-500/10 text-red-500 border border-red-500/30 text-xs rounded-lg p-3 mb-4 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {loginError}
              </div>
          )}
          {regSuccessMsg && (
              <div className="bg-green-500/10 text-green-500 border border-green-500/30 text-xs rounded-lg p-3 mb-4 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> {regSuccessMsg}
              </div>
          )}

          <div className="space-y-4 text-left mb-6">
            <div>
              <label className={`text-xs ml-1 font-bold ${theme.textMuted}`}>USERNAME</label>
              <div className={`flex items-center border rounded-xl p-3 mt-1 ${theme.inputBg} ${theme.inputBorder}`}>
                <User className="w-5 h-5 text-gray-500 mr-3" />
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="admin" required className={`bg-transparent border-none outline-none w-full ${theme.text}`} />
              </div>
            </div>
            <div>
              <label className={`text-xs ml-1 font-bold ${theme.textMuted}`}>PASSWORD</label>
              <div className={`flex items-center border rounded-xl p-3 mt-1 ${theme.inputBg} ${theme.inputBorder}`}>
                <Lock className="w-5 h-5 text-gray-500 mr-3" />
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required className={`bg-transparent border-none outline-none w-full ${theme.text}`} />
              </div>
            </div>
            
            {!isLoginMode && (
              <div className="animate-fade-in">
                <label className={`text-xs ml-1 font-bold ${theme.textMuted}`}>{t.confirmPassLbl.toUpperCase()}</label>
                <div className={`flex items-center border rounded-xl p-3 mt-1 ${theme.inputBg} ${theme.inputBorder}`}>
                  <Lock className="w-5 h-5 text-gray-500 mr-3" />
                  <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="••••••••" required className={`bg-transparent border-none outline-none w-full ${theme.text}`} />
                </div>
              </div>
            )}
          </div>
          
          <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/20 transition-all transform hover:scale-[1.02]">
            {isLoginMode ? t.loginBtn : t.createBtn}
          </button>

          <div className="mt-6">
            <button type="button" onClick={() => {setIsLoginMode(!isLoginMode); setLoginError(''); setUsername(''); setPassword(''); setConfirmPassword('');}} className={`text-sm font-medium hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {isLoginMode ? t.switchReg : t.switchLog}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 font-sans transition-colors duration-500 ${theme.bg} ${theme.text}`}>
      
      <style>{`
        @keyframes hubBlink5 {
          0%, 20%, 40%, 60%, 80%, 100% { filter: drop-shadow(0 0 0px transparent); }
          10%, 30%, 50%, 70%, 90% { filter: drop-shadow(0 0 25px #3b82f6); }
        }
        .hub-blink-active {
          animation: hubBlink5 4s linear;
        }
        @keyframes hospGlowContinuous {
          0%, 100% { filter: drop-shadow(0 0 10px #22c55e); }
          50% { filter: drop-shadow(0 0 35px #22c55e); }
        }
        .hosp-glow-active {
          animation: hospGlowContinuous 1.5s infinite;
        }
      `}</style>

      <header className={`flex justify-between items-center border-b pb-4 mb-6 ${theme.border}`}>
        <div className="flex items-center gap-3"><Activity className="text-red-500 w-8 h-8" /><h1 className="text-2xl font-bold tracking-wider">{t.appTitle}</h1></div>
        <div className={`flex gap-3 p-1 rounded-lg ${theme.panel} ${theme.border}`}>
          
          <div className={`flex items-center border rounded-md px-2 ${theme.border}`}>
            <Globe className={`w-4 h-4 mr-1 ${theme.textMuted}`} />
            <select value={lang} onChange={(e)=>setLang(e.target.value)} className={`bg-transparent outline-none text-sm font-bold ${theme.text}`}>
              <option value="EN">English</option>
              <option value="HI">हिंदी (Hindi)</option>
              <option value="MR">मराठी (Marathi)</option>
            </select>
          </div>

          <button onClick={() => setActiveTab('user')} className={`px-4 py-2 text-sm rounded-md transition ${activeTab === 'user' ? 'bg-red-600 text-white font-bold' : theme.textMuted}`}>{t.userTab}</button>
          <button onClick={() => setActiveTab('hospital')} className={`px-4 py-2 text-sm rounded-md transition flex items-center gap-2 ${activeTab === 'hospital' ? 'bg-blue-600 text-white font-bold' : theme.textMuted}`}>
            {t.hospTab} {hospitalAlerts.length > 0 && <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{hospitalAlerts.length}</span>}
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`ml-1 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
            {isDarkMode ? <Sun className="text-yellow-400 w-5 h-5" /> : <Moon className="text-blue-600 w-5 h-5" />}
          </button>
          <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 text-sm rounded-md text-red-500 border border-red-500 hover:bg-red-500/10 ml-2">Logout</button>
        </div>
      </header>

      {activeTab === 'user' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="space-y-4">
            <div className={`p-6 rounded-2xl shadow-xl max-h-[550px] overflow-y-auto border transition-colors duration-500 ${theme.panel} ${theme.border}`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme.text}`}>{t.formTitle}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-xs mb-2 ${theme.textMuted}`}>{t.nameLbl}</label>
                  <div className={`flex items-center border rounded-lg p-3 ${theme.inputBg} ${theme.inputBorder}`}>
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <input type="text" value={patientName} onChange={(e)=>setPatientName(e.target.value)} disabled={isDispatched} placeholder="Rohan..." className={`bg-transparent border-none outline-none w-full text-sm ${theme.text}`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs mb-2 ${theme.textMuted}`}>{t.phoneLbl}</label>
                  <div className={`flex items-center border rounded-lg p-3 ${theme.inputBg} ${theme.inputBorder}`}>
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <input type="tel" value={contactNumber} onChange={(e)=>setContactNumber(e.target.value)} disabled={isDispatched} placeholder="98765..." className={`bg-transparent border-none outline-none w-full text-sm ${theme.text}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm mb-2 ${theme.textMuted}`}>{t.typeLbl}</label>
                  <select className={`w-full border rounded-lg p-3 text-sm outline-none ${theme.inputBg} ${theme.inputBorder} ${theme.text}`} value={patientType} onChange={(e) => setPatientType(e.target.value)} disabled={isDispatched}>
                    <option value="Vehicle Accident">Vehicle Accident</option>
                    <option value="Car Accident">Car Accident</option>
                    <option value="Bike Accident">Bike Accident</option>
                    <option value="Cardiac Arrest">Cardiac Arrest</option>
                    <option value="Trauma / Fall">Trauma / Fall</option>
                    <option value="Unconscious">Unconscious</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm mb-2 font-bold text-red-500`}>🚑 {t.ambCountLbl}</label>
                  <select className={`w-full border border-red-500/50 rounded-lg p-3 text-sm outline-none ${theme.inputBg} ${theme.text}`} value={ambulanceCount} onChange={(e) => setAmbulanceCount(Number(e.target.value))} disabled={isDispatched}>
                    <option value="1">1 Ambulance</option>
                    <option value="2">2 Ambulances</option>
                    <option value="3">3 Ambulances</option>
                    <option value="4">4 Ambulances</option>
                    <option value="5">5 Ambulances</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 mt-4">
                <label className={`block text-sm mb-2 font-bold text-yellow-500`}>🚁 {t.droneLbl}</label>
                <select className={`w-full border border-yellow-500/50 rounded-lg p-3 text-sm outline-none ${theme.inputBg} ${theme.text}`} value={dronePayload} onChange={(e) => setDronePayload(e.target.value)} disabled={isDispatched}>
                  <option value={t.droneOpts.FirstAid}>{t.droneOpts.FirstAid}</option>
                  <option value={t.droneOpts.AED}>{t.droneOpts.AED}</option>
                  <option value={t.droneOpts.Blood}>{t.droneOpts.Blood}</option>
                  <option value={t.droneOpts.AntiVenom}>{t.droneOpts.AntiVenom}</option>
                </select>
              </div>

              <div className="mb-4">
                <label className={`block text-sm mb-2 ${theme.textMuted}`}>{t.descLbl}</label>
                <div className={`flex items-start border rounded-lg p-3 ${theme.inputBg} ${theme.inputBorder}`}>
                  <FileText className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                  <textarea value={description} onChange={(e)=>setDescription(e.target.value)} disabled={isDispatched} rows="2" className={`bg-transparent border-none outline-none w-full text-sm resize-none ${theme.text}`}></textarea>
                </div>
              </div>

              <div className="flex justify-between items-end mb-2">
                <label className={`block text-sm ${theme.textMuted}`}>{t.locLbl}</label>
                <button onClick={handleDetectLocation} disabled={isDispatched || isLocating} className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition shadow-md">
                  <LocateFixed className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} /> {t.btnDetect}
                </button>
              </div>
              
              <div className="space-y-2 mb-6">
                {dynamicZones.length === 0 && (
                  <div className={`text-center p-4 border border-dashed rounded-lg text-sm ${theme.border} ${theme.textMuted}`}>{t.btnClickDetect}</div>
                )}
                {dynamicZones.map(zone => (
                  <label key={zone.id} className={`flex items-start gap-3 p-3 rounded-lg border border-red-500 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} transition-all`}>
                    <MapPin className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{zone.name}</span>
                  </label>
                ))}
              </div>

              {!isDispatched ? (
                <button onClick={handleSOS} className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white shadow-lg font-bold">
                  <AlertCircle className="w-6 h-6" /> {t.btnSOS}
                </button>
              ) : (
                <button onClick={handleReset} className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold border ${isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-gray-200 border-gray-400 text-gray-800'}`}>
                  <RefreshCw className="w-6 h-6" /> {t.btnClear}
                </button>
              )}
            </div>
            
            <div className={`relative p-4 rounded-2xl border h-48 overflow-y-auto flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-gray-900/90 border-gray-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]' : 'bg-gray-50 border-gray-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]'}`}>
              <div className={`flex justify-between items-center mb-3 sticky top-0 z-10 pb-2 border-b ${isDarkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
                <h2 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  <Activity className="w-4 h-4 animate-pulse" /> {t.logsTitle}
                </h2>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> SYSTEM ONLINE
                </span>
              </div>
              <div className="space-y-2.5 flex-1 font-mono text-xs">
                {logs.length === 0 ? (
                  <div className={`text-center mt-6 italic ${theme.textMuted}`}>Awaiting system events...</div>
                ) : (
                  logs.map((log, idx) => {
                    let Icon = Activity;
                    let color = isDarkMode ? "text-gray-300" : "text-gray-700";
                    let bg = "bg-transparent";
                    if(log.msg.includes('Location') || log.msg.includes('पता') || log.msg.includes('पत्ता')) { Icon = MapPin; color = isDarkMode ? "text-blue-300" : "text-blue-600"; }
                    else if(log.msg.includes('Drone') || log.msg.includes('ड्रोन')) { Icon = Navigation; color = isDarkMode ? "text-yellow-400" : "text-yellow-600"; }
                    else if(log.msg.includes('Ambulance') || log.msg.includes('Convoy') || log.msg.includes('एम्बुलेंस') || log.msg.includes('रुग्णवाहिका')) { Icon = Truck; color = isDarkMode ? "text-blue-400" : "text-blue-600"; }
                    else if(log.msg.includes('Arrived') || log.msg.includes('reached') || log.msg.includes('Hospital') || log.msg.includes('रुग्णालय')) { Icon = CheckCircle; color = isDarkMode ? "text-green-400" : "text-green-600"; bg = isDarkMode ? "bg-green-500/10 border-green-500/30" : "bg-green-100 border-green-300"; }
                    else if(log.msg.includes('DISPATCH') || log.msg.includes('CRITICAL')) { Icon = AlertCircle; color = isDarkMode ? "text-red-400" : "text-red-600"; bg = isDarkMode ? "bg-red-500/10 border-red-500/30" : "bg-red-100 border-red-300"; }
                    return (
                      <div key={idx} className={`flex gap-3 items-start p-1.5 rounded border border-transparent transition-all ${bg}`}>
                        <span className={`flex-shrink-0 mt-0.5 ${color}`}><Icon className="w-3.5 h-3.5" /></span>
                        <div className="flex flex-col">
                          <span className={`text-[9px] opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{log.time}</span>
                          <span className={`font-medium ${color === 'text-green-400' || color === 'text-green-600' || color === 'text-red-400' || color === 'text-red-600' ? color : (isDarkMode ? 'text-gray-200' : 'text-gray-800')}`}>{log.msg}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className={`relative rounded-2xl border h-[600px] overflow-hidden flex items-center shadow-inner transition-colors duration-500 ${theme.mapBg} ${theme.border}`}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-500">
                <iframe title="RealCityMap" width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=72.75,19.35,72.88,19.45&amp;layer=mapnik" style={{ filter: theme.mapFilter, transform: 'scale(1.1)', transition: 'filter 0.5s ease' }}></iframe>
                <div className={`absolute inset-0 transition-colors duration-500 ${theme.mapOverlay}`}></div>
              </div>

              {Object.entries(dispatches).map(([id, d]) => (
                <div key={`zone-net-${id}`} className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10" style={{ left: `${d.zone.x}%`, top: `${d.zone.y}%` }}>
                  <MapPin className="w-8 h-8 text-red-500 animate-bounce drop-shadow-md" />
                </div>
              ))}

              {!isDispatched && dynamicZones.map(zone => (
                <div key={`zone-pre-${zone.id}`} className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10" style={{ left: `${zone.x}%`, top: `${zone.y}%` }}>
                  <MapPin className="w-8 h-8 text-yellow-500 opacity-90 drop-shadow-md" />
                </div>
              ))}

              {hospitals.map(h => (
                <div key={`h-${h.id}`} className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center ${isHospTarget(h.id) || isHospReached(h.id) ? 'z-20 scale-110' : 'opacity-95'}`} style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                  <RealisticHospitalIcon className="w-14 h-14 drop-shadow-lg" isReached={isHospReached(h.id)}/>
                  <span className={`text-[10px] mt-1 font-bold px-1.5 py-0.5 rounded shadow border ${isHospReached(h.id) ? 'bg-green-600 text-white border-green-500' : (isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300')}`}>{h.name}</span>
                </div>
              ))}

              {emsHubs.map(hub => (
                <div key={`hub-${hub.id}`} className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center ${isHubActive(hub.id) ? 'z-10 scale-105' : 'opacity-90'}`} style={{ left: `${hub.x}%`, top: `${hub.y}%` }}>
                  <RealisticHubIcon className="w-12 h-12 drop-shadow-md" isActive={isHubActive(hub.id)} isBlinking={isHubBlinking(hub.id)}/>
                  <span className={`text-[9px] mt-0.5 font-bold px-1.5 py-0.5 rounded border ${isHubActive(hub.id) ? 'bg-blue-600 text-white border-blue-500' : (isDarkMode ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-200 text-gray-600 border-gray-300')}`}>Hub {hub.id}</span>
                </div>
              ))}

              {Object.entries(dispatches).map(([id, d]) => {
                if(d.phase === 'idle') return null;
                const dronePos = getPos(d, true);
                const ambPos = getPos(d, false);
                return (
                  <React.Fragment key={`veh-${id}`}>
                    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear z-30" style={{ left: `${dronePos.x}%`, top: `${dronePos.y}%` }}>
                      <CustomDrone className="w-10 h-10 drop-shadow-2xl" />
                    </div>
                    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear z-20" style={{ left: `${ambPos.x}%`, top: `${ambPos.y}%`, marginTop: '15px' }}>
                      <CustomAmbulance className="w-12 h-12 drop-shadow-2xl" />
                      {d.ambulanceCount > 1 && (
                        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-lg animate-pulse">
                          x{d.ambulanceCount}
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hospital' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-2xl border transition-colors duration-500 ${theme.panel} ${theme.border}`}>
              <h2 className="text-xl font-bold flex items-center gap-3 mb-4 text-blue-500"><BellRing className="w-6 h-6" /> {t.activeAlerts}</h2>
              <div className="space-y-4">
                {hospitalAlerts.length === 0 ? (
                  <div className={`p-8 rounded-xl text-center border ${theme.border} ${theme.textMuted}`}><ShieldAlert className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>No active emergencies.</p></div>
                ) : (
                  hospitalAlerts.map(alert => (
                    <div key={alert.id} className={`p-5 rounded-xl shadow-lg border transition-colors duration-500 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          <h3 className="text-lg font-bold text-red-500 flex items-center gap-2"><Activity className="w-5 h-5 animate-pulse"/> {alert.message}</h3>
                          <div className={`mt-2 grid grid-cols-2 gap-2 text-sm ${theme.textMuted}`}>
                            <p><strong className={theme.text}>Name:</strong> {alert.patientName}</p>
                            <p><strong className={theme.text}>Phone:</strong> {alert.contactNumber}</p>
                            <p><strong className={theme.text}>Type:</strong> {alert.type}</p>
                            <p><strong className="text-red-500">🚑 Ambulances Coming:</strong> <span className="font-bold text-white bg-red-600 px-2 py-0.5 rounded">{alert.ambulanceCount}</span></p>
                            <p className="col-span-2"><strong className="text-yellow-500">🚁 Incoming Drone Payload:</strong> {alert.dronePayload}</p>
                            <p className="col-span-2"><strong className={theme.text}>Description:</strong> {alert.description}</p>
                            <p className="col-span-2"><strong className={theme.text}>Address:</strong> {alert.address}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                          <button onClick={() => handleResolvePatient(alert, 'Saved')} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-1"><Heart className="w-4 h-4"/> SAVE</button>
                          <button onClick={() => handleResolvePatient(alert, 'Deceased')} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-1"><Skull className="w-4 h-4"/> DEAD</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`p-6 rounded-2xl border transition-colors duration-500 ${theme.panel} ${theme.border}`}>
              <h2 className={`text-xl font-bold flex items-center gap-3 mb-4 ${theme.text}`}><Database className="w-6 h-6 text-blue-500" /> {t.patHistory}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className={`text-xs uppercase ${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">ID</th>
                      <th className="px-4 py-3">Patient Name</th>
                      <th className="px-4 py-3">Incident Type</th>
                      <th className="px-4 py-3">Outcome</th>
                      <th className="px-4 py-3 rounded-tr-lg">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientRecords.map((record, index) => (
                      <tr key={index} className={`border-b ${theme.border} ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                        <td className={`px-4 py-3 font-mono ${theme.textMuted}`}>#{record.id}</td>
                        <td className={`px-4 py-3 font-medium ${theme.text}`}>{record.name}</td>
                        <td className={`px-4 py-3 ${theme.textMuted}`}>{record.type}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${record.outcome === 'Saved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {record.outcome}
                          </span>
                        </td>
                        <td className={`px-4 py-3 ${theme.textMuted}`}>{record.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border flex items-center justify-between ${theme.panel} ${theme.border}`}>
               <div>
                 <p className={`text-xs uppercase font-bold ${theme.textMuted}`}>{t.totalCases}</p>
                 <p className={`text-3xl font-bold text-blue-500`}>{patientRecords.length}</p>
               </div>
               <Activity className="w-10 h-10 text-blue-500/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border ${theme.panel} ${theme.border}`}>
                 <p className={`text-xs uppercase font-bold text-green-500`}>{t.saved}</p>
                 <p className={`text-2xl font-bold text-green-500 mt-1`}>{savedCount}</p>
              </div>
              <div className={`p-5 rounded-2xl border ${theme.panel} ${theme.border}`}>
                 <p className={`text-xs uppercase font-bold text-red-500`}>{t.deceased}</p>
                 <p className={`text-2xl font-bold text-red-500 mt-1`}>{deadCount}</p>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border transition-colors duration-500 ${theme.panel} ${theme.border}`}>
              <h2 className={`text-lg font-bold mb-4 text-center ${theme.text}`}>{t.survival}</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#fff', borderColor: isDarkMode ? '#374151' : '#e5e7eb', color: isDarkMode ? '#fff' : '#000' }} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}