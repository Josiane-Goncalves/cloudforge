import React from 'react';
import { AppView } from '../../types/navigation';
import { PixelBadge } from '../../components/common/PixelBadge';
import { PixelButton } from '../../components/common/PixelButton';
import { PixelCard } from '../../components/common/PixelCard';

interface HomePageProps {
  onNavigate: (view: AppView) => void;
}

const WELL_ARCHITECTED_PILLARS = [
  {
    name: 'Segurança',
    subtitle: 'Security',
    icon: '🛡️',
    description: 'Privilégio mínimo com IAM, criptografia com KMS e proteção de borda com WAF.',
  },
  {
    name: 'Confiabilidade',
    subtitle: 'Reliability',
    icon: '⚡',
    description: 'Resiliência multi-AZ, failover automatizado no Route 53 e desacoplamento de carga.',
  },
  {
    name: 'Eficiência de Performance',
    subtitle: 'Performance',
    icon: '🚀',
    description: 'Cache global via CloudFront, latência ultra-baixa com DynamoDB e escalabilidade serverless.',
  },
  {
    name: 'Otimização de Custos',
    subtitle: 'Cost Optimization',
    icon: '⚖️',
    description: 'Eliminação de capacidade ociosa, sizing adequado e precificação sob demanda.',
  },
  {
    name: 'Excelência Operacional',
    subtitle: 'Operational',
    icon: '📜',
    description: 'Infraestrutura automatizada, telemetria contínua e evolução arquitetural padronizada.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="home-view">
      {/* Hero Sanctum Banner */}
      <section className="home-hero pixel-card pixel-card--bordered">
        <div className="home-hero__content">
          <div className="home-hero__badge">
            <PixelBadge variant="gold">SANCTUM DO ARQUITETO • SAA-C03</PixelBadge>
          </div>
          <h1 className="home-hero__title">
            Forge Arquiteturas Resilientes na Nuvem
          </h1>
          <p className="home-hero__subtitle">
            Aprenda a selecionar, combinar e defender decisões arquiteturais com base nos padrões
            reais do <strong>AWS Well-Architected Framework</strong>. Treine o raciocínio prático
            exigido na certificação <em>Solutions Architect – Associate</em>.
          </p>
          <div className="home-hero__actions">
            <PixelButton variant="gold" onClick={() => onNavigate('lab')}>
              Iniciar Missões no Lab
            </PixelButton>
            <PixelButton variant="runic" onClick={() => onNavigate('codex')}>
              Consultar Codex de Serviços
            </PixelButton>
          </div>
        </div>
      </section>

      {/* Feature Portals / Navigation Cards */}
      <section className="grid-cols-3" aria-label="Módulos da Forja">
        {/* Portal 1: Codex */}
        <PixelCard variant="runic" className="portal-card">
          <div>
            <div className="portal-card__header">
              <PixelBadge variant="cyan">ARSENAL</PixelBadge>
              <span className="font-pixel text-muted" style={{ fontSize: '0.7rem' }}>01</span>
            </div>
            <h2 className="portal-card__title text-cyan">Codex of Services</h2>
            <p className="portal-card__desc">
              Grimório técnico com os 13 serviços fundamentais do MVP organizados por categoria.
              Casos de uso canônicos, pegadinhas frequentes de prova e referências oficiais.
            </p>
          </div>
          <div className="portal-card__footer">
            <PixelButton
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('codex')}
              style={{ width: '100%' }}
            >
              Abrir Grimório →
            </PixelButton>
          </div>
        </PixelCard>

        {/* Portal 2: Architecture Lab */}
        <PixelCard variant="gold" className="portal-card">
          <div>
            <div className="portal-card__header">
              <PixelBadge variant="gold">BANCADA</PixelBadge>
              <span className="font-pixel text-muted" style={{ fontSize: '0.7rem' }}>02</span>
            </div>
            <h2 className="portal-card__title text-gold">Architecture Lab</h2>
            <p className="portal-card__desc">
              Enfrente desafios arquiteturais baseados em cenários reais de negócio. Combine componentes em camadas
              e submeta sua solução para avaliação técnica determinística.
            </p>
          </div>
          <div className="portal-card__footer">
            <PixelButton
              variant="gold"
              size="sm"
              onClick={() => onNavigate('lab')}
              style={{ width: '100%' }}
            >
              Acessar Bancada →
            </PixelButton>
          </div>
        </PixelCard>

        {/* Portal 3: Progress & Review */}
        <PixelCard className="portal-card">
          <div>
            <div className="portal-card__header">
              <PixelBadge variant="copper">HISTÓRICO</PixelBadge>
              <span className="font-pixel text-muted" style={{ fontSize: '0.7rem' }}>03</span>
            </div>
            <h2 className="portal-card__title text-copper">Architect&apos;s Record</h2>
            <p className="portal-card__desc">
              Acompanhe sua evolução na forja, insígnias de domínio, pontuações Well-Architected
              e prontidão para o exame SAA-C03 guardadas no seu navegador.
            </p>
          </div>
          <div className="portal-card__footer">
            <PixelButton
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('progress')}
              style={{ width: '100%' }}
            >
              Ver Estatísticas →
            </PixelButton>
          </div>
        </PixelCard>
      </section>

      {/* Well-Architected Pillars Section */}
      <section className="pillars-section" aria-labelledby="pillars-heading">
        <div className="pillars-section__header">
          <div className="rune-divider">
            <span className="font-pixel" style={{ fontSize: '0.75rem' }}>◆ OS CINCO PILARES DA FORJA ◆</span>
          </div>
          <h2 id="pillars-heading" className="pillars-section__title">
            Fundamentos do AWS Well-Architected Framework
          </h2>
        </div>

        <div className="pillars-grid">
          {WELL_ARCHITECTED_PILLARS.map((pillar) => (
            <div key={pillar.name} className="pillar-card">
              <span className="pillar-card__icon" aria-hidden="true">{pillar.icon}</span>
              <h3 className="pillar-card__name">{pillar.name}</h3>
              <p className="pillar-card__desc">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
