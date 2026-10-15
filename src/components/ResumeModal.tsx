import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  FileText
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolio();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textContent = `
${data.profile.name.toUpperCase()}
${data.profile.displayTitle}
Email: ${data.profile.email} | Phone: ${data.profile.phone}
Location: ${data.profile.location}
GitHub: ${data.profile.socials.github} | LinkedIn: ${data.profile.socials.linkedin}

SUMMARY
${data.resume.summary}

EDUCATION
${data.education.map(e => `- ${e.degree} (${e.period})\n  ${e.grade} - ${e.institution}`).join('\n')}

TECHNICAL SKILLS
- Languages: C, C++, Python, JavaScript, TypeScript, Java, Dart, 8086 Assembly
- Frameworks & Web: React, Node.js, Express, Flutter, Tailwind CSS
- Core CS & Databases: Data Structures, Algorithms, PostgreSQL, MySQL, Firebase
- Hardware & Embedded: ESP32, RFID RC522, FreeRTOS, Sensors & Actuators

EXPERIENCE
${data.resume.experience.map(e => `
* ${e.role} — ${e.company} (${e.period})
  ${e.bullets.map(b => `- ${b}`).join('\n  ')}
`).join('\n')}

FEATURED PROJECTS
${data.projects.map(p => `
* ${p.title} (${p.categoryLabel})
  Tech: ${p.tags.join(', ')}
  Description: ${p.tagline}
`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# ${data.profile.name} — Curriculum Vitae
**${data.profile.displayTitle}**  
Email: [${data.profile.email}](mailto:${data.profile.email})  
Location: ${data.profile.location}  
GitHub: [${data.profile.socials.github}](${data.profile.socials.github})  
LinkedIn: [${data.profile.socials.linkedin}](${data.profile.socials.linkedin})  

---

## Professional Summary
${data.resume.summary}

---

## Education
${data.education.map(e => `### ${e.degree}
*${e.institution}* | **${e.grade}** (${e.period})
- ${e.description}
`).join('\n')}

---

## Experience
${data.resume.experience.map(exp => `### ${exp.role} — ${exp.company}
*${exp.period} | ${exp.location}*
${exp.bullets.map(b => `- ${b}`).join('\n')}
`).join('\n')}

---

## Technical Skills
- **Skills**: ${data.skills.map(s => s.name).join(', ')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.profile.name.replace(/\s+/g, '_')}_CV.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FAF7F2] border border-[#DDD3C4] rounded-2xl shadow-2xl text-stone-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Toolbar */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-[#EFE8DC] border-b border-[#DDD3C4] shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#7B1123]" />
            <span className="text-sm font-bold text-[#3B0E14]">Curriculum Vitae Preview</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#7B1123] text-[#FAF7F2] hover:bg-[#670D1B] transition-colors shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {/* Copy Text Button */}
            <button
              onClick={handleCopyText}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-[#DDD3C4] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            {/* Download Markdown */}
            <button
              onClick={handleDownloadMarkdown}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-[#DDD3C4] transition-colors"
              title="Download Markdown CV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white text-stone-500 hover:text-stone-900 transition-colors ml-2"
              aria-label="Close CV modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 font-sans print:p-0 print:text-black">
          
          {/* Document Header */}
          <div className="border-b border-[#E3D9CC] pb-6 print:border-black">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B0B11] tracking-tight print:text-black">
              {data.profile.name}
            </h1>
            <p className="text-sm font-medium text-[#7B1123] print:text-gray-800 mt-1">
              {data.profile.displayTitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 mt-3 print:text-gray-700">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#7B1123] print:hidden" />
                <span>{data.profile.email}</span>
              </span>
              <span className="text-[#C4B59F] print:text-gray-400">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#7B1123] print:hidden" />
                <span>{data.profile.phone}</span>
              </span>
              <span className="text-[#C4B59F] print:text-gray-400">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#7B1123] print:hidden" />
                <span>{data.profile.location}</span>
              </span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7B1123] mb-2 print:text-black">
              Executive Summary
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed print:text-black">
              {data.resume.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7B1123] mb-3 print:text-black">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.degree} className="text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <strong className="text-stone-900 font-semibold print:text-black">{edu.degree}</strong>
                    <span className="font-mono text-[#7B1123] text-xs print:text-gray-800">{edu.period}</span>
                  </div>
                  <div className="text-stone-600 print:text-gray-700 text-xs">
                    {edu.institution} — <span className="text-[#7B1123] font-medium">{edu.grade}</span> ({edu.gradeLabel})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7B1123] mb-3 print:text-black">
              Engineering Experience
            </h2>
            <div className="space-y-5">
              {data.resume.experience.map((exp) => (
                <div key={exp.role} className="text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <strong className="text-stone-900 font-semibold print:text-black">{exp.role}</strong>
                    <span className="font-mono text-[#7B1123] text-xs print:text-gray-800">{exp.period}</span>
                  </div>
                  <div className="text-stone-600 print:text-gray-700 text-xs mb-2">
                    {exp.company} — {exp.location}
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-700 print:text-gray-900">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-[#7B1123] print:text-black font-bold mt-0.5">·</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7B1123] mb-3 print:text-black">
              Technical Competencies
            </h2>
            <div className="space-y-2 text-xs text-stone-700 print:text-black">
              <div>
                <strong className="text-stone-900 print:text-black">Skills in Registry: </strong>
                <span>{data.skills.map((s) => s.name).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Featured Projects Highlight */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7B1123] mb-3 print:text-black">
              Selected Software & Hardware Projects
            </h2>
            <div className="space-y-3.5 text-xs sm:text-sm">
              {data.projects.slice(0, 4).map((p) => (
                <div key={p.id}>
                  <div className="flex items-center justify-between">
                    <strong className="text-stone-900 print:text-black font-semibold">{p.title}</strong>
                    <span className="text-[11px] font-mono text-[#7B1123] print:text-gray-800">{p.categoryLabel}</span>
                  </div>
                  <div className="text-xs text-stone-500 print:text-gray-600 font-mono mb-1">
                    {p.tags.join(' · ')}
                  </div>
                  <p className="text-xs text-stone-700 print:text-gray-900 leading-relaxed">
                    {p.tagline}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
