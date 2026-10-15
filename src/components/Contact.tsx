import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  ArrowUpRight
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Contact: React.FC = () => {
  const { data } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.profile.email).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(data.profile.phone).then(() => {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    });
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7B1123] mb-2">
            <span>06</span>
            <span className="text-[#C4B59F]">/</span>
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2B0B11] text-balance">
            Direct Contact Information
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Reach out directly for software engineering opportunities, project collaboration, or discussions.
          </p>
        </div>

        {/* Direct Communication Channels (Clean Cards Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Email Card */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C4] flex flex-col justify-between shadow-sm hover:border-[#7B1123]/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#7B1123]/10 border border-[#7B1123]/30 flex items-center justify-center text-[#7B1123] mb-4 group-hover:bg-[#7B1123]/20 transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-1">
                Direct Email
              </span>
              <a 
                href={`mailto:${data.profile.email}`}
                className="text-sm font-bold text-stone-900 hover:text-[#7B1123] transition-colors break-all"
              >
                {data.profile.email}
              </a>
            </div>

            <div className="pt-5 mt-5 border-t border-[#E3D9CC] flex items-center justify-between">
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B1123] hover:text-[#5B0B17] transition-colors"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
              </button>

              <a
                href={`mailto:${data.profile.email}`}
                className="p-1.5 rounded-lg text-stone-400 hover:text-[#7B1123] transition-colors"
                title="Send mail"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Phone / WhatsApp Card */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C4] flex flex-col justify-between shadow-sm hover:border-[#7B1123]/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#7B1123]/10 border border-[#7B1123]/30 flex items-center justify-center text-[#7B1123] mb-4 group-hover:bg-[#7B1123]/20 transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-1">
                Phone & WhatsApp
              </span>
              <a 
                href={`https://wa.me/${data.profile.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-bold text-stone-900 hover:text-[#7B1123] transition-colors"
              >
                {data.profile.phone}
              </a>
            </div>

            <div className="pt-5 mt-5 border-t border-[#E3D9CC] flex items-center justify-between">
              <button
                onClick={handleCopyPhone}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B1123] hover:text-[#5B0B17] transition-colors"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPhone ? 'Copied!' : 'Copy Number'}</span>
              </button>

              <a
                href={`https://wa.me/${data.profile.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="p-1.5 rounded-lg text-stone-400 hover:text-[#7B1123] transition-colors"
                title="Open WhatsApp"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Location Card */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C4] flex flex-col justify-between shadow-sm hover:border-[#7B1123]/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#7B1123]/10 border border-[#7B1123]/30 flex items-center justify-center text-[#7B1123] mb-4 group-hover:bg-[#7B1123]/20 transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-1">
                Location
              </span>
              <span className="text-sm font-bold text-stone-900 leading-snug block">
                {data.profile.location}
              </span>
            </div>

            <div className="pt-5 mt-5 border-t border-[#E3D9CC] text-xs text-stone-500">
              Open to Remote Worldwide
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
