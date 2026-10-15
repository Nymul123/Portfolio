import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, Facebook, Lock, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { data, isOwner, setLoginModalOpen, setAdminConsoleOpen } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#26070D] border-t border-[#3D0F19] py-12 text-[#E2D5C3] text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-[#3D0F19]">
          
          {/* Brand Wordmark (Logo removed as requested) */}
          <div className="flex items-center gap-2 text-[#FAF7F2] font-bold text-sm">
            <span>{data.profile.name}</span>
            <span className="text-[#672230]">·</span>
            <span className="text-[#C4B2A0] font-normal text-xs font-mono">CSE Portfolio</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {data.profile.socials?.github && (
              <a
                href={data.profile.socials.github}
                target="_blank"
                rel="noreferrer noopener"
                className="p-2 rounded-lg bg-[#360C14] hover:bg-[#4C121D] text-[#D8C9B7] hover:text-[#FAF7F2] transition-colors"
                title="GitHub"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {data.profile.socials?.linkedin && (
              <a
                href={data.profile.socials.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="p-2 rounded-lg bg-[#360C14] hover:bg-[#4C121D] text-[#D8C9B7] hover:text-[#FAF7F2] transition-colors"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {(data.profile.socials?.email || data.profile.email) && (
              <a
                href={data.profile.socials?.email || `mailto:${data.profile.email}`}
                className="p-2 rounded-lg bg-[#360C14] hover:bg-[#4C121D] text-[#D8C9B7] hover:text-[#FAF7F2] transition-colors"
                title="Email"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {data.profile.socials?.facebook && (
              <a
                href={data.profile.socials.facebook}
                target="_blank"
                rel="noreferrer noopener"
                className="p-2 rounded-lg bg-[#360C14] hover:bg-[#4C121D] text-[#D8C9B7] hover:text-[#FAF7F2] transition-colors"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#360C14] hover:bg-[#4C121D] text-[#E2D5C3] hover:text-[#FAF7F2] border border-[#4C121D] transition-all text-xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#EAA4B0]" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#A89685] text-[11px]">
          <div>
            © {new Date().getFullYear()} {data.profile.name}. Handcrafted in Warm Beige & Royal Maroon.
          </div>

          {/* Discreet Hidden Owner Portal Trigger */}
          <div className="flex items-center gap-4">
            {isOwner ? (
              <button
                onClick={() => setAdminConsoleOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#7B1123] text-[#FAF7F2] font-semibold text-[11px] hover:bg-[#8F152A] transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-[#EAA4B0]" />
                <span>Owner Console</span>
              </button>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 py-1 px-2 rounded text-[#998777] hover:text-[#FAF7F2] hover:bg-[#360C14] transition-all opacity-70 hover:opacity-100"
                title="Restricted Administrative Area for Portfolio Owner"
              >
                <Lock className="w-3 h-3 text-[#A89685]" />
                <span>Owner Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
