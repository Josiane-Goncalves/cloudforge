import React from 'react';
import { AwsService } from '../../../types/service';
import { CATEGORY_LABELS, getServiceById } from '../../../data/services';
import { PixelBadge } from '../../../components/common/PixelBadge';
import { PixelButton } from '../../../components/common/PixelButton';
import { PixelCard } from '../../../components/common/PixelCard';

interface ServiceCardProps {
  service: AwsService;
  onInspect: (service: AwsService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onInspect }) => {
  return (
    <PixelCard variant="default" className="service-card">
      <div>
        <div className="service-card__header">
          <PixelBadge variant="cyan">{CATEGORY_LABELS[service.category]}</PixelBadge>
          <span className="font-pixel text-muted" style={{ fontSize: '0.65rem' }}>
            SAA-C03
          </span>
        </div>
        <h2 className="service-card__title font-epic">{service.name}</h2>
        <p className="service-card__summary">{service.summary}</p>
      </div>

      <div className="service-card__relations-preview">
        {service.relatedServices.length > 0 && (
          <div>
            <span className="service-card__relations-title font-pixel">
              Integrações Canônicas:
            </span>
            <div className="service-card__relations-list">
              {service.relatedServices.map((rel) => {
                const targetService = getServiceById(rel.serviceId);
                const shortLabel = targetService
                  ? targetService.name.split(' (')[0]
                  : rel.serviceId;
                return (
                  <PixelBadge key={rel.serviceId} variant="default">
                    {shortLabel}
                  </PixelBadge>
                );
              })}
            </div>
          </div>
        )}

        <div className="service-card__footer">
          <PixelButton
            variant="gold"
            size="sm"
            onClick={() => onInspect(service)}
            style={{ width: '100%' }}
          >
            Consultar Códice →
          </PixelButton>
        </div>
      </div>
    </PixelCard>
  );
};
