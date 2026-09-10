import { supabase } from './supabaseClient';
import { MOCK_COMPANIES } from './mockData';

export const companyVerificationService = {
  // Fetch verification status & documents for a specific company
  getVerificationStatus: async (companyId) => {
    if (!companyId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, verification_status, verification_documents, verified_at')
        .eq('id', companyId)
        .maybeSingle();

      if (!error && data) {
        return {
          status: data.verification_status || 'Pending',
          documents: data.verification_documents || {},
          verifiedAt: data.verified_at,
        };
      }
    } catch (err) {
      console.warn('Supabase fetch verification status notice:', err.message);
    }

    // Local Storage Fallback Cache
    const cacheKey = `ic_verification_${companyId}`;
    const cached = localStorage.getItem(cacheKey);
    return cached
      ? JSON.parse(cached)
      : {
          status: 'Pending',
          documents: {
            logo_url: MOCK_COMPANIES[1]?.logo || '',
            website_url: MOCK_COMPANIES[1]?.website || '',
            registration_doc_url: 'https://example.com/docs/corporate_reg_cert.pdf',
            tax_id: 'EIN-987456123',
          },
          verifiedAt: null,
        };
  },

  // Submit company verification documents
  submitRequest: async (companyId, { logoUrl, websiteUrl, registrationDocUrl, taxId, notes }) => {
    const payload = {
      verification_status: 'Pending',
      verification_documents: {
        logo_url: logoUrl,
        website_url: websiteUrl,
        registration_doc_url: registrationDocUrl,
        tax_id: taxId,
        notes: notes || 'Submitted corporate registration details.',
        submitted_at: new Date().toISOString(),
      },
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', companyId);

      if (error) {
        console.warn('Supabase submit verification warning:', error.message);
      }
    } catch (err) {
      console.warn('Database save exception:', err.message);
    }

    // Local storage fallback cache
    const cacheKey = `ic_verification_${companyId}`;
    const localData = {
      status: 'Pending',
      documents: payload.verification_documents,
      verifiedAt: null,
    };
    localStorage.setItem(cacheKey, JSON.stringify(localData));
    return localData;
  },

  // Fetch all companies pending admin verification review
  fetchPendingCompanies: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'company');

      if (!error && data && data.length > 0) {
        return data.map((c) => ({
          id: c.id,
          name: c.full_name || 'Corporate Employer',
          logo: c.verification_documents?.logo_url || c.avatar_url || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=150&q=80',
          website: c.verification_documents?.website_url || c.portfolio || 'https://company.example.com',
          status: c.verification_status || 'Pending',
          registrationDoc: c.verification_documents?.registration_doc_url || 'https://example.com/docs/tax_certificate.pdf',
          taxId: c.verification_documents?.tax_id || 'TAX-889412',
          submittedAt: c.verification_documents?.submitted_at || c.updated_at || new Date().toISOString(),
          verifiedAt: c.verified_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch pending companies notice:', err.message);
    }

    // Default Mock Companies queue for Admin Dashboard
    return [
      {
        id: 'comp_101',
        name: 'Nexus Cloud Technologies',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        website: 'https://nexuscloud.io',
        status: 'Pending',
        registrationDoc: 'https://nexuscloud.io/legal/cert_inc.pdf',
        taxId: 'EIN-84-992104',
        submittedAt: '2 hours ago',
      },
      {
        id: 'comp_102',
        name: 'Quantum AI Research Labs',
        logo: 'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?auto=format&fit=crop&w=150&q=80',
        website: 'https://quantumlabs.ai',
        status: 'Pending',
        registrationDoc: 'https://quantumlabs.ai/legal/corporate_tax_return.pdf',
        taxId: 'EIN-91-304912',
        submittedAt: '5 hours ago',
      },
      {
        id: 'comp_103',
        name: 'Starlight Interactive Studios',
        logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=150&q=80',
        website: 'https://starlight.game',
        status: 'Approved',
        registrationDoc: 'https://starlight.game/legal/inc_license.pdf',
        taxId: 'EIN-12-840921',
        submittedAt: '1 day ago',
        verifiedAt: '1 day ago',
      },
    ];
  },

  // Admin action: Approve or Reject verification
  updateStatus: async (companyId, newStatus) => {
    const isApproved = newStatus === 'Approved';
    const payload = {
      verification_status: newStatus,
      verified_at: isApproved ? new Date().toISOString() : null,
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', companyId);

      if (error) {
        console.warn('Supabase update status notice:', error.message);
      }
    } catch (err) {
      console.warn('Database status update exception:', err.message);
    }

    // Local storage fallback cache
    const cacheKey = `ic_verification_${companyId}`;
    const existing = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        ...existing,
        status: newStatus,
        verifiedAt: payload.verified_at,
      })
    );

    return true;
  },
};
