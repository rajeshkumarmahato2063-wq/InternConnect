import React, { useState, useEffect } from 'react';
import { Download, Table, Users, Briefcase } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { reportService } from '../../services/reportService';
import { apiService } from '../../services/api';
import { internshipService } from '../../services/internshipService';

const AdminReports = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [uData, jData] = await Promise.all([
          apiService.getUsers(),
          internshipService.getInternships(),
        ]);
        setUsers(uData || []);
        setJobs(jData || []);
      } catch (err) {
        console.error('Error loading reports data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const reports = [
    {
      id: 'users',
      title: 'Platform User & Account Directory Audit',
      description: 'Comprehensive export of registered candidates, recruiters, verification statuses, and roles.',
      icon: Users,
      data: users,
    },
    {
      id: 'jobs',
      title: 'Active Internship Postings Audit',
      description: 'Full audit of published internship listings, stipends, requirements, and employer associations.',
      icon: Briefcase,
      data: jobs,
    },
  ];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold">Generating audit report data...</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default AdminReports;
