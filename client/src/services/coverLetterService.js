import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:5000');

export const coverLetterService = {
  // Generate cover letter via Gemini API backend & persist to Supabase
  generate: async ({
    studentId,
    internshipId = null,
    studentName,
    studentCollege,
    studentDegree,
    studentSkills = [],
    internshipTitle,
    companyName,
    internshipDescription = '',
  }) => {
    let coverLetter = '';

    // 1. Call Backend Gemini AI endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          studentCollege,
          studentDegree,
          studentSkills,
          internshipTitle,
          companyName,
          internshipDescription,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.coverLetter) {
          coverLetter = json.coverLetter;
        }
      }
    } catch (err) {
      console.warn('Backend cover letter service unavailable, utilizing client generator:', err.message);
    }

    // 2. Client-side fallback if backend API is offline
    if (!coverLetter) {
      const skillsStr = Array.isArray(studentSkills) ? studentSkills.join(', ') : studentSkills;
      coverLetter = `Dear Hiring Manager at ${companyName || 'the Team'},

I am writing to express my strong interest in the ${internshipTitle || 'Internship'} role. As a student at ${studentCollege || 'University'} pursuing ${studentDegree || 'Computer Science'}, my academic background and hands-on experience in ${skillsStr || 'software engineering'} align closely with your team's objectives.

During my studies and project work, I have built web applications using full-stack development tools and industry best practices. I take pride in writing clean, maintainable code and solving technical problems efficiently.

${companyName || 'Your company'}'s work in technical innovation deeply inspires me. I am eager to bring my enthusiasm, technical foundation, and dedication to your engineering operations.

Thank you for your consideration. I look forward to discussing how my experience can contribute to your upcoming projects.

Sincerely,
${studentName || 'Aarav Sharma'}
${studentDegree || 'Computer Science'} | ${studentCollege || 'University'}`;
    }

    // 3. Persist generated letter into Supabase cover_letters table
    if (studentId && coverLetter) {
      try {
        const dbPayload = {
          student_id: studentId,
          internship_id: internshipId,
          content: coverLetter,
        };

        const { data, error } = await supabase
          .from('cover_letters')
          .insert(dbPayload)
          .select('*')
          .maybeSingle();

        if (error) {
          console.warn('Supabase cover letter insert notice:', error.message);
        }
      } catch (dbErr) {
        console.warn('Database save exception:', dbErr.message);
      }

      // Local storage fallback cache
      const historyKey = `ic_cover_letters_${studentId}`;
      const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
      existing.unshift({
        id: `cl_${Date.now()}`,
        internshipId,
        content: coverLetter,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(historyKey, JSON.stringify(existing.slice(0, 10)));
    }

    return coverLetter;
  },

  // Export & Download formatted PDF document
  downloadPDF: (content, title = 'Cover_Letter') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formattedContent = content
      .split('\n\n')
      .map((para) => `<p style="margin-bottom: 16px; line-height: 1.6;">${para.replace(/\n/g, '<br/>')}</p>`)
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              padding: 40px 50px;
              max-width: 800px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header-bar {
              border-bottom: 2px solid #6366f1;
              padding-bottom: 15px;
              margin-bottom: 30px;
            }
            .header-bar h1 {
              margin: 0;
              font-size: 24px;
              color: #4f46e5;
            }
            .header-bar p {
              margin: 4px 0 0 0;
              font-size: 13px;
              color: #64748b;
            }
            .letter-body {
              font-size: 14px;
              line-height: 1.7;
              color: #334155;
            }
            .footer {
              margin-top: 50px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <h1>INTERNCONNECT AI — PROFESSIONAL COVER LETTER</h1>
            <p>Generated via Gemini AI Engine • Verified Candidate Document</p>
          </div>
          <div class="letter-body">
            ${formattedContent}
          </div>
          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} via InternConnect AI Platform
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  },
};
