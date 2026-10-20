export interface MissionRequirementDef {
  id: 'req-latency' | 'req-private-storage' | 'req-https' | 'req-simplicity' | 'req-cost';
  title: string;
  description: string;
}

export const MISSION_001_DATA = {
  id: 'mission-001',
  code: 'MIS-001',
  title: 'Missão 001 — O Portal Global',
  subtitle: 'Website Estático com Distribuição Global e Isolamento de Origem',
  difficulty: 'Apprentice (SAA-C03)',
  scenario:
    'A Arcana Corp precisa publicar seu novo portal institucional para clientes distribuídos em diversos continentes. Os ativos são exclusivamente estáticos (HTML, CSS, JavaScript e imagens). A solução deve entregar conteúdo com baixa latência mundial, garantindo que o armazenamento permaneça inacessível publicamente e o tráfego dos visitantes seja protegido por HTTPS.',
  requirements: [
    {
      id: 'req-latency',
      title: 'Baixa latência global',
      description: 'Visitantes em qualquer continente devem receber os ativos com tempo mínimo de resposta (TTFB reduzido).',
    },
    {
      id: 'req-private-storage',
      title: 'Armazenamento sem acesso público direto',
      description: 'O repositório de arquivos não pode ser acessado diretamente pela internet pública nem por navegadores contornando a CDN.',
    },
    {
      id: 'req-https',
      title: 'HTTPS para os visitantes',
      description: 'Todo o tráfego dos usuários finais deve ser protegido por conexão TLS/HTTPS obrigatória.',
    },
    {
      id: 'req-simplicity',
      title: 'Arquitetura simples',
      description: 'Design enxuto, sem provisionamento ou gerenciamento de servidores, instâncias ou topologias de rede desnecessárias.',
    },
    {
      id: 'req-cost',
      title: 'Eficiência de custos',
      description: 'Aproveitamento do modelo serverless sob demanda e cache de borda para evitar despesas desnecessárias de transferência e infraestrutura.',
    },
  ] as MissionRequirementDef[],
  constraints: [
    'O site utilizará o domínio padrão do CloudFront (*.cloudfront.net).',
    'Não incluir Amazon Route 53 nem AWS Certificate Manager (ACM) nesta missão.',
  ],
  candidateServiceIds: ['amazon-s3', 'amazon-cloudfront', 'amazon-vpc', 'aws-iam'],
};
