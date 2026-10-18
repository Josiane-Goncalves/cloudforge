import React, { useEffect, useRef } from 'react';
import { AwsService } from '../../../types/service';
import { CATEGORY_LABELS, getServiceById } from '../../../data/services';
import { PixelBadge } from '../../../components/common/PixelBadge';
import { PixelButton } from '../../../components/common/PixelButton';

interface ServiceDetailModalProps {
  service: AwsService | null;
  onClose: () => void;
  onSelectRelatedService: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onSelectRelatedService,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (service) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [service]);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
    onClose();
  };

  // Handle native escape cancel event
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
    e.preventDefault();
    handleClose();
  };

  // Close when clicking directly on the backdrop area
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="codex-dialog pixel-card"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      onClose={onClose}
      aria-labelledby={service ? 'codex-dialog-title' : undefined}
    >
      {service && (
        <div className="codex-dialog__inner">
        {/* Header */}
        <div className="codex-dialog__header">
          <div className="codex-dialog__title-area">
            <div>
              <PixelBadge variant="cyan">{CATEGORY_LABELS[service.category]}</PixelBadge>
            </div>
            <h2 id="codex-dialog-title" className="codex-dialog__title font-epic">
              {service.name}
            </h2>
          </div>
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={handleClose}
            aria-label="Fechar códice"
            style={{ minWidth: '32px', padding: '4px 8px' }}
          >
            ✕
          </PixelButton>
        </div>

        {/* Content Body */}
        <div className="codex-dialog__body">
          {/* Summary & Purpose */}
          <section>
            <h3 className="codex-section__title">
              <span aria-hidden="true">📜</span> Finalidade Arquitetural
            </h3>
            <p className="codex-section__text">{service.purpose}</p>
          </section>

          {/* When to use */}
          <section>
            <h3 className="codex-section__title">
              <span aria-hidden="true">🎯</span> Quando Utilizar
            </h3>
            <ul className="codex-list">
              {service.whenToUse.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Use cases */}
          <section>
            <h3 className="codex-section__title">
              <span aria-hidden="true">🛠️</span> Exemplos Práticos de Utilização
            </h3>
            <ul className="codex-list">
              {service.useCases.map((useCase, idx) => (
                <li key={idx}>{useCase}</li>
              ))}
            </ul>
          </section>

          {/* Limitations and caveats */}
          <section>
            <div className="codex-callout-warning">
              <h3
                className="codex-section__title"
                style={{ color: 'var(--copper-bright)', marginBottom: '8px' }}
              >
                <span aria-hidden="true">⚠️</span> Limitações Técnicas &amp; Cuidados no SAA-C03
              </h3>
              <ul className="codex-list">
                {service.limitationsAndCaveats.map((caveat, idx) => (
                  <li key={idx}>{caveat}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Related services */}
          {service.relatedServices.length > 0 && (
            <section>
              <h3 className="codex-section__title">
                <span aria-hidden="true">🔗</span> Relacionamentos &amp; Integrações Técnicas
              </h3>
              <div className="codex-related-grid">
                {service.relatedServices.map((rel) => {
                  const targetService = getServiceById(rel.serviceId);
                  const displayName = targetService ? targetService.name : rel.serviceId;

                  return (
                    <div key={rel.serviceId} className="codex-related-card">
                      <div className="codex-related-card__header">
                        <span className="codex-related-card__name">
                          {displayName}
                        </span>
                        {targetService && (
                          <PixelBadge variant="gold">
                            {CATEGORY_LABELS[targetService.category]}
                          </PixelBadge>
                        )}
                      </div>
                      <p className="codex-related-card__context">{rel.context}</p>
                      <div className="codex-related-card__actions">
                        {targetService && (
                          <PixelButton
                            variant="runic"
                            size="sm"
                            onClick={() => onSelectRelatedService(rel.serviceId)}
                          >
                            Inspecionar {targetService.id.toUpperCase()} →
                          </PixelButton>
                        )}
                        {rel.docsUrl && (
                          <a
                            href={rel.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="codex-link-external"
                          >
                            Guia de Integração AWS ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="codex-dialog__footer">
          <a
            href={service.officialDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="codex-link-external"
          >
            <span>📖 Documentação Oficial na AWS</span>
            <span aria-hidden="true">↗</span>
          </a>
          <PixelButton variant="ghost" size="sm" onClick={handleClose}>
            Fechar Códice
          </PixelButton>
        </div>
      </div>
      )}
    </dialog>
  );
};
