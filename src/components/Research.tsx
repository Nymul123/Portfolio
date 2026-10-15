import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Users, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ResearchPaper } from '../data/portfolioData';

export const Research: React.FC = () => {
  const { data, isOwner, setAdminConsoleOpen, setAdminActiveTab, deleteResearch, openEditResearch } = usePortfolio();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

  const papers = data.research || [];

  const statuses = ['All', ...Array.from(new Set(papers.map((p) => p.status).filter(Boolean)))];

  const filteredPapers = papers.filter((p) => {
    if (selectedStatus === 'All') return true;
    return p.status === selectedStatus;
  });

  return (
    <section id="research" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7B1123] mb-2">
              <span>04</span>
              <span className="text-[#C4B59F]">/</span>
              <span>Scholarly Output</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2B0B11] text-balance">
              Research Papers & Publications
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
              Peer-reviewed conference proceedings, journal publications, technical reports, and preprints.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {papers.length > 0 && statuses.length > 2 && (
              <div className="inline-flex p-1 bg-[#EFE8DC] border border-[#DDD3C4] rounded-xl overflow-x-auto max-w-full">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      selectedStatus === st
                        ? 'bg-[#7B1123] text-[#FAF7F2] shadow-sm'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}

            {isOwner && (
              <button
                onClick={() => {
                  setAdminActiveTab('research');
                  setAdminConsoleOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] text-xs font-semibold rounded-xl transition-all shadow-sm shadow-[#7B1123]/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Research Paper</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty state when 0 papers */}
        {papers.length === 0 ? (
          <div className="text-center py-12 bg-[#FAF7F2] rounded-2xl border border-[#DDD3C4]">
            <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">No research papers added yet.</p>
            <p className="text-xs text-stone-500 mt-1">
              {isOwner ? 'Click "+ Add Research Paper" to publish your journal articles, conference papers, or preprints.' : 'Publications will appear here once published.'}
            </p>
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  setAdminActiveTab('research');
                  setAdminConsoleOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#7B1123] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#670D1B] transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload First Research Paper</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredPapers.map((paper) => {
              const isExpanded = expandedAbstractId === paper.id;
              return (
                <article
                  key={paper.id}
                  className="p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C4] hover:border-[#7B1123]/40 transition-all shadow-sm hover:shadow-md relative group flex flex-col justify-between"
                >
                  {/* Owner controls: Edit & Delete */}
                  {isOwner && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                      <button
                        type="button"
                        onClick={() => openEditResearch(paper)}
                        className="p-2 text-stone-600 hover:text-[#7B1123] hover:bg-[#EFE8DC] rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                        title="Edit research paper"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#7B1123]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteResearch(paper.id)}
                        className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                        title="Delete research paper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}

                  <div>
                    {/* Status & Venue Metadata */}
                    <div className="flex flex-wrap items-center gap-2 mb-2 pr-28">
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#7B1123]/10 text-[#7B1123] border border-[#7B1123]/20">
                        {paper.status || 'Published'}
                      </span>
                      {paper.year && (
                        <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{paper.year}</span>
                        </span>
                      )}
                      <span className="text-stone-300">·</span>
                      <span className="text-xs font-semibold text-[#3B0E14]">
                        {paper.conferenceOrJournal}
                      </span>
                    </div>

                    {/* Paper Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug mb-2 group-hover:text-[#7B1123] transition-colors">
                      {paper.title}
                    </h3>

                    {/* Authors */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-3">
                      <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{paper.authors}</span>
                    </div>

                    {/* Abstract with toggle */}
                    {paper.abstract && (
                      <div className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                        <p className={isExpanded ? '' : 'line-clamp-2'}>
                          {paper.abstract}
                        </p>
                        {paper.abstract.length > 140 && (
                          <button
                            type="button"
                            onClick={() => setExpandedAbstractId(isExpanded ? null : paper.id)}
                            className="text-xs font-semibold text-[#7B1123] hover:underline mt-1 inline-block"
                          >
                            {isExpanded ? 'Show less' : 'Read abstract...'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Keywords */}
                    {paper.keywords && paper.keywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {paper.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="text-[10px] font-mono bg-[#EFE8DC] text-stone-700 px-2 py-0.5 rounded border border-[#DDD3C4]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="pt-4 border-t border-[#E3D9CC] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {paper.doiOrUrl && (
                        <a
                          href={paper.doiOrUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] text-xs font-semibold rounded-lg transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Paper / DOI</span>
                        </a>
                      )}

                      {paper.pdfUrl && (
                        <a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFE8DC] hover:bg-[#E5DCCE] text-stone-800 text-xs font-semibold rounded-lg border border-[#DDD3C4] transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#7B1123]" />
                          <span>Download PDF</span>
                        </a>
                      )}

                      {!paper.doiOrUrl && !paper.pdfUrl && (
                        <span className="text-xs text-stone-500 italic">Full text available on request</span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-stone-500">
                      Peer-Reviewed Research
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
