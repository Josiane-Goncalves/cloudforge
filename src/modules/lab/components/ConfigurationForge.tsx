import React from 'react';
import {
  Mission001Config,
} from '../../../types/mission';
import { PixelBadge } from '../../../components/common/PixelBadge';
import { PixelCard } from '../../../components/common/PixelCard';

interface ConfigurationForgeProps {
  selectedServiceIds: string[];
  config: Mission001Config;
  onChangeConfig: (updated: Partial<Mission001Config>) => void;
}

export const ConfigurationForge: React.FC<ConfigurationForgeProps> = ({
  selectedServiceIds,
  config,
  onChangeConfig,
}) => {
  const hasS3 = selectedServiceIds.includes('amazon-s3');
  const hasCloudFront = selectedServiceIds.includes('amazon-cloudfront');
  const hasVpc = selectedServiceIds.includes('amazon-vpc');
  const hasIam = selectedServiceIds.includes('aws-iam');

  if (selectedServiceIds.length === 0) {
    return (
      <PixelCard className="forge-panel">
        <h2 className="lab-section-title">
          <span aria-hidden="true">⚙️</span> Forja de Configurações Técnicas
        </h2>
        <p className="text-secondary" style={{ fontSize: '0.9rem', margin: 0 }}>
          Selecione ao menos um serviço no Arsenal acima para desbloquear as opções de configuração arquitetural.
        </p>
      </PixelCard>
    );
  }

  return (
    <PixelCard className="forge-panel">
      <h2 className="lab-section-title">
        <span aria-hidden="true">⚙️</span> Forja de Configurações Técnicas
      </h2>
      <p className="lab-section-desc">
        Ajuste as propriedades críticas de cada serviço selecionado para atender aos requisitos de segurança, protocolo e isolamento:
      </p>

      <div className="forge-sections-grid">
        {/* Amazon S3 Configurations */}
        {hasS3 && (
          <div className="forge-box">
            <h3 className="forge-box__title">
              <span>Amazon S3</span>
              <PixelBadge variant="gold">Armazenamento</PixelBadge>
            </h3>

            {/* S3 Origin Type */}
            <div className="forge-field">
              <span className="forge-label">Tipo de Origem S3:</span>
              <div className="forge-radio-group">
                <label className={`forge-radio-option ${config.s3OriginType === 's3-rest' ? 'forge-radio-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="s3OriginType"
                    value="s3-rest"
                    checked={config.s3OriginType === 's3-rest'}
                    onChange={() => onChangeConfig({ s3OriginType: 's3-rest' })}
                  />
                  <div>
                    <span className="forge-radio-label-text">REST Endpoint (Padrão S3 API)</span>
                    <span className="forge-radio-desc">
                      Compatível com autenticação de assinatura OAC e isolamento de rede privado.
                    </span>
                  </div>
                </label>

                <label className={`forge-radio-option ${config.s3OriginType === 's3-website' ? 'forge-radio-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="s3OriginType"
                    value="s3-website"
                    checked={config.s3OriginType === 's3-website'}
                    onChange={() => onChangeConfig({ s3OriginType: 's3-website' })}
                  />
                  <div>
                    <span className="forge-radio-label-text">Website Endpoint (Static Website Hosting)</span>
                    <span className="forge-radio-desc">
                      Atua como servidor HTTP externo público; incompatível com OAC.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* S3 Block Public Access */}
            <div className="forge-field">
              <span className="forge-label">Proteção de Borda S3:</span>
              <label className={`forge-toggle ${config.s3BlockPublicAccess ? 'forge-toggle--active' : ''}`}>
                <div>
                  <span className="forge-radio-label-text">S3 Block Public Access (BPA)</span>
                  <span className="forge-radio-desc">
                    {config.s3BlockPublicAccess
                      ? 'ATIVADO: Bloqueia leitura pública direta e anônima aos objetos do bucket.'
                      : 'DESATIVADO: Permite potencial exposição pública direta dos arquivos.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.s3BlockPublicAccess ?? false}
                  onChange={(e) => onChangeConfig({ s3BlockPublicAccess: e.target.checked })}
                />
              </label>
            </div>

            {/* S3 Bucket Policy */}
            <div className="forge-field">
              <span className="forge-label">Bucket Policy (Autorização de Acesso):</span>
              <div className="forge-radio-group">
                <label className={`forge-radio-option ${config.s3BucketPolicy === 'oac-statement' ? 'forge-radio-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="s3BucketPolicy"
                    value="oac-statement"
                    checked={config.s3BucketPolicy === 'oac-statement'}
                    onChange={() => onChangeConfig({ s3BucketPolicy: 'oac-statement' })}
                  />
                  <div>
                    <span className="forge-radio-label-text">Política Restrita a OAC (cloudfront.amazonaws.com)</span>
                    <span className="forge-radio-desc">
                      Permite leitura apenas para requisições assinadas pela distribuição CloudFront (SourceArn).
                    </span>
                  </div>
                </label>

                <label className={`forge-radio-option ${config.s3BucketPolicy === 'public-read-statement' ? 'forge-radio-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="s3BucketPolicy"
                    value="public-read-statement"
                    checked={config.s3BucketPolicy === 'public-read-statement'}
                    onChange={() => onChangeConfig({ s3BucketPolicy: 'public-read-statement' })}
                  />
                  <div>
                    <span className="forge-radio-label-text">Política de Leitura Pública Aberta (Principal: *)</span>
                    <span className="forge-radio-desc">
                      Concede s3:GetObject para qualquer usuário anônimo na internet.
                    </span>
                  </div>
                </label>

                <label className={`forge-radio-option ${config.s3BucketPolicy === 'none' ? 'forge-radio-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="s3BucketPolicy"
                    value="none"
                    checked={config.s3BucketPolicy === 'none'}
                    onChange={() => onChangeConfig({ s3BucketPolicy: 'none' })}
                  />
                  <div>
                    <span className="forge-radio-label-text">Nenhuma Bucket Policy</span>
                    <span className="forge-radio-desc">
                      Sem permissão explícita no bucket; CloudFront receberá erro HTTP 403 Forbidden.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Amazon CloudFront Configurations */}
        {hasCloudFront && (
          <div className="forge-box">
            <h3 className="forge-box__title">
              <span>Amazon CloudFront</span>
              <PixelBadge variant="cyan">Borda &amp; CDN</PixelBadge>
            </h3>

            {/* CloudFront OAC */}
            <div className="forge-field">
              <span className="forge-label">Assinatura de Acesso à Origem:</span>
              <label className={`forge-toggle ${config.cloudfrontOacEnabled ? 'forge-toggle--active' : ''}`}>
                <div>
                  <span className="forge-radio-label-text">Origin Access Control (OAC)</span>
                  <span className="forge-radio-desc">
                    {config.cloudfrontOacEnabled
                      ? 'HABILITADO: O CloudFront assina criptograficamente as requisições ao bucket S3.'
                      : 'DESABILITADO: O CloudFront envia requisições sem assinatura de identidade de origem.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.cloudfrontOacEnabled ?? false}
                  onChange={(e) => onChangeConfig({ cloudfrontOacEnabled: e.target.checked })}
                />
              </label>
            </div>

            {/* Viewer Protocol Policy */}
            <div className="forge-field">
              <span className="forge-label">Viewer Protocol Policy (Comportamento de Cache):</span>
              <div className="forge-radio-group">
                <label className={`forge-radio-option ${config.cloudfrontViewerProtocolPolicy === 'redirect-to-https' ? 'forge-radio-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="viewerProtocol"
                    value="redirect-to-https"
                    checked={config.cloudfrontViewerProtocolPolicy === 'redirect-to-https'}
                    onChange={() => onChangeConfig({ cloudfrontViewerProtocolPolicy: 'redirect-to-https' })}
                  />
                  <div>
                    <span className="forge-radio-label-text">Redirect HTTP to HTTPS (Recomendado)</span>
                    <span className="forge-radio-desc">
                      Redireciona transparentemente conexões HTTP (porta 80) para HTTPS criptografado (porta 443).
                    </span>
                  </div>
                </label>

                <label className={`forge-radio-option ${config.cloudfrontViewerProtocolPolicy === 'https-only' ? 'forge-radio-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="viewerProtocol"
                    value="https-only"
                    checked={config.cloudfrontViewerProtocolPolicy === 'https-only'}
                    onChange={() => onChangeConfig({ cloudfrontViewerProtocolPolicy: 'https-only' })}
                  />
                  <div>
                    <span className="forge-radio-label-text">HTTPS Only</span>
                    <span className="forge-radio-desc">
                      Aceita estritamente conexões HTTPS; rejeita acessos HTTP retornando código HTTP 403.
                    </span>
                  </div>
                </label>

                <label className={`forge-radio-option ${config.cloudfrontViewerProtocolPolicy === 'allow-all' ? 'forge-radio-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="viewerProtocol"
                    value="allow-all"
                    checked={config.cloudfrontViewerProtocolPolicy === 'allow-all'}
                    onChange={() => onChangeConfig({ cloudfrontViewerProtocolPolicy: 'allow-all' })}
                  />
                  <div>
                    <span className="forge-radio-label-text">Allow All (Permitir HTTP e HTTPS)</span>
                    <span className="forge-radio-desc">
                      Inseguro: permite que visitantes trafeguem dados em texto claro sem criptografia.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Amazon VPC Notice (if selected) */}
        {hasVpc && (
          <div className="forge-box" style={{ borderTopColor: 'var(--copper-bright)' }}>
            <h3 className="forge-box__title">
              <span>Amazon VPC</span>
              <PixelBadge variant="copper">Rede Isolada</PixelBadge>
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
              <p>
                <strong>Observação de Arquitetura:</strong> A criação de uma VPC não acarreta cobrança financeira direta por si só.
              </p>
              <p style={{ margin: 0 }}>
                No entanto, uma VPC é destinada ao isolamento de recursos de computação privados (EC2, RDS, VPC Lambdas). Para entrega de sites estáticos públicos globais, ela adiciona complexidade e superfícies de configuração redundantes (subnets, gateways e rotas) sem trazer valor ao cenário serverless.
              </p>
            </div>
          </div>
        )}

        {/* AWS IAM Notice (if selected) */}
        {hasIam && (
          <div className="forge-box" style={{ borderTopColor: 'var(--runic-dim)' }}>
            <h3 className="forge-box__title">
              <span>AWS IAM</span>
              <PixelBadge variant="cyan">Governança</PixelBadge>
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
              <p>
                <strong>Papel de Permissões:</strong> O IAM gerencia credenciais de administradores e usuários da conta AWS.
              </p>
              <p style={{ margin: 0 }}>
                Para o fluxo de entrega de conteúdo web público entre CloudFront e S3 com OAC, a autorização é realizada <strong>diretamente no recurso S3</strong> através de sua Bucket Policy, sem necessidade de usuários IAM ou Access Keys no caminho de entrega.
              </p>
            </div>
          </div>
        )}
      </div>
    </PixelCard>
  );
};
