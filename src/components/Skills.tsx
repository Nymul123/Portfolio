import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  Terminal, 
  FileCode, 
  Coffee, 
  Smartphone, 
  Cpu, 
  Layers, 
  Server, 
  TabletSmartphone, 
  Palette, 
  Globe, 
  Binary, 
  Database, 
  Flame, 
  HardDrive, 
  Network, 
  Radio, 
  CreditCard, 
  Activity, 
  Share2,
  Search,
  Plus,
  Trash2,
  Edit2,
  Wrench
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5 text-[#7B1123]" />,
  Terminal: <Terminal className="w-5 h-5 text-[#7B1123]" />,
  FileCode: <FileCode className="w-5 h-5 text-[#7B1123]" />,
  Coffee: <Coffee className="w-5 h-5 text-[#7B1123]" />,
  Smartphone: <Smartphone className="w-5 h-5 text-[#7B1123]" />,
  Cpu: <Cpu className="w-5 h-5 text-[#7B1123]" />,
  Layers: <Layers className="w-5 h-5 text-[#7B1123]" />,
  Server: <Server className="w-5 h-5 text-[#7B1123]" />,
  TabletSmartphone: <TabletSmartphone className="w-5 h-5 text-[#7B1123]" />,
  Palette: <Palette className="w-5 h-5 text-[#7B1123]" />,
  Globe: <Globe className="w-5 h-5 text-[#7B1123]" />,
  Binary: <Binary className="w-5 h-5 text-[#7B1123]" />,
  Database: <Database className="w-5 h-5 text-[#7B1123]" />,
  Flame: <Flame className="w-5 h-5 text-[#7B1123]" />,
  HardDrive: <HardDrive className="w-5 h-5 text-[#7B1123]" />,
  Network: <Network className="w-5 h-5 text-[#7B1123]" />,
  Radio: <Radio className="w-5 h-5 text-[#7B1123]" />,
  CreditCard: <CreditCard className="w-5 h-5 text-[#7B1123]" />,
  Activity: <Activity className="w-5 h-5 text-[#7B1123]" />,
  Share2: <Share2 className="w-5 h-5 text-[#7B1123]" />
};

export const Skills: React.FC = () => {
  const { data, isOwner, setAdminConsoleOpen, setAdminActiveTab, deleteSkill, openEditSkill } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically extract unique written categories from skills
  const categories = useMemo(() => {
    const cats = new Set<string>();
    data.skills.forEach((s) => {
      if (s.category && s.category.trim()) {
        cats.add(s.category.trim());
      }
    });
    return ['All', ...Array.from(cats)];
  }, [data.skills]);

  const filteredSkills = useMemo(() => {
    return data.skills.filter((skill) => {
      const matchesCategory = 
        activeCategory === 'All' || 
        skill.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesQuery = 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.details.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [data.skills, activeCategory, searchQuery]);

  return (
    <section id="skills" className="py-20 md:py-28 relative bg-[#F4EDE2]/70 border-y border-[#E3D9CC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7B1123] mb-2">
            <span>02</span>
            <span className="text-[#C4B59F]">/</span>
            <span>Technical Capabilities</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2B0B11] text-balance">
                Technical Skills & Engineering Stack
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
                Programming languages, frameworks, system tools, and development competencies.
              </p>
            </div>

            {/* Quick Live Search Input & Owner Add Action */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {data.skills.length > 0 && (
                <div className="relative w-full md:w-64 shrink-0">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search skills (e.g., C++, React)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#DDD3C4] rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#7B1123] focus:ring-1 focus:ring-[#7B1123] transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              {isOwner && (
                <button
                  onClick={() => {
                    setAdminActiveTab('skills');
                    setAdminConsoleOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] text-xs font-semibold rounded-xl transition-all shrink-0 shadow-sm shadow-[#7B1123]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Skill</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Filter Tabs if skills exist */}
        {data.skills.length > 0 && categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all ${
                  activeCategory === cat
                    ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#FAF7F2] text-stone-600 border border-[#DDD3C4] hover:text-[#7B1123] hover:border-[#7B1123]/40'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="text-xs text-stone-500 ml-auto hidden md:inline">
              Showing {filteredSkills.length} competencies
            </span>
          </div>
        )}

        {/* Empty state when 0 skills */}
        {data.skills.length === 0 ? (
          <div className="text-center py-12 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C4]">
            <Wrench className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">No technical skills added yet.</p>
            <p className="text-xs text-stone-500 mt-1">
              {isOwner ? 'Add your programming languages, frameworks, and tools using the owner console.' : 'Technical competencies will appear here once published.'}
            </p>
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  setAdminActiveTab('skills');
                  setAdminConsoleOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#7B1123] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#670D1B] transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Skill</span>
              </button>
            )}
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-12 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C4]">
            <p className="text-stone-600 text-sm">No skills found matching &quot;{searchQuery}&quot;.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} 
              className="mt-3 text-xs text-[#7B1123] hover:underline font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id || skill.name}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C4] hover:border-[#7B1123]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative"
              >
                {/* Owner controls: Edit & Delete */}
                {isOwner && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                    <button
                      type="button"
                      onClick={() => openEditSkill(skill)}
                      className="p-1.5 text-stone-600 hover:text-[#7B1123] hover:bg-[#EFE8DC] rounded-lg transition-colors"
                      title={`Edit ${skill.name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#7B1123]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        deleteSkill(skill.id || skill.name);
                      }}
                      className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors"
                      title={`Delete ${skill.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3 pr-14">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EFE8DC] border border-[#DDD3C4] flex items-center justify-center shrink-0 group-hover:border-[#7B1123]/40 transition-colors">
                        {iconMap[skill.icon] || <Code2 className="w-5 h-5 text-[#7B1123]" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#7B1123] transition-colors">
                          {skill.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="capitalize">{skill.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#7B1123] font-semibold">{skill.level}</span>
                        </div>
                      </div>
                    </div>

                    {skill.projectsCount > 0 && (
                      <span className="text-[11px] font-mono text-stone-600 tabular-nums bg-[#EFE8DC] px-2 py-0.5 rounded-md border border-[#DDD3C4]">
                        {skill.projectsCount} proj
                      </span>
                    )}
                  </div>

                  {skill.details && (
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {skill.details}
                    </p>
                  )}
                </div>

                {/* 4-tier Level indicator bar (Beginner, Intermediate, Advanced, Expert) */}
                <div className="pt-3 border-t border-[#E3D9CC] flex items-center justify-between text-[11px] text-stone-500">
                  <span>Proficiency ({skill.level})</span>
                  <div className="flex items-center gap-1.5" title={skill.level}>
                    <div 
                      className={`w-5 h-1 rounded-full ${
                        skill.level === 'Beginner' || 
                        skill.level === 'Intermediate' || 
                        skill.level === 'Advanced' || 
                        skill.level === 'Proficient' || 
                        skill.level === 'Expert' 
                          ? 'bg-[#7B1123]' 
                          : 'bg-[#DDD3C4]'
                      }`} 
                    />
                    <div 
                      className={`w-5 h-1 rounded-full ${
                        skill.level === 'Intermediate' || 
                        skill.level === 'Advanced' || 
                        skill.level === 'Proficient' || 
                        skill.level === 'Expert' 
                          ? 'bg-[#7B1123]' 
                          : 'bg-[#DDD3C4]'
                      }`} 
                    />
                    <div 
                      className={`w-5 h-1 rounded-full ${
                        skill.level === 'Advanced' || 
                        skill.level === 'Proficient' || 
                        skill.level === 'Expert' 
                          ? 'bg-[#7B1123]' 
                          : 'bg-[#DDD3C4]'
                      }`} 
                    />
                    <div 
                      className={`w-5 h-1 rounded-full ${
                        skill.level === 'Expert' 
                          ? 'bg-[#7B1123]' 
                          : 'bg-[#DDD3C4]'
                      }`} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
