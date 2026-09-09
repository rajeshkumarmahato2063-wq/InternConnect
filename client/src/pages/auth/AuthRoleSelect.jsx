import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import RoleCard from '../../components/Auth/RoleCard';

const AuthRoleSelect = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Choose Your Role"
      subtitle="Select how you want to use InternConnect AI to get started with your account."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoleCard
          type="student"
          badge="Candidate"
          title="🎓 Student"
          description="Find internships, build your ATS profile, get AI resume scores, and apply with 1-click."
          onClick={() => navigate('/auth/student/login')}
        />

        <RoleCard
          type="company"
          badge="Employer"
          title="🏢 Company"
          description="Hire talented university students, post internship openings, and manage candidate pipelines."
          onClick={() => navigate('/auth/company/login')}
        />
      </div>
    </AuthLayout>
  );
};

export default AuthRoleSelect;
