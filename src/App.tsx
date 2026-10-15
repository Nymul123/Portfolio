/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Achievements } from './components/Achievements';
import { Research } from './components/Research';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { OwnerFloatingBar } from './components/OwnerFloatingBar';

function PortfolioApp() {
  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1917] flex flex-col selection:bg-[#7B1123] selection:text-[#FAF7F2]">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Content Sections (Sections fully manageable by Owner) */}
      <main className="flex-grow">
        {/* Section 1: Hero & Profile / Metrics */}
        <Hero />

        {/* Section 2: About Me & Education Milestones */}
        <About />

        {/* Section 3: Technical Skills & Engineering Stack */}
        <Skills />

        {/* Section 4: Featured Projects Showcase */}
        <Projects />

        {/* Section 5: Research Papers & Publications */}
        <Research />

        {/* Section 6: Achievements & Distinctions */}
        <Achievements />

        {/* Contact Section (Direct communication channels) */}
        <Contact />
      </main>

      {/* Footer with Hidden Owner Portal Trigger */}
      <Footer />

      {/* Hidden Owner Authentication Modal */}
      <OwnerLoginModal />

      {/* Owner Management Console (Add / Remove / Edit across all 5 sections) */}
      <AdminConsoleModal />

      {/* Persistent floating indicator when owner is logged in */}
      <OwnerFloatingBar />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
