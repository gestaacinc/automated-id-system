import React, { useState, useRef, useEffect } from 'react';
import { Save, UserPlus, Printer, FileText, IdCard, MapPin, Phone, GraduationCap, CheckCircle2, Droplet } from 'lucide-react';
import PhotoUploader from './components/PhotoUploader';
import IDTemplate from './components/IDTemplate';
import IDBackTemplate from './components/IDBackTemplate';
import { generateAndSavePDF } from './utils/pdfGenerator';
import { ILOCOS_NORTE_DATA } from './utils/locations';

export interface StudentData {
  firstName: string;
  lastName: string;
  middleInitial: string;
  studentId: string;
  course: string;
  address: string;
  birthDate: string;
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
  photoUrl: string | null;
  issueDate: string;
  validityDate: string;
}

const DEFAULT_COURSE = "Data Analytics Level III";
const BLOOD_TYPES = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const todayISO = () => new Date().toISOString().slice(0, 10);
const plusYearISO = (years: number) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
};

function App() {
  const [studentData, setStudentData] = useState<StudentData>({
    firstName: '',
    lastName: '',
    middleInitial: '',
    studentId: `2026-${Math.floor(1000 + Math.random() * 9000)}`,
    course: DEFAULT_COURSE,
    address: '',
    birthDate: '',
    bloodType: '',
    emergencyContact: '',
    emergencyPhone: '',
    photoUrl: null,
    issueDate: todayISO(),
    validityDate: plusYearISO(1),
  });

  const [selectedTown, setSelectedTown] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSavedPath, setLastSavedPath] = useState<string | null>(null);
  const idPreviewRef = useRef<HTMLDivElement>(null);
  const idBackPreviewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoProcessed = (photoUrl: string) => {
    setStudentData(prev => ({ ...prev, photoUrl }));
  };

  useEffect(() => {
    if (selectedTown && selectedBarangay) {
      setStudentData(prev => ({
        ...prev,
        address: `${selectedBarangay}, ${selectedTown}, Ilocos Norte`
      }));
    } else {
      setStudentData(prev => ({ ...prev, address: '' }));
    }
  }, [selectedTown, selectedBarangay]);

  const generateNewId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${year}-${random}`;
  };

  const handleSaveID = async () => {
    if (!idPreviewRef.current || !idBackPreviewRef.current) return;
    if (!studentData.firstName || !studentData.lastName) {
      alert('Please fill in the Student Name (First and Last).');
      return;
    }

    setIsGenerating(true);
    setLastSavedPath(null);

    const result = await generateAndSavePDF(
      idPreviewRef.current,
      idBackPreviewRef.current,
      `${studentData.firstName} ${studentData.lastName}`,
      studentData.studentId
    );

    setIsGenerating(false);

    if (result.success) {
      setLastSavedPath(result.path || 'Saved');
    } else {
      alert('Error saving ID: ' + result.error);
    }
  };

  const resetForm = () => {
    setStudentData({
      firstName: '',
      lastName: '',
      middleInitial: '',
      studentId: generateNewId(),
      course: DEFAULT_COURSE,
      address: '',
      birthDate: '',
      bloodType: '',
      emergencyContact: '',
      emergencyPhone: '',
      photoUrl: null,
      issueDate: todayISO(),
      validityDate: plusYearISO(1),
    });
    setSelectedTown("");
    setSelectedBarangay("");
    setLastSavedPath(null);
  };

  const currentTownData = ILOCOS_NORTE_DATA.find(t => t.name === selectedTown);

  // Progress indicator state
  const hasPhoto = !!studentData.photoUrl;
  const hasName = !!studentData.firstName && !!studentData.lastName;
  const hasLocation = !!studentData.address;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20 text-gray-900 dark:text-gray-100 font-sans">
      {/* Decorative background blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-300/20 dark:bg-blue-700/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-300/20 dark:bg-purple-700/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto p-6 lg:p-8">
        {/* HEADER */}
        <header className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4 pb-6 border-b border-gray-200/70 dark:border-gray-700/70">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <IdCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ID-AUTOMATOR
              </h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Automated Student ID Generation System
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center space-x-2">
            <StepBadge active={hasPhoto} label="Photo" />
            <div className={`w-6 h-px ${hasPhoto ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <StepBadge active={hasName} label="Info" />
            <div className={`w-6 h-px ${hasName ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <StepBadge active={hasLocation} label="Location" />
          </div>

          <button
            onClick={resetForm}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur border border-gray-200 rounded-lg hover:bg-white shadow-sm hover:shadow transition dark:bg-gray-800/80 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            New Student
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: FORM */}
          <div className="space-y-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur p-6 lg:p-8 rounded-2xl shadow-xl shadow-gray-200/40 dark:shadow-black/20 border border-gray-200/50 dark:border-gray-700/50">
            <SectionHeader icon={<UserPlus className="w-5 h-5" />} title="Student Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="First Name">
                <input
                  type="text"
                  name="firstName"
                  value={studentData.firstName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="John"
                />
              </Field>
              <Field label="Last Name">
                <input
                  type="text"
                  name="lastName"
                  value={studentData.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Doe"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Student ID #">
                <input
                  type="text"
                  name="studentId"
                  value={studentData.studentId}
                  readOnly
                  className="input-field bg-gray-50 dark:bg-gray-700/50 font-mono text-red-600 dark:text-red-400 font-bold cursor-not-allowed"
                />
              </Field>
              <Field label="Course" icon={<GraduationCap className="w-3.5 h-3.5" />}>
                <input
                  type="text"
                  name="course"
                  value={studentData.course}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Course Title"
                />
              </Field>
            </div>

            <PhotoUploader onPhotoProcessed={handlePhotoProcessed} />

            <div className="space-y-4 pt-2">
              <SectionHeader icon={<MapPin className="w-5 h-5" />} title="Location & Contact" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Town / City (Ilocos Norte)">
                  <select
                    value={selectedTown}
                    onChange={(e) => {
                      setSelectedTown(e.target.value);
                      setSelectedBarangay("");
                    }}
                    className="input-field"
                  >
                    <option value="">Select Town/City</option>
                    {ILOCOS_NORTE_DATA.map(town => (
                      <option key={town.name} value={town.name}>{town.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Barangay">
                  <select
                    value={selectedBarangay}
                    onChange={(e) => setSelectedBarangay(e.target.value)}
                    disabled={!selectedTown}
                    className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Barangay</option>
                    {currentTownData?.barangays.map(brgy => (
                      <option key={brgy} value={brgy}>{brgy}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Full Address (Preview)">
                <input
                  type="text"
                  value={studentData.address}
                  readOnly
                  className="input-field bg-gray-50 dark:bg-gray-700/50 italic text-gray-500 dark:text-gray-400"
                  placeholder="Select Town and Barangay above"
                />
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Birth Date">
                  <input
                    type="date"
                    name="birthDate"
                    value={studentData.birthDate}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </Field>
                <Field label="Blood Type" icon={<Droplet className="w-3.5 h-3.5" />}>
                  <select
                    name="bloodType"
                    value={studentData.bloodType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {BLOOD_TYPES.map(bt => (
                      <option key={bt} value={bt}>{bt || '—'}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Middle Initial">
                  <input
                    type="text"
                    name="middleInitial"
                    maxLength={1}
                    value={studentData.middleInitial}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="M"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="In Case of Emergency" icon={<Phone className="w-3.5 h-3.5" />}>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={studentData.emergencyContact}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Parent Name"
                  />
                </Field>
                <Field label="Emergency Phone">
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={studentData.emergencyPhone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0912-345-6789"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* RIGHT: PREVIEW & ACTION */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur p-6 lg:p-8 rounded-2xl shadow-xl shadow-gray-200/40 dark:shadow-black/20 border border-gray-200/50 dark:border-gray-700/50 flex flex-col">
              <SectionHeader icon={<IdCard className="w-5 h-5" />} title="ID Preview (Front & Back)" />

              <div className="flex flex-col md:flex-row md:space-x-6 items-center justify-center w-full overflow-auto py-4 mt-2">
                <IDTemplate data={studentData} idRef={idPreviewRef} />
                <IDBackTemplate data={studentData} idRef={idBackPreviewRef} />
              </div>

              <div className="mt-6 w-full space-y-4">
                <button
                  onClick={handleSaveID}
                  disabled={isGenerating}
                  className={`group relative w-full flex items-center justify-center px-6 py-4 rounded-xl text-lg font-bold transition-all overflow-hidden ${
                    isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-600 hover:from-emerald-600 hover:via-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Printer className="w-6 h-6 mr-3 animate-pulse" />
                      GENERATING PDF...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                      GENERATE & DOWNLOAD 2-SIDED ID
                    </>
                  )}
                </button>

                {lastSavedPath && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border border-green-200 dark:border-green-800 rounded-xl flex items-start animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-green-800 dark:text-green-300">
                        Double-Sided ID Downloaded!
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400 mt-1 break-all font-mono">
                        <FileText className="inline w-3 h-3 mr-1" />
                        {lastSavedPath}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                        Check your browser's Downloads folder.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600">
          <p>ID-AUTOMATOR &middot; Designed for GESTAAC</p>
        </footer>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border: 1px solid rgb(209 213 219);
          border-radius: 0.5rem;
          background-color: white;
          color: rgb(17 24 39);
          transition: all 0.15s;
          font-size: 0.875rem;
        }
        .input-field:focus {
          outline: none;
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        .dark .input-field {
          background-color: rgb(55 65 81);
          border-color: rgb(75 85 99);
          color: rgb(243 244 246);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
      {icon}
    </div>
    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
  </div>
);

const Field: React.FC<{ label: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center space-x-1 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
      {icon}
      <span>{label}</span>
    </label>
    {children}
  </div>
);

const StepBadge: React.FC<{ active: boolean; label: string }> = ({ active, label }) => (
  <div className="flex items-center space-x-1.5">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
        active
          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
      }`}
    >
      {active ? <CheckCircle2 className="w-3.5 h-3.5" /> : '○'}
    </div>
    <span className={`text-xs font-semibold ${active ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
      {label}
    </span>
  </div>
);

export default App;
