import React from 'react';
import { AppView } from '../../types/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentView,
  onNavigate,
  children,
}) => {
  return (
    <div className="app-shell">
      <Header currentView={currentView} onNavigate={onNavigate} />
      <main className="main-viewport">{children}</main>
      <Footer />
    </div>
  );
};
