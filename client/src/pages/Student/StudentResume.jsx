import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  File, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import internshipService from '../../services/internshipService';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];

export default function StudentResume() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await internshipService.getProfile(user.id);
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      showToast("Failed to load profile details", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    if (file.size > MAX_FILE_SIZE) {
      showToast("File size exceeds 5 MB limit.", "error");
      return false;
    }

    const isPdf = file.name.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx = file.name.endsWith('.docx') || file.name.endsWith('.doc') || 
                  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isDocx) {
      showToast("Only PDF and DOCX files are allowed.", "error");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      handleUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        handleUpload(file);
      }
    }
  };

  const handleUpload = async (fileToUpload) => {
    const file = fileToUpload || selectedFile;
    if (!file || !user) return;

    try {
      setUploading(true);
      setProgress(20);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 15 : prev));
      }, 150);

      const result = await internshipService.uploadStudentResume(user.id, file);
      
      clearInterval(progressInterval);
      setProgress(100);

      showToast("Resume uploaded successfully!", "success");
      setProfile(prev => ({
        ...prev,
        resume_url: result.resume_url,
        resume_name: result.resume_name,
        resume_uploaded_at: result.resume_uploaded_at
      }));
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      showToast(err.message || "Failed to upload resume. Please try again.", "error");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 600);
    }
  };

  const handleDelete = async () => {
    if (!user || !profile?.resume_url) return;
    if (!window.confirm("Are you sure you want to delete your stored resume?")) return;

    try {
      setUploading(true);
      await internshipService.deleteStudentResume(user.id, profile.resume_url);
      showToast("Resume removed successfully.", "success");
      setProfile(prev => ({
        ...prev,
        resume_url: null,
        resume_name: null,
        resume_uploaded_at: null
      }));
    } catch (err) {
      console.error("Delete failed:", err);
      showToast(err.message || "Failed to remove resume.", "error");
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Assets</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Resume Management</h1>
            <p className="text-gray-400 mt-2 text-sm max-w-xl">
              Upload your latest ATS-friendly resume to automatically attach it when applying to top AI, Software, and Design internships.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-xs text-gray-300">
            <ShieldCheck className="w-8 h-8 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">Private Supabase Storage</p>
              <p className="text-gray-400 text-[11px] mt-0.5">Encrypted & accessible only during verified application reviews.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Resume Card */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-center space-x-3 text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
          <span>Loading your resume details...</span>
        </div>
      ) : profile?.resume_url ? (
        /* Existing Resume State */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-slate-900/70 border border-slate-700/60 backdrop-blur-xl shadow-xl space-y-6"
        >
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>{profile.resume_name || "Student_Resume.pdf"}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </h3>
                <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Uploaded {formatDate(profile.resume_uploaded_at)}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                    <span>PDF / DOCX Format</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-600/20"
              >
                <Eye className="w-4 h-4" />
                <span>View File</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleDelete}
                disabled={uploading}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 border border-slate-700 hover:border-red-500/30 transition-all"
                title="Delete Resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Replace Resume Section */}
          <div className="pt-2">
            <p className="text-sm font-semibold text-gray-300 mb-3">Replace existing resume</p>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-900/30'
              }`}
            >
              <input
                type="file"
                id="resume-replace-input"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="resume-replace-input"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <UploadCloud className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-gray-300">
                  <span className="text-blue-400 font-semibold hover:underline">Click to upload new version</span> or drag and drop
                </span>
                <span className="text-xs text-gray-500">PDF, DOCX up to 5MB</span>
              </label>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Empty State: No Resume Uploaded */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl text-center space-y-6"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-800/40'
            }`}
          >
            <input
              type="file"
              id="resume-upload-input"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="resume-upload-input"
              className="cursor-pointer flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Upload your Resume</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Drag and drop your file here, or <span className="text-blue-400 font-semibold hover:underline">browse computer</span>
                </p>
              </div>

              <div className="flex items-center space-x-6 text-xs text-gray-400 pt-2">
                <span className="flex items-center space-x-1.5">
                  <File className="w-4 h-4 text-slate-500" />
                  <span>PDF, DOCX formats</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1.5">
                  <HardDrive className="w-4 h-4 text-slate-500" />
                  <span>Maximum file size 5MB</span>
                </span>
              </div>
            </label>
          </div>
        </motion.div>
      )}

      {/* Progress Bar Modal/Overlay */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 rounded-2xl bg-slate-900 border border-blue-500/30 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-white flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Uploading to Supabase Storage...</span>
            </span>
            <span className="text-blue-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-2.5 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>
      )}

      {/* Guidelines Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <h4 className="font-semibold text-white text-sm mb-1">ATS Friendly</h4>
          <p className="text-xs text-gray-400">Use simple typography and clean layout without embedded images to maximize scan rates.</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <h4 className="font-semibold text-white text-sm mb-1">One-Click Apply</h4>
          <p className="text-xs text-gray-400">Your uploaded resume is automatically linked when submitting internship applications.</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <h4 className="font-semibold text-white text-sm mb-1">Instant Updates</h4>
          <p className="text-xs text-gray-400">Updating your resume here refreshes your attachment for all current active applications.</p>
        </div>
      </div>
    </div>
  );
}
