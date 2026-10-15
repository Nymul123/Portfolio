import React, { useState, useMemo } from 'react';
import { Github, Plus, Trash2, Edit2, Briefcase } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Projects: React.FC = () => {
  const { data, isOwner, setAdminConsoleOpen, setAdminActiveTab, deleteProject, openEditProject } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Dynamically extract unique written categories from current projects
  const filterCategories = useMemo(() => {
    const cats = new Set<string>();
    data.projects.forEach((p) => {
      const c = p.categoryLabel || p.category;
      if (c && c.trim()) cats.add(c.trim());
    });
    return ['All', ...Array.from(cats)];
  }, [data.projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return data.projects;
    return data.projects.filter((p) => (p.categoryLabel || p.category) === activeFilter);
  }, [data.projects, activeFilter]);

  return (
    <section id="projects" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7B1123] mb-2">
            <span>03</span>
            <span className="text-[#C4B59F]">/</span>
            <span>Featured Engineering Works</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2B0B11] text-balance">
                Featured Projects Showcase
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
                Software applications, systems architecture, and engineering projects.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Dynamic Filter Tabs based on written categories (if projects exist) */}
              {data.projects.length > 0 && filterCategories.length > 1 && (
                <div className="inline-flex p-1 bg-[#EFE8DC] border border-[#DDD3C4] rounded-xl overflow-x-auto max-w-full">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                        activeFilter === cat
                          ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {isOwner && (
                <button
                  onClick={() => {
                    setAdminActiveTab('projects');
                    setAdminConsoleOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty state when 0 projects */}
        {data.projects.length === 0 ? (
          <div className="text-center py-12 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C4]">
            <Briefcase className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">No projects added yet.</p>
            <p className="text-xs text-stone-500 mt-1">
              {isOwner ? 'Click "+ Add Project" to publish your first software or engineering project.' : 'Featured projects will appear here once published.'}
            </p>
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  setAdminActiveTab('projects');
                  setAdminConsoleOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#7B1123] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#670D1B] transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Project</span>
              </button>
            )}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C4]">
            <p className="text-stone-600 text-sm">No projects found in category &quot;{activeFilter}&quot;.</p>
            <button 
              onClick={() => setActiveFilter('All')} 
              className="mt-3 text-xs text-[#7B1123] hover:underline font-semibold"
            >
              Show all projects
            </button>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="flex flex-col rounded-2xl bg-[#FAF7F2] border border-[#DDD3C4] overflow-hidden hover:border-[#7B1123]/40 transition-all duration-200 group shadow-sm hover:shadow-lg relative"
              >
                {/* Owner controls: Edit & Delete buttons */}
                {isOwner && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditProject(project)}
                      className="p-2 rounded-xl bg-white/95 text-stone-800 hover:text-[#7B1123] hover:bg-stone-50 shadow-md transition-colors"
                      title="Edit project"
                    >
                      <Edit2 className="w-4 h-4 text-[#7B1123]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      className="p-2 rounded-xl bg-white/95 text-rose-600 hover:bg-rose-600 hover:text-white shadow-md transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Project Image Preview (if image exists) */}
                {project.image ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-[#EFE8DC]">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Scrim Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                    {/* Category tag overlay */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-mono font-medium text-[#FAF7F2] bg-[#7B1123]/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-sm">
                        {project.categoryLabel || project.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-20 bg-[#EFE8DC] p-3 flex items-center justify-between border-b border-[#DDD3C4]">
                    <span className="text-[11px] font-mono font-medium text-[#FAF7F2] bg-[#7B1123]/90 px-2.5 py-1 rounded-md">
                      {project.categoryLabel || project.category}
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Clean unboxed tech metadata */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-stone-500 font-mono mb-2.5">
                        {project.tags.slice(0, 4).map((tag, idx) => (
                          <span key={tag} className="inline-flex items-center">
                            <span className="text-stone-700">{tag}</span>
                            {idx < Math.min(project.tags.length - 1, 3) && (
                              <span className="text-stone-400 ml-1.5" aria-hidden="true">·</span>
                            )}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-stone-400">+{project.tags.length - 4} more</span>
                        )}
                      </div>
                    )}

                    {/* Title & Tagline */}
                    <h3 className="text-lg font-bold text-stone-900 mb-1 leading-snug">
                      {project.title}
                    </h3>
                    {project.tagline && (
                      <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                        {project.tagline}
                      </p>
                    )}

                    {project.description && (
                      <p className="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Card Action Footer: GitHub Repository kept */}
                  <div className="pt-4 border-t border-[#E3D9CC] flex items-center justify-between gap-3">
                    <span className="text-xs text-stone-500 font-mono">
                      Engineering Project
                    </span>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 bg-[#EFE8DC] hover:bg-[#E5DCCE] hover:text-[#7B1123] border border-[#DDD3C4] transition-all"
                        title="View GitHub Repository"
                        aria-label="View GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
