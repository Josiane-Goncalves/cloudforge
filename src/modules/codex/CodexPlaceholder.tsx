import React from 'react';
import { PixelBadge } from '../../components/common/PixelBadge';
import { PixelCard } from '../../components/common/PixelCard';

const CATEGORIES_PREVIEW = [
  {
    name: 'Networking & Content Delivery',
    count: '4 Serviços',
    items: ['Amazon VPC', 'Amazon Route 53', 'Amazon CloudFront', 'Elastic Load Balancing (ALB/NLB)'],
  },
  {
    name: 'Security, Identity & Compliance',
    count: '4 Serviços',
    items: ['AWS IAM', 'AWS WAF', 'AWS KMS', 'AWS Certificate Manager (ACM)'],
  },
  {
    name: 'Compute',
    count: '2 Serviços',
    items: ['Amazon EC2', 'AWS Lambda'],
  },
  {
    name: 'Storage',
    count: '1 Serviço',
    items: ['Amazon S3'],
  },
  {
    name: 'Database',
    count: '2 Serviços',
    items: ['Amazon RDS', 'Amazon DynamoDB'],
  },
];

export const CodexPlaceholder: React.FC = () => {
  return (
    <div className="placeholder-view">
      <header className="placeholder-header">
        <div className="placeholder-header__badge">
          <PixelBadge variant="cyan">MÓDULO EM PREPARAÇÃO • ETAPA 2</PixelBadge>
        </div>
        <h1 className="placeholder-header__title">Codex of Services</h1>
        <p className="placeholder-header__desc">
          O grimório técnico de serviços conterá cartões detalhados com propósito arquitetural,
          requisitos do exame SAA-C03, armadilhas comuns e links diretos para a documentação oficial da AWS.
        </p>
      </header>

      <PixelCard className="placeholder-panel">
        <h2 className="font-epic" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>
          Arsenal Inicial do MVP (13 Serviços Mapeados)
        </h2>
        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
          Estrutura de dados preparada para receber o catálogo tipado na próxima etapa de desenvolvimento:
        </p>

        <div className="placeholder-grid">
          {CATEGORIES_PREVIEW.map((cat) => (
            <div key={cat.name} className="placeholder-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="placeholder-item__title">{cat.name}</span>
                <PixelBadge variant="cyan">{cat.count}</PixelBadge>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {cat.items.map((svc) => (
                  <li key={svc} style={{ marginBottom: '4px' }}>{svc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="placeholder-callout">
          <span className="placeholder-callout__icon" aria-hidden="true">ℹ</span>
          <div className="placeholder-callout__text">
            <strong>Foco no SAA-C03:</strong> Nenhum serviço terá conteúdo genérico ou inventado.
            Cada entrada detalhará critérios como <em>Cross-Region Read Replicas vs Multi-AZ</em>,
            <em>Políticas OAC no CloudFront</em> e <em>padrões de criptografia KMS envelope</em>.
          </div>
        </div>
      </PixelCard>
    </div>
  );
};
