import React from 'react';
import { Mission001Config } from '../../../types/mission';
import { PixelBadge } from '../../../components/common/PixelBadge';
import { PixelCard } from '../../../components/common/PixelCard';

interface ArchitectureDiagramProps {
  selectedServiceIds: string[];
  config: Mission001Config;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  selectedServiceIds,
  config,
}) => {
  const hasS3 = selectedServiceIds.includes('amazon-s3');
  const hasCloudFront = selectedServiceIds.includes('amazon-cloudfront');
  const hasVpc = selectedServiceIds.includes('amazon-vpc');

  const isHttpsSecure =
    config.cloudfrontViewerProtocolPolicy === 'redirect-to-https' ||
    config.cloudfrontViewerProtocolPolicy === 'https-only';

  const isOacAligned =
    config.cloudfrontOacEnabled === true &&
    config.s3BucketPolicy === 'oac-statement' &&
    config.s3OriginType === 's3-rest';

  const isBucketPublic =
    config.s3BlockPublicAccess === false ||
    config.s3BucketPolicy === 'public-read-statement' ||
    config.s3OriginType === 's3-website';

  return (
    <PixelCard className="diagram-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <h2 className="lab-section-title" style={{ margin: 0 }}>
          <span aria-hidden="true">🗺️</span> Mapa Esquemático da Arquitetura
        </h2>
        <PixelBadge variant="cyan">Esquema Reativo</PixelBadge>
      </div>
      <p className="lab-section-desc">
        Visualização em tempo real do fluxo de requisições e dos limites de segurança configurados:
      </p>

      <div className="diagram-stage">
        {/* Node 1: Visitor / User */}
        <div className="diagram-node diagram-node--cyan">
          <div className="diagram-node__header">
            <h4 className="diagram-node__title">Visitante Global</h4>
            <span aria-hidden="true">🌐</span>
          </div>
          <span className="diagram-node__status">Navegador do usuário final em qualquer continente.</span>
        </div>

        {/* Connector 1: Visitor -> CloudFront (or directly to S3) */}
        {hasCloudFront ? (
          <div className="diagram-connector">
            <span className="diagram-connector__arrow" aria-hidden="true">➔</span>
            <PixelBadge variant={isHttpsSecure ? 'success' : 'copper'}>
              {isHttpsSecure
                ? config.cloudfrontViewerProtocolPolicy === 'redirect-to-https'
                  ? 'HTTPS (Redirect)'
                  : 'HTTPS Only'
                : 'Inseguro (HTTP Permitido)'}
            </PixelBadge>
          </div>
        ) : (
          <div className="diagram-connector">
            <span className="diagram-connector__arrow" aria-hidden="true" style={{ color: 'var(--copper-bright)' }}>
              ➔➔➔
            </span>
            <PixelBadge variant="copper">Alta Latência (Sem CDN)</PixelBadge>
          </div>
        )}

        {/* Node 2: Amazon CloudFront (if selected) */}
        {hasCloudFront ? (
          <div className={`diagram-node ${isHttpsSecure ? 'diagram-node--gold' : 'diagram-node--warning'}`}>
            <div className="diagram-node__header">
              <h4 className="diagram-node__title">Amazon CloudFront</h4>
              <span aria-hidden="true">⚡</span>
            </div>
            <div className="diagram-node__badge">
              <PixelBadge variant="gold">Edge Locations</PixelBadge>
            </div>
            <span className="diagram-node__status">
              Distribuição global (*.cloudfront.net) com cache na borda.
            </span>
          </div>
        ) : (
          <div className="diagram-node diagram-node--disabled">
            <div className="diagram-node__header">
              <h4 className="diagram-node__title">CDN Ausente</h4>
              <span aria-hidden="true">⚠️</span>
            </div>
            <span className="diagram-node__status text-muted">
              Sem camada de borda para cache ou aceleração de entrega.
            </span>
          </div>
        )}

        {/* Connector 2: CloudFront -> S3 Bucket */}
        {hasCloudFront && hasS3 && (
          <div className="diagram-connector">
            <span className="diagram-connector__arrow" aria-hidden="true">➔</span>
            <PixelBadge variant={isOacAligned ? 'success' : 'copper'}>
              {isOacAligned
                ? 'Assinatura OAC Válida'
                : config.s3OriginType === 's3-website'
                ? 'Website HTTP (Sem OAC)'
                : 'OAC Incompatível / Inseguro'}
            </PixelBadge>
          </div>
        )}

        {/* Node 3: Amazon S3 (if selected) */}
        {hasS3 ? (
          <div className={`diagram-node ${!isBucketPublic && isOacAligned ? 'diagram-node--gold' : 'diagram-node--warning'}`}>
            <div className="diagram-node__header">
              <h4 className="diagram-node__title">Bucket Amazon S3</h4>
              <span aria-hidden="true">🪣</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <PixelBadge variant={config.s3BlockPublicAccess ? 'success' : 'copper'}>
                {config.s3BlockPublicAccess ? 'BPA Ativado' : 'BPA Desativado'}
              </PixelBadge>
              <PixelBadge variant={config.s3OriginType === 's3-rest' ? 'cyan' : 'copper'}>
                {config.s3OriginType === 's3-rest' ? 'Origem REST' : 'Origem Website'}
              </PixelBadge>
            </div>
            <span className="diagram-node__status">
              {isBucketPublic
                ? 'ALERTA: Armazenamento vulnerável ou exposto publicamente.'
                : 'Armazenamento privado isolado; acesso restrito via Bucket Policy.'}
            </span>
          </div>
        ) : (
          <div className="diagram-node diagram-node--disabled">
            <div className="diagram-node__header">
              <h4 className="diagram-node__title">S3 Ausente</h4>
              <span aria-hidden="true">❌</span>
            </div>
            <span className="diagram-node__status text-muted">
              Nenhum armazenamento selecionado para os arquivos estáticos.
            </span>
          </div>
        )}

        {/* Node 4: Amazon VPC (if selected as unneeded component) */}
        {hasVpc && (
          <div
            className="diagram-node diagram-node--warning"
            style={{ width: '100%', maxWidth: '100%', marginTop: 'var(--space-2)' }}
          >
            <div className="diagram-node__header">
              <h4 className="diagram-node__title">Amazon VPC (Redundante / Desconectada)</h4>
              <PixelBadge variant="copper">Complexidade Não Justificada</PixelBadge>
            </div>
            <span className="diagram-node__status">
              A VPC existe sem integração no fluxo de entrega web. S3 e CloudFront são serviços serverless públicos gerenciados pela AWS que não trafegam dados por subnets privadas de VPC neste cenário.
            </span>
          </div>
        )}
      </div>
    </PixelCard>
  );
};
