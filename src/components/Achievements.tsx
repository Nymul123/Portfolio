import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  X, 
  Building,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { Achievement } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';

export const Achievements: React.FC = () => {
  const { data, isOwner, setAdminConsoleOpen, setAdminActiveTab, deleteAchievement, openEditAchievement } = usePortfolio();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  return (
    <section id="achievements" className="py-20 md:py-28 relative bg-[#F4EDE2]/70 border-y border-[#E3D9CC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7B1123] mb-2">
              <span>05</span>
              <span className="text-[#C4B59F]">/</span>
              <span>Distinctions & Honors</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2B0B11] text-balance">
              Achievements & Extra-Curricular Track Record
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
              Competitive honors, academic awards, hackathon recognitions, and verified credentials.
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => {
                setAdminActiveTab('achievements');
                setAdminConsoleOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] text-xs font-semibold rounded-xl transition-all shadow-sm shadow-[#7B1123]/20 self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Achievement</span>
            </button>
          )}
        </div>

        {/* Certificate & Award Showcase Gallery */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#3B0E14] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#7B1123]" />
              <span>Honors & Verified Certifications ({data.achievements.length})</span>
            </h3>
            {data.achievements.length > 0 && (
              <span className="text-xs text-stone-500">
                Click any award to view verification details
              </span>
            )}
          </div>

          {/* Empty state when 0 achievements */}
          {data.achievements.length === 0 ? (
            <div className="text-center py-12 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C4]">
              <Trophy className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">No achievements or certifications added yet.</p>
              <p className="text-xs text-stone-500 mt-1">
                {isOwner ? 'Add your competition awards, hackathon podiums, and certificates using the owner console.' : 'Honors and verified credentials will appear here once published.'}
              </p>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminActiveTab('achievements');
                    setAdminConsoleOpen(true);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#7B1123] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#670D1B] transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Achievement</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.achievements.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAchievement(item)}
                  className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C4] hover:border-[#7B1123]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
                >
                  {/* Owner controls: Edit & Delete */}
                  {isOwner && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditAchievement(item);
                        }}
                        className="p-1.5 text-stone-600 hover:text-[#7B1123] hover:bg-[#EFE8DC] rounded-lg transition-colors"
                        title={`Edit ${item.title}`}
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#7B1123]" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAchievement(item.id);
                        }}
                        className="p-1.5 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors"
                        title={`Delete ${item.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3 pr-14">
                      <span className="text-xs font-mono font-medium text-[#7B1123] bg-[#7B1123]/10 px-2.5 py-1 rounded-md border border-[#7B1123]/20">
                        {item.category}
                      </span>
                      {item.year && (
                        <span className="text-xs font-mono text-stone-500">
                          {item.year}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-stone-900 group-hover:text-[#7B1123] transition-colors mb-1.5">
                      {item.title}
                    </h4>

                    {item.organization && (
                      <p className="text-xs font-medium text-stone-700 mb-2 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-stone-400" />
                        <span>{item.organization}</span>
                      </p>
                    )}

                    {item.description && (
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E3D9CC] flex items-center justify-between text-xs">
                    {item.badge ? (
                      <span className="font-semibold text-[#7B1123] flex items-center gap-1 text-[11px]">
                        <Award className="w-3.5 h-3.5" />
                        <span>{item.badge}</span>
                      </span>
                    ) : <span />}

                    <span className="text-stone-500 text-[11px] group-hover:text-stone-900 font-medium transition-colors">
                      View details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedAchievement(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#FAF7F2] border border-[#DDD3C4] rounded-2xl p-6 sm:p-8 shadow-2xl text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAchievement(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-[#EFE8DC] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-medium text-[#7B1123] bg-[#7B1123]/10 px-2.5 py-0.5 rounded border border-[#7B1123]/20">
                {selectedAchievement.category}
              </span>
              {selectedAchievement.year && (
                <span className="text-xs font-mono text-stone-500">
                  Issued: {selectedAchievement.year}
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-2">
              {selectedAchievement.title}
            </h3>

            {selectedAchievement.organization && (
              <p className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#7B1123]" />
                <span>{selectedAchievement.organization}</span>
              </p>
            )}

            {selectedAchievement.description && (
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                {selectedAchievement.description}
              </p>
            )}

            {/* Proof Points */}
            {selectedAchievement.proofDetails && selectedAchievement.proofDetails.length > 0 && (
              <div className="p-4 rounded-xl bg-[#F4EDE2] border border-[#DDD3C4] mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  Verification & Scope Details
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {selectedAchievement.proofDetails.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#7B1123] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {isOwner && (
                <button
                  type="button"
                  onClick={() => {
                    const ach = selectedAchievement;
                    setSelectedAchievement(null);
                    openEditAchievement(ach);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#7B1123]/10 text-[#7B1123] border border-[#7B1123]/30 hover:bg-[#7B1123]/20 transition-all flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit in Console</span>
                </button>
              )}

              <button
                onClick={() => setSelectedAchievement(null)}
                className="ml-auto px-4 py-2 rounded-xl bg-[#7B1123] text-[#FAF7F2] font-semibold text-xs hover:bg-[#670D1B] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
