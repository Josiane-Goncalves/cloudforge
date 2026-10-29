import React from 'react';
import { MISSION_001_DATA } from '../../../data/missions/mission001';
import { PixelBadge } from '../../../components/common/PixelBadge';
import { PixelCard } from '../../../components/common/PixelCard';

export const MissionBriefing: React.FC = () => {
  return (
    <PixelCard className="lab-briefing-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <h2 className="lab-section-title" style={{ margin: 0 }}>
          <span aria-hidden="true">📜</span> Briefing Estratégico da Missão
        </h2>
        <PixelBadge variant="gold">{MISSION_001_DATA.difficulty}</PixelBadge>
      </div>

      <div className="lab-briefing__scenario">
        <strong>Cenário:</strong> {MISSION_001_DATA.scenario}
      </div>

      <div>
        <h3 className="font-epic" style={{ fontSize: '0.95rem', color: 'var(--gold-bright)', marginBottom: 'var(--space-2)' }}>
          Requisitos Arquiteturais Mandatórios:
        </h3>
        <div className="lab-requirements-grid">
          {MISSION_001_DATA.requirements.map((req, index) => (
            <div key={req.id} className="lab-req-card">
              <span className="lab-req-card__title">
                <span className="font-pixel text-muted" style={{ fontSize: '0.7rem' }}>
                  0{index + 1}
                </span>
                {req.title}
              </span>
              <p className="lab-req-card__desc">{req.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lab-constraints">
        <span className="lab-constraints__title">Restrições e Condições de Contorno:</span>
        <ul className="lab-constraints__list">
          {MISSION_001_DATA.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </PixelCard>
  );
};
