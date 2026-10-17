import React from 'react';

export interface TopHeaderProps {
  pastHero?: boolean;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onCtaClick?: () => void;
}

/**
 * TopHeader is deprecated in favor of Navbar.tsx.
 * Returning null to remove redundant visible markup.
 */
export const TopHeader: React.FC<TopHeaderProps> = () => {
  return null;
};
