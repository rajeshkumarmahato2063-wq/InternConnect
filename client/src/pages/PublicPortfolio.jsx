import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Globe,
  Mail,
  Download,
  Share2,
  QrCode,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  Code2,
  Folder,
  ArrowLeft,
  X,
} from 'lucide-react';
import Container from '../components/Container/Container';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import { portfolioService } from '../services/portfolioService';

const PublicPortfolio = () => {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const currentUrl = window.location.href;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    currentUrl
  )}`;

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      const data = await portfolioService.getPublicPortfolio(username);
      setPortfolio(data);
      setLoading(false);
    };
    loadPortfolio();
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadResume = () => {
    // Generate styled resume print or download window
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${portfolio?.fullName || 'Candidate'}_Resume</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            h1 { color: #4f46e5; margin-bottom: 5px; }
            p { margin-top: 0; color: #64748b; }
            .section { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            .skill { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; margin: 3px; }
          </style>
        </head>
        <body>
          <h1>${portfolio?.fullName || 'Candidate'}</h1>
          <p>${portfolio?.degree} • ${portfolio?.college} (${portfolio?.graduationYear})</p>
          <p>Email: ${portfolio?.email} | Portfolio: ${currentUrl}</p>
          <div class="section">
            <h3>Professional Summary</h3>
            <p>${portfolio?.bio}</p>
          </div>
          <div class="section">
            <h3>Verified Technical Skills</h3>
            ${portfolio?.skills.map((s) => `<span class="skill">${s}</span>`).join('')}
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <span className="text-xs font-semibold text-indigo-400">Loading Developer Portfolio...</span>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold">Portfolio Not Found</h2>
        <p className="text-xs text-slate-400 mt-2">The candidate portfolio page you requested does not exist.</p>
        <Link to="/" className="text-indigo-400 font-bold mt-4">
          &larr; Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-3">
        <Container>
          <div className="flex items-center justify-between">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> InternConnect AI Verified Candidate
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                icon={copied ? CheckCircle2 : Share2}
                className="border-indigo-500/30 text-indigo-300"
              >
                {copied ? 'Link Copied!' : 'Share'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowQrModal(true)}
                icon={QrCode}
                className="border-purple-500/30 text-purple-300"
              >
                QR Code
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadResume}
                icon={Download}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 font-bold"
              >
                Download Resume
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content Body */}
      <main className="py-12">
        <Container className="space-y-12">
          {/* Profile Hero Card */}
          <Card
            variant="glass"
            className="p-8 md:p-12 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 backdrop-blur-xl"
          >
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
              <img
                src={portfolio.avatar}
                alt={portfolio.fullName}
                className="w-32 h-32 md:w-36 md:h-36 rounded-3xl object-cover border-2 border-indigo-500/40 shadow-2xl shrink-0"
              />

              <div className="space-y-4 flex-1">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified InternConnect AI Candidate</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    {portfolio.fullName}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-300 mt-1">
                    {portfolio.degree} • {portfolio.college} ({portfolio.graduationYear})
                  </p>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {portfolio.bio}
                </p>

                {/* Social Links */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  {portfolio.github && (
                    <a
                      href={portfolio.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Github className="w-4 h-4 text-white" /> GitHub
                    </a>
                  )}

                  {portfolio.linkedin && (
                    <a
                      href={portfolio.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-indigo-400" /> LinkedIn
                    </a>
                  )}

                  {portfolio.portfolio && (
                    <a
                      href={portfolio.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-purple-400" /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Technical Skills Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" /> Technical Skills & Stack
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {portfolio.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <span className="text-[10px] text-amber-400 font-extrabold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                    🏅 Verified
                  </span>
                </span>
              ))}
            </div>
          </div>


          {/* Projects Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-indigo-400" /> Featured Projects ({portfolio.projects.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.projects.map((proj) => (
                <Card
                  key={proj.id}
                  variant="glass"
                  className="p-6 space-y-4 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {proj.imageUrl && (
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-44 object-cover rounded-xl border border-slate-800"
                      />
                    )}

                    <h3 className="text-lg font-extrabold text-white">{proj.title}</h3>

                    <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 text-[11px] font-semibold border border-slate-700/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-300 hover:text-white flex items-center gap-1.5 font-bold"
                      >
                        <Github className="w-4 h-4 text-white" /> View Repository
                      </a>
                    )}

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-bold"
                      >
                        <Globe className="w-4 h-4 text-indigo-400" /> Live Demo{' '}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          {portfolio.certificates && portfolio.certificates.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" /> Verified Certifications
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.certificates.map((cert) => (
                  <Card key={cert.id} variant="glass" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{cert.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {cert.issuer} • Issued {cert.issueDate}
                      </p>
                      <span className="text-[10px] font-mono text-purple-300 mt-1 block">
                        ID: {cert.credentialId}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Contact Recruiter CTA */}
          <Card variant="glass" className="p-8 text-center space-y-4 border border-indigo-500/30">
            <h3 className="text-xl font-extrabold text-white">Interested in hiring {portfolio.fullName}?</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Get in touch directly to discuss internship openings, technical interview scheduling, or project collaborations.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a
                href={`mailto:${portfolio.email}`}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Mail className="w-4 h-4" /> Send Email Inquiry
              </a>
            </div>
          </Card>
        </Container>
      </main>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-purple-400" /> Share Portfolio QR Code
                </h3>
                <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white w-fit mx-auto shadow-inner">
                <img src={qrCodeApiUrl} alt="Portfolio QR Code" className="w-48 h-48" />
              </div>

              <p className="text-xs text-slate-400">
                Scan with mobile camera to instantly view {portfolio.fullName}'s live candidate portfolio.
              </p>

              <Button variant="secondary" size="sm" fullWidth onClick={() => setShowQrModal(false)}>
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicPortfolio;
