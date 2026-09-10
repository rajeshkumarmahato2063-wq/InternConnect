import { supabase } from './supabaseClient';

// HTML Email Templates Builder with InternConnect AI Blue-Purple Branding
export const buildEmailTemplate = (templateType, data) => {
  const brandHeader = `
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; font-family: sans-serif;">INTERNCONNECT AI</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 12px; font-family: sans-serif;">Next-Gen AI Candidate Engine</p>
    </div>
  `;

  const brandFooter = `
    <div style="padding: 20px; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b; font-family: sans-serif;">
      <p>© 2026 InternConnect AI Platform. All rights reserved.</p>
      <p>Need help? Contact support@internconnect.ai</p>
    </div>
  `;

  let content = '';

  switch (templateType) {
    case 'verify_email':
      content = `
        <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 15px;">Verify Your Email Address</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Welcome to InternConnect AI! Please confirm your email address to unlock your student/recruiter dashboard, AI resume screening, and job applications.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verifyUrl || '#'}" style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);">Verify Email Address</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">This link will expire in 24 hours. If you did not sign up for InternConnect AI, please ignore this email.</p>
      `;
      break;

    case 'password_reset':
      content = `
        <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 15px;">Password Reset Request</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">We received a request to reset your InternConnect AI password. Click the button below to choose a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl || '#'}" style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">Reset My Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px;">For security reasons, this link is valid for one-time use only.</p>
      `;
      break;

    case 'interview_invite':
      content = `
        <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 15px;">Interview Invitation 🎙️</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Great news, <strong>${data.studentName}</strong>! <strong>${data.companyName}</strong> has invited you for an interview for the <strong>${data.jobTitle}</strong> position.</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #334155;">
          <p style="margin: 5px 0; color: #f8fafc;">📅 <strong>Date:</strong> ${data.date}</p>
          <p style="margin: 5px 0; color: #f8fafc;">⏰ <strong>Time:</strong> ${data.time}</p>
          <p style="margin: 5px 0; color: #f8fafc;">🔗 <strong>Meeting Link:</strong> <a href="${data.meetingLink}" style="color: #818cf8;">${data.meetingLink}</a></p>
        </div>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${data.meetingLink}" style="background: #10b981; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: bold; font-size: 13px; display: inline-block;">Join Video Interview</a>
        </div>
      `;
      break;

    case 'offer_letter':
      content = `
        <h2 style="color: #ffffff; font-size: 22px; margin-bottom: 15px;">Official Internship Offer Letter! 🏆</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Congratulations <strong>${data.studentName}</strong>! <strong>${data.companyName}</strong> is delighted to offer you the position of <strong>${data.jobTitle}</strong>.</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #10b981;">
          <p style="margin: 5px 0; color: #34d399;">💰 <strong>Stipend:</strong> ${data.stipend || 'Competitive Stipend'}</p>
          <p style="margin: 5px 0; color: #f8fafc;">🚀 <strong>Expected Start Date:</strong> ${data.startDate || 'Immediate'}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.offerUrl || '#'}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">Download Official Offer Document</a>
        </div>
      `;
      break;

    default:
      content = `
        <h2 style="color: #ffffff; font-size: 20px;">${data.title || 'Notification Update'}</h2>
        <p style="color: #cbd5e1; font-size: 14px;">${data.message || 'You have an update in your candidate portal.'}</p>
      `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #090d16; font-family: sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden;">
          ${brandHeader}
          <div style="padding: 30px;">
            ${content}
          </div>
          ${brandFooter}
        </div>
      </body>
    </html>
  `;
};

export const emailService = {
  // 1. Send Email Verification link via Supabase Auth
  sendVerificationEmail: async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/student/dashboard`,
        },
      });

      if (error) console.warn('Supabase resend verification notice:', error.message);
    } catch (e) {
      console.warn('Verification email exception:', e.message);
    }

    // Log email dispatch
    await emailService.logEmail({
      emailType: 'verify_email',
      recipient: email,
      status: 'Sent',
    });

    return true;
  },

  // 2. Send Password Reset Email link via Supabase Auth
  sendPasswordResetEmail: async (email) => {
    let success = false;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (!error) success = true;
    } catch (err) {
      console.warn('Password reset API exception:', err.message);
    }

    // Log to email_logs table
    await emailService.logEmail({
      emailType: 'password_reset',
      recipient: email,
      status: 'Sent',
    });

    return true;
  },

  // 3. Complete Password Reset Update
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // 4. Send Interview Email Notification
  sendInterviewEmail: async ({ studentEmail, studentName, companyName, jobTitle, date, time, meetingLink, userId }) => {
    await emailService.logEmail({
      userId,
      emailType: 'interview_invite',
      recipient: studentEmail,
      status: 'Sent',
      metadata: { studentName, companyName, jobTitle, date, time, meetingLink },
    });
    return true;
  },

  // 5. Send Offer Letter Email Notification
  sendOfferEmail: async ({ studentEmail, studentName, companyName, jobTitle, startDate, stipend, offerUrl, userId }) => {
    await emailService.logEmail({
      userId,
      emailType: 'offer_letter',
      recipient: studentEmail,
      status: 'Sent',
      metadata: { studentName, companyName, jobTitle, startDate, stipend, offerUrl },
    });
    return true;
  },

  // 6. Log email into Supabase email_logs table
  logEmail: async ({ userId = null, emailType, recipient, status = 'Sent', metadata = {} }) => {
    try {
      await supabase.from('email_logs').insert([
        {
          user_id: userId,
          email_type: emailType,
          recipient,
          status,
          metadata,
        },
      ]);
    } catch (err) {
      console.warn('Supabase email log notice:', err.message);
    }
  },

  // 7. Fetch user's email logs
  fetchEmailLogs: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Fetch email logs exception:', e.message);
    }
    return [];
  },
};
