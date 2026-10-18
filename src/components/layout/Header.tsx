import React from 'react';
import { AppView, NavItem } from '../../types/navigation';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Sanctum', description: 'Visão Geral da Forja' },
  { id: 'codex', label: 'Codex', badge: '13', description: 'Grimório de Serviços AWS' },
  { id: 'lab', label: 'Lab', badge: '3', description: 'Missões Arquiteturais' },
  { id: 'progress', label: 'Evolução', description: 'Progresso do Arquiteto' },
];

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="cf-header" role="banner">
      <div className="cf-header__inner">
        {/* Brand / Logo */}
        <button
          className="cf-brand"
          onClick={() => onNavigate('home')}
          aria-label="CloudForge Home"
        >
          <div className="cf-brand__logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="cf-brand__titles">
            <span className="cf-brand__name">CLOUDFORGE</span>
            <span className="cf-brand__tagline">AWS ARCHITECT LAB</span>
          </div>
        </button>

        {/* Primary Navigation */}
        <nav className="cf-nav" aria-label="Navegação Principal">
          <ul className="cf-nav__list">
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <PixelButton
                    variant={isActive ? 'active' : 'ghost'}
                    size="sm"
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.description}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <PixelBadge variant={isActive ? 'gold' : 'default'}>
                        {item.badge}
                      </PixelBadge>
                    )}
                  </PixelButton>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Architect Status / Rank Indicator */}
        <div className="cf-header__status">
          <PixelBadge variant="gold">
            <span aria-hidden="true">◆</span> RANK: APPRENTICE
          </PixelBadge>
        </div>
      </div>
    </header>
  );
};
