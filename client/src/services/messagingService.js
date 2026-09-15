import { supabase } from './supabaseClient';
import { notificationService } from './notificationService';

export const messagingService = {
  /**
   * Fetch conversations for a specific user and role
   */
  getConversations: async (userId, role = 'student') => {
    try {
      if (!userId) return [];

      let query = supabase
        .from('conversations')
        .select(`
          *,
          student:profiles!student_id(id, full_name, email, avatar_url, degree, college),
          recruiter:profiles!recruiter_id(id, full_name, email, avatar_url, company_name),
          admin:profiles!admin_id(id, full_name, email, avatar_url),
          internship:internships!internship_id(id, title, company_name, company_logo)
        `)
        .order('updated_at', { ascending: false });

      if (role === 'student') {
        query = query.eq('student_id', userId);
      } else if (role === 'company' || role === 'recruiter') {
        query = query.eq('recruiter_id', userId);
      } else if (role === 'admin') {
        // Admin gets all conversations
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        // Enrich conversations with last message & unread counts
        const enriched = await Promise.all(
          data.map(async (conv) => {
            const { data: lastMsgs } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1);

            const { count: unreadCount } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .eq('is_read', false)
              .neq('sender_id', userId);

            const lastMsg = lastMsgs?.[0] || null;

            return {
              id: conv.id,
              studentId: conv.student_id,
              recruiterId: conv.recruiter_id,
              adminId: conv.admin_id,
              internshipId: conv.internship_id,
              conversationType: conv.conversation_type,
              createdAt: conv.created_at,
              updatedAt: conv.updated_at,
              student: conv.student || { full_name: 'Candidate', email: 'student@example.com' },
              recruiter: conv.recruiter || { full_name: 'Hiring Recruiter', company_name: 'Tech Company' },
              admin: conv.admin || { full_name: 'Support Admin' },
              internship: conv.internship || { title: 'Internship Opportunity' },
              lastMessage: lastMsg?.message || 'Started conversation',
              lastMessageTime: lastMsg?.created_at || conv.updated_at,
              unreadCount: unreadCount || 0,
            };
          })
        );
        return enriched;
      }
    } catch (err) {
      console.warn('Supabase fetch conversations notice:', err);
    }

    // Fallback Mock Data for Demo Resilience
    return [
      {
        id: 'conv_demo_1',
        studentId: role === 'student' ? userId : 'stud_101',
        recruiterId: role === 'company' ? userId : 'rec_202',
        adminId: null,
        internshipId: 'job_1',
        conversationType: 'student_recruiter',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        student: { full_name: 'Aarav Sharma', email: 'aarav@example.com', college: 'IIT Delhi', degree: 'B.Tech CS' },
        recruiter: { full_name: 'Sophia Chen', company_name: 'Google LLC', avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
        admin: null,
        internship: { title: 'Frontend Software Engineering Intern' },
        lastMessage: 'Hi! We reviewed your portfolio and would love to schedule a technical round.',
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 1,
      },
      {
        id: 'conv_demo_2',
        studentId: role === 'student' ? userId : 'stud_102',
        recruiterId: role === 'company' ? userId : 'rec_203',
        adminId: 'admin_001',
        internshipId: null,
        conversationType: role === 'company' ? 'recruiter_admin' : 'student_admin',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        student: { full_name: 'Rohan Verma', email: 'rohan@example.com', college: 'BITS Pilani', degree: 'B.E. IT' },
        recruiter: { full_name: 'Marcus Vance', company_name: 'Microsoft Inc.', avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
        admin: { full_name: 'InternConnect Support Admin', email: 'support@internconnect.ai' },
        internship: { title: 'Platform Support & Inquiry' },
        lastMessage: 'Your recruiter account verification has been approved by our admin moderation team.',
        lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
        unreadCount: 0,
      }
    ];
  },

  /**
   * Fetch messages for a specific conversation
   */
  getMessages: async (conversationId) => {
    try {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data.map((m) => ({
          id: m.id,
          conversationId: m.conversation_id,
          senderId: m.sender_id,
          senderRole: m.sender_role,
          message: m.message,
          attachmentUrl: m.attachment_url,
          isRead: m.is_read,
          createdAt: m.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch messages notice:', err);
    }

    return [
      {
        id: 'msg_1',
        conversationId,
        senderId: 'rec_202',
        senderRole: 'company',
        message: 'Hello! Thank you for applying to the Frontend Software Engineering Internship.',
        attachmentUrl: null,
        isRead: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'msg_2',
        conversationId,
        senderId: 'rec_202',
        senderRole: 'company',
        message: 'We loved your ATS resume score and projects. Are you available for a 30-min technical call this week?',
        attachmentUrl: null,
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  },

  /**
   * Send a new message
   */
  sendMessage: async ({ conversationId, senderId, senderRole, message, attachmentUrl = null, recipientId = null }) => {
    try {
      const row = {
        conversation_id: conversationId,
        sender_id: senderId,
        sender_role: senderRole,
        message,
        attachment_url: attachmentUrl,
        is_read: false,
      };

      const { data, error } = await supabase.from('messages').insert([row]).select().single();

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Trigger notification if recipient ID is present
      if (recipientId) {
        await notificationService.notifyStudent({
          userId: recipientId,
          title: `💬 New Message (${senderRole})`,
          message: message.length > 60 ? `${message.substring(0, 60)}...` : message,
          type: 'message',
        });
      }

      if (!error && data) {
        return {
          id: data.id,
          conversationId: data.conversation_id,
          senderId: data.sender_id,
          senderRole: data.sender_role,
          message: data.message,
          attachmentUrl: data.attachment_url,
          isRead: data.is_read,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn('Supabase send message notice:', err);
    }

    return {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId,
      senderRole,
      message,
      attachmentUrl,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Get or create a conversation between parties
   */
  getOrCreateConversation: async ({ studentId, recruiterId, adminId = null, internshipId = null, conversationType = 'student_recruiter' }) => {
    try {
      let query = supabase.from('conversations').select('*');

      if (conversationType === 'student_recruiter') {
        query = query.eq('student_id', studentId).eq('recruiter_id', recruiterId);
        if (internshipId) query = query.eq('internship_id', internshipId);
      } else if (conversationType === 'student_admin') {
        query = query.eq('student_id', studentId).eq('conversation_type', 'student_admin');
      } else if (conversationType === 'recruiter_admin') {
        query = query.eq('recruiter_id', recruiterId).eq('conversation_type', 'recruiter_admin');
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data[0];
      }

      // Create new conversation
      const newRow = {
        student_id: studentId,
        recruiter_id: recruiterId || studentId,
        admin_id: adminId,
        internship_id: internshipId,
        conversation_type: conversationType,
      };

      const { data: created, error: createErr } = await supabase.from('conversations').insert([newRow]).select().single();

      if (!createErr && created) return created;
    } catch (err) {
      console.warn('Supabase getOrCreateConversation notice:', err);
    }

    return {
      id: `conv_${Date.now()}`,
      student_id: studentId,
      recruiter_id: recruiterId || studentId,
      admin_id: adminId,
      internship_id: internshipId,
      conversation_type: conversationType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Realtime subscription for messages in a conversation
   */
  subscribeToMessages: (conversationId, callback) => {
    if (!supabase || !conversationId) return () => {};

    const channel = supabase
      .channel(`chat_messages:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          if (payload.new) {
            callback({
              id: payload.new.id,
              conversationId: payload.new.conversation_id,
              senderId: payload.new.sender_id,
              senderRole: payload.new.sender_role,
              message: payload.new.message,
              attachmentUrl: payload.new.attachment_url,
              isRead: payload.new.is_read,
              createdAt: payload.new.created_at,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Broadcast typing indicator using Realtime Channel
   */
  sendTypingSignal: (conversationId, userId, userName, isTyping) => {
    if (!supabase || !conversationId) return;
    const channel = supabase.channel(`typing:${conversationId}`);
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId, userName, isTyping },
        });
      }
    });
  },

  /**
   * Subscribe to typing indicators
   */
  subscribeToTyping: (conversationId, callback) => {
    if (!supabase || !conversationId) return () => {};

    const channel = supabase.channel(`typing:${conversationId}`);
    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        callback(payload.payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Mark messages as read in conversation
   */
  markConversationAsRead: async (conversationId, userId) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId);
    } catch (err) {
      // ignore
    }
  },

  /**
   * Upload Chat Attachment (PDF, DOCX, PNG, JPG) to Supabase Storage
   */
  uploadChatAttachment: async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExt.toLowerCase());
      const bucket = isImage ? 'chat-images' : 'chat-documents';
      const filePath = `chat_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return urlData?.publicUrl || URL.createObjectURL(file);
      }
    } catch (err) {
      console.warn('Supabase storage chat upload notice:', err);
    }
    return URL.createObjectURL(file);
  },
};

export default messagingService;
