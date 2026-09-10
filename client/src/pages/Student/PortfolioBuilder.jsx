import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderPlus,
  Github,
  Globe,
  ExternalLink,
  Trash2,
  Share2,
  QrCode,
  CheckCircle2,
  Award,
  Sparkles,
  User,
  Plus,
  Copy,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Container from '../../components/Container/Container';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { portfolioService } from '../../services/portfolioService';
import { useAuth } from '../../context/AuthContext';

const PortfolioBuilder = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // New Project Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTech, setNewTech] = useState('React, Node.js, Tailwind CSS');
  const [newGithub, setNewGithub] = useState('');
  const [newLive, setNewLive] = useState('');
  const [newImage, setNewImage] = useState('');

  const studentId = user?.id || 'demo_student_id';
  const username = user?.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'aarav-sharma';
  const publicUrl = `${window.location.origin}/portfolio/${username}`;

  const loadProjects = async () => {
    setLoading(true);
    const data = await portfolioService.getProjects(studentId);
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, [studentId]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    const techArray = newTech.split(',').map((t) => t.trim()).filter(Boolean);

    await portfolioService.addProject(studentId, {
      title: newTitle,
      description: newDesc,
      technologies: techArray,
      githubUrl: newGithub,
      liveUrl: newLive,
      imageUrl: newImage,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewTech('');
    setNewGithub('');
    setNewLive('');
    setNewImage('');
    loadProjects();
  };

  const handleDeleteProject = async (id) => {
    await portfolioService.deleteProject(studentId, id);
    loadProjects();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MainLayout>
      <div className="py-12 pt-28">
        <Container>
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>AI Student Portfolio Builder</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">Portfolio Manager</h1>
              <p className="text-xs text-slate-400 mt-1">
                Build, showcase, and share your live developer portfolio page with recruiters
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleCopyLink}
                icon={copied ? CheckCircle2 : Share2}
                className="border-indigo-500/30 text-indigo-300"
              >
                {copied ? 'Link Copied!' : 'Share Portfolio'}
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/portfolio/${username}`)}
                icon={ExternalLink}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 font-bold shadow-lg shadow-indigo-600/30"
              >
                View Public Portfolio Page
              </Button>
            </div>
          </div>

          {/* Public Link Banner */}
          <Card variant="glass" className="p-5 mb-8 border border-indigo-500/20 bg-indigo-950/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    Your Live Portfolio Link
                  </span>
                  <p className="text-xs font-mono text-indigo-300 font-semibold mt-0.5 truncate">
                    {publicUrl}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>
          </Card>

          {/* Main Grid Section */}
          <div className="space-y-8">
            {/* Projects Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-indigo-400" /> Featured Projects ({projects.length})
                </h2>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  icon={Plus}
                >
                  Add New Project
                </Button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400">Loading projects...</div>
              ) : projects.length === 0 ? (
                <Card variant="glass" className="p-12 text-center space-y-3">
                  <FolderPlus className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Projects Added Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Showcase your full-stack applications, GitHub repositories, and live demo URLs to impress recruiters!
                  </p>
                  <Button variant="primary" size="md" onClick={() => setShowAddModal(true)} icon={Plus}>
                    Add Your First Project
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((proj) => (
                    <Card
                      key={proj.id}
                      variant="glass"
                      className="p-6 space-y-4 border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {proj.imageUrl && (
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="w-full h-40 object-cover rounded-xl border border-slate-800"
                          />
                        )}

                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-white">{proj.title}</h3>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {proj.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {proj.technologies.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-indigo-300 text-[11px] font-medium border border-slate-700/50"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                          >
                            <Github className="w-4 h-4" /> GitHub Code
                          </a>
                        )}

                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                          >
                            <Globe className="w-4 h-4" /> Live Demo <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-indigo-400" /> Add Project to Portfolio
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. InternConnect AI Engine"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summary of architectural achievements, problem solved, and quantitative results..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  required
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="React, Node.js, Supabase, Tailwind CSS"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Live Demo / Deployed Link</label>
                  <input
                    type="url"
                    value={newLive}
                    onChange={(e) => setNewLive(e.target.value)}
                    placeholder="https://myproject.vercel.app"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Project Screenshot Image URL</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <Button type="button" variant="secondary" size="md" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" className="bg-indigo-600 font-bold">
                  Save Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PortfolioBuilder;
