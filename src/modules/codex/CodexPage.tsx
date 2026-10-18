import React, { useState } from 'react';
import { AwsCategory, AwsService } from '../../types/service';
import {
  CATEGORY_LABELS,
  SERVICES,
  filterServices,
  getServiceById,
} from '../../data/services';
import { PixelBadge } from '../../components/common/PixelBadge';
import { PixelButton } from '../../components/common/PixelButton';
import { ServiceCard } from './components/ServiceCard';
import { ServiceDetailModal } from './components/ServiceDetailModal';

export const CodexPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AwsCategory | 'all'>('all');
  const [selectedService, setSelectedService] = useState<AwsService | null>(null);

  const filteredServices = filterServices(SERVICES, searchQuery, selectedCategory);

  const availableCategories: AwsCategory[] = [
    'networking-delivery',
    'security-identity',
    'storage',
  ];

  const handleSelectRelatedService = (serviceId: string) => {
    const targetService = getServiceById(serviceId);
    if (targetService) {
      setSelectedService(targetService);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="codex-view">
      {/* Header */}
      <header className="codex-header">
        <div className="codex-header__badge">
          <PixelBadge variant="gold">BIBLIOTECA TÉCNICA SAA-C03</PixelBadge>
        </div>
        <h1 className="codex-header__title font-epic">Codex of Services</h1>
        <p className="codex-header__desc">
          Explore as especificações canônicas, finalidades práticas, limitações e relacionamentos
          técnicos fundamentais para a arquitetura de soluções na AWS.
        </p>
      </header>

      {/* Search and Filters Controls */}
      <section className="codex-controls" aria-label="Filtros do Codex">
        <div className="codex-search-wrapper">
          <span className="codex-search-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            className="codex-search-input"
            placeholder="Pesquisar serviço por nome ou finalidade (ex: VPC, S3, OAC, IAM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Pesquisar serviços AWS"
          />
        </div>

        {/* Categories Pills */}
        <div className="codex-categories" role="group" aria-label="Filtrar por categoria">
          <PixelButton
            variant={selectedCategory === 'all' ? 'active' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Todas ({SERVICES.length})
          </PixelButton>

          {availableCategories.map((cat) => {
            const count = SERVICES.filter((s) => s.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <PixelButton
                key={cat}
                variant={isActive ? 'active' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {CATEGORY_LABELS[cat]} ({count})
              </PixelButton>
            );
          })}
        </div>
      </section>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <section className="codex-grid" aria-label="Lista de serviços">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onInspect={(svc) => setSelectedService(svc)}
            />
          ))}
        </section>
      ) : (
        <div className="codex-empty pixel-card">
          <h3 className="font-epic" style={{ color: 'var(--copper-bright)', marginBottom: '8px' }}>
            Nenhum serviço encontrado no grimório
          </h3>
          <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
            Nenhum registro correspondeu aos termos de busca ou categoria selecionada.
          </p>
          <PixelButton variant="gold" size="sm" onClick={handleClearFilters}>
            Limpar Busca e Filtros
          </PixelButton>
        </div>
      )}

      {/* Native HTML5 <dialog> Details Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSelectRelatedService={handleSelectRelatedService}
      />
    </div>
  );
};
