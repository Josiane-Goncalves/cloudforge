import React from 'react';
import { PixelBadge } from '../../components/common/PixelBadge';
import { PixelCard } from '../../components/common/PixelCard';

export const ProgressPlaceholder: React.FC = () => {
  return (
    <div className="placeholder-view">
      <header className="placeholder-header">
        <div className="placeholder-header__badge">
          <PixelBadge variant="copper">MÓDULO EM PREPARAÇÃO • ETAPA 5</PixelBadge>
        </div>
        <h1 className="placeholder-header__title">Architect&apos;s Record</h1>
        <p className="placeholder-header__desc">
          Registro de evolução pessoal, domínio das categorias de serviços e histórico de submissões
          armazenado 100% no navegador via localStorage.
        </p>
      </header>

      <div className="grid-cols-2">
        <PixelCard variant="gold" className="placeholder-panel">
          <h2 className="font-epic" style={{ fontSize: '1.15rem', marginBottom: 'var(--space-2)' }}>
            Status Atual do Arquiteto
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--gold-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              🔨
            </div>
            <div>
              <span className="font-epic" style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', display: 'block' }}>
                Apprentice Forger
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Nível 1 • Recém-chegado à Forja
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Missões Concluídas</span>
                <span className="font-mono text-gold">0 / 3</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)' }}>
                <div style={{ width: '0%', height: '100%', background: 'var(--gold-primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Serviços Dominados</span>
                <span className="font-mono text-cyan">0 / 13</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)' }}>
                <div style={{ width: '0%', height: '100%', background: 'var(--runic-cyan)' }} />
              </div>
            </div>
          </div>
        </PixelCard>

        <PixelCard className="placeholder-panel">
          <h2 className="font-epic" style={{ fontSize: '1.15rem', marginBottom: 'var(--space-2)' }}>
            Persistência &amp; Dados Locais
          </h2>
          <p className="text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
            O CloudForge não utiliza banco de dados remoto nem coleta telemetria pessoal.
            Seu progresso é gravado localmente no seu dispositivo.
          </p>

          <div className="placeholder-callout" style={{ marginTop: '16px' }}>
            <span className="placeholder-callout__icon" aria-hidden="true">💾</span>
            <div className="placeholder-callout__text" style={{ fontSize: '0.85rem' }}>
              <strong>Zero Backend / Zero Auth:</strong> Nas próximas etapas, você terá opções para
              fazer download do seu progresso em JSON (backup) ou resetar seus dados quando desejar recomeçar o treinamento.
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};
