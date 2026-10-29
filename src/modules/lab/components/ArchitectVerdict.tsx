import React from 'react';
import { MissionEvaluationResult } from '../../../types/mission';
import { PixelBadge } from '../../../components/common/PixelBadge';
import { PixelButton } from '../../../components/common/PixelButton';
import { PixelCard } from '../../../components/common/PixelCard';

interface ArchitectVerdictProps {
  result: MissionEvaluationResult;
  onReset: () => void;
}

export const ArchitectVerdict: React.FC<ArchitectVerdictProps> = ({ result, onReset }) => {
  return (
    <PixelCard
      className={`verdict-panel ${result.passed ? 'verdict-panel--passed' : 'verdict-panel--failed'}`}
      role="region"
      aria-labelledby="verdict-heading"
    >
      {/* Verdict Header */}
      <div className="verdict-header">
        <div>
          <PixelBadge variant={result.passed ? 'success' : 'copper'}>
            {result.passed ? 'VEREDITO: APROVADO NA FORJA' : 'VEREDITO: REQUER AJUSTES'}
          </PixelBadge>
          <h2
            id="verdict-heading"
            className={`verdict-title font-epic ${result.passed ? 'verdict-title--passed' : 'verdict-title--failed'}`}
          >
            {result.verdictTitle}
          </h2>
          <p className="verdict-summary">{result.verdictDescription}</p>
        </div>

        <PixelButton variant={result.passed ? 'gold' : 'runic'} size="sm" onClick={onReset}>
          Ajustar Arquitetura ↺
        </PixelButton>
      </div>

      {/* Requirements Checklist */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="font-epic" style={{ fontSize: '1rem', color: 'var(--gold-bright)', marginBottom: 'var(--space-3)' }}>
          Auditoria de Requisitos Mandatórios:
        </h3>
        <div className="verdict-checklist">
          {result.requirements.map((req) => (
            <div
              key={req.id}
              className={`verdict-req-item ${req.satisfied ? 'verdict-req-item--passed' : 'verdict-req-item--failed'}`}
            >
              <div className="verdict-req-header">
                <span className="verdict-req-title">{req.title}</span>
                <PixelBadge variant={req.satisfied ? 'success' : 'copper'}>
                  {req.satisfied ? '✓ ATENDIDO' : '✕ NÃO ATENDIDO'}
                </PixelBadge>
              </div>
              <p className="verdict-req-explanation">{req.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Identified Issues */}
      {result.identifiedIssues.length > 0 && (
        <div className="verdict-issues-box">
          <h3 className="verdict-issues-title">
            <span aria-hidden="true">⚠️</span> Inconsistências &amp; Anti-Patterns Identificados:
          </h3>
          <ul className="verdict-issues-list">
            {result.identifiedIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Unnecessary Services */}
      {result.unnecessaryServices.length > 0 && (
        <div className="verdict-issues-box" style={{ background: 'rgba(180, 90, 42, 0.1)', borderColor: 'var(--copper-dim)', borderLeftColor: 'var(--copper-bright)' }}>
          <h3 className="verdict-issues-title" style={{ color: 'var(--copper-bright)' }}>
            <span aria-hidden="true">🧱</span> Serviços com Complexidade Desnecessária:
          </h3>
          <ul className="verdict-issues-list" style={{ color: 'var(--text-secondary)' }}>
            {result.unnecessaryServices.map((svc, idx) => (
              <li key={idx}>
                <strong>{svc}</strong>: Adiciona complexidade de configuração e manutenção sem benefício técnico para o objetivo da missão.
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h3 className="font-epic" style={{ fontSize: '0.95rem', color: 'var(--gold-bright)', marginBottom: 'var(--space-2)' }}>
            Recomendações de Engenharia:
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
            {result.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Well-Architected Framework Pillars Strip */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="font-epic" style={{ fontSize: '1rem', color: 'var(--runic-bright)', marginBottom: 'var(--space-3)' }}>
          Análise nos Pilares do AWS Well-Architected Framework:
        </h3>
        <div className="verdict-pillars-grid">
          {result.pillars.map((pillar) => (
            <div
              key={pillar.pillar}
              className={`verdict-pillar-card verdict-pillar-card--${pillar.status}`}
            >
              <div className="verdict-pillar-name">
                <span>{pillar.pillarLabel}</span>
                <PixelBadge
                  variant={
                    pillar.status === 'aligned'
                      ? 'success'
                      : pillar.status === 'improvement-needed'
                      ? 'gold'
                      : 'copper'
                  }
                >
                  {pillar.status === 'aligned'
                    ? 'Alinhado'
                    : pillar.status === 'improvement-needed'
                    ? 'Ajustes'
                    : 'Crítico'}
                </PixelBadge>
              </div>
              <p className="verdict-pillar-desc">{pillar.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SAA-C03 Takeaways */}
      <div className="verdict-takeaways-box">
        <h3 className="verdict-takeaways-title">
          <span aria-hidden="true">💡</span> Lições Fundamentais para a Certificação SAA-C03:
        </h3>
        <ul className="verdict-takeaways-list">
          {result.saaC03Takeaways.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </PixelCard>
  );
};
