import React, { useState, useRef, useEffect } from 'react';
import { Save, UserPlus, Printer, FileText } from 'lucide-react';
import PhotoUploader from './components/PhotoUploader';
import IDTemplate from './components/IDTemplate';
import IDBackTemplate from './components/IDBackTemplate';
import { generateAndSavePDF } from './utils/pdfGenerator';
import { ILOCOS_NORTE_DATA } from './utils/locations';

interface StudentData {
  firstName: string;
  lastName: string;
  middleInitial: string;
  studentId: string;
  course: string;
  address: string;
  birthDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  photoUrl: string | null;
}

const DEFAULT_COURSE = "Data Analytics Level III";

function App() {
  const [studentData, setStudentData] = useState<StudentData>({
    firstName: '',
    lastName: '',
    middleInitial: '',
    studentId: `2026-${Math.floor(1000 + Math.random() * 9000)}`,
    course: DEFAULT_COURSE,
    address: '',
    birthDate: '',
    emergencyContact: '',
    emergencyPhone: '',
    photoUrl: null,
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
      alert('Please fill in Student Name.');
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
      emergencyContact: '',
      emergencyPhone: '',
      photoUrl: null,
    });
    setSelectedTown("");
    setSelectedBarangay("");
    setLastSavedPath(null);
  };

  const currentTownData = ILOCOS_NORTE_DATA.find(t => t.name === selectedTown);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center border-b pb-4 dark:border-gray-700">
          <div>
            <h1 className="text-3xl font-black text-blue-600 dark:text-blue-400">ID-AUTOMATOR</h1>
            <p className="text-gray-500 dark:text-gray-400">Automated Student ID Generation System</p>
          </div>
          <button 
            onClick={resetForm}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            New Student
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border dark:border-gray-700">
            <h2 className="text-xl font-bold border-b pb-2 dark:border-gray-700">Student Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={studentData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={studentData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Student ID #</label>
                <input
                  type="text"
                  name="studentId"
                  value={studentData.studentId}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 font-mono text-red-600 font-bold cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Course</label>
                <input
                  type="text"
                  name="course"
                  value={studentData.course}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Course Title"
                />
              </div>
            </div>

            <PhotoUploader onPhotoProcessed={handlePhotoProcessed} />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase border-b dark:border-gray-700 pb-1">Location & Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Town / City (Ilocos Norte)</label>
                  <select
                    value={selectedTown}
                    onChange={(e) => {
                      setSelectedTown(e.target.value);
                      setSelectedBarangay("");
                    }}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Select Town/City</option>
                    {ILOCOS_NORTE_DATA.map(town => (
                      <option key={town.name} value={town.name}>{town.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Barangay</label>
                  <select
                    value={selectedBarangay}
                    onChange={(e) => setSelectedBarangay(e.target.value)}
                    disabled={!selectedTown}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Barangay</option>
                    {currentTownData?.barangays.map(brgy => (
                      <option key={brgy} value={brgy}>{brgy}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Address (Preview)</label>
                <input
                  type="text"
                  value={studentData.address}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 italic text-gray-500"
                  placeholder="Select Town and Barangay above"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Birth Date</label>
                  <input
                    type="text"
                    name="birthDate"
                    value={studentData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="MM/DD/YYYY"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Middle Initial</label>
                  <input
                    type="text"
                    name="middleInitial"
                    maxLength={1}
                    value={studentData.middleInitial}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="M"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">In Case of Emergency</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={studentData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Parent Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Emergency Phone</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={studentData.emergencyPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    placeholder="0912-345-6789"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Action */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border dark:border-gray-700 flex flex-col items-center">
              <h2 className="text-xl font-bold mb-6 self-start border-b pb-2 w-full dark:border-gray-700">ID Preview (Front & Back)</h2>
              
              <div className="flex flex-col md:flex-row md:space-x-8 items-start justify-center w-full overflow-auto py-4">
                <IDTemplate data={studentData} idRef={idPreviewRef} />
                <IDBackTemplate data={studentData} idRef={idBackPreviewRef} />
              </div>

              <div className="mt-8 w-full space-y-4">
                <button
                  onClick={handleSaveID}
                  disabled={isGenerating}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-lg text-lg font-bold transition-all ${
                    isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Printer className="w-6 h-6 mr-3 animate-pulse" />
                      GENERATING 2-SIDED PDF...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6 mr-3" />
                      GENERATE & SAVE 2-SIDED ID
                    </>
                  )}
                </button>

                {lastSavedPath && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
                    <FileText className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-green-800 dark:text-green-300">Double-Sided ID Downloaded!</p>
                      <p className="text-xs text-green-700 dark:text-green-400 mt-1 break-all font-mono">
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
      </div>
    </div>
  );
}

export default App;
