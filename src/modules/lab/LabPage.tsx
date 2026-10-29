import React, { useState, useRef } from 'react';
import { Mission001Config, MissionEvaluationResult } from '../../types/mission';
import { evaluateMission001 } from '../../engine/mission001Evaluator';
import { MISSION_001_DATA } from '../../data/missions/mission001';
import { PixelBadge } from '../../components/common/PixelBadge';
import { PixelButton } from '../../components/common/PixelButton';
import { MissionBriefing } from './components/MissionBriefing';
import { ServiceArsenal } from './components/ServiceArsenal';
import { ConfigurationForge } from './components/ConfigurationForge';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { ArchitectVerdict } from './components/ArchitectVerdict';

const INITIAL_CONFIG: Mission001Config = {
  s3OriginType: 's3-rest',
  s3BlockPublicAccess: true,
  s3BucketPolicy: 'oac-statement',
  cloudfrontOacEnabled: true,
  cloudfrontViewerProtocolPolicy: 'redirect-to-https',
};

export const LabPage: React.FC = () => {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'amazon-s3',
    'amazon-cloudfront',
  ]);
  const [config, setConfig] = useState<Mission001Config>(INITIAL_CONFIG);
  const [evaluationResult, setEvaluationResult] = useState<MissionEvaluationResult | null>(null);

  const verdictRef = useRef<HTMLDivElement>(null);

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
    // Clear verdict on modification to encourage re-evaluating
    setEvaluationResult(null);
  };

  const handleChangeConfig = (updated: Partial<Mission001Config>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
    setEvaluationResult(null);
  };

  const handleEvaluate = () => {
    const result = evaluateMission001({
      selectedServiceIds,
      config,
    });
    setEvaluationResult(result);

    setTimeout(() => {
      verdictRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setEvaluationResult(null);
  };

  return (
    <div className="lab-view">
      {/* Header */}
      <header className="lab-header">
        <div className="lab-header__badge">
          <PixelBadge variant="gold">{MISSION_001_DATA.code} • SAA-C03 LAB</PixelBadge>
        </div>
        <h1 className="lab-header__title font-epic">{MISSION_001_DATA.title}</h1>
        <p className="lab-header__subtitle">{MISSION_001_DATA.subtitle}</p>
      </header>

      {/* 1. Mission Briefing */}
      <MissionBriefing />

      {/* 2. Service Arsenal Selector */}
      <ServiceArsenal
        selectedServiceIds={selectedServiceIds}
        onToggleService={handleToggleService}
      />

      {/* 3. Configuration Forge */}
      <ConfigurationForge
        selectedServiceIds={selectedServiceIds}
        config={config}
        onChangeConfig={handleChangeConfig}
      />

      {/* 4. Architecture Diagram */}
      <ArchitectureDiagram
        selectedServiceIds={selectedServiceIds}
        config={config}
      />

      {/* 5. Evaluation Action Bar */}
      <div className="lab-actions-bar">
        <PixelButton
          variant="gold"
          onClick={handleEvaluate}
          style={{ minWidth: '240px', padding: 'var(--space-4) var(--space-6)', fontSize: '1rem' }}
        >
          ⚒️ Avaliar Arquitetura na Forja
        </PixelButton>
      </div>

      {/* 6. Architect Verdict Report */}
      <div ref={verdictRef}>
        {evaluationResult && (
          <ArchitectVerdict result={evaluationResult} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};
