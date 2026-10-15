import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PORTFOLIO_DATA as DEFAULT_PORTFOLIO_DATA, 
  Project, 
  SkillItem, 
  EducationMilestone, 
  Achievement,
  ResearchPaper
} from '../data/portfolioData';
import { 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  db, 
  handleFirestoreError, 
  OperationType, 
  validateFirestoreConnection 
} from '../firebase';

export type PortfolioDataType = typeof DEFAULT_PORTFOLIO_DATA;

export type ActiveTabType = 'projects' | 'skills' | 'education' | 'achievements' | 'research' | 'profile';

export interface EditingState {
  type: 'project' | 'skill' | 'education' | 'achievement' | 'research' | null;
  item: any;
}

interface PortfolioContextType {
  data: PortfolioDataType;
  isOwner: boolean;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  adminConsoleOpen: boolean;
  setAdminConsoleOpen: (open: boolean) => void;
  adminActiveTab: ActiveTabType;
  setAdminActiveTab: (tab: ActiveTabType) => void;
  editingItem: EditingState | null;
  setEditingItem: (val: EditingState | null) => void;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  
  // Section 1: Hero / Profile management & Profile Picture & Social links
  updateProfile: (updatedProfile: Partial<PortfolioDataType['profile']>) => void;
  updateProfileAvatar: (avatarUrl: string | null) => void;
  removeProfileAvatar: () => void;
  
  // Section 2: Education management (Add, Edit, Delete)
  addEducation: (edu: Partial<EducationMilestone>) => void;
  updateEducation: (id: string, updated: Partial<EducationMilestone>) => void;
  deleteEducation: (idOrDegree: string) => void;
  openEditEducation: (edu: EducationMilestone) => void;
  
  // Section 3: Skills management (Add, Edit, Delete)
  addSkill: (skill: Partial<SkillItem>) => void;
  updateSkill: (id: string, updated: Partial<SkillItem>) => void;
  deleteSkill: (idOrName: string) => void;
  openEditSkill: (skill: SkillItem) => void;
  
  // Section 4: Projects management (Add, Edit, Delete)
  addProject: (project: Partial<Project>) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  openEditProject: (project: Project) => void;
  
  // Section 5: Achievements management (Add, Edit, Delete)
  addAchievement: (achievement: Partial<Achievement>) => void;
  updateAchievement: (id: string, updated: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;
  openEditAchievement: (ach: Achievement) => void;

  // Section 6: Research Papers management (Add, Edit, Delete)
  addResearch: (paper: Partial<ResearchPaper>) => void;
  updateResearch: (id: string, updated: Partial<ResearchPaper>) => void;
  deleteResearch: (id: string) => void;
  openEditResearch: (paper: ResearchPaper) => void;

  // Global cloud database synchronization status
  isServerSyncing: boolean;
  serverSynced: boolean;
  forceServerSync: () => Promise<void>;
}

// Storage keys
const STORAGE_KEY = 'nymul_portfolio_cloud_v10';
const AUTH_KEY = 'nymul_portfolio_auth_token_v10';

// Preset credentials for owner
export const OWNER_CREDENTIALS = {
  username: 'Nymul1178',
  password: '12124545943007'
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with local cache for immediate zero-latency render
  const [data, setData] = useState<PortfolioDataType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PORTFOLIO_DATA,
          ...parsed,
          profile: {
            ...DEFAULT_PORTFOLIO_DATA.profile,
            ...parsed.profile,
            avatar: parsed.profile?.avatar !== undefined ? parsed.profile.avatar : null,
            socials: {
              ...DEFAULT_PORTFOLIO_DATA.profile.socials,
              ...(parsed.profile?.socials || {})
            }
          },
          education: Array.isArray(parsed.education) ? parsed.education : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
          research: Array.isArray(parsed.research) ? parsed.research : []
        };
      }
    } catch (e) {
      console.error('Error loading initial cache from localStorage', e);
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  const [isOwner, setIsOwner] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'authenticated_owner';
    } catch {
      return false;
    }
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminConsoleOpen, setAdminConsoleOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<ActiveTabType>('projects');
  const [editingItem, setEditingItem] = useState<EditingState | null>(null);
  const [isServerSyncing, setIsServerSyncing] = useState(false);
  const [serverSynced, setServerSynced] = useState(true);

  // Central persistence dispatcher: updates local state + writes to Firebase Firestore cloud database
  const persist = async (updater: (prev: PortfolioDataType) => PortfolioDataType) => {
    let nextState: PortfolioDataType = data;
    setData((prev) => {
      const updated = updater(prev);
      nextState = updated;
      return updated;
    });

    const dataToSave: PortfolioDataType = nextState;

    // 1. Save to local storage for fast local cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (err) {
      console.warn('LocalStorage save warning:', err);
    }

    // 2. Persist directly to Firebase Firestore Cloud Database so ALL devices see updates instantly
    setIsServerSyncing(true);
    const path = 'portfolio/current';
    try {
      const docRef = doc(db, 'portfolio', 'current');
      await setDoc(docRef, {
        profile: dataToSave.profile,
        education: dataToSave.education,
        skills: dataToSave.skills,
        projects: dataToSave.projects,
        achievements: dataToSave.achievements,
        research: dataToSave.research,
        resume: dataToSave.resume,
        updatedAt: new Date().toISOString()
      });
      setServerSynced(true);
    } catch (err) {
      console.error('Error saving to Firestore:', err);
      setServerSynced(false);
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsServerSyncing(false);
    }
  };

  // Connect to Firebase Firestore on boot with real-time listener across all devices
  useEffect(() => {
    validateFirestoreConnection();

    const path = 'portfolio/current';
    const docRef = doc(db, 'portfolio', 'current');

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.data();
          const hydrated: PortfolioDataType = {
            ...DEFAULT_PORTFOLIO_DATA,
            ...cloudData,
            profile: {
              ...DEFAULT_PORTFOLIO_DATA.profile,
              ...(cloudData.profile || {}),
              avatar: cloudData.profile?.avatar !== undefined ? cloudData.profile.avatar : null,
              socials: {
                ...DEFAULT_PORTFOLIO_DATA.profile.socials,
                ...(cloudData.profile?.socials || {})
              }
            },
            education: Array.isArray(cloudData.education) ? cloudData.education : [],
            skills: Array.isArray(cloudData.skills) ? cloudData.skills : [],
            projects: Array.isArray(cloudData.projects) ? cloudData.projects : [],
            achievements: Array.isArray(cloudData.achievements) ? cloudData.achievements : [],
            research: Array.isArray(cloudData.research) ? cloudData.research : []
          };

          setData(hydrated);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
          } catch {}
          setServerSynced(true);
          setIsServerSyncing(false);
        } else {
          // If no document exists in Firestore yet, initialize it with current data / local cache
          let initialSeed: PortfolioDataType = DEFAULT_PORTFOLIO_DATA;
          try {
            const localSaved = localStorage.getItem(STORAGE_KEY);
            if (localSaved) {
              const parsed = JSON.parse(localSaved);
              if (parsed && typeof parsed === 'object') {
                initialSeed = {
                  ...DEFAULT_PORTFOLIO_DATA,
                  ...parsed
                };
              }
            }
          } catch {}

          setDoc(docRef, {
            profile: initialSeed.profile,
            education: initialSeed.education,
            skills: initialSeed.skills,
            projects: initialSeed.projects,
            achievements: initialSeed.achievements,
            research: initialSeed.research,
            resume: initialSeed.resume,
            updatedAt: new Date().toISOString()
          }).catch((err) => {
            console.error('Error creating initial Firestore portfolio doc:', err);
            handleFirestoreError(err, OperationType.WRITE, path);
          });
        }
      },
      (error) => {
        console.warn('Firestore realtime listener error:', error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Sync auth state to local storage
  useEffect(() => {
    try {
      if (isOwner) {
        localStorage.setItem(AUTH_KEY, 'authenticated_owner');
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {
      console.error('Error saving auth to localStorage', e);
    }
  }, [isOwner]);

  const login = (u: string, p: string): boolean => {
    const isMatches = 
      u.trim().toLowerCase() === OWNER_CREDENTIALS.username.toLowerCase() && 
      p === OWNER_CREDENTIALS.password;

    if (isMatches) {
      setIsOwner(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsOwner(false);
    setAdminConsoleOpen(false);
  };

  const forceServerSync = async () => {
    setIsServerSyncing(true);
    const path = 'portfolio/current';
    try {
      const docRef = doc(db, 'portfolio', 'current');
      await setDoc(docRef, {
        profile: data.profile,
        education: data.education,
        skills: data.skills,
        projects: data.projects,
        achievements: data.achievements,
        research: data.research,
        resume: data.resume,
        updatedAt: new Date().toISOString()
      });
      setServerSynced(true);
    } catch (err) {
      setServerSynced(false);
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsServerSyncing(false);
    }
  };

  // Section 1: Profile & Avatar & Socials
  const updateProfile = (updatedProfile: Partial<PortfolioDataType['profile']>) => {
    persist((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updatedProfile,
        socials: {
          ...prev.profile.socials,
          ...(updatedProfile.socials || {})
        }
      }
    }));
  };

  const updateProfileAvatar = (avatarUrl: string | null) => {
    persist((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        avatar: avatarUrl
      }
    }));
  };

  const removeProfileAvatar = () => {
    persist((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        avatar: null
      }
    }));
  };

  // Section 2: Education CRUD & Edit Trigger
  const addEducation = (edu: Partial<EducationMilestone>) => {
    const item: EducationMilestone = {
      id: edu.id || `edu-${Date.now()}`,
      degree: edu.degree || 'Degree Milestone',
      institution: edu.institution || '',
      period: edu.period || '',
      grade: edu.grade || '',
      gradeLabel: edu.gradeLabel || '',
      description: edu.description || '',
      honors: edu.honors || [],
      keyCourses: edu.keyCourses || []
    };
    persist((prev) => ({
      ...prev,
      education: [item, ...prev.education]
    }));
  };

  const updateEducation = (id: string, updated: Partial<EducationMilestone>) => {
    persist((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id || e.degree === id ? { ...e, ...updated } : e))
    }));
  };

  const deleteEducation = (idOrDegree: string) => {
    persist((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== idOrDegree && e.degree !== idOrDegree)
    }));
  };

  const openEditEducation = (edu: EducationMilestone) => {
    setEditingItem({ type: 'education', item: edu });
    setAdminActiveTab('education');
    setAdminConsoleOpen(true);
  };

  // Section 3: Skills CRUD & Edit Trigger
  const addSkill = (skill: Partial<SkillItem>) => {
    const item: SkillItem = {
      id: skill.id || `skill-${Date.now()}`,
      name: skill.name || 'New Technical Skill',
      category: skill.category || 'Core Stack',
      level: skill.level || 'Intermediate',
      icon: skill.icon || 'Code2',
      details: skill.details || '',
      projectsCount: skill.projectsCount || 0
    };
    persist((prev) => ({
      ...prev,
      skills: [item, ...prev.skills]
    }));
  };

  const updateSkill = (id: string, updated: Partial<SkillItem>) => {
    persist((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id || s.name === id ? { ...s, ...updated } : s))
    }));
  };

  const deleteSkill = (idOrName: string) => {
    persist((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== idOrName && s.name !== idOrName)
    }));
  };

  const openEditSkill = (skill: SkillItem) => {
    setEditingItem({ type: 'skill', item: skill });
    setAdminActiveTab('skills');
    setAdminConsoleOpen(true);
  };

  // Section 4: Projects CRUD & Edit Trigger
  const addProject = (project: Partial<Project>) => {
    const item: Project = {
      id: project.id || `proj-${Date.now()}`,
      title: project.title || 'New Engineering Project',
      tagline: project.tagline || '',
      category: project.category || 'Full-Stack',
      categoryLabel: project.categoryLabel || project.category || 'Engineering',
      image: project.image || '',
      description: project.description || '',
      highlights: project.highlights || [],
      tags: project.tags || [],
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || ''
    };
    persist((prev) => ({
      ...prev,
      projects: [item, ...prev.projects]
    }));
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    persist((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p))
    }));
  };

  const deleteProject = (id: string) => {
    persist((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const openEditProject = (project: Project) => {
    setEditingItem({ type: 'project', item: project });
    setAdminActiveTab('projects');
    setAdminConsoleOpen(true);
  };

  // Section 5: Achievements CRUD & Edit Trigger
  const addAchievement = (ach: Partial<Achievement>) => {
    const item: Achievement = {
      id: ach.id || `ach-${Date.now()}`,
      title: ach.title || 'New Distinction / Honor',
      category: ach.category || 'Recognition',
      organization: ach.organization || '',
      year: ach.year || `${new Date().getFullYear()}`,
      badge: ach.badge || 'Verified',
      description: ach.description || '',
      proofDetails: ach.proofDetails || []
    };
    persist((prev) => ({
      ...prev,
      achievements: [item, ...prev.achievements]
    }));
  };

  const updateAchievement = (id: string, updated: Partial<Achievement>) => {
    persist((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...updated } : a))
    }));
  };

  const deleteAchievement = (id: string) => {
    persist((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id)
    }));
  };

  const openEditAchievement = (ach: Achievement) => {
    setEditingItem({ type: 'achievement', item: ach });
    setAdminActiveTab('achievements');
    setAdminConsoleOpen(true);
  };

  // Section 6: Research Papers CRUD & Edit Trigger
  const addResearch = (paper: Partial<ResearchPaper>) => {
    const item: ResearchPaper = {
      id: paper.id || `paper-${Date.now()}`,
      title: paper.title || 'Untitled Research Publication',
      authors: paper.authors || 'Nymul Hossain',
      conferenceOrJournal: paper.conferenceOrJournal || '',
      year: paper.year || `${new Date().getFullYear()}`,
      status: paper.status || 'Published',
      doiOrUrl: paper.doiOrUrl || '',
      pdfUrl: paper.pdfUrl || '',
      abstract: paper.abstract || '',
      keywords: paper.keywords || []
    };
    persist((prev) => ({
      ...prev,
      research: [item, ...(prev.research || [])]
    }));
  };

  const updateResearch = (id: string, updated: Partial<ResearchPaper>) => {
    persist((prev) => ({
      ...prev,
      research: (prev.research || []).map((p) => (p.id === id ? { ...p, ...updated } : p))
    }));
  };

  const deleteResearch = (id: string) => {
    persist((prev) => ({
      ...prev,
      research: (prev.research || []).filter((p) => p.id !== id)
    }));
  };

  const openEditResearch = (paper: ResearchPaper) => {
    setEditingItem({ type: 'research', item: paper });
    setAdminActiveTab('research');
    setAdminConsoleOpen(true);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isOwner,
        loginModalOpen,
        setLoginModalOpen,
        adminConsoleOpen,
        setAdminConsoleOpen,
        adminActiveTab,
        setAdminActiveTab,
        editingItem,
        setEditingItem,
        login,
        logout,
        updateProfile,
        updateProfileAvatar,
        removeProfileAvatar,
        addEducation,
        updateEducation,
        deleteEducation,
        openEditEducation,
        addSkill,
        updateSkill,
        deleteSkill,
        openEditSkill,
        addProject,
        updateProject,
        deleteProject,
        openEditProject,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        openEditAchievement,
        addResearch,
        updateResearch,
        deleteResearch,
        openEditResearch,
        isServerSyncing,
        serverSynced,
        forceServerSync
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
