import React from 'react';
import { content } from '../content';
import { Button } from './design-system';

interface NavbarProps {
  onBookDemoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookDemoClick }) => {
  const { nav } = content.hero;

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pt-[27px] flex justify-center px-4 relative z-50">
      <nav
        className="w-full max-w-[750px] h-[56px] bg-[#0E0F13]/90 backdrop-blur-md border border-white/10 rounded-[12px] px-5 sm:px-6 flex items-center justify-between shadow-1 transition-all"
        aria-label="Main Navigation"
      >
        {/* Left: Logo mark + brand */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-[6px] bg-gradient-to-tr from-[#6EEDC2] to-[#4A7FF0] p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0E0F13] rounded-[5px] flex items-center justify-center">
              <div className="w-2 h-2 rotate-45 border-2 border-[#6EEDC2] rounded-xs" />
            </div>
          </div>
          <span className="text-white font-[500] text-[15px] tracking-tight font-display">
            {nav.brand}
          </span>
        </a>

        {/* Center: Nav links */}
        <div className="hidden sm:flex items-center gap-6 text-[13px] font-[400] text-white/70">
          {nav.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="hover:text-white transition-colors duration-150 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            theme="dark"
            onClick={() => {
              const el = document.querySelector('#pricing');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="!h-[36px] !px-3 !text-[12px]"
          >
            {nav.loginLabel}
          </Button>
          <Button
            variant="primary"
            onClick={onBookDemoClick}
            className="!h-[36px] !px-3.5 !text-[12px]"
          >
            {nav.ctaLabel}
          </Button>
        </div>
      </nav>
    </div>
  );
};
