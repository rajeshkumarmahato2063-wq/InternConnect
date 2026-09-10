import { supabase } from './supabaseClient';

export const assessmentService = {
  // Fetch company's posted internships with assessment status
  getCompanyAssessments: async (companyId) => {
    try {
      // 1. Fetch company's internships
      const { data: jobs, error: jobsErr } = await supabase
        .from('internships')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (jobsErr || !jobs) return [];

      const jobIds = jobs.map((j) => j.id);
      if (jobIds.length === 0) return [];

      // 2. Fetch associated assessments
      const { data: assessments, error: assErr } = await supabase
        .from('assessments')
        .select('*, questions(*), assessment_attempts(*)')
        .in('internship_id', jobIds);

      if (assErr) {
        console.warn('Supabase fetch note for assessments:', assErr.message);
      }

      // Map assessments to jobs
      return jobs.map((job) => {
        const ass = (assessments || []).find((a) => a.internship_id === job.id);
        return {
          jobId: job.id,
          jobTitle: job.title,
          department: job.department || 'Engineering',
          assessment: ass
            ? {
                id: ass.id,
                title: ass.title,
                durationMinutes: ass.duration_minutes,
                totalMarks: ass.total_marks,
                passingMarks: ass.passing_marks,
                instructions: ass.instructions,
                createdAt: ass.created_at,
                questions: (ass.questions || []).map((q) => ({
                  id: q.id,
                  question: q.question,
                  optionA: q.option_a,
                  optionB: q.option_b,
                  optionC: q.option_c,
                  optionD: q.option_d,
                  correctAnswer: q.correct_answer,
                  marks: q.marks,
                })),
                attempts: ass.assessment_attempts || [],
              }
            : null,
        };
      });
    } catch (err) {
      console.error('Error fetching company assessments:', err);
      return [];
    }
  },

  // Save or update an assessment with MCQs
  saveAssessment: async ({
    id = null,
    internshipId,
    title,
    durationMinutes = 30,
    totalMarks = 100,
    passingMarks = 60,
    instructions,
    questions = [],
    userId,
  }) => {
    try {
      let assessmentId = id;

      // 1. Upsert assessment record
      const payload = {
        internship_id: internshipId,
        title,
        duration_minutes: parseInt(durationMinutes, 10),
        total_marks: parseInt(totalMarks, 10),
        passing_marks: parseInt(passingMarks, 10),
        instructions,
        created_by: userId,
      };

      if (id) {
        payload.id = id;
      }

      const { data: assData, error: assErr } = await supabase
        .from('assessments')
        .upsert(payload, { onConflict: 'internship_id' })
        .select('*')
        .single();

      if (assErr) throw assErr;
      assessmentId = assData.id;

      // 2. Clear old questions & insert new questions if updating
      if (questions.length > 0) {
        await supabase.from('questions').delete().eq('assessment_id', assessmentId);

        const questionPayloads = questions.map((q) => ({
          assessment_id: assessmentId,
          question: q.question,
          option_a: q.optionA,
          option_b: q.optionB,
          option_c: q.optionC,
          option_d: q.optionD,
          correct_answer: q.correctAnswer,
          marks: parseInt(q.marks || 10, 10),
        }));

        const { error: qErr } = await supabase.from('questions').insert(questionPayloads);
        if (qErr) console.warn('Question insert warning:', qErr.message);
      }

      return assData;
    } catch (err) {
      console.error('Error saving assessment:', err);
      throw err;
    }
  },

  // Delete an assessment
  deleteAssessment: async (assessmentId) => {
    try {
      const { error } = await supabase.from('assessments').delete().eq('id', assessmentId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting assessment:', err);
      return false;
    }
  },

  // Get available assessments for student's applied internships
  getStudentAssessments: async (studentId) => {
    try {
      // 1. Fetch student applications
      const { data: apps, error: appErr } = await supabase
        .from('applications')
        .select('*, internship:internships(*)')
        .eq('student_id', studentId);

      if (appErr || !apps || apps.length === 0) return [];

      const internshipIds = apps.map((a) => a.internship_id).filter(Boolean);
      if (internshipIds.length === 0) return [];

      // 2. Fetch assessments for those internships
      const { data: assessments, error: assErr } = await supabase
        .from('assessments')
        .select('*, questions(*)')
        .in('internship_id', internshipIds);

      if (assErr || !assessments) return [];

      // 3. Fetch student's attempts
      const { data: attempts } = await supabase
        .from('assessment_attempts')
        .select('*')
        .eq('student_id', studentId);

      const attemptMap = {};
      (attempts || []).forEach((att) => {
        attemptMap[att.assessment_id] = att;
      });

      return assessments.map((ass) => {
        const matchedApp = apps.find((a) => a.internship_id === ass.internship_id);
        const attempt = attemptMap[ass.id] || null;

        return {
          id: ass.id,
          internshipId: ass.internship_id,
          jobTitle: matchedApp?.internship?.title || 'Internship',
          companyName: matchedApp?.internship?.company_name || 'Company',
          title: ass.title,
          durationMinutes: ass.duration_minutes,
          totalMarks: ass.total_marks,
          passingMarks: ass.passing_marks,
          instructions: ass.instructions,
          totalQuestions: (ass.questions || []).length,
          questions: (ass.questions || []).map((q) => ({
            id: q.id,
            question: q.question,
            optionA: q.option_a,
            optionB: q.option_b,
            optionC: q.option_c,
            optionD: q.option_d,
            correctAnswer: q.correct_answer,
            marks: q.marks,
          })),
          attempt: attempt
            ? {
                id: attempt.id,
                score: attempt.score,
                status: attempt.status,
                answers: attempt.answers || {},
                startedAt: attempt.started_at,
                submittedAt: attempt.submitted_at,
              }
            : null,
        };
      });
    } catch (err) {
      console.error('Error fetching student assessments:', err);
      return [];
    }
  },

  // Start student assessment attempt
  startAttempt: async (assessmentId, studentId) => {
    try {
      const payload = {
        assessment_id: assessmentId,
        student_id: studentId,
        status: 'Started',
        started_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('assessment_attempts')
        .upsert(payload, { onConflict: 'assessment_id,student_id' })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error starting attempt:', err);
      return null;
    }
  },

  // Submit assessment attempt & auto-calculate score
  submitAttempt: async ({ assessmentId, studentId, userAnswers, questions = [], passingMarks = 60 }) => {
    try {
      let earnedMarks = 0;
      let totalPossibleMarks = 0;
      let correctCount = 0;
      let wrongCount = 0;

      questions.forEach((q) => {
        const qMarks = q.marks || 10;
        totalPossibleMarks += qMarks;

        const studentAns = (userAnswers[q.id] || '').toLowerCase().trim();
        const correctAns = (q.correctAnswer || '').toLowerCase().trim();

        // Normalize option_a -> option_a or A -> option_a
        const mapOption = (opt) => {
          if (opt === 'a' || opt === 'option_a') return 'option_a';
          if (opt === 'b' || opt === 'option_b') return 'option_b';
          if (opt === 'c' || opt === 'option_c') return 'option_c';
          if (opt === 'd' || opt === 'option_d') return 'option_d';
          return opt;
        };

        if (studentAns && mapOption(studentAns) === mapOption(correctAns)) {
          earnedMarks += qMarks;
          correctCount += 1;
        } else if (studentAns) {
          wrongCount += 1;
        }
      });

      const percentage = totalPossibleMarks > 0 ? Math.round((earnedMarks / totalPossibleMarks) * 100) : 0;
      const status = percentage >= passingMarks ? 'Passed' : 'Failed';

      const payload = {
        assessment_id: assessmentId,
        student_id: studentId,
        score: earnedMarks,
        status,
        answers: userAnswers,
        submitted_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('assessment_attempts')
        .upsert(payload, { onConflict: 'assessment_id,student_id' })
        .select('*')
        .single();

      if (error) throw error;

      return {
        attemptId: data.id,
        score: earnedMarks,
        totalPossibleMarks,
        percentage,
        correctCount,
        wrongCount,
        unansweredCount: questions.length - (correctCount + wrongCount),
        status,
        submittedAt: data.submitted_at,
      };
    } catch (err) {
      console.error('Error submitting attempt:', err);
      throw err;
    }
  },

  // Fetch Leaderboard for a company's assessment
  getAssessmentLeaderboard: async (assessmentId) => {
    try {
      const { data, error } = await supabase
        .from('assessment_attempts')
        .select('*, student:profiles(*)')
        .eq('assessment_id', assessmentId)
        .order('score', { ascending: false });

      if (error || !data) return [];

      return data.map((att) => ({
        id: att.id,
        studentName: att.student?.full_name || 'Student Candidate',
        studentCollege: att.student?.college || 'University',
        studentAvatar: att.student?.avatar_url,
        score: att.score,
        status: att.status,
        submittedAt: att.submitted_at,
      }));
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  },
};
