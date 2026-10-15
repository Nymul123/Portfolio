import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Navbar: React.FC = () => {
  const { data, isOwner, setAdminConsoleOpen } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Research', href: '#research' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
        isScrolled 
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-[#E3D9CC] shadow-sm py-3' 
          : 'bg-[#FAF7F2]/80 backdrop-blur-sm border-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Logo removed as requested) */}
        <a 
          href="#hero" 
          onClick={(e) => handleLinkClick(e, '#hero')}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#3B0E14] hover:text-[#7B1123] transition-colors whitespace-nowrap shrink-0 group"
        >
          <span>{data.profile.name}</span>
          {isOwner && (
            <span className="text-[10px] font-mono font-bold bg-[#7B1123] text-[#FAF7F2] px-1.5 py-0.5 rounded ml-1">
              OWNER
            </span>
          )}
        </a>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="hover:text-[#7B1123] transition-colors whitespace-nowrap shrink-0 relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#7B1123] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action CTA & Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          {isOwner ? (
            <button
              onClick={() => setAdminConsoleOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#7B1123] bg-[#7B1123]/10 border border-[#7B1123]/30 hover:bg-[#7B1123]/20 rounded-xl transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          ) : (
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#7B1123] hover:bg-[#670D1B] active:scale-95 transition-all rounded-xl shadow-sm shadow-[#7B1123]/20"
            >
              <span>Contact</span>
            </a>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-700 hover:text-[#7B1123] hover:bg-[#EFE8DC] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E3D9CC] px-6 py-5 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="py-2.5 px-3 rounded-md text-sm font-medium text-stone-800 hover:text-[#7B1123] hover:bg-[#EFE8DC] transition-colors"
              >
                {link.name}
              </a>
            ))}
            {isOwner && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAdminConsoleOpen(true);
                }}
                className="w-full text-left py-2 px-3 text-xs font-bold text-[#7B1123] bg-[#7B1123]/10 rounded-md"
              >
                Open Owner Console
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
