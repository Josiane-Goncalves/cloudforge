import React from 'react';
import { MISSION_001_DATA } from '../../../data/missions/mission001';
import { getServiceById, CATEGORY_LABELS } from '../../../data/services';
import { PixelBadge } from '../../../components/common/PixelBadge';

interface ServiceArsenalProps {
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
}

export const ServiceArsenal: React.FC<ServiceArsenalProps> = ({
  selectedServiceIds,
  onToggleService,
}) => {
  return (
    <section aria-labelledby="arsenal-heading">
      <h2 id="arsenal-heading" className="lab-section-title">
        <span aria-hidden="true">⚔️</span> Arsenal de Serviços Candidatos
      </h2>
      <p className="lab-section-desc">
        Selecione os blocos de construção que farão parte da sua proposta arquitetural para resolver a missão:
      </p>

      <div className="arsenal-grid">
        {MISSION_001_DATA.candidateServiceIds.map((serviceId) => {
          const service = getServiceById(serviceId);
          if (!service) return null;

          const isSelected = selectedServiceIds.includes(serviceId);

          return (
            <div
              key={service.id}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              className={`arsenal-card ${isSelected ? 'arsenal-card--selected' : ''}`}
              onClick={() => onToggleService(service.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onToggleService(service.id);
                }
              }}
            >
              <div>
                <div className="arsenal-card__header">
                  <PixelBadge variant="cyan">{CATEGORY_LABELS[service.category]}</PixelBadge>
                  <div className="arsenal-checkbox" aria-hidden="true">
                    {isSelected ? '✓' : ''}
                  </div>
                </div>
                <h3 className="arsenal-card__title">{service.name}</h3>
                <p className="arsenal-card__desc">{service.summary}</p>
              </div>

              <div style={{ marginTop: 'var(--space-2)' }}>
                <span className="font-pixel text-muted" style={{ fontSize: '0.65rem' }}>
                  {isSelected ? 'SELECIONADO NA BANCADA' : 'CLIQUE PARA ADICIONAR'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
