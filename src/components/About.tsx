import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Compass, 
  Trash2, 
  Edit2,
  Plus
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const About: React.FC = () => {
  const { data, isOwner, setAdminConsoleOpen, setAdminActiveTab, deleteEducation, openEditEducation } = usePortfolio();
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(0);

  const activeEdu = data.education[selectedEducationIndex] || data.education[0];

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-14 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7B1123] mb-2">
              <span>01</span>
              <span className="text-[#C4B59F]">/</span>
              <span>Profile & Background</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2B0B11] text-balance">
              About Me & Academic Foundation
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
              Academic background, engineering foundation, and technical philosophy.
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => {
                setAdminActiveTab('education');
                setAdminConsoleOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#7B1123]/10 hover:bg-[#7B1123]/20 text-[#7B1123] text-xs font-semibold rounded-xl border border-[#7B1123]/30 transition-all self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage / Add Education</span>
            </button>
          )}
        </div>

        {/* Main Bio Card */}
        <div className="bg-[#FAF7F2] border border-[#DDD3C4] rounded-2xl p-6 sm:p-8 relative shadow-sm mb-16">
          <h3 className="text-xl font-bold text-[#3B0E14] mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#7B1123]" />
            <span>Engineering Philosophy & Profile</span>
          </h3>
          
          <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed max-w-4xl">
            <p>
              {data.profile.bio || "Computer Science & Engineering graduate focused on software architecture, clean code standards, and robust system implementations."}
            </p>
            <p>
              Passionate about bridging high-level software development with scalable backend architectures, reactive web technologies, and systems engineering.
            </p>
          </div>

          {isOwner && (
            <div className="mt-6 pt-4 border-t border-[#E3D9CC]">
              <button
                type="button"
                onClick={() => {
                  setAdminActiveTab('profile');
                  setAdminConsoleOpen(true);
                }}
                className="text-xs text-[#7B1123] font-semibold flex items-center gap-1 hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Bio in Owner Console</span>
              </button>
            </div>
          )}
        </div>

        {/* Education Milestones Section */}
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#3B0E14] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#7B1123]" />
                <span>Education Milestones ({data.education.length})</span>
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Academic qualifications, degrees, and coursework.
              </p>
            </div>

            {/* Interactive Milestone Selector Tabs (if milestones exist) */}
            {data.education.length > 0 && (
              <div className="inline-flex p-1 bg-[#EFE8DC] border border-[#DDD3C4] rounded-xl overflow-x-auto max-w-full">
                {data.education.map((edu, idx) => (
                  <button
                    key={edu.id || edu.degree}
                    onClick={() => setSelectedEducationIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      selectedEducationIndex === idx
                        ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    {edu.degree}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* If no education milestones exist by default */}
          {data.education.length === 0 ? (
            <div className="bg-[#FAF7F2] border border-[#DDD3C4] rounded-2xl p-8 text-center">
              <GraduationCap className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">No education milestones added yet.</p>
              <p className="text-xs text-stone-500 mt-1">
                {isOwner ? 'Add your degrees, institutions, and academic achievements using the owner console.' : 'Academic records will appear here once published.'}
              </p>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminActiveTab('education');
                    setAdminConsoleOpen(true);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#7B1123] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#670D1B] transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Milestone</span>
                </button>
              )}
            </div>
          ) : (
            /* Active Education Card */
            activeEdu && (
              <div className="bg-[#FAF7F2] border border-[#DDD3C4] rounded-2xl p-6 sm:p-8 shadow-sm relative">
                {isOwner && (
                  <div className="absolute top-5 right-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditEducation(activeEdu)}
                      className="p-2 text-stone-700 hover:text-[#7B1123] hover:bg-[#EFE8DC] rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="Edit this milestone"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#7B1123]" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        deleteEducation(activeEdu.id || activeEdu.degree);
                        setSelectedEducationIndex(0);
                      }}
                      className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold shadow-sm"
                      title="Delete this milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E3D9CC]">
                  <div className="pr-16">
                    {activeEdu.period && (
                      <span className="text-xs font-mono text-[#7B1123] font-semibold uppercase tracking-wider">
                        {activeEdu.period}
                      </span>
                    )}
                    <h4 className="text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
                      {activeEdu.degree}
                    </h4>
                    {activeEdu.institution && (
                      <p className="text-sm text-stone-600">
                        {activeEdu.institution}
                      </p>
                    )}
                  </div>

                  {(activeEdu.grade || activeEdu.gradeLabel) && (
                    <div className="text-left md:text-right bg-[#F5EDE1] md:bg-transparent p-3 md:p-0 rounded-xl">
                      {activeEdu.grade && (
                        <div className="text-base sm:text-lg font-mono font-bold text-[#7B1123]">
                          {activeEdu.grade}
                        </div>
                      )}
                      {activeEdu.gradeLabel && (
                        <div className="text-xs text-stone-600 font-medium">
                          {activeEdu.gradeLabel}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {activeEdu.description && (
                  <p className="text-sm text-stone-700 leading-relaxed mb-6">
                    {activeEdu.description}
                  </p>
                )}

                {/* Honors & Key Courses Split */}
                {(activeEdu.honors.length > 0 || activeEdu.keyCourses.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E3D9CC]">
                    {activeEdu.honors.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#7B1123]" />
                          <span>Key Academic Honors</span>
                        </h5>
                        <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                          {activeEdu.honors.map((honor) => (
                            <li key={honor} className="flex items-start gap-2">
                              <span className="text-[#7B1123] font-bold">·</span>
                              <span>{honor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeEdu.keyCourses.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#7B1123]" />
                          <span>Core Completed Coursework</span>
                        </h5>
                        <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-xs text-stone-700">
                          {activeEdu.keyCourses.map((course, idx) => (
                            <span key={course} className="inline-flex items-center">
                              <span className="text-stone-800">{course}</span>
                              {idx < activeEdu.keyCourses.length - 1 && (
                                <span className="text-stone-400 ml-2" aria-hidden="true">/</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )
          )}
        </div>

      </div>
    </section>
  );
};
