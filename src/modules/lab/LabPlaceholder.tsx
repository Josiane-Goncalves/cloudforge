import React from 'react';
import { PixelBadge } from '../../components/common/PixelBadge';
import { PixelCard } from '../../components/common/PixelCard';

const MISSIONS_PREVIEW = [
  {
    title: 'Missão 01: Global Static Website',
    difficulty: 'Apprentice',
    badgeVariant: 'cyan' as const,
    summary: 'Distribuir ativos estáticos com ultra-baixa latência global, terminação TLS e S3 bucket protegido sem acesso público direto.',
    keyServices: ['Amazon CloudFront', 'Amazon S3', 'Amazon Route 53', 'AWS Certificate Manager'],
  },
  {
    title: 'Missão 02: Highly Available Web App',
    difficulty: 'Journeyman',
    badgeVariant: 'gold' as const,
    summary: 'Projetar camada web resiliente a falhas de zona (AZ), com balanceador de carga em subnets públicas, instâncias privadas e banco relacional multi-AZ.',
    keyServices: ['Amazon VPC', 'Elastic Load Balancing', 'Amazon EC2', 'Amazon RDS'],
  },
  {
    title: 'Missão 03: Event-Driven Image Processing',
    difficulty: 'Master',
    badgeVariant: 'copper' as const,
    summary: 'Arquitetura assíncrona orientada a eventos para upload, redimensionamento em pipeline serverless e indexação de metadados com zero servidores provisionados.',
    keyServices: ['Amazon S3', 'AWS Lambda', 'Amazon DynamoDB', 'AWS IAM'],
  },
];

export const LabPlaceholder: React.FC = () => {
  return (
    <div className="placeholder-view">
      <header className="placeholder-header">
        <div className="placeholder-header__badge">
          <PixelBadge variant="gold">MÓDULO EM PREPARAÇÃO • ETAPA 3</PixelBadge>
        </div>
        <h1 className="placeholder-header__title">Architecture Lab</h1>
        <p className="placeholder-header__desc">
          A bancada da forja permitirá selecionar componentes do arsenal, organizá-los por camadas
          de responsabilidade arquitetural e submeter a solução para avaliação determinística.
        </p>
      </header>

      <PixelCard className="placeholder-panel">
        <h2 className="font-epic" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>
          Missões Iniciais do MVP em Preparação
        </h2>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          Cenários modelados diretamente a partir dos domínios mais cobrados no exame de Arquiteto Associado:
        </p>

        <div className="placeholder-grid">
          {MISSIONS_PREVIEW.map((mission) => (
            <div key={mission.title} className="placeholder-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="placeholder-item__title" style={{ fontSize: '0.95rem' }}>{mission.title}</span>
                <PixelBadge variant={mission.badgeVariant}>{mission.difficulty}</PixelBadge>
              </div>
              <p className="placeholder-item__text" style={{ marginBottom: '12px' }}>
                {mission.summary}
              </p>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  COMPONENTES CHAVE:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {mission.keyServices.map((svc) => (
                    <span
                      key={svc}
                      style={{
                        fontSize: '0.75rem',
                        padding: '2px 6px',
                        background: 'var(--bg-panel)',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="placeholder-callout">
          <span className="placeholder-callout__icon" aria-hidden="true">⚙</span>
          <div className="placeholder-callout__text">
            <strong>Bancada Determinística:</strong> No MVP, as missões avaliam seleções por camadas
            (Edge / DNS, Compute, Storage / Database, Security). A validação em código puro conferirá
            compatibilidade, requisitos de SLA e regras de Well-Architected sem custos de nuvem ou chamadas de API.
          </div>
        </div>
      </PixelCard>
    </div>
  );
};
