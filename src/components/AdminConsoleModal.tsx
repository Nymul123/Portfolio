import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  User, 
  GraduationCap, 
  Wrench, 
  Briefcase, 
  Trophy, 
  BookOpen,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  Edit2,
  Undo2,
  Github,
  Linkedin,
  Facebook,
  Mail,
  FileText,
  ExternalLink
} from 'lucide-react';
import { usePortfolio, ActiveTabType } from '../context/PortfolioContext';
import { Project, SkillItem, EducationMilestone, Achievement, ResearchPaper } from '../data/portfolioData';
import { compressImageFile, compressThumbnailFile } from '../utils/imageHelper';

export const AdminConsoleModal: React.FC = () => {
  const {
    data,
    adminConsoleOpen,
    setAdminConsoleOpen,
    adminActiveTab,
    setAdminActiveTab,
    editingItem,
    setEditingItem,
    logout,
    updateProfile,
    updateProfileAvatar,
    removeProfileAvatar,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addResearch,
    updateResearch,
    deleteResearch,
    isServerSyncing,
    serverSynced
  } = usePortfolio();

  const [notification, setNotification] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCompressingProjectThumbnail, setIsCompressingProjectThumbnail] = useState(false);
  const projectThumbnailInputRef = useRef<HTMLInputElement>(null);

  // Profile form state (including social links and direct email)
  const [profileForm, setProfileForm] = useState({
    name: data.profile.name || '',
    displayTitle: data.profile.displayTitle || '',
    location: data.profile.location || '',
    email: data.profile.email || '',
    phone: data.profile.phone || '',
    bio: data.profile.bio || '',
    avatarUrlInput: '',
    github: data.profile.socials?.github || '',
    linkedin: data.profile.socials?.linkedin || '',
    facebook: data.profile.socials?.facebook || '',
    directEmail: data.profile.email || ''
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    tagline: '',
    category: '',
    image: '',
    description: '',
    tagsStr: '',
    liveUrl: '',
    githubUrl: ''
  });

  // Skill form state
  const [skillForm, setSkillForm] = useState({
    id: '',
    name: '',
    category: '',
    level: 'Intermediate' as SkillItem['level'],
    details: '',
    projectsCount: 1
  });

  // Education form state
  const [eduForm, setEduForm] = useState({
    id: '',
    degree: '',
    institution: '',
    period: '',
    grade: '',
    gradeLabel: '',
    description: '',
    coursesStr: '',
    honorsStr: ''
  });

  // Achievement form state
  const [achForm, setAchForm] = useState({
    id: '',
    title: '',
    category: '',
    organization: '',
    year: '',
    badge: '',
    description: '',
    proofDetailsStr: ''
  });

  // Research paper form state
  const [researchForm, setResearchForm] = useState({
    id: '',
    title: '',
    authors: '',
    conferenceOrJournal: '',
    year: '',
    status: 'Published' as ResearchPaper['status'],
    doiOrUrl: '',
    pdfUrl: '',
    abstract: '',
    keywordsStr: ''
  });

  // Keep profile form synced when data changes
  useEffect(() => {
    setProfileForm((prev) => ({
      ...prev,
      name: data.profile.name || '',
      displayTitle: data.profile.displayTitle || '',
      location: data.profile.location || '',
      email: data.profile.email || '',
      phone: data.profile.phone || '',
      bio: data.profile.bio || '',
      github: data.profile.socials?.github || '',
      linkedin: data.profile.socials?.linkedin || '',
      facebook: data.profile.socials?.facebook || '',
      directEmail: data.profile.email || ''
    }));
  }, [data.profile]);

  // Sync editing items into form fields
  useEffect(() => {
    if (!editingItem) return;

    if (editingItem.type === 'project' && editingItem.item) {
      const p: Project = editingItem.item;
      setProjectForm({
        id: p.id,
        title: p.title || '',
        tagline: p.tagline || '',
        category: p.categoryLabel || p.category || '',
        image: p.image || '',
        description: p.description || '',
        tagsStr: p.tags ? p.tags.join(', ') : '',
        liveUrl: p.liveUrl || '',
        githubUrl: p.githubUrl || ''
      });
      setAdminActiveTab('projects');
    } else if (editingItem.type === 'skill' && editingItem.item) {
      const s: SkillItem = editingItem.item;
      setSkillForm({
        id: s.id,
        name: s.name || '',
        category: s.category || '',
        level: s.level || 'Intermediate',
        details: s.details || '',
        projectsCount: s.projectsCount || 1
      });
      setAdminActiveTab('skills');
    } else if (editingItem.type === 'education' && editingItem.item) {
      const e: EducationMilestone = editingItem.item;
      setEduForm({
        id: e.id,
        degree: e.degree || '',
        institution: e.institution || '',
        period: e.period || '',
        grade: e.grade || '',
        gradeLabel: e.gradeLabel || '',
        description: e.description || '',
        coursesStr: e.keyCourses ? e.keyCourses.join(', ') : '',
        honorsStr: e.honors ? e.honors.join(', ') : ''
      });
      setAdminActiveTab('education');
    } else if (editingItem.type === 'achievement' && editingItem.item) {
      const a: Achievement = editingItem.item;
      setAchForm({
        id: a.id,
        title: a.title || '',
        category: a.category || '',
        organization: a.organization || '',
        year: a.year || '',
        badge: a.badge || '',
        description: a.description || '',
        proofDetailsStr: a.proofDetails ? a.proofDetails.join('\n') : ''
      });
      setAdminActiveTab('achievements');
    } else if (editingItem.type === 'research' && editingItem.item) {
      const r: ResearchPaper = editingItem.item;
      setResearchForm({
        id: r.id,
        title: r.title || '',
        authors: r.authors || '',
        conferenceOrJournal: r.conferenceOrJournal || '',
        year: r.year || '',
        status: r.status || 'Published',
        doiOrUrl: r.doiOrUrl || '',
        pdfUrl: r.pdfUrl || '',
        abstract: r.abstract || '',
        keywordsStr: r.keywords ? r.keywords.join(', ') : ''
      });
      setAdminActiveTab('research');
    }
  }, [editingItem, setAdminActiveTab]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  if (!adminConsoleOpen) return null;

  // Reliable File Upload Handler with compression
  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImageFile(file, 600, 600, 0.85);
      updateProfileAvatar(compressedDataUrl);
      notify('Profile picture uploaded and updated successfully!');
    } catch (err) {
      console.error('Image compression failed', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateProfileAvatar(reader.result);
          notify('Profile picture updated successfully!');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyAvatarUrl = () => {
    const url = profileForm.avatarUrlInput.trim();
    if (url) {
      updateProfileAvatar(url);
      setProfileForm((prev) => ({ ...prev, avatarUrlInput: '' }));
      notify('Profile picture updated from URL!');
    }
  };

  const handleRemoveAvatar = () => {
    removeProfileAvatar();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    notify('Profile picture removed!');
  };

  // Project Thumbnail File Upload Handler with compression
  const handleProjectThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingProjectThumbnail(true);
      const compressedDataUrl = await compressThumbnailFile(file);
      setProjectForm((prev) => ({ ...prev, image: compressedDataUrl }));
      notify('Project thumbnail image uploaded and compressed successfully!');
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
      notify('Failed to process image file. Please try another image.');
    } finally {
      setIsCompressingProjectThumbnail(false);
      if (projectThumbnailInputRef.current) {
        projectThumbnailInputRef.current.value = '';
      }
    }
  };

  // PROFILE SAVE (includes GitHub, LinkedIn, Facebook, direct email)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = profileForm.directEmail.trim() || profileForm.email.trim();
    const mailto = cleanEmail ? (cleanEmail.startsWith('mailto:') ? cleanEmail : `mailto:${cleanEmail}`) : '';

    updateProfile({
      name: profileForm.name.trim() || 'Nymul Hossain',
      displayTitle: profileForm.displayTitle.trim() || 'Software Developer',
      location: profileForm.location.trim() || '',
      email: cleanEmail,
      phone: profileForm.phone.trim() || '',
      bio: profileForm.bio.trim() || '',
      socials: {
        github: profileForm.github.trim(),
        linkedin: profileForm.linkedin.trim(),
        facebook: profileForm.facebook.trim(),
        email: mailto
      }
    });
    notify('Profile details & social options updated successfully!');
  };

  // PROJECT SUBMIT (ADD or UPDATE)
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = projectForm.tagsStr 
      ? projectForm.tagsStr.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Software Engineering'];
    const writtenCat = projectForm.category.trim() || 'General';

    if (editingItem?.type === 'project' && projectForm.id) {
      updateProject(projectForm.id, {
        title: projectForm.title.trim() || 'Untitled Project',
        tagline: projectForm.tagline.trim(),
        category: writtenCat,
        categoryLabel: writtenCat,
        image: projectForm.image.trim(),
        description: projectForm.description.trim(),
        tags,
        liveUrl: projectForm.liveUrl.trim() || undefined,
        githubUrl: projectForm.githubUrl.trim()
      });
      notify(`Project "${projectForm.title || 'Untitled'}" updated!`);
      setEditingItem(null);
    } else {
      addProject({
        title: projectForm.title.trim() || 'New Project',
        tagline: projectForm.tagline.trim(),
        category: writtenCat,
        categoryLabel: writtenCat,
        image: projectForm.image.trim(),
        description: projectForm.description.trim(),
        tags,
        liveUrl: projectForm.liveUrl.trim() || undefined,
        githubUrl: projectForm.githubUrl.trim()
      });
      notify('Project published successfully!');
    }

    setProjectForm({
      id: '',
      title: '',
      tagline: '',
      category: '',
      image: '',
      description: '',
      tagsStr: '',
      liveUrl: '',
      githubUrl: ''
    });
  };

  // SKILL SUBMIT (ADD or UPDATE)
  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const writtenCat = skillForm.category.trim() || 'Technical Skills';

    if (editingItem?.type === 'skill' && skillForm.id) {
      updateSkill(skillForm.id, {
        name: skillForm.name.trim() || 'Skill',
        category: writtenCat,
        level: skillForm.level || 'Intermediate',
        details: skillForm.details.trim(),
        projectsCount: Number(skillForm.projectsCount) || 1
      });
      notify(`Skill "${skillForm.name}" updated!`);
      setEditingItem(null);
    } else {
      addSkill({
        name: skillForm.name.trim() || 'New Skill',
        category: writtenCat,
        level: skillForm.level || 'Intermediate',
        details: skillForm.details.trim(),
        projectsCount: Number(skillForm.projectsCount) || 1
      });
      notify('Skill added successfully!');
    }

    setSkillForm({
      id: '',
      name: '',
      category: '',
      level: 'Intermediate',
      details: '',
      projectsCount: 1
    });
  };

  // EDUCATION SUBMIT (ADD or UPDATE)
  const handleEduSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courses = eduForm.coursesStr 
      ? eduForm.coursesStr.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const honors = eduForm.honorsStr 
      ? eduForm.honorsStr.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (editingItem?.type === 'education' && eduForm.id) {
      updateEducation(eduForm.id, {
        degree: eduForm.degree.trim() || 'Degree Milestone',
        institution: eduForm.institution.trim(),
        period: eduForm.period.trim(),
        grade: eduForm.grade.trim(),
        gradeLabel: eduForm.gradeLabel.trim(),
        description: eduForm.description.trim(),
        keyCourses: courses,
        honors
      });
      notify(`Education milestone "${eduForm.degree}" updated!`);
      setEditingItem(null);
    } else {
      addEducation({
        degree: eduForm.degree.trim() || 'Degree Milestone',
        institution: eduForm.institution.trim(),
        period: eduForm.period.trim(),
        grade: eduForm.grade.trim(),
        gradeLabel: eduForm.gradeLabel.trim(),
        description: eduForm.description.trim(),
        keyCourses: courses,
        honors
      });
      notify('Education milestone added!');
    }

    setEduForm({
      id: '',
      degree: '',
      institution: '',
      period: '',
      grade: '',
      gradeLabel: '',
      description: '',
      coursesStr: '',
      honorsStr: ''
    });
  };

  // ACHIEVEMENT SUBMIT (ADD or UPDATE)
  const handleAchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proofs = achForm.proofDetailsStr 
      ? achForm.proofDetailsStr.split('\n').map((p) => p.trim()).filter(Boolean)
      : [];

    if (editingItem?.type === 'achievement' && achForm.id) {
      updateAchievement(achForm.id, {
        title: achForm.title.trim() || 'Recognition / Award',
        category: achForm.category.trim() || 'General',
        organization: achForm.organization.trim(),
        year: achForm.year.trim() || new Date().getFullYear().toString(),
        badge: achForm.badge.trim(),
        description: achForm.description.trim(),
        proofDetails: proofs
      });
      notify(`Achievement "${achForm.title}" updated!`);
      setEditingItem(null);
    } else {
      addAchievement({
        title: achForm.title.trim() || 'Recognition / Award',
        category: achForm.category.trim() || 'General',
        organization: achForm.organization.trim(),
        year: achForm.year.trim() || new Date().getFullYear().toString(),
        badge: achForm.badge.trim(),
        description: achForm.description.trim(),
        proofDetails: proofs
      });
      notify('Achievement added successfully!');
    }

    setAchForm({
      id: '',
      title: '',
      category: '',
      organization: '',
      year: '',
      badge: '',
      description: '',
      proofDetailsStr: ''
    });
  };

  // RESEARCH SUBMIT (ADD or UPDATE)
  const handleResearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = researchForm.keywordsStr
      ? researchForm.keywordsStr.split(',').map((k) => k.trim()).filter(Boolean)
      : [];

    if (editingItem?.type === 'research' && researchForm.id) {
      updateResearch(researchForm.id, {
        title: researchForm.title.trim() || 'Untitled Research Paper',
        authors: researchForm.authors.trim() || 'Nymul Hossain',
        conferenceOrJournal: researchForm.conferenceOrJournal.trim() || 'Conference / Journal',
        year: researchForm.year.trim() || new Date().getFullYear().toString(),
        status: researchForm.status || 'Published',
        doiOrUrl: researchForm.doiOrUrl.trim() || undefined,
        pdfUrl: researchForm.pdfUrl.trim() || undefined,
        abstract: researchForm.abstract.trim(),
        keywords: kw
      });
      notify(`Research paper "${researchForm.title || 'Untitled'}" updated!`);
      setEditingItem(null);
    } else {
      addResearch({
        title: researchForm.title.trim() || 'New Research Paper',
        authors: researchForm.authors.trim() || 'Nymul Hossain',
        conferenceOrJournal: researchForm.conferenceOrJournal.trim() || 'Conference / Journal',
        year: researchForm.year.trim() || new Date().getFullYear().toString(),
        status: researchForm.status || 'Published',
        doiOrUrl: researchForm.doiOrUrl.trim() || undefined,
        pdfUrl: researchForm.pdfUrl.trim() || undefined,
        abstract: researchForm.abstract.trim(),
        keywords: kw
      });
      notify('Research paper added successfully!');
    }

    setResearchForm({
      id: '',
      title: '',
      authors: '',
      conferenceOrJournal: '',
      year: '',
      status: 'Published',
      doiOrUrl: '',
      pdfUrl: '',
      abstract: '',
      keywordsStr: ''
    });
  };

  const researchPapers = data.research || [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => {
        setAdminConsoleOpen(false);
        setEditingItem(null);
      }}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#FAF7F2] border border-[#DDD3C4] rounded-2xl shadow-2xl text-stone-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-[#EFE8DC] border-b border-[#DDD3C4] shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7B1123]" />
            <h2 className="text-base font-bold text-[#3B0E14] tracking-tight">
              Owner Content Management Console
            </h2>
            <span className="text-xs font-mono bg-[#7B1123]/10 text-[#7B1123] px-2 py-0.5 rounded border border-[#7B1123]/20">
              Admin Mode
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-[11px] font-medium">
              <span className={`w-2 h-2 rounded-full ${isServerSyncing ? 'bg-amber-500 animate-spin' : 'bg-emerald-600 animate-pulse'}`} />
              <span>{isServerSyncing ? 'Saving to Cloud Database...' : 'Cloud Database Synced (Live on All Devices)'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs text-[#7B1123] hover:bg-[#7B1123]/10 font-medium rounded-lg border border-[#7B1123]/30 transition-colors"
            >
              Logout
            </button>

            <button
              onClick={() => {
                setAdminConsoleOpen(false);
                setEditingItem(null);
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              aria-label="Close admin console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab selector ordered 01 to 06 matching the website sections */}
        <div className="flex items-center gap-1 p-2 bg-[#F5EDE1] border-b border-[#DDD3C4] overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => {
              setAdminActiveTab('education');
              setEditingItem(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              adminActiveTab === 'education'
                ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFE7DC]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>01. Education ({data.education.length})</span>
          </button>

          <button
            onClick={() => {
              setAdminActiveTab('skills');
              setEditingItem(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              adminActiveTab === 'skills'
                ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFE7DC]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>02. Skills ({data.skills.length})</span>
          </button>

          <button
            onClick={() => {
              setAdminActiveTab('projects');
              setEditingItem(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              adminActiveTab === 'projects'
                ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFE7DC]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>03. Projects ({data.projects.length})</span>
          </button>

          <button
            onClick={() => {
              setAdminActiveTab('research');
              setEditingItem(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              adminActiveTab === 'research'
                ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFE7DC]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>04. Research ({researchPapers.length})</span>
          </button>

          <button
            onClick={() => {
              setAdminActiveTab('achievements');
              setEditingItem(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              adminActiveTab === 'achievements'
                ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFE7DC]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>05. Achievements ({data.achievements.length})</span>
          </button>

          <button
            onClick={() => {
              setAdminActiveTab('profile');
              setEditingItem(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              adminActiveTab === 'profile'
                ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#EFE7DC]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>06. Profile & Contact</span>
          </button>
        </div>

        {/* Feedback notification toast */}
        {notification && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-medium flex items-center justify-between shrink-0 animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* Content Pane */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6">
          
          {/* TAB 1: PROJECTS */}
          {adminActiveTab === 'projects' && (
            <div className="space-y-6">
              {/* Add / Edit Project Form */}
              <div className="p-5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C4]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#3B0E14] flex items-center gap-2">
                    {editingItem?.type === 'project' ? (
                      <>
                        <Edit2 className="w-4 h-4 text-[#7B1123]" />
                        <span>Edit Project: &ldquo;{projectForm.title || 'Untitled'}&rdquo;</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#7B1123]" />
                        <span>Add Project (All fields optional)</span>
                      </>
                    )}
                  </h3>

                  {editingItem?.type === 'project' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setProjectForm({
                          id: '',
                          title: '',
                          tagline: '',
                          category: '',
                          image: '',
                          description: '',
                          tagsStr: '',
                          liveUrl: '',
                          githubUrl: ''
                        });
                      }}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-semibold"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleProjectSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Distributed Task Scheduler"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        placeholder="e.g. High-performance concurrent scheduler in C++"
                        value={projectForm.tagline}
                        onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Category (Written)</label>
                      <input
                        type="text"
                        placeholder="e.g. Web & Full-Stack, IoT, Systems..."
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Tech Stack Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. React, Node.js, C++"
                        value={projectForm.tagsStr}
                        onChange={(e) => setProjectForm({ ...projectForm, tagsStr: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        placeholder="https://github.com/..."
                        value={projectForm.githubUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Project architecture and key feature summary..."
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                    />
                  </div>

                  <div className="p-3.5 bg-white border border-[#DDD3C4] rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-stone-800">
                        Thumbnail Image (Device Upload or URL)
                      </label>
                      {projectForm.image && (
                        <button
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, image: '' })}
                          className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Image</span>
                        </button>
                      )}
                    </div>

                    {/* Hidden file input for project thumbnail upload */}
                    <input
                      type="file"
                      ref={projectThumbnailInputRef}
                      accept="image/*"
                      onChange={handleProjectThumbnailUpload}
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => projectThumbnailInputRef.current?.click()}
                        disabled={isCompressingProjectThumbnail}
                        className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#EFE8DC] text-stone-800 text-xs font-semibold rounded-lg border border-[#DDD3C4] flex items-center gap-1.5 shadow-sm hover:border-[#7B1123]/40 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#7B1123]" />
                        <span>{isCompressingProjectThumbnail ? 'Compressing Image...' : 'Upload Image from Device'}</span>
                      </button>

                      <span className="text-[11px] text-stone-500 italic">
                        Select JPG, PNG or WebP (auto-optimized & compressed)
                      </span>
                    </div>

                    {/* Live Thumbnail Preview if selected/entered */}
                    {projectForm.image && (
                      <div className="relative w-full max-w-sm h-36 rounded-xl overflow-hidden border-2 border-[#DDD3C4] bg-[#EFE8DC] shadow-sm flex items-center justify-center">
                        <img
                          src={projectForm.image}
                          alt="Project Thumbnail Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1.5 right-1.5 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                          Thumbnail Preview
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-stone-500 mb-1">
                        Or enter direct image URL:
                      </span>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/... or paste image URL"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {editingItem?.type === 'project' ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{editingItem?.type === 'project' ? 'Save Changes' : 'Publish Project'}</span>
                    </button>
                    {editingItem?.type === 'project' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setProjectForm({
                            id: '',
                            title: '',
                            tagline: '',
                            category: '',
                            image: '',
                            description: '',
                            tagsStr: '',
                            liveUrl: '',
                            githubUrl: ''
                          });
                        }}
                        className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Current Projects List with Edit and Delete actions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                  Current Projects ({data.projects.length})
                </h4>
                {data.projects.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 bg-white border border-[#DDD3C4] rounded-xl text-center">
                    No projects added yet. Use the form above to add your first project.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {data.projects.map((proj) => (
                      <div 
                        key={proj.id} 
                        className="p-3.5 bg-white border border-[#DDD3C4] rounded-xl flex items-center justify-between gap-4 hover:border-[#7B1123]/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#3B0E14] truncate">{proj.title}</span>
                            <span className="text-[11px] font-mono text-[#7B1123] bg-[#7B1123]/10 px-1.5 py-0.5 rounded">
                              {proj.categoryLabel || proj.category}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 truncate mt-0.5">{proj.tagline || proj.description}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({ type: 'project', item: proj });
                            }}
                            className="p-2 text-stone-700 hover:text-[#7B1123] hover:bg-[#EFE8DC] rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Edit project"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#7B1123]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteProject(proj.id);
                              if (editingItem?.item?.id === proj.id) {
                                setEditingItem(null);
                              }
                              notify(`Removed "${proj.title}"`);
                            }}
                            className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Delete project immediately"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {adminActiveTab === 'skills' && (
            <div className="space-y-6">
              {/* Add / Edit Skill Form */}
              <div className="p-5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C4]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#3B0E14] flex items-center gap-2">
                    {editingItem?.type === 'skill' ? (
                      <>
                        <Edit2 className="w-4 h-4 text-[#7B1123]" />
                        <span>Edit Skill: &ldquo;{skillForm.name}&rdquo;</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#7B1123]" />
                        <span>Add Skill (All fields optional)</span>
                      </>
                    )}
                  </h3>

                  {editingItem?.type === 'skill' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setSkillForm({
                          id: '',
                          name: '',
                          category: '',
                          level: 'Intermediate',
                          details: '',
                          projectsCount: 1
                        });
                      }}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-semibold"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSkillSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Skill Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Python, Docker, C++"
                        value={skillForm.name}
                        onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Category (Written)</label>
                      <input
                        type="text"
                        placeholder="e.g. Programming Languages, Frameworks..."
                        value={skillForm.category}
                        onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Proficiency</label>
                      <select
                        value={skillForm.level}
                        onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Projects Count</label>
                      <input
                        type="number"
                        min="1"
                        value={skillForm.projectsCount}
                        onChange={(e) => setSkillForm({ ...skillForm, projectsCount: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Scope / Details</label>
                    <input
                      type="text"
                      placeholder="e.g. Memory management, concurrent systems"
                      value={skillForm.details}
                      onChange={(e) => setSkillForm({ ...skillForm, details: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {editingItem?.type === 'skill' ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{editingItem?.type === 'skill' ? 'Save Changes' : 'Add Skill'}</span>
                    </button>
                    {editingItem?.type === 'skill' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setSkillForm({
                            id: '',
                            name: '',
                            category: '',
                            level: 'Intermediate',
                            details: '',
                            projectsCount: 1
                          });
                        }}
                        className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Current Skills with Edit and Delete */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                  Current Skills ({data.skills.length})
                </h4>
                {data.skills.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 bg-white border border-[#DDD3C4] rounded-xl text-center">
                    No skills added yet. Use the form above to add your first technical skill.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {data.skills.map((skill) => (
                      <div 
                        key={skill.id || skill.name} 
                        className="p-3 bg-white border border-[#DDD3C4] rounded-xl flex items-center justify-between gap-2 hover:border-[#7B1123]/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900 truncate">{skill.name}</span>
                            <span className="text-[10px] text-[#7B1123] font-medium">({skill.level})</span>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate">{skill.details || skill.category}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({ type: 'skill', item: skill });
                            }}
                            className="p-1.5 text-stone-600 hover:text-[#7B1123] hover:bg-[#EFE8DC] rounded-lg transition-colors"
                            title="Edit skill"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#7B1123]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteSkill(skill.id || skill.name);
                              if (editingItem?.item?.id === skill.id) {
                                setEditingItem(null);
                              }
                              notify(`Removed "${skill.name}"`);
                            }}
                            className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors"
                            title="Delete skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {adminActiveTab === 'education' && (
            <div className="space-y-6">
              {/* Add / Edit Education Form */}
              <div className="p-5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C4]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#3B0E14] flex items-center gap-2">
                    {editingItem?.type === 'education' ? (
                      <>
                        <Edit2 className="w-4 h-4 text-[#7B1123]" />
                        <span>Edit Education: &ldquo;{eduForm.degree}&rdquo;</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#7B1123]" />
                        <span>Add Education Milestone (All fields optional)</span>
                      </>
                    )}
                  </h3>

                  {editingItem?.type === 'education' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setEduForm({
                          id: '',
                          degree: '',
                          institution: '',
                          period: '',
                          grade: '',
                          gradeLabel: '',
                          description: '',
                          coursesStr: '',
                          honorsStr: ''
                        });
                      }}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-semibold"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleEduSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Degree Title</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Sc. in Computer Science & Engineering"
                        value={eduForm.degree}
                        onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Institution</label>
                      <input
                        type="text"
                        placeholder="e.g. University Name"
                        value={eduForm.institution}
                        onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Timeline Period</label>
                      <input
                        type="text"
                        placeholder="2020 – 2024"
                        value={eduForm.period}
                        onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Grade / CGPA</label>
                      <input
                        type="text"
                        placeholder="CGPA 3.85 / 4.00"
                        value={eduForm.grade}
                        onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Grade Label / Honor</label>
                      <input
                        type="text"
                        placeholder="Dean's List"
                        value={eduForm.gradeLabel}
                        onChange={(e) => setEduForm({ ...eduForm, gradeLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Summary Description</label>
                    <textarea
                      rows={2}
                      placeholder="Academic highlights..."
                      value={eduForm.description}
                      onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Key Courses (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Algorithms, Operating Systems, Computer Architecture"
                        value={eduForm.coursesStr}
                        onChange={(e) => setEduForm({ ...eduForm, coursesStr: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Academic Honors (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Dean's Honor Roll, Merit Scholarship"
                        value={eduForm.honorsStr}
                        onChange={(e) => setEduForm({ ...eduForm, honorsStr: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {editingItem?.type === 'education' ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{editingItem?.type === 'education' ? 'Save Changes' : 'Save Education'}</span>
                    </button>
                    {editingItem?.type === 'education' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setEduForm({
                            id: '',
                            degree: '',
                            institution: '',
                            period: '',
                            grade: '',
                            gradeLabel: '',
                            description: '',
                            coursesStr: '',
                            honorsStr: ''
                          });
                        }}
                        className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Current Milestones with Edit and Delete */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                  Current Milestones ({data.education.length})
                </h4>
                {data.education.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 bg-white border border-[#DDD3C4] rounded-xl text-center">
                    No education milestones added yet. Use the form above to add your degrees or academic background.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div 
                        key={edu.id || edu.degree} 
                        className="p-3.5 bg-white border border-[#DDD3C4] rounded-xl flex items-center justify-between gap-4 hover:border-[#7B1123]/40 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-stone-900">{edu.degree}</div>
                          <div className="text-xs text-stone-500">
                            {edu.institution} {edu.grade ? `· ${edu.grade}` : ''} {edu.period ? `(${edu.period})` : ''}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({ type: 'education', item: edu });
                            }}
                            className="p-2 text-stone-700 hover:text-[#7B1123] hover:bg-[#EFE8DC] rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Edit milestone"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#7B1123]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteEducation(edu.id || edu.degree);
                              if (editingItem?.item?.id === edu.id) {
                                setEditingItem(null);
                              }
                              notify(`Removed "${edu.degree}"`);
                            }}
                            className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Delete milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: RESEARCH PAPERS */}
          {adminActiveTab === 'research' && (
            <div className="space-y-6">
              {/* Add / Edit Research Paper Form */}
              <div className="p-5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C4]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#3B0E14] flex items-center gap-2">
                    {editingItem?.type === 'research' ? (
                      <>
                        <Edit2 className="w-4 h-4 text-[#7B1123]" />
                        <span>Edit Research Paper: &ldquo;{researchForm.title || 'Untitled'}&rdquo;</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#7B1123]" />
                        <span>Add Research Paper / Publication (All fields optional)</span>
                      </>
                    )}
                  </h3>

                  {editingItem?.type === 'research' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setResearchForm({
                          id: '',
                          title: '',
                          authors: '',
                          conferenceOrJournal: '',
                          year: '',
                          status: 'Published',
                          doiOrUrl: '',
                          pdfUrl: '',
                          abstract: '',
                          keywordsStr: ''
                        });
                      }}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-semibold"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleResearchSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Paper Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Adaptive Consensus in Edge IoT Networks"
                        value={researchForm.title}
                        onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Authors</label>
                      <input
                        type="text"
                        placeholder="e.g. Nymul Hossain, Jane Doe, John Smith"
                        value={researchForm.authors}
                        onChange={(e) => setResearchForm({ ...researchForm, authors: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Conference / Journal / Publisher</label>
                      <input
                        type="text"
                        placeholder="e.g. IEEE Access / ACM SIGCOMM"
                        value={researchForm.conferenceOrJournal}
                        onChange={(e) => setResearchForm({ ...researchForm, conferenceOrJournal: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Publication Year</label>
                      <input
                        type="text"
                        placeholder="e.g. 2024"
                        value={researchForm.year}
                        onChange={(e) => setResearchForm({ ...researchForm, year: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Status</label>
                      <select
                        value={researchForm.status}
                        onChange={(e) => setResearchForm({ ...researchForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      >
                        <option value="Published">Published</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Preprint">Preprint</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">DOI / Paper URL</label>
                      <input
                        type="text"
                        placeholder="https://doi.org/... or https://arxiv.org/abs/..."
                        value={researchForm.doiOrUrl}
                        onChange={(e) => setResearchForm({ ...researchForm, doiOrUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">PDF Download URL (optional)</label>
                      <input
                        type="text"
                        placeholder="https://.../paper.pdf"
                        value={researchForm.pdfUrl}
                        onChange={(e) => setResearchForm({ ...researchForm, pdfUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Keywords / Subject Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Distributed Systems, Microcontrollers, Fault Tolerance"
                      value={researchForm.keywordsStr}
                      onChange={(e) => setResearchForm({ ...researchForm, keywordsStr: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Abstract Summary</label>
                    <textarea
                      rows={3}
                      placeholder="Brief summary of research methodology and contributions..."
                      value={researchForm.abstract}
                      onChange={(e) => setResearchForm({ ...researchForm, abstract: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {editingItem?.type === 'research' ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{editingItem?.type === 'research' ? 'Save Changes' : 'Upload Research Paper'}</span>
                    </button>
                    {editingItem?.type === 'research' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setResearchForm({
                            id: '',
                            title: '',
                            authors: '',
                            conferenceOrJournal: '',
                            year: '',
                            status: 'Published',
                            doiOrUrl: '',
                            pdfUrl: '',
                            abstract: '',
                            keywordsStr: ''
                          });
                        }}
                        className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Current Research Papers List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                  Current Research Papers ({researchPapers.length})
                </h4>
                {researchPapers.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 bg-white border border-[#DDD3C4] rounded-xl text-center">
                    No research papers uploaded yet. Use the form above to add your publications.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {researchPapers.map((paper) => (
                      <div 
                        key={paper.id} 
                        className="p-3.5 bg-white border border-[#DDD3C4] rounded-xl flex items-center justify-between gap-4 hover:border-[#7B1123]/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900 truncate">{paper.title}</span>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#7B1123]/10 text-[#7B1123]">
                              {paper.status}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 truncate mt-0.5">
                            {paper.conferenceOrJournal} {paper.year ? `(${paper.year})` : ''} · {paper.authors}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({ type: 'research', item: paper });
                            }}
                            className="p-2 text-stone-700 hover:text-[#7B1123] hover:bg-[#EFE8DC] rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Edit research paper"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#7B1123]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteResearch(paper.id);
                              if (editingItem?.item?.id === paper.id) {
                                setEditingItem(null);
                              }
                              notify(`Removed "${paper.title}"`);
                            }}
                            className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Delete research paper"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ACHIEVEMENTS */}
          {adminActiveTab === 'achievements' && (
            <div className="space-y-6">
              {/* Add / Edit Achievement Form */}
              <div className="p-5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C4]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#3B0E14] flex items-center gap-2">
                    {editingItem?.type === 'achievement' ? (
                      <>
                        <Edit2 className="w-4 h-4 text-[#7B1123]" />
                        <span>Edit Achievement: &ldquo;{achForm.title}&rdquo;</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#7B1123]" />
                        <span>Add Achievement / Award (All fields optional)</span>
                      </>
                    )}
                  </h3>

                  {editingItem?.type === 'achievement' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setAchForm({
                          id: '',
                          title: '',
                          category: '',
                          organization: '',
                          year: '',
                          badge: '',
                          description: '',
                          proofDetailsStr: ''
                        });
                      }}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-semibold"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleAchSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Award / Honor Title</label>
                      <input
                        type="text"
                        placeholder="e.g. National Hackathon Winner"
                        value={achForm.title}
                        onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Category (Written)</label>
                      <input
                        type="text"
                        placeholder="e.g. Competitions, Academic, Research..."
                        value={achForm.category}
                        onChange={(e) => setAchForm({ ...achForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Organization / Issuer</label>
                      <input
                        type="text"
                        placeholder="e.g. IEEE / Ministry of ICT"
                        value={achForm.organization}
                        onChange={(e) => setAchForm({ ...achForm, organization: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Year</label>
                      <input
                        type="text"
                        placeholder="2024"
                        value={achForm.year}
                        onChange={(e) => setAchForm({ ...achForm, year: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        placeholder="Podium / 1st Place / Distinction"
                        value={achForm.badge}
                        onChange={(e) => setAchForm({ ...achForm, badge: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Context of achievement..."
                      value={achForm.description}
                      onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Verification / Proof Details (one per line)</label>
                    <textarea
                      rows={2}
                      placeholder="Credential ID, verify link, or scope..."
                      value={achForm.proofDetailsStr}
                      onChange={(e) => setAchForm({ ...achForm, proofDetailsStr: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {editingItem?.type === 'achievement' ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{editingItem?.type === 'achievement' ? 'Save Changes' : 'Add Achievement'}</span>
                    </button>
                    {editingItem?.type === 'achievement' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setAchForm({
                            id: '',
                            title: '',
                            category: '',
                            organization: '',
                            year: '',
                            badge: '',
                            description: '',
                            proofDetailsStr: ''
                          });
                        }}
                        className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Current Achievements with Edit and Delete */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                  Current Achievements ({data.achievements.length})
                </h4>
                {data.achievements.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 bg-white border border-[#DDD3C4] rounded-xl text-center">
                    No achievements added yet. Use the form above to add your awards and certificates.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.achievements.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-3.5 bg-white border border-[#DDD3C4] rounded-xl flex items-center justify-between gap-4 hover:border-[#7B1123]/40 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-stone-900">{item.title}</div>
                          <div className="text-xs text-stone-500">
                            {item.organization} {item.badge ? `· ${item.badge}` : ''} {item.year ? `(${item.year})` : ''}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({ type: 'achievement', item });
                            }}
                            className="p-2 text-stone-700 hover:text-[#7B1123] hover:bg-[#EFE8DC] rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Edit achievement"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#7B1123]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteAchievement(item.id);
                              if (editingItem?.item?.id === item.id) {
                                setEditingItem(null);
                              }
                              notify(`Removed "${item.title}"`);
                            }}
                            className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Delete achievement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE, PICTURE & SOCIAL CHANNELS */}
          {adminActiveTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Picture Management Card */}
              <div className="p-5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C4]">
                <h3 className="text-sm font-bold text-[#3B0E14] mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#7B1123]" />
                  <span>Profile Picture Management</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Current Photo / Placeholder */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#DDD3C4] bg-[#EFE8DC] shrink-0 shadow-sm flex items-center justify-center">
                    {data.profile.avatar ? (
                      <img
                        src={data.profile.avatar}
                        alt="Profile Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <User className="w-10 h-10 text-stone-400 mx-auto" />
                        <span className="text-[10px] text-stone-500 font-mono">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Actions to Upload, URL or Remove */}
                  <div className="space-y-3 flex-grow w-full">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* File Upload Button */}
                      <button
                        type="button"
                        disabled={isCompressing}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7B1123] text-[#FAF7F2] font-semibold text-xs hover:bg-[#670D1B] transition-colors shadow-sm disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isCompressing ? 'Compressing & Saving...' : 'Upload from Device'}</span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarFileUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      {/* Remove Profile Picture Button */}
                      {data.profile.avatar && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Profile Picture</span>
                        </button>
                      )}
                    </div>

                    {/* Or paste Image URL */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Or enter Image URL:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com/photo.jpg"
                          value={profileForm.avatarUrlInput}
                          onChange={(e) => setProfileForm({ ...profileForm, avatarUrlInput: e.target.value })}
                          className="flex-grow px-3 py-1.5 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleApplyAvatarUrl}
                          className="px-3 py-1.5 bg-[#EFE8DC] hover:bg-[#E5DCCE] text-stone-800 font-semibold text-xs rounded-lg border border-[#DDD3C4] transition-colors"
                        >
                          Set URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details & Social Options Form */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C4] space-y-4">
                  <h3 className="text-sm font-bold text-[#3B0E14] mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#7B1123]" />
                    <span>Profile Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Display Title</label>
                      <input
                        type="text"
                        value={profileForm.displayTitle}
                        onChange={(e) => setProfileForm({ ...profileForm, displayTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Hero Bio</label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                    />
                  </div>

                  {/* DIRECT SOCIAL & EMAIL OPTIONS (Requested by user) */}
                  <div className="pt-4 border-t border-[#DDD3C4]">
                    <h4 className="text-xs font-bold text-[#3B0E14] mb-3 flex items-center gap-1.5">
                      <span>Social Media & Direct Email Options (Live across site)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                          <Github className="w-3.5 h-3.5 text-[#7B1123]" />
                          <span>GitHub Profile URL</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://github.com/your-username"
                          value={profileForm.github}
                          onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                          <Linkedin className="w-3.5 h-3.5 text-[#7B1123]" />
                          <span>LinkedIn Profile URL</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/in/your-username"
                          value={profileForm.linkedin}
                          onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                          <Facebook className="w-3.5 h-3.5 text-[#7B1123]" />
                          <span>Facebook Profile URL</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://facebook.com/your-username"
                          value={profileForm.facebook}
                          onChange={(e) => setProfileForm({ ...profileForm, facebook: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#7B1123]" />
                          <span>Direct Email Address</span>
                        </label>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={profileForm.directEmail}
                          onChange={(e) => setProfileForm({ ...profileForm, directEmail: e.target.value, email: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#DDD3C4] rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile & Social Links</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
