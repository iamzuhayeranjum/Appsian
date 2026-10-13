import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onNavigate }) => {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/8 text-white/60">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div
            onClick={onScrollToTop}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/15 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 2.5L22.5 7.4L14 12.3L5.5 7.4L14 2.5Z" fill="white" />
              <path d="M9 14.5L13.8 17.2L9 20L4.2 17.2L9 14.5Z" fill="#6EEDC2" />
              <path d="M19 14.5L23.8 17.2L19 20L14.2 17.2L19 14.5Z" fill="white" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-white text-base">Appsian</span>
            <p className="text-xs text-white/40">AI Inbound Receptionist & Call Dispatch</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          {['services', 'workflows', 'toolverse', 'customers', 'resources'].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className="capitalize hover:text-white transition-colors cursor-pointer"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-white/40">
        <p>© 2026 Appsian Technologies Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-white/70 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-white/70 transition-colors">Terms of Service</a>
          <a href="#security" className="hover:text-white/70 transition-colors">Security & Trust</a>
        </div>
      </div>
    </footer>
  );
};
