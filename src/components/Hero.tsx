import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Facebook, 
  ArrowRight, 
  Edit3,
  Camera,
  Trash2,
  User,
  Loader2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { compressImageFile } from '../utils/imageHelper';

export const Hero: React.FC = () => {
  const { data, isOwner, setAdminConsoleOpen, setAdminActiveTab, updateProfileAvatar, removeProfileAvatar } = usePortfolio();
  const roles = data.profile.heroRoles && data.profile.heroRoles.length > 0
    ? data.profile.heroRoles
    : ['Computer Science Engineer', 'Software Developer'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset imageLoaded when avatar changes
  useEffect(() => {
    setImageLoaded(true);
  }, [data.profile.avatar]);

  // Dynamic typing text effect
  useEffect(() => {
    if (!roles || roles.length === 0) return;
    const currentRole = roles[roleIndex % roles.length];
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseTime = isDeleting ? 400 : 1800;

    if (!isDeleting && displayText === currentRole) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentRole.substring(0, prev.length - 1)
          : currentRole.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles]);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressedDataUrl = await compressImageFile(file, 600, 600, 0.85);
      updateProfileAvatar(compressedDataUrl);
      setImageLoaded(true);
    } catch (err) {
      console.error('Failed to compress avatar', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateProfileAvatar(reader.result);
          setImageLoaded(true);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    removeProfileAvatar();
    setImageLoaded(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background ambient lighting - Warm Beige & Subtle Maroon Glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#7B1123]/5 blur-[140px] rounded-full pointer-events-none -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#B08968]/15 blur-[120px] rounded-full pointer-events-none -z-10" 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Two-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Typographic Hierarchy & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Editorial kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7B1123] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#7B1123]" />
              <span>Computer Science & Engineering</span>
              <span className="text-[#C4B59F]">·</span>
              <span className="text-stone-600">Software Developer</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2B0B11] leading-[1.15] mb-4 text-balance">
              Hi, I&apos;m{' '}
              <span className="text-[#7B1123]">
                {data.profile.name}
              </span>
            </h1>

            {/* Dynamic Typing Title */}
            <div className="h-10 sm:h-12 flex items-center mb-6">
              <span className="text-lg sm:text-xl md:text-2xl font-mono font-medium text-[#7B1123] flex items-center">
                <span>{displayText}</span>
                <span className="w-2 h-6 sm:h-7 bg-[#7B1123] inline-block ml-1 animate-pulse" />
              </span>
            </div>

            {/* Lead Narrative */}
            {data.profile.bio && (
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-xl mb-8">
                {data.profile.bio}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-9">
              <button
                onClick={() => scrollTo('#projects')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7B1123] text-[#FAF7F2] font-semibold text-sm hover:bg-[#670D1B] active:scale-95 transition-all shadow-md shadow-[#7B1123]/25"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('#contact')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EFE8DC] hover:bg-[#E5DCCE] text-[#3B0E14] font-medium text-sm border border-[#DDD3C4] transition-all active:scale-95"
              >
                <span>Get in Touch</span>
              </button>

              {isOwner && (
                <button
                  onClick={() => {
                    setAdminActiveTab('profile');
                    setAdminConsoleOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#7B1123]/10 text-[#7B1123] border border-[#7B1123]/30 hover:bg-[#7B1123]/20 transition-all ml-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Quick Links: Social media & platform icons */}
            <div className="flex items-center gap-3 pt-6 border-t border-[#E3D9CC]">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium mr-2">
                Connect:
              </span>

              {/* GitHub */}
              {data.profile.socials.github && (
                <a
                  href={data.profile.socials.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD3C4] text-stone-700 hover:text-[#7B1123] hover:border-[#7B1123]/40 hover:bg-[#EFE8DC] transition-all shadow-sm"
                  title="GitHub Profile"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              {/* LinkedIn */}
              {data.profile.socials.linkedin && (
                <a
                  href={data.profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD3C4] text-stone-700 hover:text-[#7B1123] hover:border-[#7B1123]/40 hover:bg-[#EFE8DC] transition-all shadow-sm"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}

              {/* Email */}
              {data.profile.email && (
                <a
                  href={`mailto:${data.profile.email}`}
                  className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD3C4] text-stone-700 hover:text-[#7B1123] hover:border-[#7B1123]/40 hover:bg-[#EFE8DC] transition-all shadow-sm"
                  title="Direct Email"
                  aria-label="Direct Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}

              {/* Facebook */}
              {data.profile.socials.facebook && (
                <a
                  href={data.profile.socials.facebook}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD3C4] text-stone-700 hover:text-[#7B1123] hover:border-[#7B1123]/40 hover:bg-[#EFE8DC] transition-all shadow-sm"
                  title="Facebook Profile"
                  aria-label="Facebook Profile"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Hero Portrait Card (Clean, NO Dhaka/Relocation badge, robust avatar management) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Back Accent Glow */}
              <div 
                aria-hidden="true" 
                className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#7B1123]/20 via-[#B08968]/20 to-[#7B1123]/20 blur-xl opacity-80"
              />

              {/* Portrait Frame Container */}
              <div className="relative rounded-3xl bg-[#FAF7F2] border-2 border-[#DDD3C4] overflow-hidden shadow-xl">
                
                {/* Image or Clean Fallback Monogram */}
                <div className="aspect-square w-full relative bg-[#EFE8DC] flex items-center justify-center">
                  {data.profile.avatar && imageLoaded ? (
                    <img
                      src={data.profile.avatar}
                      alt={data.profile.name}
                      referrerPolicy="no-referrer"
                      onError={() => setImageLoaded(false)}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3EDE2] text-stone-700 p-8 text-center">
                      <div className="w-24 h-24 rounded-full bg-[#7B1123]/10 border-2 border-[#7B1123]/30 flex items-center justify-center text-[#7B1123] font-bold text-3xl font-mono mb-3 shadow-inner">
                        {data.profile.name.split(' ').map((n) => n[0]).join('') || 'NH'}
                      </div>
                      <h3 className="text-lg font-bold text-stone-900">{data.profile.name}</h3>
                      <p className="text-xs text-stone-500 mt-1">{data.profile.displayTitle}</p>
                    </div>
                  )}

                  {/* Owner direct avatar overlay buttons */}
                  {isOwner && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-xl bg-white/95 text-stone-800 hover:text-[#7B1123] shadow-md transition-all text-xs flex items-center gap-1 font-semibold disabled:opacity-50"
                        title="Upload / Change profile picture"
                      >
                        {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7B1123]" /> : <Camera className="w-3.5 h-3.5" />}
                        <span className="text-[11px] hidden sm:inline">{isUploading ? 'Saving...' : 'Change Photo'}</span>
                      </button>

                      {data.profile.avatar && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="p-2 rounded-xl bg-white/95 text-rose-600 hover:bg-rose-50 shadow-md transition-all"
                          title="Remove profile picture"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Sub-card: Minimalist name badge only, NO hardcoded fake stats */}
                <div className="p-4 bg-[#F5EDE1] border-t border-[#DDD3C4] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#3B0E14]">{data.profile.name}</p>
                    <p className="text-stone-600 text-[11px]">{data.profile.displayTitle}</p>
                  </div>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('profile');
                        setAdminConsoleOpen(true);
                      }}
                      className="text-[11px] text-[#7B1123] font-semibold hover:underline"
                    >
                      Manage
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Optional KPI Metrics Strip (Only shown if owner has configured metrics) */}
        {data.profile.metrics && data.profile.metrics.length > 0 && (
          <div className="mt-14 pt-8 border-t border-[#E3D9CC]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.profile.metrics.map((metric) => (
                <div 
                  key={metric.label}
                  className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C4] hover:border-[#7B1123]/40 transition-colors shadow-sm"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#7B1123] tabular-nums mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900">
                    {metric.label}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {metric.context}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
