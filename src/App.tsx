import React, { useState } from 'react';
import { AppView } from './types/navigation';
import { Layout } from './components/layout/Layout';
import { HomePage } from './modules/home/HomePage';
import { CodexPage } from './modules/codex/CodexPage';
import { LabPage } from './modules/lab/LabPage';
import { ProgressPlaceholder } from './modules/progress/ProgressPlaceholder';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />;
      case 'codex':
        return <CodexPage />;
      case 'lab':
        return <LabPage />;
      case 'progress':
        return <ProgressPlaceholder />;
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderActiveView()}
    </Layout>
  );
};

export default App;
