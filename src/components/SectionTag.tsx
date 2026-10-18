import React from 'react';
import {
  PhoneMissed,
  LayoutGrid,
  Play,
  Sparkles,
  Gift,
  Lightbulb,
  TriangleAlert,
  ListChecks,
  Compass,
  ShieldCheck,
  TrendingUp,
  BadgeDollarSign,
  Rocket,
  CircleHelp,
} from 'lucide-react';
import { AppsianMark } from './AppsianLogo';

export type SectionTagIcon =
  | 'appsian'
  | 'phone-missed'
  | 'layout-grid'
  | 'play'
  | 'sparkles'
  | 'gift'
  | 'lightbulb'
  | 'triangle-alert'
  | 'list-checks'
  | 'compass'
  | 'shield-check'
  | 'trending-up'
  | 'badge-dollar-sign'
  | 'rocket'
  | 'circle-help'
  | (string & {})
  | React.ReactNode;

export interface SectionTagProps {
  label: string;
  icon?: SectionTagIcon;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  id?: string;
}

function renderIconGlyph(icon: SectionTagIcon) {
  if (React.isValidElement(icon)) {
    return icon;
  }

  if (typeof icon === 'string') {
    const key = icon.toLowerCase().replace(/[-_\s]/g, '');
    switch (key) {
      case 'appsian':
        return <AppsianMark size={12} />;
      case 'phonemissed':
        return <PhoneMissed className="w-3 h-3 stroke-[2]" />;
      case 'layoutgrid':
        return <LayoutGrid className="w-3 h-3 stroke-[2]" />;
      case 'play':
        return <Play className="w-3 h-3 stroke-[2] fill-current" />;
      case 'sparkles':
        return <Sparkles className="w-3 h-3 stroke-[2]" />;
      case 'gift':
        return <Gift className="w-3 h-3 stroke-[2]" />;
      case 'lightbulb':
        return <Lightbulb className="w-3 h-3 stroke-[2]" />;
      case 'trianglealert':
        return <TriangleAlert className="w-3 h-3 stroke-[2]" />;
      case 'listchecks':
        return <ListChecks className="w-3 h-3 stroke-[2]" />;
      case 'compass':
        return <Compass className="w-3 h-3 stroke-[2]" />;
      case 'shieldcheck':
        return <ShieldCheck className="w-3 h-3 stroke-[2]" />;
      case 'trendingup':
        return <TrendingUp className="w-3 h-3 stroke-[2]" />;
      case 'badgedollarsign':
        return <BadgeDollarSign className="w-3 h-3 stroke-[2]" />;
      case 'rocket':
        return <Rocket className="w-3 h-3 stroke-[2]" />;
      case 'circlehelp':
        return <CircleHelp className="w-3 h-3 stroke-[2]" />;
      default:
        return <Sparkles className="w-3 h-3 stroke-[2]" />;
    }
  }

  return <Sparkles className="w-3 h-3 stroke-[2]" />;
}

export const SectionTag: React.FC<SectionTagProps> = ({
  label,
  icon,
  variant = 'auto',
  className = '',
  id,
}) => {
  const variantClass =
    variant === 'dark'
      ? 'section-tag--dark'
      : variant === 'light'
      ? 'section-tag--light'
      : 'section-tag--auto';

  return (
    <div
      id={id}
      className={`section-tag ${variantClass} ${className}`.trim()}
    >
      <div className="section-tag-icon-circle" aria-hidden="true">
        {renderIconGlyph(icon || 'sparkles')}
      </div>
      <span className="section-tag-label">{label}</span>
    </div>
  );
};
