import { supabase } from './supabaseClient';
import { MOCK_INTERNSHIPS, MOCK_APPLICATIONS } from './mockData';

export const internshipService = {
  /**
   * Fetch active internships from Supabase 'internships' table with multi-filters
   */
  getInternships: async (filters = {}) => {
    try {
      let query = supabase
        .from('internships')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Multi-column search query
      if (filters.query && filters.query.trim() !== '') {
        const q = filters.query.trim();
        query = query.or(
          `title.ilike.%${q}%,company_name.ilike.%${q}%,location.ilike.%${q}%,work_mode.ilike.%${q}%`
        );
      }

      // Location filter (handling Remote keyword)
      if (filters.location && filters.location.trim() !== '') {
        const loc = filters.location.trim();
        if (loc.toLowerCase() === 'remote') {
          query = query.or(`location.ilike.%remote%,work_mode.ilike.%remote%`);
        } else {
          query = query.ilike('location', `%${loc}%`);
        }
      }

      if (filters.workMode && filters.workMode !== 'All') {
        query = query.eq('work_mode', filters.workMode);
      }

      if (filters.minStipend) {
        query = query.gte('stipend_value', Number(filters.minStipend));
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        let items = data.map((item) => ({
          id: item.id,
          companyId: item.company_id,
          companyName: item.company_name || 'Tech Company',
          companyLogo:
            item.company_logo ||
            'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
          title: item.title,
          description: item.description,
          location: item.location,
          workMode: item.work_mode,
          stipend: item.stipend,
          stipendValue: item.stipend_value,
          duration: item.duration,
          skills: item.skills || [],
          deadline: item.deadline,
          openings: item.openings,
          isActive: item.is_active,
          matchScore: 92,
        }));

        // Secondary client-side skill array filter if query matches specific skill
        if (filters.query && filters.query.trim() !== '') {
          const q = filters.query.trim().toLowerCase();
          // Filter if item skills contain query or title/company/location matches
          items = items.filter(
            (j) =>
              j.title.toLowerCase().includes(q) ||
              j.companyName.toLowerCase().includes(q) ||
              j.location.toLowerCase().includes(q) ||
              j.workMode.toLowerCase().includes(q) ||
              (j.skills && j.skills.some((s) => s.toLowerCase().includes(q)))
          );
        }

        return items;
      }
    } catch (err) {
      console.warn('Supabase fetch internships fallback:', err);
    }

    // Client mock data fallback
    let result = [...MOCK_INTERNSHIPS];

    if (filters.query && filters.query.trim() !== '') {
      const q = filters.query.trim().toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.workMode.toLowerCase().includes(q) ||
          (j.skills && j.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    if (filters.location && filters.location.trim() !== '') {
      const loc = filters.location.trim().toLowerCase();
      if (loc === 'remote') {
        result = result.filter(
          (j) => j.workMode.toLowerCase() === 'remote' || j.location.toLowerCase().includes('remote')
        );
      } else {
        result = result.filter((j) => j.location.toLowerCase().includes(loc));
      }
    }

    if (filters.workMode && filters.workMode !== 'All') {
      result = result.filter((j) => j.workMode.toLowerCase() === filters.workMode.toLowerCase());
    }

    if (filters.minStipend) {
      result = result.filter((j) => j.stipendValue >= Number(filters.minStipend));
    }

    // Verified Companies Priority Sorting (Verified employers appear first)
    result.sort((a, b) => {
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return 0;
    });

    return result;
  },

  /**
   * Fetch single internship details
   */
  getInternshipById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          companyId: data.company_id,
          companyName: data.company_name || 'Tech Company',
          companyLogo:
            data.company_logo ||
            'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
          title: data.title,
          description: data.description,
          location: data.location,
          workMode: data.work_mode,
          stipend: data.stipend,
          stipendValue: data.stipend_value,
          duration: data.duration,
          skills: data.skills || [],
          deadline: data.deadline,
          openings: data.openings,
          matchScore: 95,
        };
      }
    } catch (err) {
      // ignore
    }

    return MOCK_INTERNSHIPS.find((j) => j.id === id) || MOCK_INTERNSHIPS[0];
  },

  /**
   * Create new internship (Company role)
   */
  createInternship: async (jobData, companyUserId) => {
    try {
      const row = {
        company_id: companyUserId,
        company_name: jobData.companyName || 'Microsoft',
        company_logo:
          jobData.companyLogo ||
          'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        work_mode: jobData.workMode,
        stipend: jobData.stipend,
        stipend_value: jobData.stipendValue || 50000,
        duration: jobData.duration,
        skills: jobData.skills,
        deadline: jobData.deadline,
        openings: jobData.openings,
        is_active: !jobData.saveDraft,
      };

      const { data, error } = await supabase.from('internships').insert([row]).select().single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase create internship fallback:', err);
    }

    const mockJob = {
      id: `job_${Date.now()}`,
      companyId: companyUserId,
      postedAt: new Date().toISOString(),
      applicantsCount: 0,
      matchScore: 90,
      status: jobData.saveDraft ? 'draft' : 'active',
      ...jobData,
    };
    MOCK_INTERNSHIPS.unshift(mockJob);
    return mockJob;
  },

  /**
   * Fetch company's posted internships
   */
  getCompanyInternships: async (companyUserId) => {
    try {
      let query = supabase
        .from('internships')
        .select('*')
        .order('created_at', { ascending: false });

      if (companyUserId) {
        query = query.eq('company_id', companyUserId);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          companyId: item.company_id,
          companyName: item.company_name || 'Tech Company',
          companyLogo: item.company_logo || 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
          title: item.title,
          description: item.description,
          location: item.location,
          workMode: item.work_mode,
          stipend: item.stipend,
          stipendValue: item.stipend_value,
          duration: item.duration,
          skills: item.skills || [],
          deadline: item.deadline,
          openings: item.openings,
          isActive: item.is_active,
          status: item.is_active ? 'active' : 'closed',
          applicantsCount: 0,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch company internships fallback:', err);
    }

    return MOCK_INTERNSHIPS;
  },

  /**
   * Update existing internship details
   */
  updateInternship: async (id, jobData) => {
    try {
      const row = {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        work_mode: jobData.workMode,
        stipend: jobData.stipend,
        stipend_value: jobData.stipendValue || 50000,
        duration: jobData.duration,
        skills: jobData.skills,
        deadline: jobData.deadline,
        openings: jobData.openings,
        is_active: jobData.isActive !== undefined ? jobData.isActive : true,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('internships')
        .update(row)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase update internship fallback:', err);
    }

    const mock = MOCK_INTERNSHIPS.find((j) => j.id === id);
    if (mock) {
      Object.assign(mock, jobData);
    }
    return mock;
  },

  /**
   * Update internship active status (Close/Reopen)
   */
  updateInternshipStatus: async (id, isActiveOrStatus) => {
    const isAct = typeof isActiveOrStatus === 'boolean' ? isActiveOrStatus : isActiveOrStatus === 'active';
    try {
      const { data, error } = await supabase
        .from('internships')
        .update({ is_active: isAct, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (!error && data) return data[0];
    } catch (err) {
      // ignore
    }
    const mock = MOCK_INTERNSHIPS.find((j) => j.id === id);
    if (mock) mock.status = isAct ? 'active' : 'closed';
    return mock;
  },

  /**
   * Delete internship listing
   */
  deleteInternship: async (id) => {
    try {
      await supabase.from('internships').delete().eq('id', id);
    } catch (err) {
      // ignore
    }
    const idx = MOCK_INTERNSHIPS.findIndex((j) => j.id === id);
    if (idx !== -1) MOCK_INTERNSHIPS.splice(idx, 1);
    return true;
  },

  /**
   * Apply for Internship (Student role)
   */
  applyForJob: async ({ internshipId, studentId, coverLetter, resumeUrl, student }) => {
    try {
      const row = {
        internship_id: internshipId,
        student_id: studentId,
        cover_letter: coverLetter,
        resume_url: resumeUrl || 'https://example.com/resume.pdf',
        status: 'Applied',
      };

      const { data, error } = await supabase.from('applications').insert([row]).select().single();

      if (error && error.code === '23505') {
        throw new Error('You have already submitted an application for this internship!');
      }

      if (!error && data) return data;
    } catch (err) {
      if (err.message.includes('already')) throw err;
    }

    const mockApp = {
      id: `app_${Date.now()}`,
      jobId: internshipId,
      studentId: studentId,
      studentName: student?.name || 'Candidate',
      studentEmail: student?.email,
      studentCollege: student?.college || 'University',
      studentDegree: student?.degree || 'Degree',
      appliedAt: new Date().toISOString(),
      status: 'Applied',
      matchScore: 95,
      coverLetter,
      resumeName: 'Candidate_Resume.pdf',
      statusHistory: [{ status: 'Applied', timestamp: new Date().toISOString(), note: 'Applied' }],
    };
    MOCK_APPLICATIONS.unshift(mockApp);
    return mockApp;
  },

  /**
   * Save an internship for a student
   */
  saveJob: async (studentId, internshipId) => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .insert([{ student_id: studentId, internship_id: internshipId }])
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase save job fallback:', err);
    }
    return { id: `saved_${Date.now()}`, student_id: studentId, internship_id: internshipId };
  },

  /**
   * Remove a saved internship for a student
   */
  removeSavedJob: async (studentId, internshipId) => {
    try {
      await supabase
        .from('saved_jobs')
        .delete()
        .eq('student_id', studentId)
        .eq('internship_id', internshipId);
    } catch (err) {
      console.warn('Supabase remove saved job fallback:', err);
    }
    return true;
  },

  /**
   * Fetch all saved internships for a student
   */
  getUserSavedJobs: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*, internships(*)')
        .eq('student_id', studentId);

      if (!error && data && data.length > 0) {
        return data
          .filter((item) => item.internships)
          .map((item) => ({
            id: item.internships.id,
            companyId: item.internships.company_id,
            companyName: item.internships.company_name || 'Tech Company',
            companyLogo: item.internships.company_logo || 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
            title: item.internships.title,
            description: item.internships.description,
            location: item.internships.location,
            workMode: item.internships.work_mode,
            stipend: item.internships.stipend,
            stipendValue: item.internships.stipend_value,
            duration: item.internships.duration,
            skills: item.internships.skills || [],
            deadline: item.internships.deadline,
            openings: item.internships.openings,
            matchScore: 94,
          }));
      }
    } catch (err) {
      console.warn('Supabase fetch saved jobs fallback:', err);
    }
    return MOCK_INTERNSHIPS.slice(0, 2);
  },

  /**
   * Fetch applications for a student
   */
  getUserApplications: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, internships(*)')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((a) => ({
          id: a.id,
          jobId: a.internship_id,
          jobTitle: a.internships?.title || 'Software Engineering Intern',
          companyName: a.internships?.company_name || 'Tech Giant',
          companyLogo:
            a.internships?.company_logo ||
            'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
          studentId: a.student_id,
          status: a.status,
          appliedAt: a.applied_at || a.created_at,
          coverLetter: a.cover_letter,
          resumeName: 'Primary_ATS_Resume.pdf',
          interviewDetails: a.interview_details,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch student applications fallback:', err);
    }
    return MOCK_APPLICATIONS;
  },

  /**
   * Fetch applied job IDs for a student
   */
  getUserAppliedJobIds: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('internship_id')
        .eq('student_id', studentId);

      if (!error && data) {
        return data.map(app => app.internship_id);
      }
    } catch (err) {
      console.warn('Supabase fetch student applied job IDs fallback:', err);
    }
    return MOCK_APPLICATIONS.map(a => a.jobId);
  },

  /**
   * Fetch applications submitted to a company's internships
   */
  getCompanyApplications: async (companyUserId) => {
    try {
      let query = supabase.from('applications').select('*, internships(*)');
      if (companyUserId) {
        query = query.eq('internships.company_id', companyUserId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((a) => ({
          id: a.id,
          jobId: a.internship_id,
          jobTitle: a.internships?.title || 'Software Engineering Intern',
          studentName: a.student_name || 'Candidate Student',
          studentEmail: a.student_email || 'student@university.edu',
          studentCollege: a.student_college || 'Indian Institute of Technology',
          studentDegree: a.student_degree || 'B.Tech Computer Science',
          appliedAt: a.applied_at || a.created_at,
          status: a.status,
          matchScore: a.match_score || 88,
          coverLetter: a.cover_letter,
          resumeName: a.resume_name || 'Resume.pdf',
          interviewDetails: a.interview_details,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch company applications fallback:', err);
    }
    return MOCK_APPLICATIONS;
  },

  /**
   * Update Application Status (Recruiter / Company role)
   */
  updateApplicationStatus: async (appId, status, studentId = null, jobTitle = 'Internship') => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', appId)
        .select();

      if (!error && data && data.length > 0) {
        const app = data[0];
        const sId = studentId || app.student_id;
        if (sId) {
          const statusMessages = {
            'Reviewing': `Your application for ${jobTitle} is now under active review.`,
            'Shortlisted': `🎉 Congratulations! You have been shortlisted for ${jobTitle}.`,
            'Interview Scheduled': `🗓️ Technical interview has been scheduled for ${jobTitle}.`,
            'Selected': `🚀 Congratulations! You have been selected for ${jobTitle}!`,
            'Rejected': `Update on your application for ${jobTitle}.`
          };
          await internshipService.createNotification(sId, {
            title: `Application Status Updated: ${status}`,
            message: statusMessages[status] || `Your application status for ${jobTitle} was updated to ${status}.`,
            type: status === 'Selected' ? 'success' : status === 'Shortlisted' ? 'info' : 'update'
          });
        }
        return app;
      }
    } catch (err) {
      console.warn('Supabase status update fallback:', err);
    }

    const app = MOCK_APPLICATIONS.find((a) => a.id === appId);
    if (app) app.status = status;
    return app;
  },

  /**
   * Real-time Subscription listener for Application updates
   */
  subscribeToApplications: (userId, callback) => {
    if (!supabase) return () => {};
    const channel = supabase
      .channel(`public:applications:user:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        (payload) => {
          callback?.(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Real-time Subscription listener for Internship postings updates
   */
  subscribeToInternships: (callback) => {
    if (!supabase) return () => {};
    const channel = supabase
      .channel('public:internships:realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'internships' },
        (payload) => {
          callback?.(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Upload Student Resume to Supabase Storage ('resumes' bucket)
   */
  uploadStudentResume: async (studentId, file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${studentId}/resume_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get Public or Signed URL
      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
      const publicUrl = urlData?.publicUrl || `https://supabase.co/storage/v1/object/public/resumes/${filePath}`;

      // Update Profile table
      await supabase
        .from('profiles')
        .update({
          resume_url: publicUrl,
          resume_name: file.name,
          resume_uploaded_at: new Date().toISOString(),
        })
        .eq('id', studentId);

      return {
        resumeUrl: publicUrl,
        resumeName: file.name,
        uploadedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('Supabase storage upload fallback:', err);
    }

    return {
      resumeUrl: URL.createObjectURL(file),
      resumeName: file.name,
      uploadedAt: new Date().toISOString(),
    };
  },

  /**
   * Delete Student Resume from Supabase Storage
   */
  deleteStudentResume: async (studentId) => {
    try {
      await supabase
        .from('profiles')
        .update({
          resume_url: null,
          resume_name: null,
          resume_uploaded_at: null,
        })
        .eq('id', studentId);
    } catch (err) {
      console.warn('Supabase resume delete fallback:', err);
    }
    return true;
  },

  /**
   * Schedule Technical Interview (Company recruiter role)
   */
  scheduleInterview: async (interviewData) => {
    try {
      const row = {
        internship_id: interviewData.jobId || interviewData.internship_id,
        student_id: interviewData.studentId || interviewData.student_id,
        company_id: interviewData.companyId || interviewData.company_id,
        interview_date: interviewData.date || interviewData.interview_date,
        interview_time: interviewData.time || interviewData.interview_time,
        meeting_link: interviewData.meetingLink || interviewData.meeting_link || 'https://meet.google.com/abc-defg-hij',
        interview_type: interviewData.interview_type || interviewData.interviewType || 'Technical Screening',
        notes: interviewData.notes || 'Technical Live Code Evaluation',
        status: 'Scheduled',
      };

      const { data, error } = await supabase.from('interviews').insert([row]).select().single();

      // Trigger candidate notification
      const studentId = interviewData.studentId || interviewData.student_id;
      if (studentId) {
        await internshipService.createNotification(studentId, {
          title: '🗓️ Interview Scheduled!',
          message: `Technical interview (${row.interview_type}) scheduled for ${row.interview_date} at ${row.interview_time}.`,
          type: 'interview',
        });
      }

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase schedule interview fallback:', err);
    }

    const mockInterview = {
      id: `int_${Date.now()}`,
      jobTitle: interviewData.jobTitle || 'Software Engineer Intern',
      companyName: interviewData.companyName || 'Tech Company',
      date: interviewData.date || '2026-10-15',
      time: interviewData.time || '10:00 AM',
      meetingLink: interviewData.meetingLink || 'https://meet.google.com/abc-defg-hij',
      interviewType: interviewData.interview_type || 'Technical Screening',
      notes: interviewData.notes || 'Technical Live Code Evaluation',
      status: 'Scheduled',
    };
    return mockInterview;
  },

  /**
   * Fetch scheduled interviews for a student
   */
  getStudentInterviews: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*, internships(*), company:profiles!company_id(*)')
        .eq('student_id', studentId)
        .order('interview_date', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          jobId: item.internship_id,
          jobTitle: item.internships?.title || 'Engineering Intern',
          companyName: item.company?.full_name || item.internships?.company_name || 'Tech Company',
          companyLogo: item.company?.avatar_url || item.internships?.company_logo || 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
          date: item.interview_date,
          time: item.interview_time,
          meetingLink: item.meeting_link,
          interviewType: item.interview_type || 'Technical Screening',
          notes: item.notes,
          status: item.status || 'Scheduled',
          created_at: item.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch student interviews fallback:', err);
    }

    return [
      {
        id: 'int_1',
        jobTitle: 'Frontend Software Engineering Intern',
        companyName: 'Microsoft',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        date: '2026-10-15',
        time: '10:00 AM IST',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        interviewType: 'Technical Screening',
        notes: 'Round 1: React architecture & System Design',
        status: 'Scheduled',
      },
    ];
  },

  /**
   * Fetch scheduled interviews for a recruiter company
   */
  getCompanyInterviews: async (companyId) => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*, internships(*), student:profiles!student_id(*)')
        .eq('company_id', companyId)
        .order('interview_date', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          jobId: item.internship_id,
          jobTitle: item.internships?.title || 'Engineering Intern',
          studentName: item.student?.full_name || 'Student Candidate',
          studentEmail: item.student?.email || 'student@example.com',
          studentAvatar: item.student?.avatar_url,
          date: item.interview_date,
          time: item.interview_time,
          meetingLink: item.meeting_link,
          interviewType: item.interview_type || 'Technical Screening',
          notes: item.notes,
          status: item.status || 'Scheduled',
          created_at: item.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch company interviews fallback:', err);
    }

    return [];
  },

  /**
   * Update Interview Status (Completed, Cancelled, Scheduled)
   */
  updateInterviewStatus: async (interviewId, status, studentId, details = {}) => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .update({ status })
        .eq('id', interviewId)
        .select()
        .single();

      if (studentId) {
        let msg = `Your interview status has been updated to ${status}.`;
        if (status === 'Cancelled') msg = `Your scheduled interview for ${details.jobTitle || 'internship'} has been cancelled by the recruiter.`;
        if (status === 'Completed') msg = `Your interview for ${details.jobTitle || 'internship'} has been marked as Completed.`;
        await internshipService.createNotification(studentId, {
          title: `🗓️ Interview Update: ${status}`,
          message: msg,
          type: status === 'Cancelled' ? 'alert' : 'info'
        });
      }

      if (!error && data) return data;
    } catch (err) {
      console.warn('Update interview status exception:', err);
    }
    return { id: interviewId, status };
  },

  /**
   * Realtime subscription for interviews table
   */
  subscribeToInterviews: (userId, onInterviewChange) => {
    if (!userId) return () => {};
    try {
      const channel = supabase
        .channel(`public:interviews:user_${userId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'interviews' },
          (payload) => {
            if (onInterviewChange) onInterviewChange(payload);
          }
        )
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } catch (err) {
      console.warn('Interviews realtime subscription error:', err);
      return () => {};
    }
  },

  /**
   * Notification Persistence & Retrieval
   */
  createNotification: async (userId, { title, message, type }) => {
    try {
      await supabase.from('notifications').insert([
        {
          user_id: userId,
          title,
          message,
          type: type || 'info',
          is_read: false,
        },
      ]);
    } catch (err) {
      // ignore
    }
  },

  getUserNotifications: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      // ignore
    }
    return [];
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    } catch (err) {
      // ignore
    }
  },

  /**
   * Real-Time Messaging API
   */
  getConversations: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetch messages fallback:', err);
    }

    return [
      {
        id: 'msg_1',
        sender_id: 'comp_google',
        receiver_id: userId,
        sender_name: 'Google Recruiter',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        message: 'Hi Aarav, we reviewed your ATS resume score and would love to schedule a quick 30-min technical call!',
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'msg_2',
        sender_id: 'comp_microsoft',
        receiver_id: userId,
        sender_name: 'Microsoft Engineering Lead',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        message: 'Congratulations! Your offer letter for the Frontend Intern position has been issued.',
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  },

  sendMessage: async ({ sender_id, receiver_id, internship_id, message }) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ sender_id, receiver_id, internship_id, message, is_read: false }])
        .select()
        .single();

      // Send real-time notification
      await internshipService.createNotification(receiver_id, {
        title: '💬 New Message',
        message: message.length > 50 ? `${message.substring(0, 50)}...` : message,
        type: 'message',
      });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase send message fallback:', err);
    }

    return {
      id: `msg_${Date.now()}`,
      sender_id,
      receiver_id,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    };
  },

  subscribeToMessages: (userId, callback) => {
    if (!supabase) return () => {};
    const channel = supabase
      .channel(`public:messages:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new?.sender_id === userId || payload.new?.receiver_id === userId) {
            callback?.(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Offer Letter API
   */
  sendOfferLetter: async (offerData) => {
    try {
      const row = {
        internship_id: offerData.internship_id,
        student_id: offerData.student_id,
        company_id: offerData.company_id,
        offer_letter_url: offerData.offer_letter_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        stipend: offerData.stipend || '$4,500/month',
        status: 'Pending',
        issued_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('offers').insert([row]).select().single();

      // Trigger notification
      await internshipService.createNotification(offerData.student_id, {
        title: '🎉 Official Offer Letter Received!',
        message: `You have received an official internship offer letter. Click to view details.`,
        type: 'offer',
      });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase send offer fallback:', err);
    }

    return {
      id: `off_${Date.now()}`,
      ...offerData,
      status: 'Pending',
      issued_at: new Date().toISOString(),
    };
  },

  getStudentOffers: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*, internships(*)')
        .eq('student_id', studentId)
        .order('issued_at', { ascending: false });

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase fetch offers fallback:', err);
    }

    return [
      {
        id: 'off_101',
        internship_id: 'job_1',
        student_id: studentId,
        company_name: 'Microsoft Inc.',
        company_logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        job_title: 'Full Stack Engineering Intern',
        offer_letter_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        stipend: '$5,200 / month',
        status: 'Pending',
        issued_at: new Date(Date.now() - 72000000).toISOString(),
      },
    ];
  },

  respondToOffer: async (offerId, status) => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .update({ status })
        .eq('id', offerId)
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase offer response fallback:', err);
    }
    return { id: offerId, status };
  },

  /**
   * Internship Certificate API
   */
  issueCertificate: async (certData) => {
    try {
      const row = {
        student_id: certData.student_id,
        internship_id: certData.internship_id,
        certificate_url: certData.certificate_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        verification_code: `CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        issued_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('certificates').insert([row]).select().single();

      // Trigger notification
      await internshipService.createNotification(certData.student_id, {
        title: '📜 Completion Certificate Issued!',
        message: 'Your official internship completion certificate is ready for download & verification.',
        type: 'certificate',
      });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase issue certificate fallback:', err);
    }

    return {
      id: `cert_${Date.now()}`,
      ...certData,
      verification_code: `CERT-ICAI990`,
      issued_at: new Date().toISOString(),
    };
  },

  getStudentCertificates: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*, internships(*)')
        .eq('student_id', studentId)
        .order('issued_at', { ascending: false });

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase fetch certificates fallback:', err);
    }

    return [
      {
        id: 'cert_88',
        student_id: studentId,
        company_name: 'Google LLC',
        company_logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        job_title: 'AI Product Development Intern',
        certificate_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        verification_code: 'CERT-ICAI-2026-X89',
        issued_at: new Date(Date.now() - 400000000).toISOString(),
      },
    ];
  },
};

export default internshipService;
