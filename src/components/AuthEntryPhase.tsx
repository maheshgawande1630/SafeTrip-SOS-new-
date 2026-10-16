import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Smartphone,
  Fingerprint,
  Users,
  Key,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserSafetySettings, EmergencyContact } from '../types/safetrip';
import { soundSystem } from '../utils/audioHaptics';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  persona: 'commuter' | 'trekker' | 'elderly' | 'student';
  avatarInitials: string;
  isLoggedIn: boolean;
  lastLoginTime: string;
}

interface AuthEntryPhaseProps {
  onLoginSuccess: (user: UserProfile) => void;
  settings: UserSafetySettings;
  contacts: EmergencyContact[];
}

export const DEMO_PERSONAS: {
  id: string;
  name: string;
  phone: string;
  email: string;
  persona: UserProfile['persona'];
  roleTitle: string;
  avatarInitials: string;
  defaultVehicle: string;
  typicalTrip: string;
}[] = [
  {
    id: 'user-1',
    name: 'Aarav Sharma',
    phone: '+91 98201 23456',
    email: 'aarav.sharma@safetrip.in',
    persona: 'commuter',
    roleTitle: 'Late Night Cab Commuter',
    avatarInitials: 'AS',
    defaultVehicle: 'Uber Go / Ola Prime (White Dzire - MH-02-EE-8492)',
    typicalTrip: 'BKC Tech Hub to Andheri West'
  },
  {
    id: 'user-2',
    name: 'Pooja Iyer',
    phone: '+91 98205 67890',
    email: 'pooja.iyer@safetrip.in',
    persona: 'trekker',
    roleTitle: 'Solo Sahyadri Fort Trekker',
    avatarInitials: 'PI',
    defaultVehicle: 'On-foot (GPS Beacon active)',
    typicalTrip: 'Sinhagad Foothills to Kalyan Darwaza'
  },
  {
    id: 'user-3',
    name: 'Priya Sharma',
    phone: '+91 98212 34567',
    email: 'priya.sharma@safetrip.in',
    persona: 'commuter',
    roleTitle: 'City Auto-Rickshaw & Metro Traveler',
    avatarInitials: 'PS',
    defaultVehicle: 'Auto-Rickshaw (MH-12-AZ-3819)',
    typicalTrip: 'Shivajinagar Terminal to Kothrud'
  },
  {
    id: 'user-4',
    name: 'Rameshwar Nath',
    phone: '+91 98220 98765',
    email: 'rameshwar.nath@safetrip.in',
    persona: 'elderly',
    roleTitle: 'Senior Citizen Solo Transit',
    avatarInitials: 'RN',
    defaultVehicle: 'BEST Route 34 Bus',
    typicalTrip: 'Apollo Clinic to Vasant Vihar'
  }
];

export const AuthEntryPhase: React.FC<AuthEntryPhaseProps> = ({
  onLoginSuccess,
  settings,
  contacts
}) => {
  const [selectedPersona, setSelectedPersona] = useState(DEMO_PERSONAS[0]);
  const [phoneInput, setPhoneInput] = useState(DEMO_PERSONAS[0].phone);
  const [enteredPIN, setEnteredPIN] = useState('1234');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'persona' | 'manual'>('persona');
  const [showPin, setShowPin] = useState(false);

  const handleSelectPersona = (p: (typeof DEMO_PERSONAS)[0]) => {
    setSelectedPersona(p);
    setPhoneInput(p.phone);
    setEnteredPIN('1234');
    setErrorMsg(null);
  };

  const executeLogin = (userToLogin: typeof selectedPersona) => {
    setIsVerifying(true);
    setErrorMsg(null);
    soundSystem.playDiscreetPulse();

    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        id: userToLogin.id,
        name: userToLogin.name,
        phone: userToLogin.phone,
        email: userToLogin.email,
        persona: userToLogin.persona,
        avatarInitials: userToLogin.avatarInitials,
        isLoggedIn: true,
        lastLoginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 500);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }
    if (enteredPIN !== settings.realPIN && enteredPIN !== '1234') {
      setErrorMsg(`Incorrect security PIN. Default is ${settings.realPIN}`);
      return;
    }

    const matched = DEMO_PERSONAS.find((p) => p.phone === phoneInput) || {
      id: `user-${Date.now()}`,
      name: 'Verified Traveler',
      phone: phoneInput,
      email: 'traveler@safetrip.io',
      persona: 'commuter' as const,
      roleTitle: 'Protected Traveler',
      avatarInitials: 'VT',
      defaultVehicle: 'City Transit',
      typicalTrip: 'Protected Commute'
    };

    executeLogin(matched);
  };

  return (
    <div className="min-h-screen bg-[#F4F2E9] text-[#4F4F4D] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-white border border-[#D8D4C5] rounded-2xl shadow-xl p-6 sm:p-8 z-10 flex flex-col gap-5">
        {/* App Title & Identity */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#4F4F4D] text-[#BCB88A] shadow-md mb-1 border border-[#383836]">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4F4F4D]">
            SafeTrip SOS
          </h1>
          <p className="text-xs text-[#686865] max-w-md mx-auto leading-relaxed">
            Intelligent journey & travel safety platform. Choose a verified traveler profile or authenticate to enter the cockpit.
          </p>
        </div>

        {/* Tab Toggle: Fast-pass Persona vs Manual Entry */}
        <div className="flex p-1 bg-[#ECE9DD] rounded-xl border border-[#D8D4C5] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('persona')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'persona'
                ? 'bg-[#4F4F4D] text-[#F4F2E9] shadow-sm'
                : 'text-[#686865] hover:text-[#4F4F4D]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Select Persona Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-[#4F4F4D] text-[#F4F2E9] shadow-sm'
                : 'text-[#686865] hover:text-[#4F4F4D]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>PIN / Mobile Passkey</span>
          </button>
        </div>

        {/* Mode 1: Fast-Pass Persona Cards */}
        {activeTab === 'persona' && (
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-[#686865] block uppercase tracking-wider">
              Choose profile context:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = selectedPersona.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPersona(p)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#F4F2E9] border-[#BCB88A] ring-2 ring-[#BCB88A]/60 shadow-xs'
                        : 'bg-white border-[#D8D4C5] hover:border-[#BCB88A] hover:bg-[#F4F2E9]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-[#4F4F4D] text-[#BCB88A] shadow-xs'
                            : 'bg-[#ECE9DD] text-[#4F4F4D]'
                        }`}
                      >
                        {p.avatarInitials}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#4F4F4D]">{p.name}</div>
                        <div className="text-[11px] text-[#686865] line-clamp-1">{p.roleTitle}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#686865] font-mono flex items-center justify-between border-t border-[#ECE9DD] pt-2">
                      <span className="font-bold text-[#4F4F4D]">{p.persona.toUpperCase()}</span>
                      <span className="text-[#686865]">{p.phone}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => executeLogin(selectedPersona)}
              disabled={isVerifying}
              className="w-full mt-2 py-3 px-4 bg-[#4F4F4D] hover:bg-[#383836] text-[#F4F2E9] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md flex items-center justify-center gap-2 transition-all border border-[#383836] disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#BCB88A]/40 border-t-[#BCB88A] rounded-full animate-spin" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 text-[#BCB88A]" />
                  <span>Authorize As {selectedPersona.name}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Mode 2: Manual Phone & PIN Entry */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualLogin} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-[#686865] block mb-1 uppercase tracking-wider">
                Registered Mobile Number
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-[#686865] absolute left-3 top-3" />
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full bg-[#F4F2E9] border border-[#D8D4C5] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#4F4F4D] font-mono focus:outline-none focus:border-[#4F4F4D] focus:ring-1 focus:ring-[#4F4F4D]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#686865] uppercase tracking-wider">
                  Security PIN
                </label>
                <span className="text-[11px] text-[#686865] font-mono">
                  Default: {settings.realPIN}
                </span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-[#686865] absolute left-3 top-3" />
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={4}
                  value={enteredPIN}
                  onChange={(e) => setEnteredPIN(e.target.value)}
                  placeholder="4-digit PIN"
                  className="w-full bg-[#F4F2E9] border border-[#D8D4C5] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#4F4F4D] font-mono tracking-widest focus:outline-none focus:border-[#4F4F4D] focus:ring-1 focus:ring-[#4F4F4D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-[#686865] hover:text-[#4F4F4D]"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-center font-medium">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 bg-[#4F4F4D] hover:bg-[#383836] text-[#F4F2E9] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md flex items-center justify-center gap-2 transition-all border border-[#383836] disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#BCB88A]/40 border-t-[#BCB88A] rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#BCB88A]" />
                  <span>Authenticate & Open Safe Cockpit</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Pre-Flight Security Diagnostics Checklist */}
        <div className="p-3.5 bg-[#ECE9DD] border border-[#D8D4C5] rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#4F4F4D]">
            <span>PRE-FLIGHT SECURITY DIAGNOSTICS</span>
            <span className="text-[#4F4F4D] bg-[#BCB88A]/40 border border-[#BCB88A] px-2 py-0.5 rounded-full flex items-center gap-1 font-mono text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-[#4F4F4D]" />
              SYSTEM READY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4F4F4D] pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BCB88A]" />
              <span>Decoy PIN Active (`{settings.decoyPIN}`)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BCB88A]" />
              <span>Voice Code: "{settings.voiceCodeWord}"</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BCB88A]" />
              <span>{contacts.length} Contacts Enrolled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BCB88A]" />
              <span>Offline First-Aid Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
