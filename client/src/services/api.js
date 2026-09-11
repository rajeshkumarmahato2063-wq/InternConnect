import axios from 'axios';
import {
  MOCK_INTERNSHIPS,
  MOCK_APPLICATIONS,
  MOCK_COMPANIES,
  MOCK_USERS,
  MOCK_NOTIFICATIONS,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:5000');

// Configure Axios Client for Production / Express Backend
export const axiosClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor to attach Bearer JWT Token automatically
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ic_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // --- Backend Auth API Endpoints ---
  login: async (email, password) => {
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  registerStudent: async (studentData) => {
    try {
      const response = await axiosClient.post('/auth/student/register', studentData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  registerCompany: async (companyData) => {
    try {
      const response = await axiosClient.post('/auth/company/register', companyData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  // --- Internships (Mock Data Layer) ---
  getInternships: async (filters = {}) => {
    await delay();
    let result = [...MOCK_INTERNSHIPS];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.workMode && filters.workMode !== 'All') {
      result = result.filter((j) => j.workMode.toLowerCase() === filters.workMode.toLowerCase());
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter((j) => j.location.toLowerCase().includes(loc));
    }

    if (filters.paidOnly) {
      result = result.filter((j) => j.paid);
    }

    if (filters.minStipend) {
      result = result.filter((j) => j.stipendValue >= Number(filters.minStipend));
    }

    return result;
  },

  getInternshipById: async (id) => {
    await delay();
    return MOCK_INTERNSHIPS.find((j) => j.id === id) || null;
  },

  createInternship: async (jobData) => {
    await delay(500);
    const newJob = {
      id: `job_${Date.now()}`,
      postedAt: new Date().toISOString(),
      applicantsCount: 0,
      matchScore: 90,
      status: jobData.saveDraft ? 'draft' : 'active',
      flagged: false,
      companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      ...jobData,
    };
    MOCK_INTERNSHIPS.unshift(newJob);
    return newJob;
  },

  updateInternshipStatus: async (id, status) => {
    await delay();
    const job = MOCK_INTERNSHIPS.find((j) => j.id === id);
    if (job) job.status = status;
    return job;
  },

  deleteInternship: async (id) => {
    await delay();
    const idx = MOCK_INTERNSHIPS.findIndex((j) => j.id === id);
    if (idx !== -1) MOCK_INTERNSHIPS.splice(idx, 1);
    return true;
  },

  // --- Applications ---
  getApplications: async (studentId) => {
    await delay();
    if (studentId) {
      return MOCK_APPLICATIONS.filter((a) => a.studentId === studentId);
    }
    return MOCK_APPLICATIONS;
  },

  applyForJob: async ({ jobId, coverLetter, resumeName, student }) => {
    await delay(600);
    const job = MOCK_INTERNSHIPS.find((j) => j.id === jobId);
    if (!job) throw new Error('Job listing not found');

    const existing = MOCK_APPLICATIONS.find(
      (a) => a.jobId === jobId && a.studentId === student.id
    );
    if (existing) throw new Error('You have already applied to this internship!');

    const newApp = {
      id: `app_${Date.now()}`,
      jobId,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentAvatar: student.avatar,
      studentCollege: student.college,
      studentDegree: student.degree,
      appliedAt: new Date().toISOString(),
      status: 'Applied',
      matchScore: job.matchScore || 90,
      coverLetter,
      resumeName: resumeName || 'Student_Resume.pdf',
      statusHistory: [
        {
          status: 'Applied',
          timestamp: new Date().toISOString(),
          note: 'Application submitted successfully.',
        },
      ],
    };

    job.applicantsCount = (job.applicantsCount || 0) + 1;
    MOCK_APPLICATIONS.unshift(newApp);
    return newApp;
  },

  updateApplicationStatus: async (appId, status, note, interviewDetails = null) => {
    await delay();
    const app = MOCK_APPLICATIONS.find((a) => a.id === appId);
    if (app) {
      app.status = status;
      app.statusHistory.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${status}.`,
      });
      if (interviewDetails) {
        app.interviewDetails = interviewDetails;
      }
    }
    return app;
  },

  getCompanies: async () => {
    await delay();
    return MOCK_COMPANIES;
  },

  verifyCompany: async (companyId, verify = true) => {
    await delay();
    const comp = MOCK_COMPANIES.find((c) => c.id === companyId);
    if (comp) comp.verified = verify;
    return comp;
  },

  getUsers: async () => {
    await delay();
    return MOCK_USERS;
  },

  toggleUserBlock: async (userId) => {
    await delay();
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) user.blocked = !user.blocked;
    return user;
  },

  getNotifications: async () => {
    await delay();
    return MOCK_NOTIFICATIONS;
  },
};
