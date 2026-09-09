import React from 'react';
import { Download, FileText, Table, CheckCircle2, Building2, Users, Briefcase } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { reportService } from '../../services/reportService';
import { MOCK_INTERNSHIPS, MOCK_APPLICATIONS } from '../../services/mockData';

const studentReportData = [
  { ID: 'STD-101', Name: 'Aarav Sharma', Email: 'aarav@university.edu', College: 'IIT Bombay', Degree: 'B.Tech CSE', AppliedJobs: 5, Status: 'Active' },
  { ID: 'STD-102', Name: 'Priya Patel', Email: 'priya@university.edu', College: 'NIT Trichy', Degree: 'B.Tech IT', AppliedJobs: 3, Status: 'Active' },
  { ID: 'STD-103', Name: 'Rohan Verma', Email: 'rohan@university.edu', College: 'BITS Pilani', Degree: 'B.E. ECE', AppliedJobs: 4, Status: 'Active' },
];

const companyReportData = [
  { ID: 'CMP-201', CompanyName: 'Microsoft', Industry: 'Software', JobsPosted: 4, HiresMade: 12, Status: 'Verified' },
  { ID: 'CMP-202', CompanyName: 'Google', Industry: 'Cloud & AI', JobsPosted: 3, HiresMade: 9, Status: 'Verified' },
  { ID: 'CMP-203', CompanyName: 'Amazon', Industry: 'E-commerce', JobsPosted: 5, HiresMade: 15, Status: 'Verified' },
];

const internshipReportData = MOCK_INTERNSHIPS.map((j) => ({
  JobID: j.id,
  Title: j.title,
  Company: j.companyName,
  Location: j.location,
  WorkMode: j.workMode,
  Stipend: j.stipend,
  Openings: j.openings || 1,
  Status: j.status || 'Active',
}));

const applicationReportData = MOCK_APPLICATIONS.map((a) => ({
  AppID: a.id,
  Candidate: a.studentName || 'Candidate',
  JobTitle: a.jobTitle,
  Company: a.companyName || 'Microsoft',
  Status: a.status,
  AppliedDate: a.appliedAt?.slice(0, 10) || '2026-09-01',
}));

const AdminReports = () => {
  const reports = [
    {
      id: 'students',
      title: 'Student Candidates Master Report',
      description: 'Complete registration directory, enrolled colleges, degrees, and active application counts.',
      icon: Users,
      data: studentReportData,
    },
    {
      id: 'companies',
      title: 'Company Recruiters Master Report',
      description: 'Verified enterprise accounts, total postings created, and successful candidate hiring metrics.',
      icon: Building2,
      data: companyReportData,
    },
    {
      id: 'internships',
      title: 'Internship Listings Audit Report',
      description: 'Active openings, work mode distribution, stipend values, and application deadlines.',
      icon: Briefcase,
      data: internshipReportData,
    },
    {
      id: 'applications',
      title: 'Candidate Applications Pipeline Report',
      description: 'Submissions timeline, candidate AI match scores, interview schedules, and final hiring status.',
      icon: FileText,
      data: applicationReportData,
    },
  ];

  return (
    <DashboardLayout
      title="Platform Executive Reports"
      subtitle="Export audit-ready PDF and CSV reports for student profiles, company recruiters, listings, and hiring pipelines."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((rep) => {
            const Icon = rep.icon;
            return (
              <Card key={rep.id} variant="glass" hoverable={false} className="p-6 flex flex-col justify-between space-y-6 border-slate-800">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-snug">{rep.title}</h4>
                      <span className="text-[11px] text-emerald-400 font-semibold">{rep.data.length} Records Loaded</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{rep.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => reportService.exportToCSV(rep.id, rep.data)}
                    icon={Table}
                  >
                    Export CSV
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => reportService.exportToPDF(rep.title, rep.data)}
                    icon={Download}
                  >
                    Generate PDF / Print
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
